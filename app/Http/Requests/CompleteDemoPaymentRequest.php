<?php

namespace App\Http\Requests;

use App\Models\Purchase;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rule;

class CompleteDemoPaymentRequest extends FormRequest
{
    protected $redirectRoute = 'home';

    public function authorize(): bool
    {
        $purchase = $this->route('purchase');

        return $purchase instanceof Purchase && Gate::allows('view', $purchase);
    }

    public function rules(): array
    {
        return ['outcome' => ['required', 'string', Rule::in(['success', 'failed', 'cancelled'])]];
    }
}
