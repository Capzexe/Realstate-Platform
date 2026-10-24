@extends('layouts.app')
@section('title', 'Lapa nav atrasta')
@section('content')<section class="section">
        <div class="shell empty-state">
            <h1>Lapa nav atrasta</h1>
            <p>Adrese nav pieejama. Atgriezieties sākumlapā vai meklējiet citu īpašumu.</p><a class="button"
                href="{{ route('home') }}">Uz sākumlapu →</a>
        </div>
</section>@endsection
