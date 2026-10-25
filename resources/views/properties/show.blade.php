@extends('layouts.app')
@section('title', $property->address)
@section('content')
    <x-hero :title="$property->address">
        <p>{{ $property->city }} · {{ $property->type }}</p>
        <p class="small-note">Pilnā īpašuma informācija pieejama pēc atskaites iegādes.</p>
    </x-hero>
    <x-section tone="soft">
        <a class="text-link back-link" href="{{ route('home') }}#property-search">← Meklēt citu adresi</a>
        <div class="property-layout">
            <div class="paper">
                @if ($canView)
                    <h2>Īpašuma pārskats</h2>
                    @include('partials.property-data')
                    <h3 class="block-heading">Darījumu vēsture</h3>
                    <p>Atrasti {{ $property->transactions_count }} ieraksti.</p>
                @else
                    <h2>Pilnā informācija ir slēgta</h2>
                    <p class="lead">Iegādājieties šī īpašuma atskaiti, lai atvērtu pieejamos datus.</p>
                    <x-benefit-list :items="[
                        ['Īpašuma tehniskie dati', 'Platība, istabas, ēkas parametri un kadastra informācija.'],
                        ['Darījumu vēsture', 'Reģistrētie datumi, summas un cenu izmaiņu grafiks.'],
                        ['Saglabājams pārskats', 'Pilna atskaite un iespēja to saglabāt kā PDF.'],
                    ]" />
                    @if ($property->is_demo)
                        <p class="small-note">Šis ir izdomāts testa īpašums. Arī tā atskaite tiek atvērta tikai pēc maksājuma.</p>
                    @endif
                @endif
            </div>
            <aside class="purchase-panel">
                <h2>Pilna vēsture.<br>Skaidrs lēmums.</h2>
                <p>Visi pieejamie darījumi ar cenām un īpašuma tehniskajiem datiem.</p>
                <div class="purchase-price"><x-money :value="config('services.stripe.report_price') / 100" :decimals="2" /><span>Vienreizēja maksa · 24 stundu piekļuve</span></div>
                @if ($canView)
                    <a class="button button-yellow" href="{{ route('properties.report', $property) }}">Atvērt
                        atskaiti <span aria-hidden="true">→</span></a>
                @else
                    <form action="{{ route('checkout.store', $property) }}" method="post">@csrf<button
                            class="button button-yellow" type="submit" data-loading-text="Sagatavojam…">Iegādāties atskaiti
                            <span aria-hidden="true">→</span></button></form>
                    <p class="small-note">{{ $demoPayments ? 'Vietējais testa režīms: nākamajā solī simulēsiet maksājumu. Īsta nauda netiks iekasēta.' : 'Maksājums notiks Stripe vietnē. Šeit netiek ievadīti kartes dati.' }}</p>
                @endif
            </aside>
        </div>
    </x-section>
@endsection
