# Scaler

A browser-based tool for identifying what musical key a song might be in. Click up to 7 notes on the piano keyboard and Scaler will suggest the most likely keys, ranked by how well your notes fit each scale.

**[Live demo](https://colleenkhm.github.io/scaler/)**

---

## How it works

Select notes by clicking the piano keys or using your keyboard. Scaler checks your selection against all 84 possible keys (12 roots × 7 modes) and scores each one by the percentage of your selected notes that belong to it. Results are ranked from best to worst match.

### Modes checked

| Mode | Character |
|------|-----------|
| Major (Ionian) | Bright, resolved |
| Natural Minor (Aeolian) | Dark, melancholic |
| Dorian | Minor with a raised 6th — jazzy, soulful |
| Phrygian | Minor with a flat 2nd — tense, flamenco |
| Lydian | Major with a raised 4th — dreamy, floating |
| Mixolydian | Major with a flat 7th — bluesy, rock |
| Locrian | Diminished feel — rare, unstable |

### Tips for best results

- **3–4 notes** is usually enough to narrow it down significantly
- If multiple keys show 100%, keep adding notes to distinguish between them
- Notes that appear in the "Outside this key" line are chromatic — they might be passing tones, borrowed chords, or a sign you're in a different key

---

## Keyboard shortcuts

White keys and black keys are mapped to your keyboard in the standard virtual piano layout:

```
Keyboard:  A  W  S  E  D  F  T  G  Y  H  U  J
Note:      C  C# D  D# E  F  F# G  G# A  A# B
```

Press the same key again to deselect a note.

---

## Getting started

```bash
npm install
npm start
```

Then open [http://localhost:3000](http://localhost:3000).

### Other commands

```bash
npm run build    # production build
npm run deploy   # deploy to GitHub Pages
npm test         # run tests
```

---

## Stack

- [React 19](https://react.dev/)
- [MUI v9](https://mui.com/) — Grid, LinearProgress, Chip, Button
- [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API) — synthesized piano sound, no audio files required
- CSS Modules for component styles
- Deployed via GitHub Pages
