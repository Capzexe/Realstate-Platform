<?php

namespace Database\Seeders;

use App\Models\Property;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $examples = require database_path('fixtures/properties.php');
        foreach ($examples as $example) {
            $history = $example['history'];
            unset($example['history']);
            $property = Property::firstOrCreate(['cadastre_number' => $example['cadastre_number']], $example);
            if ($property->wasRecentlyCreated) {
                $property->is_demo = true;
                $property->save();
            }
            if (! $property->is_demo) {
                continue; // Seeding again must never overwrite a real imported property.
            }
            foreach ($history as [$date, $price]) {
                $property->transactions()->firstOrCreate(['transaction_date' => $date, 'price_eur' => $price, 'kind' => 'Pārdošana']);
            }
        }
    }
}
