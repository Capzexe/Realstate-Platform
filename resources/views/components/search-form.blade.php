@props(['id' => 'property-search'])
@php
    // This component also appears on pages that do not process search requests.
    $searchValue = request()->query('q');
    $searchValue = is_string($searchValue) ? mb_substr($searchValue, 0, 200) : '';
@endphp
<form class="search-form" action="{{ route('properties.index') }}" method="get" role="search">
    <label class="sr-only" for="{{ $id }}">Īpašuma adrese vai kadastra numurs</label>
    <input id="{{ $id }}" name="q" type="search" placeholder="Ievadiet adresi vai kadastra numuru"
        value="{{ $searchValue }}" required minlength="2" maxlength="200">
    <button class="button" type="submit">Pārbaudīt <span aria-hidden="true">→</span></button>
</form>
