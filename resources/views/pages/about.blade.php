@extends('layouts.app')
@section('title', 'Par mums')
@section('content')
    <x-hero title="Īpašumu dati. Cilvēku lēmumi.">
        <p>VeriSale padara īpašumu darījumu vēsturi saprotamu. Pircējiem, pārdevējiem un nozares profesionāļiem.</p>
        <a class="button button-yellow" href="{{ route('sample') }}">Iepazīt atskaiti <span aria-hidden="true">→</span></a>
    </x-hero>
    <x-photo-story title="Skaidrība sākas ar pieejamiem faktiem" image="property-research.jpg"
        alt="Darbs ar informāciju pie klēpjdatora" credit="Vitaly Gariev" source="https://unsplash.com/photos/fTZJstpGcQg">
        <p class="lead">Pirms lēmuma par īpašumu ir svarīgi zināt vairāk par šodienas sludinājuma cenu.</p>
        <x-benefit-list :items="[
            [
                'Īpašuma vēsture vienuviet',
                'Mēs sakārtojam darījumus, datumus, summas un pieejamos tehniskos parametrus vienā pārskatā.',
            ],
            [
                'Skaidri norādīta datu izcelsme',
                'Demonstrācijas ieraksti ir atzīmēti. Īstas atskaites pamats ir datubāzē importētie īpašumu un darījumu ieraksti.',
            ],
            ['Jūsu izvērtējums', 'Pārskatāmi fakti palīdz uzdot vajadzīgos jautājumus un pieņemt savu lēmumu.'],
        ]" />
    </x-photo-story>
    <x-section tone="soft">
        <x-section-heading title="Viena pieeja katrai adresei">
            <p>Informācija, kurā ir viegli orientēties un pie kuras ir viegli atgriezties.</p>
        </x-section-heading>
        <x-feature-grid :columns="3" :items="[
            ['Pārskatāmi dati', 'Darījumi un tehniskā informācija vienotā struktūrā.'],
            ['Skaidra izcelsme', 'Demonstrācijas saturs ir nodalīts no īstiem ierakstiem.'],
            ['Pārskats līdzi', 'Saglabājiet atskaiti kā PDF nākamajai sarunai vai apskatei.'],
        ]" />
    </x-section>
@endsection
