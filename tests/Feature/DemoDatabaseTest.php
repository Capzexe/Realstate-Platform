<?php

namespace Tests\Feature;

use App\Models\Property;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DemoDatabaseTest extends TestCase
{
    use RefreshDatabase;

    public function test_demo_database_covers_searchable_cities_and_property_types(): void
    {
        $this->seed();
        $this->assertSame(12, Property::where('is_demo', true)->count());
        $this->assertSame(10, Property::distinct()->count('city'));
        $this->assertSame(3, Property::distinct()->count('type'));
        $this->assertDatabaseCount('purchases', 0);

        foreach (['Jūrmala', 'Liepāja', 'Daugavpils', 'Valmiera', 'Ogre', 'Sigulda', 'Ventspils'] as $city) {
            $this->get('/ipasumi?'.http_build_query(['q' => $city]))->assertOk()
                ->assertSee($city)->assertSee('Demonstrācijas īpašums');
        }
        foreach (Property::all() as $property) {
            $this->assertSame(3, $property->transactions()->count());
            $this->get(route('properties.report', $property))->assertRedirect(route('properties.show', $property));
        }
    }

    public function test_seed_never_converts_existing_non_demo_data_to_free_access(): void
    {
        $property = Property::create(['address' => 'Existing imported property', 'city' => 'Rīga',
            'cadastre_number' => '99000000001']);
        $property->transactions()->create(['transaction_date' => '2024-01-01', 'price_eur' => 123456]);
        $this->seed();

        $this->assertFalse($property->fresh()->is_demo);
        $this->assertSame('Existing imported property', $property->fresh()->address);
        $this->assertSame(1, $property->transactions()->count());
        $this->get(route('properties.report', $property))->assertRedirect(route('properties.show', $property));
    }
}
