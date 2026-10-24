<div class="table-scroll" role="region" aria-label="Darījumu vēsture" tabindex="0">
    <table>
        <caption class="sr-only">{{ $property->is_demo ? 'Ilustratīvi' : 'Reģistrēti' }} īpašuma darījumi</caption>
        <thead>
            <tr>
                <th scope="col">Darījuma datums</th>
                <th scope="col">Veids</th>
                <th scope="col" class="number">Summa</th>
            </tr>
        </thead>
        <tbody>
            @forelse($property->transactions as $transaction)
                <tr>
                    <td>{{ $transaction->transaction_date->format('d.m.Y.') }}</td>
                    <td>{{ $transaction->kind }}</td>
                    <td class="number"><x-money :value="$transaction->price_eur" /></td>
            </tr>@empty<tr>
                    <td colspan="3">Darījumu ieraksti nav pieejami.</td>
                </tr>
            @endforelse
        </tbody>
    </table>
</div>
