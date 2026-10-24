<?php

namespace Tests\Feature;

use App\Models\Property;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ImportTest extends TestCase
{
    use RefreshDatabase;

    public function test_csv_can_be_imported_twice_without_duplicate_sales(): void
    {
        for ($i = 0; $i < 2; $i++) {
            $this->artisan('properties:import', ['file' => database_path('examples/properties.csv')])->assertSuccessful();
        }
        $this->assertDatabaseCount('properties', 1);
        $this->assertDatabaseCount('property_transactions', 2);
        $this->assertFalse(Property::first()->is_demo);
        $this->assertSame(1, Property::search('RĪGA')->count());
    }

    public function test_bad_csv_rolls_back_preceding_rows(): void
    {
        $file = tempnam(sys_get_temp_dir(), 'verisale-test-');
        file_put_contents($file, "address,city,cadastre_number,transaction_date,price_eur\nTest,Rīga,99999999999,2024-01-01,50000\nInvalid,Rīga,invalid,2024-01-01,10\n");
        try {
            $this->artisan('properties:import', ['file' => $file])->assertFailed();
            $this->assertDatabaseCount('properties', 0);
        } finally {
            unlink($file);
        }
    }

    public function test_import_does_not_overwrite_a_public_demo(): void
    {
        $this->seed();
        $file = tempnam(sys_get_temp_dir(), 'verisale-test-');
        file_put_contents($file, "address,city,cadastre_number,transaction_date,price_eur\nTest,Rīga,01000640001,2024-01-01,50000\n");
        try {
            $this->artisan('properties:import', ['file' => $file])->assertFailed();
            $this->assertDatabaseCount('property_transactions', 36);
        } finally {
            unlink($file);
        }
    }
}
