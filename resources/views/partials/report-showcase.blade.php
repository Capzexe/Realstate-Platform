<x-section tone="soft" id="sample-report">
    <x-section-heading title="Pilns īpašuma pārskats vienuviet">
        <p>Iepazīstiet atskaites sadaļas un apskatiet, kā dati pārtop saprotamā īpašuma vēsturē.</p>
    </x-section-heading>
    <nav class="kind-switch" aria-label="Atskaites veids">
        @foreach (['Dzīvoklis', 'Māja', 'Zeme'] as $type)
            <a href="{{ route('sample', ['type' => $type, 'section' => $section]) }}#sample-report"
                @if ($property->type === $type) aria-current="page" @endif>{{ $type }}</a>
        @endforeach
    </nav>
    <div class="showcase">
        <aside>
            <nav class="report-nav" aria-label="Atskaites sadaļas">
                @foreach (['history' => 'Darījumu vēsture', 'prices' => 'Cenu dinamika', 'property' => 'Īpašuma dati', 'building' => 'Ēkas dati', 'land' => 'Zemes dati'] as $key => $label)
                    <a href="{{ route('sample', ['type' => $property->type, 'section' => $key]) }}#sample-report"
                        @if ($section === $key) aria-current="page" @endif>{{ $label }} <span
                            aria-hidden="true">›</span></a>
                @endforeach
            </nav>
            <a class="button button-yellow" href="{{ route('home') }}#property-search">Pārbaudīt īpašumu <span
                    aria-hidden="true">→</span></a>
        </aside>
        <article class="report-panel">
            <div class="panel-heading">
                <div>
                    <h3>{{ ['history' => 'Darījumu vēsture', 'prices' => 'Cenu dinamika', 'property' => 'Īpašuma dati', 'building' => 'Ēkas dati', 'land' => 'Zemes dati'][$section] }}
                    </h3>
                    <p>{{ $property->address }}, {{ $property->city }}</p>
                </div><span>Ilustratīvs piemērs</span>
            </div>
            @if ($section === 'history' || $section === 'prices')
                <div class="report-overview">
                    <div class="report-property"><img src="{{ asset('property-interior.jpg') }}"
                            alt="Ilustratīvs dzīvojamās istabas interjers" width="300" height="220" loading="lazy">
                        <div><span>{{ $property->type }} · {{ (float) $property->area_m2 }}
                                m²</span><strong>{{ $property->address }}</strong>
                            <p>{{ $property->city }}</p>
                        </div>
                    </div>
                    <div class="report-value"><span>Pēdējā darījuma summa</span><strong><x-money
                                :value="$property->transactions->first()?->price_eur" /></strong>
                        <p>{{ $property->transactions->count() }} darījumu ieraksti</p><span>Ilustratīvi dati</span>
                    </div>
                </div>
                <div class="report-chart">
                    <h4>Darījumu cenu vēsture</h4>@include('partials.chart')
                </div>
                @if ($section === 'history')
                    @include('partials.history')
                @endif
            @elseif ($section === 'land')
                <dl class="data-grid">
                    <div>
                        <dt>Zemes platība</dt>
                        <dd>{{ $property->land_area_m2 ? (float) $property->land_area_m2 . ' m²' : '—' }}</dd>
                    </div>
                    <div>
                        <dt>Pilsēta</dt>
                        <dd>{{ $property->city }}</dd>
                    </div>
                    <div>
                        <dt>Kadastra numurs</dt>
                        <dd>{{ $property->cadastre_number }}</dd>
                    </div>
                </dl>
            @else
                @include('partials.property-data')
            @endif
            <p class="small-note">Demonstrācijas dati. Pieejamā informācija ir atkarīga no datubāzē esošajiem
                ierakstiem.</p>
            <a class="text-link" href="{{ route('properties.report', $property) }}">Atvērt pilnu demonstrācijas
                atskaiti <span aria-hidden="true">→</span></a>
        </article>
    </div>
</x-section>
