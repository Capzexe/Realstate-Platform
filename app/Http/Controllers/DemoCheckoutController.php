<?php

namespace App\Http\Controllers;

use App\Http\Requests\CompleteDemoPaymentRequest;
use App\Models\Purchase;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\View\View;

class DemoCheckoutController extends Controller
{
    public function show(Purchase $purchase): View|RedirectResponse
    {
        Gate::authorize('view', $purchase);
        if ($purchase->paid_at !== null) {
            return $this->completedPurchase($purchase);
        }

        return view('checkout.demo', ['purchase' => $purchase, 'property' => $purchase->property]);
    }

    public function complete(CompleteDemoPaymentRequest $request, Purchase $purchase): RedirectResponse
    {
        if ($purchase->paid_at !== null) {
            return $this->completedPurchase($purchase);
        }

        if ($request->validated('outcome') === 'cancelled') {
            $request->session()->forget('demo_payment_attempts.'.$purchase->id);

            return to_route('properties.show', $purchase->property)->with('error', 'Testa maksājums ir atcelts. Atskaite paliek slēgta.');
        }
        // The confirmation must belong to the scenario started from the checkout form.
        // Loading the processing page alone never marks an order as paid.
        abort_unless($request->session()->get('demo_payment_attempts.'.$purchase->id) === $request->validated('outcome'), 403);
        $request->session()->forget('demo_payment_attempts.'.$purchase->id);
        if ($request->validated('outcome') === 'failed') {
            return to_route('checkout.demo.show', $purchase)->with('error', 'Testa maksājums noraidīts. Atskaite paliek slēgta. Varat mēģināt vēlreiz.');
        }

        // This is deliberately a simulation. No card data or external payment API is used.
        // The provider marker ensures this purchase is ignored outside local/test demo mode.
        $purchase->markPaid();
        $request->session()->regenerate();

        return to_route('properties.report', $purchase->property)->with('success', 'Testa maksājums izdevās. Atskaite šajā pārlūkā pieejama 24 stundas. Īsta nauda netika iekasēta.');
    }

    public function prepare(CompleteDemoPaymentRequest $request, Purchase $purchase): RedirectResponse
    {
        if ($purchase->paid_at !== null) {
            return $this->completedPurchase($purchase);
        }
        if ($request->validated('outcome') === 'cancelled') {
            return $this->complete($request, $purchase);
        }

        // Only the test scenario is stored. Displayed card details are fixed examples,
        // have no form names and are never submitted, saved or sent to a payment service.
        $request->session()->put('demo_payment_attempts.'.$purchase->id, $request->validated('outcome'));

        return to_route('checkout.demo.processing', $purchase);
    }

    public function processing(Request $request, Purchase $purchase): View|RedirectResponse
    {
        Gate::authorize('view', $purchase);
        if ($purchase->paid_at !== null) {
            return $this->completedPurchase($purchase);
        }
        $outcome = $request->session()->get('demo_payment_attempts.'.$purchase->id);
        if (! in_array($outcome, ['success', 'failed'], true)) {
            return to_route('checkout.demo.show', $purchase);
        }

        return view('checkout.processing', ['purchase' => $purchase, 'property' => $purchase->property, 'outcome' => $outcome]);
    }

    private function completedPurchase(Purchase $purchase): RedirectResponse
    {
        if (Gate::allows('viewReport', $purchase->property)) {
            return to_route('properties.report', $purchase->property);
        }

        return to_route('properties.show', $purchase->property)->with('error', 'Atskaites piekļuves laiks ir beidzies. Izveidojiet jaunu pasūtījumu.');
    }
}
