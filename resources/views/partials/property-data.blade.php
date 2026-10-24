<dl class="data-grid">
    @foreach (['Objekta veids' => $property->type, 'Platība' => $property->area_m2 ? (float) $property->area_m2 . ' m²' : null, 'Istabas' => $property->rooms, 'Stāvs / stāvi' => $property->floor ? $property->floor . ' / ' . $property->total_floors : $property->total_floors, 'Celšanas gads' => $property->construction_year, 'Sienu materiāls' => $property->wall_material, 'Zemes platība' => $property->land_area_m2 ? (float) $property->land_area_m2 . ' m²' : null, 'Kadastra numurs' => $property->cadastre_number] as $label => $value)
        <div>
            <dt>{{ $label }}</dt>
            <dd>{{ $value ?? '—' }}</dd>
        </div>
    @endforeach
</dl>
