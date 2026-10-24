@extends('layouts.app')
@section('title', 'Nepieciešama piekļuve')
@section('content')<section class="section">
        <div class="shell empty-state">
            <h1>Nepieciešama derīga piekļuve</h1>
            <p>Šī atskaite nav pieejama šajā pārlūkā vai piekļuves laiks ir beidzies.</p><a class="button"
                href="{{ route('home') }}#property-search">Meklēt īpašumu →</a>
        </div>
</section>@endsection
