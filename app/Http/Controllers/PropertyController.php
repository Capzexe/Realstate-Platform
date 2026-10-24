<?php

namespace App\Http\Controllers;

use App\Http\Requests\SearchPropertiesRequest;
use App\Models\Property;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\View\View;

class PropertyController extends Controller
{
    public function index(SearchPropertiesRequest $request): View
    {
        $data = $request->validated();
        $query = trim($data['q']);

        return view('properties.index', [
            'query' => $query,
            'properties' => Property::search($query)->withCount('transactions')->orderBy('address')->paginate(12)->appends(['q' => $query]),
        ]);
    }

    public function show(Request $request, Property $property): View
    {
        // The preview deliberately loads no prices. Paid data is rendered only by report().
        $property->loadCount('transactions');

        return view('properties.show', [
            'property' => $property,
            'latestDate' => $property->transactions()->value('transaction_date'),
            'canView' => Gate::allows('viewReport', $property),
        ]);
    }

    public function report(Request $request, Property $property): View
    {
        Gate::authorize('viewReport', $property);
        $property->load('transactions');

        return view('properties.report', [
            'property' => $property,
        ]);
    }
}
