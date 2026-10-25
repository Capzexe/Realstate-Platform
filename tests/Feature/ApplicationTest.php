<?php

namespace Tests\Feature;

use App\Models\Property;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Mail\Message;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Mail;
use Symfony\Component\Mime\Email;
use Tests\TestCase;

class ApplicationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Http::preventStrayRequests();
        $this->seed();
    }

    public function test_public_pages_render_with_one_shared_faq(): void
    {
        foreach (['/', '/cenas', '/atskaites-piemers', '/par-mums', '/kontakti', '/demo'] as $url) {
            $response = $this->get($url)->assertOk()->assertSee('Biežāk uzdotie jautājumi');
            $this->assertSame(1, substr_count($response->getContent(), 'id="faq-title"'));
        }
        $this->get('/cenas')->assertSee('Parastais pircējs')->assertSee('9,99');
    }

    public function test_sample_sections_and_property_types_work(): void
    {
        foreach (['Dzīvoklis', 'Māja', 'Zeme'] as $type) {
            foreach (['history', 'prices', 'property', 'building', 'land'] as $section) {
                $this->get('/atskaites-piemers?'.http_build_query(compact('type', 'section')))->assertOk();
            }
        }
    }

    public function test_public_demo_video_supports_byte_ranges_for_seeking(): void
    {
        $size = filesize(public_path('media/demo/purchase-walkthrough.webm'));
        $this->withHeader('Range', 'bytes=0-15')->get('/demo/video')
            ->assertStatus(206)
            ->assertHeader('Content-Type', 'video/webm')
            ->assertHeader('Accept-Ranges', 'bytes')
            ->assertHeader('Content-Range', 'bytes 0-15/'.$size)
            ->assertHeader('Content-Length', '16');
    }

    public function test_search_understands_latvian_letters_and_cadastres(): void
    {
        foreach (['BRĪVĪBAS', 'Brīvības, Rīga', '01000640001'] as $query) {
            $this->get('/ipasumi?'.http_build_query(['q' => $query]))->assertOk()->assertSee('Brīvības');
        }
        $this->get('/ipasumi?q=NonexistentAddress')->assertOk()->assertViewHas('properties', fn ($properties) => $properties->isEmpty());
    }

    public function test_search_does_not_treat_user_input_as_sql_wildcards(): void
    {
        $this->get('/ipasumi?'.http_build_query(['q' => 'Rīga%']))->assertOk()
            ->assertViewHas('properties', fn ($properties) => $properties->isEmpty());
        $this->get('/ipasumi?q=,,,')->assertSessionHasErrors('q');
        $this->get('/ipasumi')->assertSessionHasErrors('q');
    }

    public function test_demo_reports_require_payment_and_seeding_is_idempotent(): void
    {
        $property = Property::first();
        $this->get(route('properties.report', $property))->assertRedirect(route('properties.show', $property));
        $this->seed();
        $this->assertDatabaseCount('properties', 12);
        $this->assertDatabaseCount('property_transactions', 36);
    }

    public function test_imported_report_cannot_be_unlocked_by_a_query_parameter(): void
    {
        $property = $this->privateProperty();
        $this->get(route('properties.show', $property))->assertOk()->assertDontSee('123 456');
        $this->get(route('properties.report', $property).'?paid=true')->assertRedirect(route('properties.show', $property));
        Http::assertNothingSent();
    }

    public function test_report_access_requires_an_owned_unexpired_purchase(): void
    {
        $property = $this->privateProperty();
        $purchase = $property->purchases()->create();
        $purchase->markPaid();
        $this->get(route('properties.report', $property))->assertRedirect(route('properties.show', $property));
        $this->withSession(['purchase_ids' => [$purchase->id]])->get(route('properties.report', $property))->assertOk()->assertSee('123 456');
        $this->travel(25)->hours();
        $this->get(route('properties.report', $property))->assertRedirect(route('properties.show', $property));
    }

    public function test_contact_form_validates_before_sending_and_uses_configured_recipient(): void
    {
        Mail::shouldReceive('raw')->once()->withArgs(function ($body, $callback) {
            $this->assertStringContainsString('A useful message', $body);
            $message = new Message(new Email);
            $callback($message);
            $this->assertSame(config('services.contact_email'), $message->getTo()[0]->getAddress());

            return true;
        });
        $this->post('/kontakti', ['email' => 'invalid'])->assertSessionHasErrors(['name', 'email', 'subject', 'message']);
        config(['mail.default' => 'log']);
        $this->post('/kontakti', ['name' => 'Ada', 'email' => 'ada@example.com', 'subject' => 'Question', 'message' => 'A useful message for the team.'])
            ->assertRedirect(route('contact'))->assertSessionHas('success', fn ($message) => str_contains($message, 'nevis nosūtīts'));
    }

    private function privateProperty(): Property
    {
        $property = Property::create(['address' => 'Private address', 'city' => 'Rīga', 'cadastre_number' => '99999999998']);
        $property->transactions()->create(['transaction_date' => '2024-01-01', 'price_eur' => 123456]);

        return $property;
    }
}
