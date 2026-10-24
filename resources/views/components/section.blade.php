@props(['tone' => 'white'])
<section {{ $attributes->class(['section', 'tint' => $tone === 'sage', 'soft' => $tone === 'soft']) }}>
    <div class="shell">{{ $slot }}</div>
</section>
