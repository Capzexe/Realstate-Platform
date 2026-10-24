<?php

namespace App\Providers;

use App\Models\Property;
use App\Models\Purchase;
use App\Policies\PropertyPolicy;
use App\Policies\PurchasePolicy;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        Auth::viaRequest('anonymous', fn () => null);
        Gate::policy(Property::class, PropertyPolicy::class);
        Gate::policy(Purchase::class, PurchasePolicy::class);

        // Keep absolute links (especially Stripe callbacks) independent of request headers.
        URL::forceRootUrl(config('app.url'));
        if (config('security.require_https')) {
            URL::forceScheme('https');
        }

        RateLimiter::for('contact', fn (Request $request) => Limit::perMinute(5)->by($request->ip()));
        RateLimiter::for('search', fn (Request $request) => Limit::perMinute(60)->by($request->ip()));
        RateLimiter::for('checkout', fn (Request $request) => Limit::perMinute(10)->by($request->ip()));
        RateLimiter::for('checkout-status', fn (Request $request) => Limit::perMinute(10)->by($request->ip()));
        // Stripe retries 429 responses. Signature verification remains mandatory.
        RateLimiter::for('stripe-webhook', fn (Request $request) => Limit::perMinute(120)->by($request->ip()));
    }
}
