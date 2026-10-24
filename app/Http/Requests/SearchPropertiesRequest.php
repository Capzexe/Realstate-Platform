<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SearchPropertiesRequest extends FormRequest
{
    protected $redirectRoute = 'home';

    public function rules(): array
    {
        return [
            'q' => ['required', 'string', 'min:2', 'max:200', 'regex:/[\p{L}\p{N}]/u'],
            'page' => ['sometimes', 'integer', 'min:1', 'max:10000'],
        ];
    }
}
