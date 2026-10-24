<?php

namespace App\Policies;

use App\Models\Purchase;
use Illuminate\Contracts\Auth\Authenticatable;

class PurchasePolicy
{
    public function view(?Authenticatable $user, Purchase $purchase): bool
    {
        // IDs in a URL or request body do not establish ownership.
        return in_array($purchase->id, request()->session()->get('purchase_ids', []), true);
    }
}
