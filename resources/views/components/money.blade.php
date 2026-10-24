@props(['value'])
{{ $value !== null ? number_format((float) $value, 0, ',', ' ') . ' €' : '—' }}
