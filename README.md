# Berry to current — DSSC field guide

A responsive, visual science-project website built with React, TypeScript, Vite and plain CSS. The project is a student-facing guide to a berry-dye-sensitized solar cell (DSSC), with labelled technical diagrams, custom-generated illustrative lab photographs, an honest simulated dashboard, editable experiment chart, budget calculator and linked science/price sources. Generated images are visual mock-ups only; they are not evidence of a real build or measured output.

## Run locally

```bash
npm install
npm run dev
```

Vite serves the site on `http://localhost:5173` (bound to `0.0.0.0` for the Arena preview). Create a production build with `npm run build`.

## Notes

- The browser dashboard is explicitly a simulation, not a live hardware feed or a performance prediction.
- The dye comparison plot starts empty and only charts readings entered by the student.
- The INR budget is an estimate. The 15-cell kit is an overseas price reference with an assumed shipping/import allowance; confirm local availability and current vendor prices before purchasing.
