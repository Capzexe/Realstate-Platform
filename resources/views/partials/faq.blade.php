<x-section tone="soft" class="faq-section" aria-labelledby="faq-title">
    <x-section-heading title="Biežāk uzdotie jautājumi" title-id="faq-title">
        <p>Svarīgākais par atskaites saturu, datiem un piekļuvi.</p>
    </x-section-heading>
    <div class="faq-list">
        @foreach (config('verisale.faqs') as [$question, $answer])
            <details>
                <summary>{{ $question }}</summary>
                <p>{{ $answer }}</p>
            </details>
        @endforeach
    </div>
</x-section>
