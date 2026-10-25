@extends('layouts.app')
@section('title', 'Testa maksājuma apstrāde')
@section('content')
    <div class="checkout-workspace">
        @include('checkout.summary')
        <section class="checkout-payment" aria-labelledby="processing-title">
            <div class="checkout-monitor" data-payment-progress>
                <div class="checkout-monitor-heading">
                    <h2 id="processing-title" tabindex="-1">Testa maksājuma apstrāde</h2>
                    <p>Lokāla simulācija · pasūtījums #{{ $purchase->id }}</p>
                </div>
                <p class="checkout-progress-status" role="status" data-payment-status>Sagatavojam testa maksājumu…</p>
                <ol class="checkout-progress-steps">
                    <li data-payment-step aria-current="step"><span>Pasūtījums sagatavots</span><small>Izvēlētais īpašums un summa ir pārbaudīti.</small></li>
                    <li data-payment-step><span>Testa autorizācija</span><small>Izpildām izvēlēto demonstrācijas scenāriju.</small></li>
                    <li data-payment-step><span>Rezultāta apstiprināšana</span><small>Nosūtām testa rezultātu serverim.</small></li>
                    <li data-payment-step><span>{{ $outcome === 'failed' ? 'Atgriešanās norēķinos' : 'Atskaites atvēršana' }}</span><small>{{ $outcome === 'failed' ? 'Noraidīts maksājums piekļuvi nepiešķir.' : 'Pēc apstiprinājuma piekļuve būs pieejama 24 stundas.' }}</small></li>
                </ol>
                <p class="checkout-monitor-note">Šis nav Stripe savienojums vai bankas maksājums. Īsta nauda netiek pārskaitīta.</p>
                <form action="{{ route('checkout.demo.complete', $purchase) }}" method="post" data-payment-confirm>
                    @csrf
                    <input type="hidden" name="outcome" value="{{ $outcome }}">
                    <button class="button" type="submit" data-payment-fallback>Turpināt un apstiprināt testa rezultātu</button>
                </form>
                <noscript><p class="small-note">Nospiediet pogu, lai apstiprinātu testa rezultātu un turpinātu.</p></noscript>
            </div>
        </section>
    </div>
@endsection
