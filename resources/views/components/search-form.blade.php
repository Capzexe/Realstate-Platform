@props(['id' => 'property-search'])
@php
    // Error pages may render before the web middleware shares a validation bag.
    $errors = $errors ?? new \Illuminate\Support\ViewErrorBag;
    // This component also appears on pages that do not process search requests.
    $searchValue = request()->query('q', old('q', ''));
    $searchValue = is_string($searchValue) ? mb_substr($searchValue, 0, 200) : '';
@endphp
<form class="search-form" action="{{ route('properties.index') }}" method="get" role="search" data-validate-form>
    <label class="sr-only" for="{{ $id }}">Īpašuma adrese vai kadastra numurs</label>
    <input id="{{ $id }}" name="q" type="search" placeholder="Ievadiet adresi vai kadastra numuru"
        value="{{ $searchValue }}" required minlength="2" maxlength="200"
        @error('q') aria-invalid="true" aria-describedby="{{ $id }}-error" @enderror>
    <button class="button" type="submit">Pārbaudīt <span aria-hidden="true">→</span></button>
</form>
<x-field-error name="q" :id="$id . '-error'" />
