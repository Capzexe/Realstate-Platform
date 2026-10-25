<?php

namespace Tests\Feature;

use App\Models\Property;
use App\Models\Purchase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Client\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Testing\TestResponse;
use Tests\TestCase;

class CheckoutTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        config(['services.stripe.secret' => 'sk_test_example', 'services.stripe.webhook_secret' => 'whsec_example']);
        Http::preventStrayRequests();
    }

    public function test_checkout_uses_server_price_and_saves_session_ownership(): void
    {
        $property = $this->property();
        Http::fake(['api.stripe.com/*' => Http::response(['id' => 'cs_test_123', 'url' => 'https://checkout.stripe.com/c/pay/cs_test_123'])]);
        $this->post(route('checkout.store', $property), ['price' => 1])->assertRedirect('https://checkout.stripe.com/c/pay/cs_test_123')
            ->assertSessionHas('purchase_ids', [Purchase::first()->id]);
        Http::assertSent(fn (Request $request) => $request->hasHeader('Authorization', 'Bearer sk_test_example')
            && $request['line_items'][0]['price_data']['unit_amount'] === 999);
        $this->assertNull(Purchase::first()->paid_at);
    }

    public function test_missing_credentials_do_not_create_fake_purchases(): void
    {
        config(['services.stripe.secret' => '']);
        $this->post(route('checkout.store', $this->property()))->assertSessionHas('error');
        $this->assertDatabaseCount('purchases', 0);
        Http::assertNothingSent();
    }

    public function test_checkout_failure_ignores_an_external_referer(): void
    {
        config(['services.stripe.secret' => '']);
        $property = $this->property();
        $this->withHeader('Referer', 'https://attacker.example/')->post(route('checkout.store', $property))
            ->assertRedirect(route('properties.show', $property));
        Http::assertNothingSent();
    }

    public function test_failed_checkout_does_not_leave_a_pending_purchase(): void
    {
        Http::fake(['*' => Http::response([], 503)]);
        $this->post(route('checkout.store', $this->property()))->assertSessionHas('error');
        $this->assertDatabaseCount('purchases', 0);
    }

    public function test_malformed_checkout_response_does_not_redirect_or_leave_a_purchase(): void
    {
        Http::fake(['*' => Http::response(['id' => 'cs_test_123', 'url' => 'https://example.com/unexpected'])]);
        $this->post(route('checkout.store', $this->property()))->assertSessionHas('error');
        $this->assertDatabaseCount('purchases', 0);
    }

    public function test_callback_checks_payment_and_browser_ownership(): void
    {
        $purchase = $this->purchase();
        $url = route('checkout.success', $purchase).'?session_id=cs_test_123';
        $this->get($url)->assertForbidden();
        Http::fake(['*' => Http::response($this->paidSession($purchase))]);
        $this->withSession(['purchase_ids' => [$purchase->id]])->get($url)->assertRedirect(route('properties.report', $purchase->property));
        $this->assertNotNull($purchase->fresh()->paid_at);
        $this->get(route('properties.report', $purchase->property))->assertOk();
    }

    public function test_unpaid_callback_does_not_grant_access(): void
    {
        $purchase = $this->purchase();
        Http::fake(['*' => Http::response(array_replace($this->paidSession($purchase), ['payment_status' => 'unpaid']))]);
        $this->withSession(['purchase_ids' => [$purchase->id]])->get(route('checkout.success', $purchase).'?session_id=cs_test_123')->assertSessionHas('error');
        $this->assertNull($purchase->fresh()->paid_at);
    }

    public function test_webhook_rejects_forged_signatures(): void
    {
        $this->postJson('/stripe/webhook', ['type' => 'checkout.session.completed'])->assertStatus(400);
    }

    public function test_signed_webhook_unlocks_once_without_extending_expiry(): void
    {
        $purchase = $this->purchase();
        $this->sendWebhook($this->paidSession($purchase))->assertOk();
        $expires = $purchase->fresh()->expires_at->toIso8601String();
        $this->travel(2)->hours();
        $this->sendWebhook($this->paidSession($purchase))->assertOk();
        $this->assertSame($expires, $purchase->fresh()->expires_at->toIso8601String());
    }

    public function test_signed_stripe_webhook_cannot_complete_a_simulated_purchase(): void
    {
        $purchase = $this->purchase();
        $purchase->payment_provider = 'demo';
        $purchase->save();
        $this->sendWebhook($this->paidSession($purchase))->assertOk();
        $this->assertNull($purchase->fresh()->paid_at);
    }

    public function test_signed_webhook_rejects_wrong_amount_currency_or_property(): void
    {
        $purchase = $this->purchase();
        foreach ([['amount_total' => 1], ['currency' => 'usd'], ['metadata' => ['property_id' => '99999']]] as $change) {
            $this->sendWebhook(array_replace($this->paidSession($purchase), $change))->assertOk();
            $this->assertNull($purchase->fresh()->paid_at);
        }
    }

    public function test_signed_webhook_rejects_nested_scalar_confusion(): void
    {
        $purchase = $this->purchase();
        foreach ([['id' => ['cs_test_123']], ['metadata' => ['property_id' => [$purchase->property_id]]],
            ['client_reference_id' => [$purchase->id]], ['amount_total' => ['999']]] as $change) {
            $response = $this->sendWebhook(array_replace($this->paidSession($purchase), $change));
            $this->assertContains($response->status(), [200, 400]);
            $this->assertNull($purchase->fresh()->paid_at);
        }
    }

    public function test_non_json_stripe_response_fails_without_unlocking_access(): void
    {
        $purchase = $this->purchase();
        Http::fake(['*' => Http::response('upstream error', 200, ['Content-Type' => 'text/plain'])]);
        $this->withSession(['purchase_ids' => [$purchase->id]])
            ->get(route('checkout.success', $purchase).'?session_id=cs_test_123')->assertSessionHas('error');
        $this->assertNull($purchase->fresh()->paid_at);
    }

    private function property(): Property
    {
        return Property::create(['address' => 'Test address', 'city' => 'Rīga', 'cadastre_number' => '99999999999']);
    }

    private function purchase(): Purchase
    {
        return $this->property()->purchases()->create(['checkout_session_id' => 'cs_test_123']);
    }

    private function paidSession(Purchase $purchase): array
    {
        return ['id' => 'cs_test_123', 'object' => 'checkout.session', 'mode' => 'payment', 'payment_status' => 'paid',
            'currency' => 'eur', 'amount_total' => 999, 'client_reference_id' => (string) $purchase->id,
            'metadata' => ['property_id' => (string) $purchase->property_id]];
    }

    private function sendWebhook(array $session): TestResponse
    {
        $body = json_encode(['id' => 'evt_test', 'object' => 'event', 'type' => 'checkout.session.completed', 'data' => ['object' => $session]]);
        $timestamp = time();
        $signature = hash_hmac('sha256', $timestamp.'.'.$body, 'whsec_example');

        return $this->call('POST', '/stripe/webhook', [], [], [], ['CONTENT_TYPE' => 'application/json', 'HTTP_STRIPE_SIGNATURE' => "t={$timestamp},v1={$signature}"], $body);
    }
}
