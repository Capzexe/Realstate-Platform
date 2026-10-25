import { chromium } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { root, withBrowserServer } from './with-browser-server.mjs';

await withBrowserServer(async baseURL => {
    const output = path.join(root, 'public/media/demo');
    mkdirSync(output, { recursive: true });
    const browser = await chromium.launch();
    const context = await browser.newContext({ viewport: { width: 1280, height: 720 }, recordVideo: { dir: path.join(root, 'artifacts/video'), size: { width: 1280, height: 720 } } });
    const page = await context.newPage();
    const video = page.video();
    const start = Date.now();
    const captions = [];
    const pause = async (text, seconds = 5) => {
        captions.push({ start: (Date.now() - start) / 1000, text });
        // Human-viewable recording pace; automated tests use assertions instead.
        await page.waitForTimeout(seconds * 1000);
    };
    try {
        await page.goto(baseURL);
        await pause('Izvēlamies vienu no izdomātajām testa adresēm.', 6);
        await page.getByRole('link', { name: 'Dzīvoklis Brīvības iela 64–12 Rīga', exact: true }).click();
        await pause('Meklēšana atrod īpašumu. Pilnie dati vēl netiek rādīti.');
        await page.getByRole('link', { name: 'Apskatīt īpašumu', exact: true }).click();
        await pause('Tehniskie dati, cenas un vēsture ir slēgti līdz pirkumam.', 6);
        await page.getByRole('button', { name: 'Iegādāties atskaiti', exact: true }).click();
        await pause('Vietējie testa norēķini: fiksēti piemēra dati. Faktiskais maksājums 0 eiro.', 8);
        await page.getByRole('button', { name: 'Izmēģināt noraidītu maksājumu', exact: true }).click();
        await pause('Vispirms noraidījums. Apstrādes soļi ir vietēja simulācija.', 6);
        await page.getByRole('alert').waitFor();
        await pause('Noraidījums neatver atskaiti. Var mēģināt vēlreiz.');
        await page.getByRole('button', { name: 'Apmaksāt testa režīmā 9,99 €', exact: true }).click();
        await pause('Veiksmīgs testa scenārijs. Rezultātu apstiprina serveris.', 6);
        await page.waitForURL('**/atskaite');
        await pause('Atveras tikai šī īpašuma atskaite uz 24 stundām.', 6);
        await page.screenshot({ path: path.join(output, 'poster.png') });
        await page.getByRole('heading', { name: 'Cenu dinamika', exact: true }).scrollIntoViewIfNeeded();
        await pause('Redzami ilustratīvie tehniskie dati un cenu dinamika.', 6);
        await page.getByRole('heading', { name: 'Pilna darījumu vēsture', exact: true }).scrollIntoViewIfNeeded();
        await pause('Pilnā darījumu vēsture pieejama pēc veiksmīga maksājuma.');
        await page.getByRole('button', { name: 'Saglabāt kā PDF' }).scrollIntoViewIfNeeded();
        await pause('PDF saglabā ar pārlūka drukāšanas funkciju. Visi video dati ir izdomāti.', 6);
    } finally {
        const end = (Date.now() - start) / 1000;
        const stamp = value => new Date(Math.round(value * 1000)).toISOString().slice(11, 23);
        writeFileSync(path.join(output, 'purchase-walkthrough.lv.vtt'), 'WEBVTT\n\n' + captions.map((cue, index) => `${stamp(cue.start)} --> ${stamp(captions[index + 1]?.start ?? end)}\n${cue.text}\n`).join('\n'));
        await context.close();
        await video.saveAs(path.join(output, 'purchase-walkthrough.webm'));
        await browser.close();
    }
    console.log('Recorded: public/media/demo/purchase-walkthrough.webm');
});
