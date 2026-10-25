@props(['name', 'id'])
@php($errors = $errors ?? new \Illuminate\Support\ViewErrorBag)
@error($name)
    <p id="{{ $id }}" class="field-error">{{ $message }}</p>
@enderror
