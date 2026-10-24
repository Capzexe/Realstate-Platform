<?php

return [
    // There are no accounts or login routes. Purchase access belongs to a browser session.
    // A Laravel request guard returns null, allowing explicit guest-aware policies.
    'defaults' => ['guard' => 'web', 'passwords' => null],
    'guards' => ['web' => ['driver' => 'anonymous']],
    'providers' => [],
    'passwords' => [],
];
