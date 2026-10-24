<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ContactPageRequest extends FormRequest
{
    protected $redirectRoute = 'contact';

    public function rules(): array
    {
        return ['subject' => ['nullable', 'string', 'max:150', 'not_regex:/[\r\n]/']];
    }
}
