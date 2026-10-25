<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class LatvianValidationTest extends TestCase
{
    use RefreshDatabase;

    public function test_contact_errors_are_latvian_inline_and_keep_input(): void
    {
        Mail::shouldReceive('raw')->never();
        $this->from(route('contact'))->post(route('contact.store'), [
            'name' => 'Testa Pircējs', 'email' => 'invalid', 'subject' => 'Jautājums', 'message' => 'Par īsu',
        ])->assertRedirect(route('contact'))->assertSessionHasErrors(['email', 'message']);
        $this->get(route('contact'))->assertOk()->assertSee('Lūdzu, ievadiet derīgu e-pasta adresi.')
            ->assertSee('ievadiet vismaz 10 rakstzīmes')->assertSee('Testa Pircējs')
            ->assertSee('id="email-error"', false)->assertSee('aria-describedby="email-error"', false)
            ->assertSee('aria-invalid="true"', false);
    }

    public function test_invalid_search_has_a_linked_latvian_error_and_safe_old_value(): void
    {
        $this->get('/ipasumi?q=,,,')->assertRedirect(route('home'))->assertSessionHasErrors('q');
        $this->get(route('home'))->assertOk()->assertSee('Lūdzu, pārbaudiet lauka')
            ->assertSee('id="property-search-error"', false)
            ->assertSee('aria-describedby="property-search-error"', false)->assertSee('value=",,,"', false);
    }
}
