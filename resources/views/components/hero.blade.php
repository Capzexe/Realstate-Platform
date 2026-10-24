@props([
    'title',
    'image' => 'riga-facade.jpg',
    'credit' => 'Kseniia Samoylenko',
    'source' => 'https://unsplash.com/photos/oT5FNy7Isdg',
])
<section class="page-hero">
    <div class="shell page-hero-grid">
        <div class="hero-copy">
            <h1>{{ $title }}</h1>
            <div class="hero-description">{{ $slot }}</div>
        </div>
        <figure class="page-hero-photo">
            <img class="page-hero-background" src="{{ asset($image) }}" alt="" aria-hidden="true">
            <figcaption><a href="{{ $source }}">Ilustratīvs foto: {{ $credit }} / Unsplash</a></figcaption>
        </figure>
    </div>
</section>
