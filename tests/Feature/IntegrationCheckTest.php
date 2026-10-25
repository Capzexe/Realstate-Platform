<?php

namespace Tests\Feature;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class IntegrationCheckTest extends TestCase
{
    public function test_status_check_makes_no_external_requests_or_mail(): void
    {
        Http::preventStrayRequests();
        Mail::shouldReceive('mailer')->never();
        $this->artisan('integrations:check')->assertSuccessful();
        Http::assertNothingSent();
    }

    public function test_missing_or_live_keys_cannot_run_a_stripe_test(): void
    {
        Http::preventStrayRequests();
        foreach (['', 'sk_live_do_not_use'] as $key) {
            config(['services.stripe.secret' => $key]);
            $this->artisan('integrations:check --stripe')->assertFailed();
        }
        Http::assertNothingSent();
    }

    public function test_stripe_check_requires_a_successful_test_mode_response(): void
    {
        config(['services.stripe.secret' => 'sk_test_example']);
        Http::fake(['api.stripe.com/v1/balance' => Http::sequence()->push(['livemode' => false])->push(['livemode' => true])]);
        $this->artisan('integrations:check --stripe')->expectsOutputToContain('authentication passed')->assertSuccessful();
        $this->artisan('integrations:check --stripe')->assertFailed();
    }

    public function test_mail_test_does_not_mistake_log_delivery_for_smtp(): void
    {
        config(['mail.default' => 'log']);
        Mail::shouldReceive('mailer')->never();
        $this->artisan('integrations:check --mail-to=test@example.com')->assertFailed();
    }
}
