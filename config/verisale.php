<?php

return [
    // These arrays are display copy, not subscription or billing rules.
    'plans' => [
        ['name' => 'Parastais pircējs', 'price' => '9,99', 'period' => 'par atskaiti', 'description' => 'Vienam īpašumam. Vienam pārdomātam lēmumam.', 'features' => ['Konkrēta īpašuma tehniskie dati', 'Darījumu vēsture ar reģistrētajām cenām', 'Cenu vēstures grafiks', 'Drukājams PDF pārskats']],
        ['name' => 'Profesionālis', 'price' => '49,99', 'period' => 'mēnesī · piedāvājums pēc saziņas', 'description' => 'Mākleriem, vērtētājiem un investoriem ikdienas darbam.', 'features' => ['Pārrunājiet regulāras piekļuves vajadzības', 'Vienojieties par nepieciešamo datu apjomu', 'Risinājums profesionālam darbam', 'Aktivizēšana pēc individuālas vienošanās']],
        ['name' => 'Aģentūrām', 'price' => '149', 'period' => 'mēnesī, sākot no · pēc saziņas', 'description' => 'Pārrunāsim nekustamo īpašumu komandas vajadzības.', 'features' => ['Komandas datu vajadzību izvērtēšana', 'Individuāls sadarbības piedāvājums', 'Vienošanās par piekļuvi un apjomu', 'Sazinieties pirms pasūtīšanas']],
    ],
    'faqs' => [
        ['Kā darbojas vienreizējā maksa?', 'Viena īsta īpašuma atskaite maksā 9,99 €. Pēc apstiprināta maksājuma piekļuve šajā pārlūkā ir pieejama 24 stundas. Demonstrācijas atskaites ir bez maksas.'],
        ['Kādus datus iegūstu?', 'Pieejamos īpašuma datus, darījumu datumus, reģistrētās summas eiro un cenu vēstures grafiku. Atskaiti var saglabāt kā PDF ar pārlūka drukāšanas funkciju.'],
        ['Vai piemēros redzami īsti darījumi?', 'Nē. Demonstrācijas īpašumi un to darījumi ir ilustratīvi. Īstas atskaites saturs ir atkarīgs no datubāzē importētajiem ierakstiem.'],
        ['Vai varu iegādāties vairākas atskaites?', 'Jā. Katra īpašuma atskaite tiek iegādāta atsevišķi. Saglabājiet atskaiti kā PDF un turpiniet izmantot to pašu pārlūku, lai saglabātu piekļuvi.'],
    ],
    'features' => [
        ['Reģistrētās cenas', 'Darījumu summas eiro — skaidrs atskaites punkts īpašuma cenu vēsturei.'],
        ['Darījumu vēsture', 'Iepriekšējie darījumi un to datumi pārskatāmā hronoloģijā.'],
        ['Kadastra informācija', 'Īpašuma kadastra numurs vienā pārskatā.'],
        ['Ēkas tehniskie dati', 'Celšanas gads, sienu materiāls un stāvu skaits.'],
        ['Īpašuma platība', 'Platība, istabas un citi pieejamie parametri.'],
        ['Zemes informācija', 'Ar īpašumu saistītā zemes platība.'],
        ['Cenu dinamika', 'Darījumu summas grafikā, lai saskatītu izmaiņas.'],
        ['PDF pārskats', 'Saglabājiet atskaiti ar pārlūka drukāšanas funkciju.'],
    ],
];
