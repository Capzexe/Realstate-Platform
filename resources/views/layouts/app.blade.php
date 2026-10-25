<!doctype html>
<html lang="lv">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="Īpašumu darījumu vēsture un saprotami pārskati ar VeriSale.">
    <title>@yield('title', 'Īpašumu vēsture') · VeriSale</title>
    <link rel="stylesheet" href="{{ asset('fonts/fonts.css') }}">
    <link rel="stylesheet" href="{{ asset('css/app.css') }}">
    <script src="{{ asset('js/app.js') }}" defer></script>
</head>

<body>
    <a class="skip-link" href="#main-content">Pāriet uz saturu</a>
    <header class="site-header">
        <div class="shell header-inner">
            <a class="wordmark" href="{{ route('home') }}" aria-label="VeriSale sākumlapa">verisale<span>.</span></a>
            <button class="menu-toggle" type="button" data-menu-toggle aria-expanded="false"
                aria-controls="primary-navigation">Izvēlne</button>
            <nav id="primary-navigation" class="navigation" aria-label="Galvenā navigācija">
                @foreach (['home' => 'Sākums', 'pricing' => 'Cenas', 'sample' => 'Atskaites piemērs', 'about' => 'Par mums', 'contact' => 'Kontakti'] as $name => $label)
                    <a href="{{ route($name) }}"
                        @if (request()->routeIs($name)) aria-current="page" @endif>{{ $label }}</a>
                @endforeach
            </nav>
            <a class="header-search" href="{{ route('home') }}#property-search">Meklēt īpašumu <span
                    aria-hidden="true">→</span></a>
        </div>
    </header>
    @if (session('success') || session('error') || $errors->any())
        <div class="notice" role="{{ session('success') ? 'status' : 'alert' }}">
            <div class="shell">
                @if (session('success'))
                    <p>{{ session('success') }}</p>
                @endif
                @if (session('error'))
                    <p>{{ session('error') }}</p>
                @endif
                @if ($errors->any())
                    <p>Lūdzu, pārbaudiet ievadītos datus.</p>
                    <ul>
                        @foreach ($errors->all() as $error)
                            <li>{{ $error }}</li>
                        @endforeach
                    </ul>
                @endif
            </div>
        </div>
    @endif
    <main id="main-content">@yield('content')</main>
    @include('partials.faq')
    @include('partials.final-search')
    <footer class="site-footer">
        <div class="shell footer-grid">
            <div><a class="wordmark" href="{{ route('home') }}">verisale<span>.</span></a>
                <p>Katram īpašumam ir vēsture.<br>Mēs palīdzam to izlasīt.</p>
                <p>Rīga, Latvija</p>
            </div>
            <div>
                <h2>Platforma</h2><a href="{{ route('home') }}#property-search">Meklēt īpašumu</a><a
                    href="{{ route('pricing') }}">Cenu plāni</a><a href="{{ route('sample') }}">Atskaites piemērs</a>
                <a href="{{ route('demo') }}">Pirkuma plūsmas video</a>
            </div>
            <div>
                <h2>Par VeriSale</h2><a href="{{ route('about') }}">Mūsu pieeja</a><a
                    href="{{ route('contact') }}">Sazināties</a><a
                    href="mailto:{{ config('services.contact_email') }}">{{ config('services.contact_email') }}</a>
            </div>
        </div>
        <div class="shell footer-bottom">© {{ date('Y') }} VeriSale. Īpašumu darījumu vēsture.</div>
    </footer>
</body>

</html>
