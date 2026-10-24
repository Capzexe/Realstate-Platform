@extends('layouts.app')
@section('title', $property->address)
@section('content')
    <x-hero :title="$property->address">
        <p>{{ $property->city }} · {{ $property->type }} · {{ $property->cadastre_number }}</p>
        <p class="small-note">Atrasti {{ $property->transactions_count }} darījumu ieraksti.</p>
    </x-hero>
    <x-section tone="soft">
        <a class="text-link back-link" href="{{ route('home') }}#property-search">← Meklēt citu adresi</a>
        <div class="property-layout">
            <div class="paper">
                <h2>Īpašuma pārskats</h2>
                @include('partials.property-data')
                <h3 class="block-heading">Darījumu vēsture</h3>
                <p>Atrasti {{ $property->transactions_count }} ieraksti. Summas pieejamas pilnajā atskaitē.</p>
                <dl class="data-grid">
                    <div>
                        <dt>Pēdējais reģistrētais darījums</dt>
                        <dd>{{ $latestDate ? date('d.m.Y.', strtotime($latestDate)) : '—' }}</dd>
                    </div>
                </dl>
            </div>
            <aside class="purchase-panel">
                <h2>Pilna vēsture.<br>Skaidrs lēmums.</h2>
                @if ($property->is_demo)
                    <p>Šis ir demonstrācijas īpašums. Tā ilustratīvo atskaiti varat atvērt bez maksas.</p>
                @else
                    <p>Visi pieejamie darījumi ar cenām un īpašuma tehniskajiem datiem.</p>
                    <div class="purchase-price">9,99 €<span>Vienreizēja maksa · 24 stundu piekļuve</span></div>
                @endif
                @if ($canView)
                    <a class="button button-yellow" href="{{ route('properties.report', $property) }}">Atvērt
                        {{ $property->is_demo ? 'piemēra ' : '' }}atskaiti <span aria-hidden="true">→</span></a>
                @else
                    <form action="{{ route('checkout.store', $property) }}" method="post">@csrf<button
                            class="button button-yellow" type="submit" data-loading-text="Sagatavojam…">Iegādāties atskaiti
                            <span aria-hidden="true">→</span></button></form>
                    <p class="small-note">Maksājums notiks Stripe vietnē. Šeit netiek ievadīti kartes dati.</p>
                @endif
            </aside>
        </div>
    </x-section>
@endsection
