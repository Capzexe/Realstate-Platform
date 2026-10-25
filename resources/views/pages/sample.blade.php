@extends('layouts.app')
@section('title', 'Atskaites piemērs')
@section('content')
    <x-hero title="Viena adrese. Pilna aina." image="property-interior.jpg" credit="Spacejoy"
        source="https://unsplash.com/photos/0JGRXomKXSw">
        <p>Iepazīstiet atskaites struktūru: darījumu vēsturi, reģistrētās cenas un īpašuma tehniskos datus.</p>
        <p class="small-note">Ilustratīvs piemērs, nevis konkrēta īpašuma novērtējums.</p>
        <a class="button button-yellow" href="#sample-report">Apskatīt pārskatu <span aria-hidden="true">↓</span></a>
    </x-hero>
    @include('partials.report-showcase')
@endsection
