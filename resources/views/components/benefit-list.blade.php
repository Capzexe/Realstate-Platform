@props(['items', 'numbered' => false])
@if ($numbered)
    <ol class="steps">
        @foreach ($items as [$title, $copy])
            <li>
                <h3>{{ $title }}</h3>
                <p>{{ $copy }}</p>
            </li>
        @endforeach
    </ol>
@else
    <div class="benefit-list">
        @foreach ($items as [$title, $copy])
            <article>
                <h3>{{ $title }}</h3>
                <p>{{ $copy }}</p>
            </article>
        @endforeach
    </div>
@endif
