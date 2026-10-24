<?php

namespace App\Console\Commands;

use App\Models\Property;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use RuntimeException;

class ImportProperties extends Command
{
    protected $signature = 'properties:import {file : Path to a UTF-8 CSV file}';

    protected $description = 'Import property details and transactions from a CSV file';

    public function handle(): int
    {
        $path = $this->argument('file');
        if (! is_file($path) || ! is_readable($path)) {
            $this->error('The CSV file does not exist or cannot be read.');

            return self::FAILURE;
        }
        $file = fopen($path, 'r');
        try {
            $header = fgetcsv($file, 0, ',', '"', '');
            if (! $header) {
                throw new RuntimeException('The CSV file is empty.');
            }
            $header[0] = preg_replace('/^\xEF\xBB\xBF/', '', $header[0]);
            $header = array_map('trim', $header);
            $required = ['address', 'city', 'cadastre_number', 'transaction_date', 'price_eur'];
            if (array_diff($required, $header) || count(array_unique($header)) !== count($header)) {
                throw new RuntimeException('Use unique column names and include: '.implode(', ', $required));
            }

            // One transaction keeps a bad row from leaving a partially imported file.
            $count = DB::transaction(function () use ($file, $header) {
                $count = 0;
                $line = 1;
                while (($values = fgetcsv($file, 0, ',', '"', '')) !== false) {
                    $line++;
                    if ($values === [null]) {
                        continue;
                    }
                    if (count($values) !== count($header)) {
                        throw new RuntimeException("Row {$line}: the number of values does not match the header.");
                    }
                    $row = array_map(fn ($value) => trim($value) === '' ? null : trim($value), array_combine($header, $values));
                    $validator = Validator::make($row, [
                        'address' => 'required|string|max:255',
                        'city' => 'required|string|max:255',
                        'cadastre_number' => 'required|regex:/^[0-9]{11}$/',
                        'transaction_date' => 'required|date_format:Y-m-d',
                        'price_eur' => 'required|numeric|min:0.01|max:9999999999.99',
                        'type' => 'sometimes|nullable|in:Dzīvoklis,Māja,Zeme',
                        'area_m2' => 'sometimes|nullable|numeric|min:0|max:9999999999.99',
                        'rooms' => 'sometimes|nullable|integer|min:0|max:65535',
                        'floor' => 'sometimes|nullable|integer|min:0|max:65535',
                        'total_floors' => 'sometimes|nullable|integer|min:0|max:65535',
                        'construction_year' => 'sometimes|nullable|integer|min:1|max:9999',
                        'wall_material' => 'sometimes|nullable|string|max:255',
                        'land_area_m2' => 'sometimes|nullable|numeric|min:0|max:999999999999.99',
                    ]);
                    if ($validator->fails()) {
                        throw new RuntimeException("Row {$line}: ".$validator->errors()->first());
                    }
                    $data = $validator->validated();
                    $existing = Property::where('cadastre_number', $data['cadastre_number'])->first();
                    if ($existing?->is_demo) {
                        throw new RuntimeException("Row {$line}: this cadastre belongs to a demo. Use a different cadastre for imported records.");
                    }
                    $details = collect($data)->except(['transaction_date', 'price_eur'])->all();
                    $details['type'] = $details['type'] ?? $existing?->type ?? 'Dzīvoklis';
                    $property = Property::updateOrCreate(['cadastre_number' => $data['cadastre_number']], $details);
                    // Re-importing the same sale will not add a duplicate transaction.
                    $property->transactions()->firstOrCreate([
                        'transaction_date' => $data['transaction_date'],
                        'price_eur' => $data['price_eur'],
                        'kind' => 'Pārdošana',
                    ]);
                    $count++;
                }

                return $count;
            });
            $this->info("Imported {$count} CSV rows. Existing transactions were kept without duplicates.");

            return self::SUCCESS;
        } catch (RuntimeException $exception) {
            $this->error($exception->getMessage());

            return self::FAILURE;
        } finally {
            fclose($file);
        }
    }
}
