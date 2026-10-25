<?php

namespace App\Http\Controllers;

use App\Http\Requests\SearchPropertiesRequest;
use App\Models\Property;
use App\Models\Purchase;
use Illuminate\Http\RedirectResponse;
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
            'properties' => Property::search($query)->select(['id', 'address', 'city', 'type', 'is_demo'])->orderBy('address')->paginate(12)->appends(['q' => $query]),
        ]);
    }

    public function show(Property $property): View
    {
        $canView = Gate::allows('viewReport', $property);
        if ($canView) {
            $property->loadCount('transactions');
        }

        return view('properties.show', [
            'property' => $property,
            'canView' => $canView,
            'demoPayments' => Purchase::demoPaymentsEnabled(),
        ]);
    }

    public function report(Property $property): View|RedirectResponse
    {
        if (Gate::denies('viewReport', $property)) {
            return to_route('properties.show', $property)->with('error', 'Lai skatītu pilno īpašuma informāciju, vispirms iegādājieties atskaiti.');
        }
        $property->load('transactions');

        return view('properties.report', [
            'property' => $property,
        ]);
    }
}
