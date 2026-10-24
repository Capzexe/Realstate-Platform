<?php

namespace App\Http\Controllers;

use App\Http\Requests\CheckoutReturnRequest;
use App\Models\Property;
use App\Models\Purchase;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Client\RequestException;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Validator;
use Stripe\Exception\SignatureVerificationException;
use Stripe\Webhook;
use UnexpectedValueException;

class CheckoutController extends Controller
{
    public function store(Request $request, Property $property): RedirectResponse
    {
        if (Gate::allows('viewReport', $property)) {
            return to_route('properties.report', $property);
        }
        if (! config('services.stripe.secret') || ! config('services.stripe.webhook_secret')) {
            return to_route('properties.show', $property)->with('error', 'Norēķini šobrīd nav pieejami. Varat apskatīt bezmaksas demonstrācijas atskaiti.');
        }

        $purchase = $property->purchases()->create();
        try {
            $session = Http::withToken(config('services.stripe.secret'))->withoutRedirecting()->asForm()->connectTimeout(10)->timeout(20)
                ->post('https://api.stripe.com/v1/checkout/sessions', [
                    'mode' => 'payment',
                    'client_reference_id' => (string) $purchase->id,
                    'success_url' => route('checkout.success', $purchase).'?session_id={CHECKOUT_SESSION_ID}',
                    'cancel_url' => route('properties.show', $property),
                    'metadata' => ['purchase_id' => (string) $purchase->id, 'property_id' => (string) $property->id],
                    'line_items' => [['quantity' => 1, 'price_data' => [
                        'currency' => 'eur', 'unit_amount' => config('services.stripe.report_price'),
                        'product_data' => ['name' => 'VeriSale — '.$property->address],
                    ]]],
                ])->throw()->json();
        } catch (ConnectionException|RequestException) {
            $purchase->delete();

            return to_route('properties.show', $property)->with('error', 'Neizdevās sagatavot norēķinus. Lūdzu, mēģiniet vēlāk.');
        }
        if (! is_array($session) || ! is_string($session['id'] ?? null)
            || ! preg_match('/\Acs_[A-Za-z0-9_]{1,252}\z/', $session['id']) || ! is_string($session['url'] ?? null)
            || ! str_starts_with($session['url'], 'https://checkout.stripe.com/')) {
            $purchase->delete();

            return to_route('properties.show', $property)->with('error', 'Neizdevās sagatavot norēķinus. Lūdzu, mēģiniet vēlāk.');
        }
        $purchase->update(['checkout_session_id' => $session['id']]);
        // Laravel stores these IDs on the server; guessing another purchase ID gives no access.
        $request->session()->push('purchase_ids', $purchase->id);

        return redirect()->away($session['url']);
    }

    public function success(CheckoutReturnRequest $request, Purchase $purchase): RedirectResponse
    {
        // The FormRequest checks browser ownership before validating the session ID.
        abort_unless($purchase->checkout_session_id && $request->validated('session_id') === $purchase->checkout_session_id, 403);
        abort_unless(filled(config('services.stripe.secret')), 503);
        try {
            $session = Http::withToken(config('services.stripe.secret'))->withoutRedirecting()->connectTimeout(10)->timeout(20)
                ->get('https://api.stripe.com/v1/checkout/sessions/'.rawurlencode($purchase->checkout_session_id))->throw()->json();
        } catch (ConnectionException|RequestException) {
            return to_route('properties.show', $purchase->property)->with('error', 'Maksājuma pārbaude šobrīd nav pieejama. Mēģiniet vēlāk.');
        }
        // A success URL is not proof of payment. Verify the session with Stripe before unlocking anything.
        if (! $this->matchesPaidPurchase($session, $purchase)) {
            return to_route('properties.show', $purchase->property)->with('error', 'Maksājums vēl nav apstiprināts.');
        }
        $purchase->markPaid();

        return to_route('properties.report', $purchase->property);
    }

    public function webhook(Request $request): Response
    {
        abort_unless(filled(config('services.stripe.webhook_secret')), 503);
        try {
            // Use Stripe's own verifier instead of accepting a browser-posted "payment completed" flag.
            $event = Webhook::constructEvent($request->getContent(), $request->header('Stripe-Signature', ''), config('services.stripe.webhook_secret'));
        } catch (UnexpectedValueException|SignatureVerificationException) {
            return response('Invalid signature', 400);
        }
        $payload = $event->toArray();
        if (in_array($payload['type'] ?? null, ['checkout.session.completed', 'checkout.session.async_payment_succeeded'], true)) {
            // Validate nested data only after verifying the signature on the ORIGINAL body.
            if (Validator::make($payload, ['data' => ['required', 'array'], 'data.object' => ['required', 'array'],
                'data.object.id' => ['required', 'string', 'max:255', 'regex:/\Acs_[A-Za-z0-9_]+\z/'],
            ])->fails()) {
                return response('Invalid payload', 400);
            }
            $session = $payload['data']['object'];
            $purchase = Purchase::where('checkout_session_id', $session['id'] ?? '')->first();
            if ($purchase && $this->matchesPaidPurchase($session, $purchase)) {
                $purchase->markPaid();
            }
        }

        return response('Received');
    }

    private function matchesPaidPurchase(mixed $session, Purchase $purchase): bool
    {
        // Reject arrays where strings are expected; do not cast arbitrary nested input.
        if (! is_array($session) || Validator::make($session, [
            'id' => ['required', 'string', 'max:255'],
            'payment_status' => ['required', 'string'], 'mode' => ['required', 'string'],
            'currency' => ['required', 'string'], 'amount_total' => ['required', 'integer'],
            'client_reference_id' => ['required', 'string', 'max:255'],
            'metadata' => ['required', 'array'], 'metadata.property_id' => ['required', 'string', 'max:255'],
        ])->fails()) {
            return false;
        }

        return ($session['id'] ?? null) === $purchase->checkout_session_id
            && ($session['payment_status'] ?? null) === 'paid'
            && ($session['mode'] ?? null) === 'payment'
            && ($session['currency'] ?? null) === 'eur'
            && ($session['amount_total'] ?? null) === config('services.stripe.report_price')
            && $session['client_reference_id'] === (string) $purchase->id
            && $session['metadata']['property_id'] === (string) $purchase->property_id;
    }
}
