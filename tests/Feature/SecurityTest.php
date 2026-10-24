<?php

namespace Tests\Feature;

use App\Models\Property;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;
use RuntimeException;
use Tests\TestCase;

class SecurityTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Http::preventStrayRequests();
    }

    public function test_security_headers_cover_success_and_error_responses(): void
    {
        foreach (['/', '/missing-page'] as $url) {
            $response = $this->get($url);
            $response->assertHeader('X-Frame-Options', 'DENY')
                ->assertHeader('X-Content-Type-Options', 'nosniff')
                ->assertHeader('Referrer-Policy', 'strict-origin-when-cross-origin')
                ->assertHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
            $policy = $response->headers->get('Content-Security-Policy');
            $this->assertStringContainsString("frame-ancestors 'none'", $policy);
            $this->assertStringNotContainsString('unsafe-inline', $policy);
            $this->assertStringNotContainsString('unsafe-eval', $policy);
            $this->assertStringContainsString('no-store', $response->headers->get('Cache-Control'));
        }
        $this->get('/')->assertHeaderMissing('Strict-Transport-Security');
    }

    public function test_production_http_redirects_to_configured_https_origin(): void
    {
        config(['security.require_https' => true, 'app.url' => 'https://localhost']);
        $this->get('http://localhost/cenas?source=test')->assertStatus(308)->assertRedirect('https://localhost/cenas?source=test');
        $this->post('http://localhost/kontakti')->assertStatus(308)->assertRedirect('https://localhost/kontakti');
        $this->get('https://localhost/cenas')->assertOk()->assertHeader('Strict-Transport-Security', 'max-age=31536000');
    }

    public function test_bad_production_origin_and_host_header_are_rejected(): void
    {
        config(['security.require_https' => true, 'app.url' => 'https://localhost']);
        $this->get('https://attacker.example/cenas')->assertStatus(400);
        config(['app.url' => 'http://localhost']);
        $this->get('http://localhost/cenas')->assertStatus(503);
    }

    public function test_only_explicit_proxy_ips_can_assert_https(): void
    {
        config(['security.require_https' => true, 'app.url' => 'https://localhost',
            'security.trusted_proxies' => ['*', '**', 'REMOTE_ADDR']]);
        $this->withServerVariables(['REMOTE_ADDR' => '198.51.100.5'])
            ->withHeaders(['X-Forwarded-Proto' => 'https', 'X-Forwarded-Host' => 'attacker.example'])
            ->get('http://localhost/cenas')->assertStatus(308);

        config(['security.trusted_proxies' => ['198.51.100.5']]);
        $this->get('http://localhost/cenas')->assertOk()->assertHeader('Strict-Transport-Security');
        $this->get('http://localhost/kontakti')->assertSee('action="https://localhost', false)
            ->assertDontSee('attacker.example');
    }

    public function test_spoofed_forwarded_for_does_not_bypass_contact_throttling(): void
    {
        for ($i = 1; $i <= 5; $i++) {
            $this->withHeader('X-Forwarded-For', "192.0.2.{$i}")->postJson('/kontakti', [])->assertUnprocessable();
        }
        $this->withHeader('X-Forwarded-For', '192.0.2.99')->postJson('/kontakti', [])->assertStatus(429)->assertHeader('Retry-After');
    }

    public function test_deployed_configuration_cannot_enable_debug_or_insecure_cookies(): void
    {
        $values = ['APP_ENV' => 'production', 'APP_DEBUG' => 'true', 'SESSION_SECURE_COOKIE' => 'false',
            'SESSION_HTTP_ONLY' => 'false', 'SESSION_SAME_SITE' => 'none', 'SESSION_DOMAIN' => '.example.com'];
        $originalEnv = $_ENV;
        $originalServer = $_SERVER;
        try {
            foreach ($values as $key => $value) {
                $_ENV[$key] = $_SERVER[$key] = $value;
            }
            $app = require config_path('app.php');
            $session = require config_path('session.php');
            $security = require config_path('security.php');
            $this->assertFalse($app['debug']);
            $this->assertTrue($session['secure']);
            $this->assertTrue($session['http_only']);
            $this->assertTrue($session['encrypt']);
            $this->assertSame('lax', $session['same_site']);
            $this->assertSame('/', $session['path']);
            $this->assertNull($session['domain']);
            $this->assertStringStartsWith('__Host-', $session['cookie']);
            $this->assertTrue($security['require_https']);
        } finally {
            $_ENV = $originalEnv;
            $_SERVER = $originalServer;
        }
    }

    public function test_session_cookie_is_http_only_and_same_site_lax(): void
    {
        $cookies = $this->get('/kontakti')->headers->getCookies();
        $cookie = collect($cookies)->first(fn ($cookie) => $cookie->getName() === config('session.cookie'));
        $this->assertNotNull($cookie);
        $this->assertTrue($cookie->isHttpOnly());
        $this->assertSame('lax', $cookie->getSameSite());
    }

    public function test_array_shaped_query_inputs_are_validation_errors(): void
    {
        foreach (['/kontakti?subject[]=bad', '/ipasumi?q[]=bad', '/ipasumi?q=Riga&page[]=1',
            '/atskaites-piemers?type[]=Zeme', '/atskaites-piemers?section[]=history'] as $url) {
            $this->getJson($url)->assertUnprocessable();
        }
    }

    public function test_shared_search_component_handles_unrelated_array_parameters(): void
    {
        foreach (['/', '/cenas', '/kontakti', '/missing-page'] as $url) {
            $this->get($url.'?q[]=bad')->assertStatus($url === '/missing-page' ? 404 : 200);
        }
    }

    public function test_unexpected_errors_have_headers_without_exposing_exception_details(): void
    {
        config(['app.debug' => false]);
        Route::get('/security-test-error', function () {
            throw new RuntimeException('private-test-secret-do-not-display');
        });
        $this->get('/security-test-error')->assertStatus(500)
            ->assertHeader('X-Content-Type-Options', 'nosniff')
            ->assertDontSee('private-test-secret-do-not-display')->assertDontSee('<style>', false);
    }

    public function test_array_shaped_flashed_contact_inputs_do_not_crash_the_page(): void
    {
        Mail::shouldReceive('raw')->never();
        $this->from('/kontakti')->post('/kontakti', ['name' => ['bad'], 'email' => ['bad'], 'subject' => ['bad'], 'message' => ['bad']])
            ->assertSessionHasErrors(['name', 'email', 'subject', 'message']);
        $this->get('/kontakti')->assertOk();
    }

    public function test_validation_redirects_do_not_trust_an_external_referer(): void
    {
        $this->withHeader('Referer', 'https://attacker.example/')->get('/kontakti?subject[]=bad')
            ->assertRedirect(route('contact'));
        $this->get('/ipasumi?q[]=bad')->assertRedirect(route('home'));
        $this->get('/atskaites-piemers?type[]=bad')->assertRedirect(route('sample'));
        $this->post('/kontakti', [])->assertRedirect(route('contact'));
    }

    public function test_contact_input_is_escaped_and_email_header_injection_is_rejected(): void
    {
        Mail::shouldReceive('raw')->never();
        $payload = '"><script>alert(1)</script>';
        $this->get('/kontakti?'.http_build_query(['subject' => $payload]))->assertOk()
            ->assertDontSee($payload, false)->assertSee(e($payload), false);
        $this->postJson('/kontakti', ['name' => "Ada\r\nBcc: victim@example.com", 'email' => 'ada@example.com',
            'subject' => "Hi\nBcc: victim@example.com", 'message' => 'A useful message.'])->assertUnprocessable()->assertJsonValidationErrors(['name', 'subject']);
    }

    public function test_search_query_is_bound_rather_than_executed_as_sql(): void
    {
        $property = $this->property();
        foreach (["' OR 1=1 --", 'Rīga%', 'Rīga_'] as $query) {
            $this->get('/ipasumi?'.http_build_query(['q' => $query]))->assertOk()
                ->assertViewHas('properties', fn ($properties) => $properties->isEmpty());
        }
        $this->assertDatabaseHas('properties', ['id' => $property->id]);
    }

    public function test_policies_deny_other_browsers_and_undefined_mutations(): void
    {
        $property = $this->property();
        $purchase = $property->purchases()->create();
        $purchase->markPaid();
        $this->get(route('properties.report', $property))->assertForbidden()->assertHeader('Cache-Control', 'no-store, private');
        $this->assertFalse(Gate::allows('view', $purchase));
        $this->assertFalse(Gate::allows('update', $property));
        $this->assertFalse(Gate::allows('delete', $purchase));
        $this->withSession(['purchase_ids' => [$purchase->id]])->get(route('properties.report', $property))->assertOk();
        $this->assertTrue(Gate::allows('view', $purchase));
    }

    public function test_payment_and_demo_flags_cannot_be_mass_assigned(): void
    {
        $property = $this->property();
        $property->fill(['is_demo' => true])->save();
        $this->assertFalse($property->fresh()->is_demo);
        $purchase = $property->purchases()->create();
        $purchase->fill(['paid_at' => now(), 'expires_at' => now()->addDay(), 'property_id' => 999])->save();
        $this->assertNull($purchase->fresh()->paid_at);
        $this->assertSame($property->id, $purchase->fresh()->property_id);
    }

    public function test_callback_is_rate_limited_before_making_more_stripe_requests(): void
    {
        config(['services.stripe.secret' => 'sk_test_example']);
        $purchase = $this->property()->purchases()->create(['checkout_session_id' => 'cs_test_123']);
        Http::fake(['*' => Http::response(['payment_status' => 'unpaid'])]);
        $url = route('checkout.success', $purchase).'?session_id=cs_test_123';
        for ($i = 0; $i < 10; $i++) {
            $this->withSession(['purchase_ids' => [$purchase->id]])->get($url)->assertRedirect();
        }
        $this->get($url)->assertStatus(429);
        Http::assertSentCount(10);
    }

    public function test_callback_rejects_nested_session_id_without_contacting_stripe(): void
    {
        $purchase = $this->property()->purchases()->create(['checkout_session_id' => 'cs_test_123']);
        $this->withSession(['purchase_ids' => [$purchase->id]])
            ->getJson(route('checkout.success', $purchase).'?session_id[]=cs_test_123')->assertUnprocessable();
        Http::assertNothingSent();
    }

    public function test_oversized_requests_are_rejected_before_contact_logic(): void
    {
        $this->withServerVariables(['CONTENT_LENGTH' => 262145])->postJson('/kontakti', [])->assertStatus(413)->assertHeader('X-Content-Type-Options', 'nosniff');
    }

    public function test_csrf_is_enforced_outside_the_unit_test_environment(): void
    {
        // Laravel deliberately skips CSRF during tests. Exercise the real middleware branch.
        $this->app['env'] = 'production';
        $this->post('/kontakti', [])->assertStatus(419);
        $token = str_repeat('a', 40);
        $this->withSession(['_token' => $token])->postJson('/kontakti', ['_token' => $token])->assertUnprocessable();
        config(['services.stripe.webhook_secret' => 'whsec_example']);
        $this->postJson('/stripe/webhook', [])->assertStatus(400); // Signature required, no CSRF exception elsewhere.
    }

    public function test_private_storage_has_no_public_serving_route(): void
    {
        $this->assertFalse(config('filesystems.disks.local.serve'));
        $this->assertSame(storage_path('app/private'), config('filesystems.disks.local.root'));
        Storage::fake('local');
        Storage::disk('local')->put('secret.txt', 'not-public');
        $this->get('/storage/secret.txt')->assertNotFound();
        $this->get('/.env')->assertNotFound();
    }

    private function property(): Property
    {
        return Property::create(['address' => 'Private address', 'city' => 'Rīga', 'cadastre_number' => '99999999999']);
    }
}
