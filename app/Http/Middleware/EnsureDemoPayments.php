<?php

namespace App\Http\Middleware;

use App\Models\Purchase;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureDemoPayments
{
    public function handle(Request $request, Closure $next): Response
    {
        $purchase = $request->route('purchase');
        abort_unless(Purchase::demoPaymentsEnabled() && $purchase instanceof Purchase
            && $purchase->payment_provider === 'demo', 404);

        return $next($request);
    }
}
