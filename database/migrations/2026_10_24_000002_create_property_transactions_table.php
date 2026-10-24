<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('property_transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('property_id')->constrained()->cascadeOnDelete();
            $table->date('transaction_date');
            $table->decimal('price_eur', 14, 2);
            $table->string('kind')->default('Pārdošana');
            $table->timestamps();
            $table->unique(['property_id', 'transaction_date', 'price_eur', 'kind'], 'unique_property_transaction');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('property_transactions');
    }
};
