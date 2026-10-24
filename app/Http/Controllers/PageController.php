<?php

namespace App\Http\Controllers;

use App\Http\Requests\ContactPageRequest;
use App\Http\Requests\SampleReportRequest;
use App\Models\Property;
use Illuminate\View\View;

class PageController extends Controller
{
    public function home(): View
    {
        return view('pages.home', ['property' => Property::with('transactions')->where('is_demo', true)->orderBy('id')->first()]);
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
            'property' => Property::with('transactions')->where('is_demo', true)->where('type', $data['type'] ?? 'Dzīvoklis')->firstOrFail(),
            'section' => $data['section'] ?? 'history',
        ]);
    }
}
