<?php

namespace App\Policies;

use App\Models\Property;
use Illuminate\Contracts\Auth\Authenticatable;

class PropertyPolicy
{
    public function viewReport(?Authenticatable $user, Property $property): bool
    {
        // Demo data is public. Real reports require an owned, paid, unexpired purchase.
        return $property->reportIsAvailable(request()->session()->get('purchase_ids', []));
    }
}
