import { useEffect, useRef } from 'react';
import { playNote } from '../utils/synth';
import styles from './Piano.css';

const WHITE_W = 90;
const WHITE_H = 260;
const BLACK_W = 56;
const BLACK_H = 162;
const OCTAVE = 3;

const KEY_MAP = {
  a: 'C', w: 'C#', s: 'D', e: 'D#', d: 'E',
  f: 'F', t: 'F#', g: 'G', y: 'G#', h: 'A', u: 'A#', j: 'B',
};

const NOTE_KEY = Object.fromEntries(
  Object.entries(KEY_MAP).map(([k, v]) => [v, k.toUpperCase()])
);

const OCTAVE_PATTERN = [
  { note: 'C',  type: 'white', whiteIndex: 0 },
  { note: 'C#', type: 'black', afterWhite: 0 },
  { note: 'D',  type: 'white', whiteIndex: 1 },
  { note: 'D#', type: 'black', afterWhite: 1 },
  { note: 'E',  type: 'white', whiteIndex: 2 },
  { note: 'F',  type: 'white', whiteIndex: 3 },
  { note: 'F#', type: 'black', afterWhite: 3 },
  { note: 'G',  type: 'white', whiteIndex: 4 },
  { note: 'G#', type: 'black', afterWhite: 4 },
  { note: 'A',  type: 'white', whiteIndex: 5 },
  { note: 'A#', type: 'black', afterWhite: 5 },
  { note: 'B',  type: 'white', whiteIndex: 6 },
];

function buildKeys(numOctaves = 1, startOctave = OCTAVE) {
  const white = [];
  const black = [];
  for (let oct = 0; oct < numOctaves; oct++) {
    const offset = oct * 7 * WHITE_W;
    OCTAVE_PATTERN.forEach(({ note, type, whiteIndex, afterWhite }) => {
      const key = { note, type, octave: startOctave + oct };
      if (type === 'white') {
        key.left = offset + whiteIndex * WHITE_W;
        white.push(key);
      } else {
        key.left = offset + (afterWhite + 1) * WHITE_W - BLACK_W / 2;
        black.push(key);
      }
    });
  }
  return { white, black };
}

const { white: WHITE_KEYS, black: BLACK_KEYS } = buildKeys(1);
const TOTAL_WIDTH = 7 * WHITE_W;

export default function Piano({ selectedNotes, onNoteClick }) {
  const pressedKeys = useRef(new Set());

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.repeat || e.metaKey || e.ctrlKey || e.altKey) return;
      const tag = document.activeElement?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      const note = KEY_MAP[e.key.toLowerCase()];
      if (!note || pressedKeys.current.has(e.key)) return;
      pressedKeys.current.add(e.key);
      playNote(note, OCTAVE);
      onNoteClick(note);
    };
    const handleKeyUp = (e) => pressedKeys.current.delete(e.key);

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [onNoteClick]);

  const handleClick = (note) => {
    playNote(note, OCTAVE);
    onNoteClick(note);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.piano} style={{ width: TOTAL_WIDTH, height: WHITE_H }}>

        {WHITE_KEYS.map(key => {
          const selected = selectedNotes.has(key.note);
          const keyClass = `${styles.whiteKey} ${selected ? styles.selected : ''}`;
          const labelClass = `${styles.whiteKeyLabel} ${selected ? styles.selected : ''}`;
          return (
            <div
              key={`${key.note}${key.octave}`}
              className={keyClass}
              style={{ left: key.left, width: WHITE_W - 2, height: WHITE_H }}
              onClick={() => handleClick(key.note)}
            >
              <span className={styles.whiteKeyHint}>{NOTE_KEY[key.note]}</span>
              <span className={labelClass}>{key.note}</span>
            </div>
          );
        })}

        {BLACK_KEYS.map(key => {
          const selected = selectedNotes.has(key.note);
          const keyClass = `${styles.blackKey} ${selected ? styles.selected : ''}`;
          const labelClass = `${styles.blackKeyLabel} ${selected ? styles.selected : ''}`;
          return (
            <div
              key={`${key.note}${key.octave}`}
              className={keyClass}
              style={{ left: key.left, width: BLACK_W, height: BLACK_H }}
              onClick={() => handleClick(key.note)}
            >
              <span className={styles.blackKeyHint}>{NOTE_KEY[key.note]}</span>
              <span className={labelClass}>{key.note}</span>
            </div>
          );
        })}

      </div>
    </div>
  );
}
