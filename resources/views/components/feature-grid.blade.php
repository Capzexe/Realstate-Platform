@props(['items', 'columns' => 4])
<div {{ $attributes->class(['feature-grid', 'three' => $columns === 3]) }}>
    @foreach ($items as [$title, $copy])
        <article>
            <h3>{{ $title }}</h3>
            <p>{{ $copy }}</p>
        </article>
    @endforeach
</div>
