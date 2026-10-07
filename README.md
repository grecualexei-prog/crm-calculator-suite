# CRM Performance Calculator

Un calculator CRM performant pentru managementul vânzărilor, funcțiile ierarhice și KPI-urile cheie.

## Ce include

- calcul pipeline și forecast
- calcul comision și target per agent
- conversie, lead score, ROI
- profit net, marjă și cash flow
- LTV/CAC, retention și churn
- adaptare în funcție de rolul ales (Director, Manager, Agent, Back-office, Financiar etc.)
- structură modulară, gata pentru extindere

## Cum rulează

Deschide `index.html` în browser.

## Structură proiect

- `index.html` — interfața principală
- `style.css` — stiluri
- `app.js` — logica calculatorului și KPI-urilor

## Exemple de funcții CRM calculate

- `Pipeline = valoare oportunități × probabilitate`
- `Comision = pipeline × comision %`
- `Target per agent = target lunar / număr vânzători`
- `Conversie = clienți noi / (clienți noi + clienți existenți)`
- `ROI = (profit brut - costuri) / costuri * 100`
- `LTV / CAC = LTV / CAC`
- `Retention = % păstrare clienți`
- `Churn = % pierdere clienți`

## Extensii recomandate

- export CSV / PDF
- autentificare cu roluri și permisiuni
- dashboard cu grafice
- input din date DB / API
- workflow pentru lead-uri, oferte, comenzi, facturi
