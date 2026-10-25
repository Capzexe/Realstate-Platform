@props(['properties'])
@if ($properties->isNotEmpty())
    <nav class="address-suggestions" aria-label="Testa adreses">
        <p>Izmēģiniet ar testa adresi</p>
        <div class="address-suggestion-grid">
            @foreach ($properties as $example)
                <a href="{{ route('properties.index', ['q' => $example->address . ', ' . $example->city]) }}">
                    <span class="suggestion-type">{{ $example->type }}</span>
                    <strong>{{ $example->address }}</strong>
                    <span class="suggestion-city">{{ $example->city }}</span>
                </a>
            @endforeach
        </div>
    </nav>
@endif
