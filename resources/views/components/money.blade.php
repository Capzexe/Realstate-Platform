@props(['value', 'decimals' => 0])
{{ $value !== null ? number_format((float) $value, $decimals, ',', ' ') . ' €' : '—' }}
