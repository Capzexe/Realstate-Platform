<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('properties', function (Blueprint $table) {
            $table->id();
            $table->string('address');
            $table->string('city');
            $table->string('cadastre_number')->unique();
            $table->string('type')->default('Dzīvoklis');
            $table->decimal('area_m2', 12, 2)->nullable();
            $table->unsignedSmallInteger('rooms')->nullable();
            $table->unsignedSmallInteger('floor')->nullable();
            $table->unsignedSmallInteger('total_floors')->nullable();
            $table->unsignedSmallInteger('construction_year')->nullable();
            $table->string('wall_material')->nullable();
            $table->decimal('land_area_m2', 14, 2)->nullable();
            $table->boolean('is_demo')->default(false);
            $table->text('search_text');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('properties');
    }
};
