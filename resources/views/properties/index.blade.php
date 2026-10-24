@extends('layouts.app')
@section('title', 'Meklēšanas rezultāti')
@section('content')
    <x-hero title="Atrodiet īpašuma vēsturi.">
        <p>Meklēšanas rezultāti: {{ $query }}</p>
        <x-search-form id="results-search" />
    </x-hero>
    <x-section>
        <x-section-heading title="Meklēšanas rezultāti" align="left">
            <p>Atrasti {{ $properties->total() }} īpašumi. Izvēlieties adresi, lai iepazītos ar pieejamo informāciju.</p>
        </x-section-heading>
        <div class="results-list">
            @forelse ($properties as $property)
                <article class="result-row">
                    <div>
                        <h3><a href="{{ route('properties.show', $property) }}">{{ $property->address }}</a></h3>
                        <p>{{ $property->city }} · {{ $property->type }} · {{ $property->cadastre_number }}</p>
                        @if ($property->is_demo)
                            <p class="small-note">Demonstrācijas īpašums ar ilustratīviem darījumiem.</p>
                        @endif
                    </div>
                    <div><span>{{ $property->transactions_count }} darījumi</span><a class="text-link"
                            href="{{ route('properties.show', $property) }}">Apskatīt īpašumu <span
                                aria-hidden="true">→</span></a></div>
                </article>
            @empty
                <div class="empty-state">
                    <h3>Īpašums nav atrasts</h3>
                    <p>Pārbaudiet adresi vai ievadiet kadastra numuru. Varat arī apskatīt demonstrācijas atskaiti.</p><a
                        class="button" href="{{ route('sample') }}">Atskaites piemērs <span aria-hidden="true">→</span></a>
                </div>
            @endforelse
        </div>
        @if ($properties->hasPages())
            <nav class="pagination" aria-label="Rezultātu lapas">
                @if ($properties->previousPageUrl())
                    <a href="{{ $properties->previousPageUrl() }}">← Iepriekšējā</a>
                @endif
                <span>
                    {{ $properties->currentPage() }} / {{ $properties->lastPage() }}</span>
                @if ($properties->nextPageUrl())
                    <a href="{{ $properties->nextPageUrl() }}">Nākamā →</a>
                @endif
            </nav>
        @endif
    </x-section>
@endsection
