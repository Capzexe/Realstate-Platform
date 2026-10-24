@props(['property'])
<div {{ $attributes->class(['report-preview']) }} aria-label="Ilustratīvs īpašuma atskaites priekšskatījums">
    <div class="preview-history">
        <div class="preview-heading"><span>Darījumu vēsture</span><span>verisale.</span></div>
        <p>{{ $property->address }}</p>
        @foreach ($property->transactions->take(3) as $transaction)
            <div class="preview-sale">
                <span>{{ $transaction->transaction_date->format('d.m.Y.') }}<small>{{ $transaction->kind }}</small></span>
                <strong><x-money :value="$transaction->price_eur" /></strong>
            </div>
        @endforeach
        <div class="preview-history-bottom">Kadastra nr. {{ $property->cadastre_number }}</div>
    </div>
    <div class="preview-main">
        <div class="preview-heading"><span>Īpašuma pārskats</span><span>verisale.</span></div>
        <h2>{{ $property->address }}</h2>
        <p>{{ $property->city }} · {{ $property->type }}</p>
        <div class="preview-value"><span>Pēdējā darījuma summa</span><strong><x-money :value="$property->transactions->first()?->price_eur" /></strong></div>
        <dl class="preview-details">
            <div>
                <dt>Platība</dt>
                <dd>{{ (float) $property->area_m2 }} m²</dd>
            </div>
            <div>
                <dt>Istabas</dt>
                <dd>{{ $property->rooms ?? '—' }}</dd>
            </div>
            <div>
                <dt>Darījumi</dt>
                <dd>{{ $property->transactions->count() }}</dd>
            </div>
        </dl>
        @include('partials.chart', ['compact' => true])
    </div>
    <p class="preview-caption">Demonstrācijas atskaite · ilustratīvi dati</p>
</div>
