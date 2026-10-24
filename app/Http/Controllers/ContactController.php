<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreContactRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Mail\Message;
use Illuminate\Support\Facades\Mail;
use Throwable;

class ContactController extends Controller
{
    public function store(StoreContactRequest $request): RedirectResponse
    {
        $data = $request->validated();

        try {
            Mail::raw("From: {$data['name']} <{$data['email']}>\n\n{$data['message']}", function (Message $mail) use ($data) {
                $mail->to(config('services.contact_email'))->replyTo($data['email'], $data['name'])->subject($data['subject']);
            });
        } catch (Throwable $exception) {
            report($exception);

            return to_route('contact')->withInput($data)->with('error', 'Ziņojumu neizdevās nosūtīt. Lūdzu, mēģiniet vēlāk.');
        }

        $message = config('mail.default') === 'log'
            ? 'Demonstrācijas režīms: ziņojums saglabāts lokālajā pasta žurnālā, nevis nosūtīts.'
            : 'Paldies! Jūsu ziņojums ir nosūtīts.';

        return to_route('contact')->with('success', $message);
    }
}
