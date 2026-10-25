<?php

namespace App\Http\Controllers;

use App\Http\Requests\ContactPageRequest;
use App\Http\Requests\SampleReportRequest;
use App\Models\Property;
use App\Models\PropertyTransaction;
use Illuminate\View\View;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class PageController extends Controller
{
    public function demoVideo(): BinaryFileResponse
    {
        // Laravel handles HTTP byte ranges, so seeking also works on PHP's local
        // server. This fixed public recording never reads a user-supplied path.
        return response()->file(public_path('media/demo/purchase-walkthrough.webm'), [
            'Content-Type' => 'video/webm',
        ]);
    }

    public function home(): View
    {
        return view('pages.home', [
            'property' => $this->reportExample(),
            // Only public teaser fields from fictional records appear in these shortcuts.
            'suggestedProperties' => Property::where('is_demo', true)
                ->whereIn('address', ['Brīvības iela 64–12', 'Gaismas iela 12', 'Demo priežu iela 4'])
                ->select(['id', 'address', 'city', 'type'])->orderBy('id')->limit(3)->get(),
        ]);
    }

    public function pricing(): View
    {
        return view('pages.pricing');
    }

    public function about(): View
    {
        return view('pages.about');
    }

    public function contact(ContactPageRequest $request): View
    {
        return view('pages.contact', ['subject' => $request->validated('subject', '')]);
    }

    public function sample(SampleReportRequest $request): View
    {
        $data = $request->validated();

        return view('pages.sample', [
            'property' => $this->reportExample($data['type'] ?? 'Dzīvoklis'),
            'section' => $data['section'] ?? 'history',
        ]);
    }

    private function reportExample(string $type = 'Dzīvoklis'): Property
    {
        // Marketing illustrations are detached models, NEVER records from the paid database.
        // Changing a search/property ID cannot reveal its data through the sample page.
        $details = match ($type) {
            'Māja' => ['area_m2' => 145, 'rooms' => 4, 'land_area_m2' => 1000],
            'Zeme' => ['area_m2' => 2000, 'land_area_m2' => 2000],
            default => ['area_m2' => 50, 'rooms' => 2, 'land_area_m2' => 250],
        };
        $property = new Property($details + ['address' => 'Atskaites struktūras paraugs', 'city' => 'Ilustrācija',
            'cadastre_number' => '00000000000', 'type' => $type, 'floor' => 1, 'total_floors' => 2,
            'construction_year' => 2000, 'wall_material' => 'Ilustratīvs piemērs']);
        $property->is_demo = true;
        $property->setRelation('transactions', collect([
            new PropertyTransaction(['transaction_date' => '2025-01-01', 'price_eur' => 127000, 'kind' => 'Pārdošana']),
            new PropertyTransaction(['transaction_date' => '2018-01-01', 'price_eur' => 100000, 'kind' => 'Pārdošana']),
            new PropertyTransaction(['transaction_date' => '2010-01-01', 'price_eur' => 70000, 'kind' => 'Pārdošana']),
        ]));

        return $property;
    }
}
