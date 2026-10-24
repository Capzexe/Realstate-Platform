@extends('layouts.app')
@section('title', 'Cenas')
@section('content')
    <x-hero title="Skaidra vēsture. Skaidras cenas." image="property-interior.jpg" credit="Spacejoy"
        source="https://unsplash.com/photos/0JGRXomKXSw">
        <p>No vienas atskaites līdz komandas ikdienas darbam. Izvēlieties apjomu, kas atbilst jūsu vajadzībām.</p>
        <a class="text-link" href="{{ route('sample') }}">Vispirms apskatīt atskaites piemēru <span
                aria-hidden="true">→</span></a>
    </x-hero>
    @include('partials.pricing')
    <x-section tone="soft">
        <x-section-heading title="Ziniet, ko iegūstat">
            <p>Vienreizējās atskaites nosacījumi īsumā.</p>
        </x-section-heading>
        <x-feature-grid :columns="3" :items="[
            ['Viena konkrēta adrese', 'Darījumu vēsture un visi pieejamie īpašuma parametri vienā atskaitē.'],
            ['24 stundu piekļuve', 'Pēc apstiprināta maksājuma turpiniet izmantot to pašu pārlūku.'],
            ['PDF, ko saglabāt', 'Izmantojiet pārlūka drukāšanas iespēju, lai pārskats paliktu pie jums.'],
        ]" />
    </x-section>
@endsection
