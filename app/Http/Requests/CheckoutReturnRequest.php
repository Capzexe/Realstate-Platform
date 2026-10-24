<?php

namespace App\Http\Requests;

use App\Models\Purchase;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;

class CheckoutReturnRequest extends FormRequest
{
    protected $redirectRoute = 'home';

    public function authorize(): bool
    {
        $purchase = $this->route('purchase');

        return $purchase instanceof Purchase && Gate::allows('view', $purchase);
    }

    public function rules(): array
    {
        return ['session_id' => ['required', 'string', 'max:255', 'regex:/\Acs_[A-Za-z0-9_]+\z/']];
    }
}
