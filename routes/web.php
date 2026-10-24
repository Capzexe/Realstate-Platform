<?php

use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\PageController;
use App\Http\Controllers\PropertyController;
use Illuminate\Support\Facades\Route;

Route::get('/', [PageController::class, 'home'])->name('home');
Route::get('/cenas', [PageController::class, 'pricing'])->name('pricing');
Route::get('/atskaites-piemers', [PageController::class, 'sample'])->name('sample');
Route::get('/par-mums', [PageController::class, 'about'])->name('about');
Route::get('/kontakti', [PageController::class, 'contact'])->name('contact');
Route::post('/kontakti', [ContactController::class, 'store'])->middleware('throttle:contact')->name('contact.store');
Route::get('/ipasumi', [PropertyController::class, 'index'])->middleware('throttle:search')->name('properties.index');
Route::get('/ipasumi/{property}', [PropertyController::class, 'show'])->name('properties.show');
Route::get('/ipasumi/{property}/atskaite', [PropertyController::class, 'report'])->name('properties.report');
Route::post('/ipasumi/{property}/checkout', [CheckoutController::class, 'store'])->middleware('throttle:checkout')->name('checkout.store');
Route::get('/checkout/{purchase}/success', [CheckoutController::class, 'success'])->middleware('throttle:checkout-status')->name('checkout.success');
Route::post('/stripe/webhook', [CheckoutController::class, 'webhook'])->middleware('throttle:stripe-webhook')->name('stripe.webhook');
