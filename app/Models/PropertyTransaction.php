<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

class PropertyTransaction extends Model
{
    protected $fillable = ['transaction_date', 'price_eur', 'kind'];

    protected function casts(): array
    {
        return ['transaction_date' => 'date', 'price_eur' => 'decimal:2'];
    }

    public function setTransactionDateAttribute($value): void
    {
        // SQLite keeps dates as text. Use one format so repeated imports find the same sale.
        $this->attributes['transaction_date'] = Carbon::parse($value)->format('Y-m-d');
    }

    public function property(): BelongsTo
    {
        return $this->belongsTo(Property::class);
    }
}
