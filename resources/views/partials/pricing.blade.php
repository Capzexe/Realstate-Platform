<x-section class="pricing-section" id="cenas">
    <x-section-heading title="Izvēlieties atskaiti savām vajadzībām">
        <p>Vienam īpašumam, regulāram darbam vai komandai. Sāciet ar sev piemērotāko.</p>
    </x-section-heading>
    <div class="pricing-grid">
        @foreach (config('verisale.plans') as $plan)
            <article class="pricing-plan {{ $loop->iteration === 2 ? 'pricing-featured' : '' }}">
                <h3>{{ $plan['name'] }}</h3>
                <p class="plan-description">{{ $plan['description'] }}</p>
                <div class="plan-price">{{ $plan['price'] }}<span> €</span></div>
                <p class="plan-period">{{ $plan['period'] }}</p>
                <ul>
                    @foreach ($plan['features'] as $feature)
                        <li>{{ $feature }}</li>
                    @endforeach
                </ul>
                <a class="button {{ $loop->iteration === 2 ? 'button-yellow' : '' }}"
                    href="{{ $loop->first ? route('home') . '#property-search' : route('contact', ['subject' => $plan['name']]) }}">{{ $loop->first ? 'Meklēt īpašumu' : 'Sazināties par plānu' }}
                    <span aria-hidden="true">→</span></a>
                <p class="plan-note">
                    {{ $loop->first ? 'Vienreizēja maksa · 24 stundu piekļuve' : 'Piedāvājums pēc individuālas saziņas' }}
                </p>
            </article>
        @endforeach
    </div>
    <div class="pricing-footnote"><span>Atskaites struktūras paraugs bez maksas</span><span>Saglabājams
            PDF</span><span>Vienkārša piekļuve šajā pārlūkā</span></div>
</x-section>
