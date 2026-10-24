<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Property extends Model
{
    // is_demo changes paid access; only trusted seeding code may assign it explicitly.
    protected $fillable = ['address', 'city', 'cadastre_number', 'type', 'area_m2', 'rooms', 'floor', 'total_floors', 'construction_year', 'wall_material', 'land_area_m2'];

    protected function casts(): array
    {
        return ['is_demo' => 'boolean', 'area_m2' => 'decimal:2', 'land_area_m2' => 'decimal:2'];
    }

    protected static function booted(): void
    {
        // PHP lowercases Latvian letters correctly even when SQLite cannot.
        static::saving(function (Property $property) {
            $property->search_text = mb_strtolower("{$property->address} {$property->city} {$property->cadastre_number}");
        });
    }

    public function transactions(): HasMany
    {
        return $this->hasMany(PropertyTransaction::class)->orderByDesc('transaction_date')->orderByDesc('id');
    }

    public function purchases(): HasMany
    {
        return $this->hasMany(Purchase::class);
    }

    public function scopeSearch(Builder $query, string $text): void
    {
        foreach (preg_split('/\s*,\s*/u', $text, -1, PREG_SPLIT_NO_EMPTY) as $part) {
            // Treat % and _ as typed characters, not as SQL wildcard instructions.
            $term = str_replace(['!', '%', '_'], ['!!', '!%', '!_'], mb_strtolower(trim($part)));
            $query->whereRaw("search_text LIKE ? ESCAPE '!'", ["%{$term}%"]);
        }
    }

    public function reportIsAvailable(array $purchaseIds): bool
    {
        return $this->is_demo || $this->purchases()->whereIn('id', $purchaseIds)
            ->whereNotNull('paid_at')->where('expires_at', '>', now())->exists();
    }

    public function chartPoints(): array
    {
        $transactions = $this->transactions->sortBy('transaction_date')->values();
        $maximum = max(1, (float) $transactions->max('price_eur'));

        return $transactions->map(fn ($transaction, $index) => [
            'x' => 60 + ($index * 420 / max(1, $transactions->count() - 1)),
            'y' => 170 - ((float) $transaction->price_eur / $maximum * 120),
            'year' => $transaction->transaction_date->format('Y'),
            'price' => $transaction->price_eur,
        ])->all();
    }
}
