@extends('layouts.app')
@section('title', 'Kontakti')
@section('content')
    @php
        // Validation failures can flash array-shaped input. Never pass arrays to HTML escaping.
        $form = [];
        foreach (['name', 'email', 'subject', 'message'] as $field) {
            $value = old($field, $field === 'subject' ? $subject : '');
            $form[$field] = is_string($value) ? $value : '';
        }
    @endphp
    <x-hero title="Sāksim ar sarunu." image="property-research.jpg" credit="Vitaly Gariev"
        source="https://unsplash.com/photos/fTZJstpGcQg">
        <p>Jautājumi par īpašumu datiem, atskaitēm vai sadarbību? Pastāstiet, kā varam palīdzēt.</p>
    </x-hero>
    <x-section tone="soft">
        <div class="split-layout">
            <aside class="contact-info">
                <h2>Rakstiet mums</h2>
                <a class="contact-email"
                    href="mailto:{{ config('services.contact_email') }}">{{ config('services.contact_email') }}</a>
                <x-benefit-list :items="[
                    ['Par atskaites saturu', 'Palīdzēsim saprast atskaites struktūru un pieejamos datus.'],
                    ['Par profesionālu sadarbību', 'Pastāstiet par nepieciešamo datu apjomu un komandas vajadzībām.'],
                ]" />
                <a class="text-link" href="{{ route('pricing') }}">Apskatīt cenas <span aria-hidden="true">→</span></a>
            </aside>
            <form class="paper contact-form" action="{{ route('contact.store') }}" method="post" data-validate-form>
                @csrf
                <h3>Jūsu ziņojums</h3>
                <p>Aizpildiet laukus, lai sazinātos ar mūsu komandu.</p>
                <div class="form-pair">
                    <div class="form-field"><label for="name">Vārds, uzvārds</label><input id="name" name="name"
                            autocomplete="name" value="{{ $form['name'] }}" required maxlength="100"
                            @error('name') aria-invalid="true" aria-describedby="name-error" @enderror>
                        <x-field-error name="name" id="name-error" />
                    </div>
                    <div class="form-field"><label for="email">E-pasts</label><input id="email" name="email"
                            type="email" autocomplete="email" value="{{ $form['email'] }}" required maxlength="254"
                            @error('email') aria-invalid="true" aria-describedby="email-error" @enderror>
                        <x-field-error name="email" id="email-error" />
                    </div>
                </div>
                <div class="form-field"><label for="subject">Temats</label><input id="subject" name="subject"
                        value="{{ $form['subject'] }}" required maxlength="150"
                        @error('subject') aria-invalid="true" aria-describedby="subject-error" @enderror>
                    <x-field-error name="subject" id="subject-error" />
                </div>
                <div class="form-field"><label for="message">Ziņojums</label>
                    <textarea id="message" name="message" rows="5" required minlength="10" maxlength="5000"
                        @error('message') aria-invalid="true" aria-describedby="message-error" @enderror>{{ $form['message'] }}</textarea>
                    <x-field-error name="message" id="message-error" />
                </div>
                <button class="button" type="submit" data-loading-text="Sūtām…">Nosūtīt ziņojumu <span
                        aria-hidden="true">→</span></button>
                @if (config('mail.default') === 'log')
                    <p class="small-note">Demonstrācijas režīms: ziņojums tiks saglabāts lokāli, nevis nosūtīts.</p>
                @endif
            </form>
        </div>
    </x-section>
@endsection
