@props(['title', 'align' => 'center', 'titleId' => null])
<div {{ $attributes->class(['section-title', 'section-title-left' => $align === 'left']) }}>
    <h2 @if ($titleId) id="{{ $titleId }}" @endif>{{ $title }}</h2>
    @if (trim($slot) !== '')
        <div class="section-description">{{ $slot }}</div>
    @endif
</div>
