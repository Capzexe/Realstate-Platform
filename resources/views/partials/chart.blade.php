@php($points = $property->chartPoints())
@if (count($points) > 1)
    <svg class="history-chart" viewBox="0 0 560 220" role="img"
        aria-label="Darījumu cenu vēsture: {{ collect($points)->map(fn ($point) => $point['year'].' — '.number_format((float) $point['price'], 0, ',', ' ').' eiro')->implode('; ') }}.">
        <line x1="45" y1="175" x2="510" y2="175" stroke="#dae4dc" />
        <line x1="45" y1="90" x2="510" y2="90" stroke="#eaf1ed" />
        <polyline points="{{ collect($points)->map(fn($point) => $point['x'] . ',' . $point['y'])->implode(' ') }}"
            fill="none" stroke="#275441" stroke-width="3" />
        @foreach ($points as $point)
            <g>
                <circle cx="{{ $point['x'] }}" cy="{{ $point['y'] }}" r="5" fill="#16372a" /><text
                    x="{{ $point['x'] }}" y="{{ $point['y'] - 15 }}" text-anchor="middle"><x-money
                        :value="$point['price']" /></text><text x="{{ $point['x'] }}" y="205"
                    text-anchor="middle">{{ $point['year'] }}</text>
            </g>
        @endforeach
    </svg>
@else<p class="small-note">Grafikam nepieciešami vismaz divi darījumi.</p>
@endif
