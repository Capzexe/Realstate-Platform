<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Purchase extends Model
{
    protected $fillable = ['checkout_session_id'];

    protected function casts(): array
    {
        return ['paid_at' => 'datetime', 'expires_at' => 'datetime'];
    }

    public function property(): BelongsTo
    {
        return $this->belongsTo(Property::class);
    }

    public function markPaid(): void
    {
        // A repeated webhook must not restart the customer's 24-hour access period.
        static::whereKey($this->id)->whereNull('paid_at')->update([
            'paid_at' => now(),
            'expires_at' => now()->addDay(),
        ]);
    }
}
