<?php

use App\Http\Middleware\EnsureSecureTransport;
use App\Http\Middleware\SecurityHeaders;
use App\Http\Middleware\TrustProxies;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Symfony\Component\HttpFoundation\Response;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->prepend(SecurityHeaders::class);
        $middleware->replace(Illuminate\Http\Middleware\TrustProxies::class, TrustProxies::class);
        $middleware->append(EnsureSecureTransport::class);
        // Stripe cannot send a browser CSRF token. Its signature is checked in CheckoutController.
        $middleware->validateCsrfTokens(except: ['stripe/webhook']);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        // Rejected requests (403, 404, 419, 422, 429 and 500) need the same headers.
        $exceptions->respond(fn (Response $response) => SecurityHeaders::apply(request(), $response));
    })->create();
