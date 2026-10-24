@extends('layouts.app')
@section('title', $property->address . ' — atskaite')
@section('content')
    <x-section tone="soft">
        <div class="report-toolbar"><a class="text-link" href="{{ route('properties.show', $property) }}">← Īpašuma
                pārskats</a><button type="button" class="button" data-print>Saglabāt kā PDF <span
                    aria-hidden="true">→</span></button></div>
        <article class="paper live-report">
            <div class="panel-heading">
                <div>
                    <h1>{{ $property->address }}</h1>
                    <p>{{ $property->city }} · {{ $property->cadastre_number }}</p>
                </div><span>{{ $property->transactions->count() }} darījumi</span>
            </div>
            @if ($property->is_demo)
                <p class="demo-notice">Ilustratīva demonstrācijas atskaite. Šie nav pārbaudīti darījumu dati par konkrētu
                    īpašumu.</p>
            @endif
            <div class="report-summary">
                <div><span>Pēdējā darījuma summa</span><strong><x-money :value="$property->transactions->first()?->price_eur" /></strong></div>
                <div><span>Darījumu ieraksti</span><strong>{{ $property->transactions->count() }}</strong></div>
            </div>
            <section class="report-block">
                <h2>Ēkas un īpašuma dati</h2>@include('partials.property-data')
            </section>
            <section class="report-block">
                <h2>Cenu dinamika</h2>@include('partials.chart')
            </section>
            <section class="report-block">
                <h2>Pilna darījumu vēsture</h2>@include('partials.history')
            </section>
        </article>
    </x-section>
@endsection
