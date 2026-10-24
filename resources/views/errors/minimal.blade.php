{{-- Laravel's fallback error pages use this layout; keep them compatible with our CSP. --}}
@extends('layouts.app')
@section('content')
    <section class="section">
        <div class="shell empty-state">
            <p>@yield('code')</p>
            <h1>@yield('title', 'Pieprasījumu neizdevās izpildīt')</h1>
            <p>@yield('message', 'Lūdzu, mēģiniet vēlāk.')</p>
            <a class="button" href="{{ route('home') }}">Atgriezties sākumlapā →</a>
        </div>
    </section>
@endsection
