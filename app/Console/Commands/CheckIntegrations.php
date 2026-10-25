<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;
use Throwable;

class CheckIntegrations extends Command
{
    protected $signature = 'integrations:check {--stripe : Authenticate against the Stripe test API only} {--mail-to= : Send one SMTP test message to this explicit recipient}';

    protected $description = 'Check configuration without printing secrets; optionally verify real test services';

    public function handle(): int
    {
        $secret = config('services.stripe.secret');
        $testKey = is_string($secret) && (str_starts_with($secret, 'sk_test_') || str_starts_with($secret, 'rk_test_'));
        $smtp = config('mail.default') === 'smtp' && filled(config('mail.mailers.smtp.host'));
        $this->line('Stripe test key: '.($testKey ? 'configured' : 'missing or not a test key'));
        $this->line('Stripe webhook secret: '.(filled(config('services.stripe.webhook_secret')) ? 'configured' : 'missing'));
        $this->line('SMTP mailer: '.($smtp ? 'configured' : 'not selected'));

        if ($this->option('stripe')) {
            // Never run this operator test with a live credential, and never log the key.
            if (! $testKey) {
                $this->error('Configure a Stripe TEST credential first. No API request was sent.');

                return self::FAILURE;
            }
            try {
                $response = Http::withToken($secret)->withoutRedirecting()->connectTimeout(10)->timeout(20)
                    ->get('https://api.stripe.com/v1/balance')->throw()->json();
                if (! is_array($response) || ($response['livemode'] ?? null) !== false) {
                    $this->error('The response did not confirm Stripe test mode.');

                    return self::FAILURE;
                }
                $this->info('Stripe test API authentication passed. Checkout/webhook delivery still needs an end-to-end run.');
            } catch (Throwable) {
                $this->error('Stripe test API verification failed. Check credentials and outbound HTTPS; no secret was printed.');

                return self::FAILURE;
            }
        }

        $recipient = $this->option('mail-to');
        if ($recipient !== null) {
            if (! $smtp || Validator::make(['email' => $recipient], ['email' => ['required', 'string', 'email:rfc', 'max:254', 'not_regex:/[\r\n]/']])->fails()) {
                $this->error('Select MAIL_MAILER=smtp and supply a valid --mail-to recipient first. No message was sent.');

                return self::FAILURE;
            }
            try {
                // Sending is opt-in: a configuration check alone never emails anyone.
                Mail::mailer('smtp')->raw('VeriSale SMTP connection test. This message contains no property, payment or credential data.',
                    fn ($message) => $message->to($recipient)->subject('VeriSale — SMTP test'));
                $this->info('SMTP accepted the test message. Confirm receipt in the inbox or spam folder separately.');
            } catch (Throwable) {
                $this->error('SMTP verification failed. Check the configured server, TLS, sender and credentials.');

                return self::FAILURE;
            }
        }

        return self::SUCCESS;
    }
}
