@extends('layouts.app')
@section('title', 'Īpašumu darījumu vēsture')
@section('content')
    <section class="home-hero">
        <div class="shell hero-grid">
            <div class="hero-copy">
                <h1>Pārbaudiet īpašuma <mark>cenas, vēsturi</mark> un pieejamos datus.</h1>
                <p>Vairāk skaidrības pirms darījuma. Īpašuma vēsture un tehniskā informācija vienā saprotamā atskaitē.</p>
                <x-search-form />
                <x-address-suggestions :properties="$suggestedProperties" />
                <div class="hero-includes">
                    <strong>Ko uzzināsiet atskaitē</strong>
                    <ul>
                        @foreach (['Darījumu summas', 'Cenu vēsture', 'Kadastra numurs', 'Ēkas parametri', 'Zemes platība', 'PDF pārskats'] as $item)
                            <li>{{ $item }}</li>
                        @endforeach
                    </ul>
                </div>
            </div>
            @if ($property)
                <x-report-preview :property="$property" />
            @else
                <div class="hero-empty">
                    <h2>Katram īpašumam ir vēsture.</h2>
                    <p>Sāciet ar adresi vai kadastra numuru.</p>
                </div>
            @endif
        </div>
    </section>

    <div class="source-band">
        <div class="shell">
            <p>Svarīgākā informācija — vienā vietā</p>
            <div><span>Darījumu vēsture</span><span>Kadastra dati</span><span>Ēkas parametri</span><span>Zemes
                    informācija</span><span>PDF atskaite</span></div>
        </div>
    </div>

    <x-section>
        <x-section-heading title="Kas ir iekļauts atskaitē?">
            <p>Fakti, kas palīdz īpašumu ieraudzīt pilnīgāk — pirms pirkuma, pārdošanas vai nākamās sarunas.</p>
        </x-section-heading>
        <x-feature-grid :items="config('verisale.features')" />
    </x-section>

    <x-section tone="soft">
        <div class="split-layout">
            <div>
                <h2>Kāpēc sākt ar īpašuma vēsturi?</h2>
                <p class="lead">Sludinājums ir tikai sākums. Iepazīstiet faktus, kas ir aiz adreses.</p>
                <x-benefit-list :items="[
                    [
                        'Reģistrētās darījumu summas',
                        'Skatiet iepriekšējos darījumus un to datumus vienotā hronoloģijā.',
                    ],
                    [
                        'Skaidra informācijas struktūra',
                        'Adrese, kadastra numurs, ēkas un zemes parametri bez meklēšanas dažādās lapās.',
                    ],
                    [
                        'Pārskats arī nākamajai sarunai',
                        'Saglabājiet atskaiti kā PDF un atgriezieties pie vajadzīgajiem faktiem.',
                    ],
                ]" />
            </div>
            <div class="clarity-panel">
                <h3>Precīzi ieraksti.<br>Saprotama aina.</h3>
                <div class="clarity-search"><span>Īpašuma adrese</span><strong>Atskaites struktūras paraugs</strong><span
                        class="document-line"></span><span class="document-line short"></span></div>
                <div class="clarity-dark"><span>Darījumu vēsture</span><strong>3 darījumi vienā pārskatā</strong>
                    <p>Datumi, reģistrētās summas un īpašuma parametri.</p>
                </div>
                <p class="small-note">Ilustratīvs atskaites piemērs</p>
            </div>
        </div>
    </x-section>

    <x-photo-story title="Pārbaudiet pirms pērkat vai pārdodat īpašumu" image="property-research.jpg"
        alt="Sieviete pie klēpjdatora iepazīstas ar informāciju" credit="Vitaly Gariev"
        source="https://unsplash.com/photos/fTZJstpGcQg">
        <p class="lead">Mazāk minējumu. Vairāk jautājumu, kuriem ir pamats.</p>
        <x-benefit-list :numbered="true" :items="[
            ['Ievadiet adresi vai kadastra numuru', 'Atrodiet īpašumu un apskatiet pieejamo informāciju.'],
            ['Iegādājieties atskaiti', 'Pabeidziet maksājumu, lai atvērtu tieši šī īpašuma datus.'],
            ['Saglabājiet svarīgāko', 'Izpētiet darījumu vēsturi un saglabājiet pārskatu kā PDF.'],
        ]" />
        <a class="button button-yellow" href="#property-search">Pārbaudīt īpašumu <span aria-hidden="true">→</span></a>
    </x-photo-story>

    @if ($property)
        @include('partials.report-showcase', ['section' => 'history'])
    @endif

    <x-section>
        <x-section-heading title="Pārvērtiet datus pārdomātos lēmumos">
            <p>Saprotami nosacījumi vienas adreses izpētei.</p>
        </x-section-heading>
        <div class="facts">
            <div><strong>24 h</strong><span>Piekļuve iegādātajai atskaitei</span></div>
            <div><strong>9,99 €</strong><span>Vienreizēja maksa par atskaiti</span></div>
            <div><strong>PDF</strong><span>Pārskats, ko varat saglabāt</span></div>
        </div>
        <div class="audience-block">
            <x-section-heading title="Pircējiem, pārdevējiem un profesionāļiem">
                <p>Katram savs mērķis. Kopīgs sākumpunkts — pārskatāmi fakti.</p>
            </x-section-heading>
            <x-feature-grid :columns="3" :items="[
                ['Pērkat īpašumu?', 'Iepazīstiet iepriekšējos darījumus un sagatavojiet jautājumus pirms apskates.'],
                ['Plānojat pārdot?', 'Apkopojiet pieejamo informāciju un sagatavojieties sarunai ar pircēju.'],
                [
                    'Strādājat ar īpašumiem?',
                    'Pārskatiet tehniskos datus un cenu vēsturi vienotā, saglabājamā atskaitē.',
                ],
            ]" />
        </div>
    </x-section>

    @if ($property)
        <x-section tone="soft">
            <div class="split-layout">
                <div>
                    <h2>Viss, kas nepieciešams, lai vienotos par pārdomātu darījumu.</h2>
                    <p class="lead">Sāciet ar īpašuma vēsturi, turpiniet ar īstajiem jautājumiem.</p>
                    <ul class="plain-list">
                        <li>Iepriekšējo darījumu summas un datumi</li>
                        <li>Ēkas un īpašuma tehniskie parametri</li>
                        <li>Pārskatāma cenu dinamika</li>
                    </ul>
                    <a class="button button-yellow" href="#property-search">Pārbaudīt īpašumu <span
                            aria-hidden="true">→</span></a>
                </div>
                <div class="history-proof">
                    <div class="history-address"><span>Demonstrācijas īpašums</span>
                        <h3>{{ $property->address }}</h3>
                        <p>{{ $property->city }} · {{ (float) $property->area_m2 }} m²</p><strong><x-money
                                :value="$property->transactions->first()?->price_eur" /></strong>
                    </div>
                    <div class="paper">@include('partials.chart')<p class="small-note">Ilustratīva darījumu cenu vēsture
                        </p>
                    </div>
                </div>
            </div>
        </x-section>
    @endif

    <x-photo-story title="Lai saruna par īpašumu sākas ar faktiem" image="property-interior.jpg"
        alt="Gaišs dzīvojamās istabas interjers" credit="Spacejoy" source="https://unsplash.com/photos/0JGRXomKXSw">
        <p class="lead">Pirms apskates vai sarunas par finansējumu veltiet brīdi īpašuma pieejamajiem datiem.</p>
        <ul class="plain-list">
            <li>Vai vēsture sakrīt ar jums zināmo?</li>
            <li>Kādi ir ēkas un zemes parametri?</li>
            <li>Ko vēl vēlaties noskaidrot pirms darījuma?</li>
        </ul>
        <a class="button button-yellow" href="#property-search">Izpētīt īpašumu <span aria-hidden="true">→</span></a>
    </x-photo-story>

    <x-section tone="soft">
        <x-section-heading title="Viena atskaite. Plašāks skatījums.">
            <p>Mazāk meklēšanas dažādās vietās, vairāk pārskatāmas informācijas.</p>
        </x-section-heading>
        <div class="comparison">
            <div>
                <h3>Meklējot pa vienam</h3>
                <dl>
                    <div>
                        <dt>Cena sludinājumā</dt>
                        <dd>Sākumā redzat pārdevēja prasīto cenu</dd>
                    </div>
                    <div>
                        <dt>Atsevišķi ieraksti</dt>
                        <dd>Darījumu vēsture jāmeklē papildus</dd>
                    </div>
                    <div>
                        <dt>Savas piezīmes</dt>
                        <dd>Informācija paliek dažādos dokumentos</dd>
                    </div>
                    <div>
                        <dt>Nākamā saruna</dt>
                        <dd>Fakti vēlreiz jāatrod un jāsakārto</dd>
                    </div>
                </dl>
            </div>
            <div class="comparison-brand">
                <h3>Ar VeriSale atskaiti</h3>
                <dl>
                    <div>
                        <dt>Darījumu summas</dt>
                        <dd>Pieejamās reģistrētās cenas vienā pārskatā</dd>
                    </div>
                    <div>
                        <dt>Īpašuma vēsture</dt>
                        <dd>Darījumi pārskatāmā hronoloģijā</dd>
                    </div>
                    <div>
                        <dt>Tehniskā informācija</dt>
                        <dd>Ēkas, īpašuma un zemes parametri</dd>
                    </div>
                    <div>
                        <dt>Saglabājams pārskats</dt>
                        <dd>PDF, pie kura atgriezties arī vēlāk</dd>
                    </div>
                </dl>
            </div>
        </div>
    </x-section>
    @include('partials.pricing')
@endsection
