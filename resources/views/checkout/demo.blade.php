@extends('layouts.app')
@section('title', 'Testa norēķini')
@section('content')
    <div class="checkout-workspace">
        @include('checkout.summary')
        <section class="checkout-payment" aria-labelledby="payment-title">
            <div class="checkout-form-paper">
                <h2 id="payment-title">Maksājuma informācija</h2>
                <p class="checkout-intro">Testa norēķini. Īsta nauda netiks iekasēta.</p>
                <form action="{{ route('checkout.demo.prepare', $purchase) }}" method="post">
                    @csrf
                    <input type="hidden" name="outcome" value="success">
                    <div class="form-field">
                        <label for="demo-email">E-pasta adrese · testa piemērs</label>
                        <input id="demo-email" type="text" value="demo@example.com" readonly autocomplete="off">
                    </div>
                    <fieldset class="checkout-card-fields">
                        <legend>Testa kartes dati</legend>
                        <label class="sr-only" for="demo-card">Testa kartes numurs</label>
                        <input id="demo-card" type="text" value="4242  4242  4242  4242" readonly autocomplete="off">
                        <div class="checkout-card-pair">
                            <div><label for="demo-expiry">Derīguma termiņš</label><input id="demo-expiry" type="text" value="12 / 28" readonly autocomplete="off"></div>
                            <div><label for="demo-code">Drošības kods</label><input id="demo-code" type="text" value="424" readonly autocomplete="off"></div>
                        </div>
                        <p class="small-note">Fiksēti demonstrācijas dati. Kartes dati netiek nosūtīti vai saglabāti.</p>
                    </fieldset>
                    <div class="form-field">
                        <label for="demo-name">Vārds uz kartes · testa piemērs</label>
                        <input id="demo-name" type="text" value="Testa Pircējs" readonly autocomplete="off">
                    </div>
                    <button class="button checkout-pay-button" type="submit" data-loading-text="Sagatavojam testa maksājumu…">Apmaksāt testa režīmā <x-money :value="config('services.stripe.report_price') / 100" :decimals="2" /></button>
                </form>
                <div class="checkout-test-actions">
                    <form action="{{ route('checkout.demo.prepare', $purchase) }}" method="post">@csrf
                        <input type="hidden" name="outcome" value="failed">
                        <button class="text-link" type="submit">Izmēģināt noraidītu maksājumu</button>
                    </form>
                    <form action="{{ route('checkout.demo.complete', $purchase) }}" method="post">@csrf
                        <input type="hidden" name="outcome" value="cancelled">
                        <button class="text-link" type="submit">Atcelt</button>
                    </form>
                </div>
            </div>
        </section>
    </div>
@endsection
