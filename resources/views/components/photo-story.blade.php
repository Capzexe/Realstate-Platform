@props(['title', 'image', 'alt', 'credit', 'source', 'tone' => 'white'])
<x-section :tone="$tone" {{ $attributes }}>
    <div class="photo-story">
        <figure>
            <img src="{{ asset($image) }}" alt="{{ $alt }}" width="800" height="900" loading="lazy">
            <figcaption>Ilustratīvs foto · <a href="{{ $source }}">{{ $credit }} / Unsplash</a></figcaption>
        </figure>
        <div class="story-copy">
            <h2>{{ $title }}</h2>
            {{ $slot }}
        </div>
    </div>
</x-section>
