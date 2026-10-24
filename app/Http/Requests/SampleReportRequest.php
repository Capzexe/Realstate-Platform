<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class SampleReportRequest extends FormRequest
{
    protected $redirectRoute = 'sample';

    public function rules(): array
    {
        return [
            'type' => ['nullable', 'string', Rule::in(['Dzīvoklis', 'Māja', 'Zeme'])],
            'section' => ['nullable', 'string', Rule::in(['history', 'prices', 'property', 'building', 'land'])],
        ];
    }
}
