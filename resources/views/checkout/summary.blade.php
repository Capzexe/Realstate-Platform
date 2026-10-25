<aside class="checkout-summary" aria-labelledby="order-title">
    <a class="text-link" href="{{ route('properties.show', $property) }}">Atpakaļ uz īpašumu</a>
    <div class="checkout-order-heading">
        <h1 id="order-title">VeriSale īpašuma atskaite</h1>
        <p>{{ $property->address }}</p>
        <p>{{ $property->city }} · {{ $property->type }}</p>
    </div>
    <dl class="checkout-order-lines">
        <div><dt>Īpašuma dati un darījumu vēsture</dt><dd><x-money :value="config('services.stripe.report_price') / 100" :decimals="2" /></dd></div>
        <div><dt>Cenu izmaiņu grafiks</dt><dd>Iekļauts</dd></div>
        <div><dt>Saglabāšana PDF formātā</dt><dd>Iekļauts</dd></div>
        <div><dt>Piekļuve šajā pārlūkā</dt><dd>24 stundas</dd></div>
    </dl>
    <div class="checkout-total">
        <div><h2>Kopā testa pasūtījumā</h2><strong><x-money :value="config('services.stripe.report_price') / 100" :decimals="2" /></strong></div>
        <p>Faktiskais maksājums: <strong>0 €</strong>. Šī ir vietēja simulācija. Atskaite paliek slēgta līdz veiksmīgai apstiprināšanai.</p>
    </div>
</aside>
