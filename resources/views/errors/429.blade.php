@extends('layouts.app')
@section('title', 'Pārāk daudz pieprasījumu')
@section('content')<section class="section">
        <div class="shell empty-state">
            <h1>Nedaudz uzgaidiet</h1>
            <p>Pieprasījumu limits ir sasniegts. Mēģiniet vēlāk. Atskaite joprojām ir pieejama.</p><a class="button"
                href="{{ route('home') }}">Uz sākumlapu →</a>
        </div>
</section>@endsection
