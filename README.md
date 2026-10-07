# SWE 3409 Mobile Application Development · CAT 1 (practical) · Group NN

**INES-Ruhengeri · Department of Computer Science · Lecturer: Clement Munyentwari · 7 October 2026**

## The scenario: Milk Check, the collector's phone app

At the Kinigi milk collection centre the collector records every can on a phone:
farmer code, litres, temperature on arrival and hours since milking. The app
refuses bad input, asks your group's Python API (`swe3513-cat1-gNN`, Member 4)
for the **rejection risk**, sends the delivery to the server, and lists today's
deliveries with totals. When the network is down, the app keeps working and says
so: the delivery stays on the phone.

> All data is synthetic, made up for this CAT.

## Who does what

Every member owns **one AI task and one mobile task**. Agree on member numbers in
the first 5 minutes and write them in your team file.

| Member | AI task (swe3513-cat1) | Mobile task (swe3409-cat1) |
| --- | --- | --- |
| 1 | A1 `data.py`: load and clean the deliveries | M3 `DeliveryList.tsx`: list and totals |
| 2 | A2 `stats.py`: summary by sector, litres by day | M4 `api.ts` + `App.tsx` + `config.ts`: mobile integrator |
| 3 | A3 `model.py`: rejection risk by gradient descent | M2 `DeliveryForm.tsx`: the form |
| 4 | A4 `api.py`: FastAPI service, AI integrator | M1 `logic.ts`: rules, labels, totals |
| 5 | A5 `evaluate.py`: precision, recall, model card | M5 `health.ts` + `StatusBanner.tsx` |

**Group of 4:** there is no Member 5. A5 and M5 stay untouched and nobody is marked on them.

The header comment of each file says which member owns it and what "done" means.

## Tasks in this repository

| Task | Member | File | How it is checked |
| --- | --- | --- | --- |
| M1 | 4 | `src/logic.ts` | `npm run test:logic` (6 tests) |
| M2 | 3 | `src/components/DeliveryForm.tsx` | placeholder gone + typecheck + on the phone |
| M3 | 1 | `src/components/DeliveryList.tsx` | placeholder gone + typecheck + on the phone |
| M4 | 2 | `src/api.ts`, `App.tsx`, `src/config.ts` | `npm run test:api` (6) + App wired + `docs/screenshot.png` |
| M5 | 5 | `src/health.ts`, `src/components/StatusBanner.tsx` | `npm run test:health` (3) + banner on the phone |

**When you start your task, delete its `TODO Mn` lines.** For M1, M4 and M5 this switches
their tests on. For the screens, the marking script checks that the placeholder is gone.

M1, M2, M3 and M5 can all start at once: the types they need are already in `src/logic.ts`.
M4 writes `api.ts` first, then wires `App.tsx` after the others merge.

## Start (once)

```bash
git clone git@github.com:ines-swe-2026/swe3409-cat1-gNN.git
cd swe3409-cat1-gNN
npm install
npm run check               # typecheck + tests: 15 skipped, correct
npx expo start              # scan the QR code with Expo Go
```

## Work cycle

```bash
git switch main && git pull
git switch -c m3-list-aline
# edit, save, look at the phone, then:
npm run typecheck
git add src/components/DeliveryList.tsx
git commit -m "M3: list deliveries with risk and sent status"
git push -u origin m3-list-aline
```

On GitHub: **Compare & pull request** → template → a teammate as **Reviewer** → after approval, **Merge**.

## Connect to the group's Python API

1. Member 4 (AI repo): `uvicorn milkcheck.api:app --host 0.0.0.0 --app-dir src`
2. Laptop IP (Windows `ipconfig`, Linux `hostname -I`, macOS `ipconfig getifaddr en0`) into `src/config.ts`.
3. Phone and laptop on the same Wi-Fi, or both on one phone's hotspot. Test `http://<IP>:8000/health` in the phone's browser first.

## How this repository is marked (SWE 3409, out of 100 per student)

| Part | Marks | Where it is read |
| --- | --- | --- |
| Your task works on `main` (tests, or placeholder gone + typecheck + required parts) | 40 | marking script |
| Your own commits (2 or more) with clear messages | 10 | commit history |
| Your pull request merged | 10 | Pull requests tab |
| You reviewed a teammate's pull request | 5 | reviews |
| `team/<username>.md` filled in | 5 | team folder |
| Group phone demo: the mobile part | 20 | live, on the phone |
| You explain or change a line of your own file | 10 | live, at the demo |
