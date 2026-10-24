@extends('layouts.app')
@section('title', 'Atskaites piemērs')
@section('content')
    <x-hero title="Viena adrese. Pilna aina.">
        <p>Iepazīstiet atskaites struktūru: darījumu vēsturi, reģistrētās cenas un īpašuma tehniskos datus.</p>
        <p class="small-note">Ilustratīvs piemērs, nevis konkrēta īpašuma novērtējums.</p>
        <a class="button button-yellow" href="#sample-report">Apskatīt pārskatu <span aria-hidden="true">↓</span></a>
    </x-hero>
    @include('partials.report-showcase')
@endsection
