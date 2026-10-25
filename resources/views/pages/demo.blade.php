@extends('layouts.app')
@section('title', 'Pirkuma plūsmas demonstrācija')
@section('content')
    <x-hero title="No adreses līdz īpašuma atskaitei." image="property-interior.jpg" credit="Spacejoy"
        source="https://unsplash.com/photos/0JGRXomKXSw">
        <p>Īss ieskats meklēšanā, aizslēgtā pārskatā, testa norēķinos un atskaites atvēršanā.</p>
        <p class="small-note">Video izmanto izdomātus datus un vietējo maksājuma simulāciju. Īsta nauda netiek iekasēta.</p>
    </x-hero>
    <x-section>
        <x-section-heading title="Apskatiet visu pirkuma plūsmu">
            <p>Noraidīts maksājums atstāj atskaiti slēgtu; veiksmīgs testa maksājums atver konkrētā īpašuma datus.</p>
        </x-section-heading>
        <video class="demo-video" controls playsinline preload="none" poster="{{ asset('media/demo/poster.png') }}" aria-label="VeriSale pirkuma plūsmas demonstrācija">
            <source src="{{ route('demo.video') }}" type="video/webm">
            <track kind="captions" src="{{ asset('media/demo/purchase-walkthrough.lv.vtt') }}" srclang="lv" label="Latviski" default>
            Jūsu pārlūks neatbalsta video. <a href="{{ route('demo.video') }}">Lejupielādēt ierakstu</a>.
        </video>
        <p class="demo-video-note">Ieraksts ir bez skaņas; ieslēdziet latviešu subtitrus. Vietējā simulācija publiskajā produkcijas vidē nav pieejama. Reālai integrācijas pārbaudei izmantojiet Stripe testa vidi.</p>
        <a class="text-link" href="{{ route('home') }}#property-search">Izmēģināt meklēšanu <span aria-hidden="true">→</span></a>
    </x-section>
@endsection
