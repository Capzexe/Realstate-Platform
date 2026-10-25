<?php

namespace App\Policies;

use App\Models\Property;
use Illuminate\Contracts\Auth\Authenticatable;

class PropertyPolicy
{
    public function viewReport(?Authenticatable $user, Property $property): bool
    {
        // Every saved property, including fictional fixtures, requires a valid purchase.
        return $property->reportIsAvailable(request()->session()->get('purchase_ids', []));
    }
}
