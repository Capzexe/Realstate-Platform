<?php

namespace Tests\Feature;

use App\Models\Property;
use App\Models\Purchase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class DemoCheckoutTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        config(['services.payments.demo' => true]);
        Http::preventStrayRequests();
        $this->seed();
    }

    public function test_saved_property_details_are_absent_before_payment(): void
    {
        $property = Property::first();
        foreach ([route('properties.show', $property), '/ipasumi?q=Brīvības'] as $url) {
            $this->get($url)->assertOk()->assertDontSee('87 500')->assertDontSee('54.2')
                ->assertDontSee('Ķieģeļu mūris')->assertDontSee('01000640001')
                ->assertDontSee('15.03.2023.')->assertDontSee('data-print', false);
        }
        $this->get(route('properties.report', $property).'?paid=true')->assertRedirect(route('properties.show', $property));
        $this->assertDatabaseCount('purchases', 0);
    }

    public function test_public_marketing_examples_do_not_contain_saved_property_data(): void
    {
        $property = Property::first();
        $property->update(['wall_material' => 'PRIVATE-MATERIAL-DO-NOT-DISPLAY', 'area_m2' => 998.76]);
        $property->transactions()->first()->update(['price_eur' => 987654]);
        foreach (['/', '/atskaites-piemers?section=property', '/atskaites-piemers?section=history'] as $url) {
            $this->get($url)->assertOk()->assertSee('Atskaites struktūras paraugs')
                ->assertDontSee('PRIVATE-MATERIAL-DO-NOT-DISPLAY')->assertDontSee('998.76')
                ->assertDontSee('987 654')->assertDontSee('01000640001');
            // The home page may advertise public addresses as clickable test searches.
            if ($url !== '/') {
                $this->get($url)->assertDontSee($property->address);
            }
        }
    }

    public function test_only_confirmed_demo_payment_unlocks_this_property(): void
    {
        $property = Property::first();
        $purchase = $this->start($property);
        $this->get(route('checkout.demo.show', $purchase))->assertOk()->assertSee('Maksājuma informācija')
            ->assertSee('Apmaksāt testa režīmā')->assertSee('9,99')->assertSee('4242')
            ->assertDontSee('87 500')->assertDontSee('name="card', false);
        $this->get(route('properties.report', $property))->assertRedirect(route('properties.show', $property));
        $this->assertNull($purchase->fresh()->paid_at);

        $this->post(route('checkout.demo.prepare', $purchase), ['outcome' => 'success'])
            ->assertRedirect(route('checkout.demo.processing', $purchase));
        $this->get(route('checkout.demo.processing', $purchase))->assertOk()->assertSee('Testa maksājuma apstrāde')
            ->assertSee('data-payment-confirm', false)->assertDontSee('87 500');
        $this->assertNull($purchase->fresh()->paid_at);
        $this->get(route('properties.report', $property))->assertRedirect(route('properties.show', $property));

        $this->post(route('checkout.demo.complete', $purchase), ['outcome' => 'success', 'price' => 1,
            'property_id' => Property::orderByDesc('id')->first()->id, 'expires_at' => '2099-01-01'])
            ->assertRedirect(route('properties.report', $property));
        $purchase->refresh();
        $this->assertSame('demo', $purchase->payment_provider);
        $this->assertNotNull($purchase->paid_at);
        $this->assertTrue($purchase->expires_at->equalTo($purchase->paid_at->copy()->addDay()));
        $this->get(route('properties.report', $property))->assertOk()->assertSee('87 500')->assertSee('data-print', false);
        $this->get(route('properties.show', $property))->assertOk()->assertSee('54.2')->assertSee('Ķieģeļu mūris');
        $other = Property::whereKeyNot($property->id)->first();
        $this->get(route('properties.report', $other))->assertRedirect(route('properties.show', $other));
        Http::assertNothingSent();
    }

    public function test_failed_and_cancelled_payments_never_unlock_information(): void
    {
        $property = Property::first();
        $purchase = $this->start($property);
        $this->post(route('checkout.demo.prepare', $purchase), ['outcome' => 'failed'])->assertRedirect(route('checkout.demo.processing', $purchase));
        $this->get(route('checkout.demo.processing', $purchase))->assertOk()->assertSee('Atgriešanās norēķinos');
        $this->post(route('checkout.demo.complete', $purchase), ['outcome' => 'failed'])
            ->assertRedirect(route('checkout.demo.show', $purchase))->assertSessionHas('error');
        $this->post(route('checkout.demo.complete', $purchase), ['outcome' => 'cancelled'])
            ->assertRedirect(route('properties.show', $property))->assertSessionHas('error');
        $this->assertNull($purchase->fresh()->paid_at);
        $this->get(route('properties.report', $property))->assertRedirect(route('properties.show', $property));
        Http::assertNothingSent();
    }

    public function test_other_browsers_cannot_view_or_complete_a_purchase(): void
    {
        $purchase = $this->start(Property::first());
        $this->withSession(['purchase_ids' => []])->get(route('checkout.demo.show', $purchase))->assertForbidden();
        $this->post(route('checkout.demo.complete', $purchase), ['outcome' => 'success'])->assertForbidden();
        $this->assertNull($purchase->fresh()->paid_at);
    }

    public function test_simulator_cannot_complete_a_stripe_purchase(): void
    {
        $purchase = Property::first()->purchases()->create(['checkout_session_id' => 'cs_test_real_provider']);
        $this->withSession(['purchase_ids' => [$purchase->id]])
            ->get(route('checkout.demo.show', $purchase))->assertNotFound();
        $this->post(route('checkout.demo.complete', $purchase), ['outcome' => 'success'])->assertNotFound();
        $this->assertNull($purchase->fresh()->paid_at);
        Http::assertNothingSent();
    }

    public function test_unsigned_simulator_event_cannot_complete_payment_through_stripe_webhook(): void
    {
        config(['services.stripe.webhook_secret' => 'whsec_example']);
        $purchase = $this->start(Property::first());
        $this->postJson('/stripe/webhook', ['eventType' => 'checkout.session.completed',
            'session_id' => 'cs_test_forged', 'property_id' => $purchase->property_id])->assertStatus(400);
        $this->assertNull($purchase->fresh()->paid_at);
        $this->get(route('properties.report', $purchase->property))->assertRedirect(route('properties.show', $purchase->property));
        Http::assertNothingSent();
    }

    public function test_production_cannot_simulate_payment_or_use_a_previous_simulation(): void
    {
        $property = Property::first();
        $purchase = $this->start($property);
        $purchase->markPaid();
        $this->app['env'] = 'production';
        config(['services.payments.demo' => true]); // Even an incorrect production switch cannot bypass payment.
        $this->get(route('checkout.demo.show', $purchase))->assertNotFound();
        $this->withSession(['_token' => 'test-token'])->post(route('checkout.demo.complete', $purchase),
            ['outcome' => 'success', '_token' => 'test-token'])->assertNotFound();
        $this->get(route('properties.report', $property))->assertRedirect(route('properties.show', $property));
        $this->assertFalse(Purchase::demoPaymentsEnabled());
    }

    public function test_disabling_demo_mode_revokes_simulated_access(): void
    {
        $property = Property::first();
        $purchase = $this->start($property);
        $purchase->markPaid();
        config(['services.payments.demo' => false]);
        $this->get(route('properties.report', $property))->assertRedirect(route('properties.show', $property));
        $this->get(route('checkout.demo.show', $purchase))->assertNotFound();
    }

    public function test_replaying_confirmation_does_not_extend_access(): void
    {
        $property = Property::first();
        $purchase = $this->start($property);
        $this->post(route('checkout.demo.prepare', $purchase), ['outcome' => 'success'])->assertRedirect();
        $this->post(route('checkout.demo.complete', $purchase), ['outcome' => 'success'])->assertRedirect();
        $expires = $purchase->fresh()->expires_at->toIso8601String();
        $this->travel(2)->hours();
        $this->post(route('checkout.demo.complete', $purchase), ['outcome' => 'success'])->assertRedirect();
        $this->assertSame($expires, $purchase->fresh()->expires_at->toIso8601String());
        $this->travel(23)->hours();
        $this->get(route('properties.report', $property))->assertRedirect(route('properties.show', $property));
        $this->post(route('checkout.demo.complete', $purchase), ['outcome' => 'success'])
            ->assertRedirect(route('properties.show', $property));
        $this->assertSame($expires, $purchase->fresh()->expires_at->toIso8601String());
    }

    public function test_nested_or_missing_outcomes_do_not_mark_a_purchase_paid(): void
    {
        $purchase = $this->start(Property::first());
        foreach ([[], ['outcome' => ['success']], ['outcome' => 'paid']] as $data) {
            $this->postJson(route('checkout.demo.complete', $purchase), $data)->assertUnprocessable();
        }
        $this->assertNull($purchase->fresh()->paid_at);
    }

    public function test_confirmation_requires_a_matching_prepared_scenario(): void
    {
        $purchase = $this->start(Property::first());
        $this->get(route('checkout.demo.processing', $purchase))->assertRedirect(route('checkout.demo.show', $purchase));
        $this->post(route('checkout.demo.complete', $purchase), ['outcome' => 'success'])->assertForbidden();
        $this->post(route('checkout.demo.prepare', $purchase), ['outcome' => 'failed'])->assertRedirect();
        $this->post(route('checkout.demo.complete', $purchase), ['outcome' => 'success'])->assertForbidden();
        $this->assertNull($purchase->fresh()->paid_at);
        $this->post(route('checkout.demo.complete', $purchase), ['outcome' => 'failed'])->assertRedirect(route('checkout.demo.show', $purchase));
        $this->assertNull($purchase->fresh()->paid_at);
    }

    public function test_preparation_checks_ownership_validation_csrf_and_production_boundary(): void
    {
        $purchase = $this->start(Property::first());
        $this->postJson(route('checkout.demo.prepare', $purchase), ['outcome' => ['success']])->assertUnprocessable();
        $this->withSession(['purchase_ids' => []])->post(route('checkout.demo.prepare', $purchase), ['outcome' => 'success'])->assertForbidden();
        $this->get(route('checkout.demo.processing', $purchase))->assertForbidden();
        $this->app['env'] = 'local';
        $this->withSession(['purchase_ids' => [$purchase->id]])->post(route('checkout.demo.prepare', $purchase), ['outcome' => 'success'])->assertStatus(419);
        $this->app['env'] = 'production';
        $this->withSession(['_token' => 'test-token'])->post(route('checkout.demo.prepare', $purchase), ['outcome' => 'success', '_token' => 'test-token'])->assertNotFound();
        $this->get(route('checkout.demo.processing', $purchase))->assertNotFound();
        $this->assertNull($purchase->fresh()->paid_at);
    }

    public function test_demo_post_requires_csrf_and_is_rate_limited(): void
    {
        $purchase = $this->start(Property::first());
        $this->app['env'] = 'local'; // Exercise CSRF without Laravel's test-environment bypass.
        $this->post(route('checkout.demo.complete', $purchase), ['outcome' => 'success'])->assertStatus(419);
        for ($i = 0; $i < 9; $i++) {
            $this->withSession(['_token' => 'valid-test-token'])->post(route('checkout.demo.complete', $purchase),
                ['outcome' => 'cancelled', '_token' => 'valid-test-token'])->assertRedirect();
        }
        $this->post(route('checkout.demo.complete', $purchase), ['outcome' => 'success', '_token' => 'valid-test-token'])->assertStatus(429);
        $this->assertNull($purchase->fresh()->paid_at);
    }

    private function start(Property $property): Purchase
    {
        $this->post(route('checkout.store', $property))->assertRedirect();
        $purchase = Purchase::latest('id')->firstOrFail();
        $this->assertSame('demo', $purchase->payment_provider);

        return $purchase;
    }
}
