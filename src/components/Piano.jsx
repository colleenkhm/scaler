import { useEffect, useRef } from 'react';
import { Box, Typography } from '@mui/material';
import { playNote } from '../utils/synth';

const WHITE_W = 90;
const WHITE_H = 260;
const BLACK_W = 56;
const BLACK_H = 162;
const OCTAVE = 3;

// Standard virtual piano keyboard mapping
const KEY_MAP = {
  a: 'C', w: 'C#', s: 'D', e: 'D#', d: 'E',
  f: 'F', t: 'F#', g: 'G', y: 'G#', h: 'A', u: 'A#', j: 'B',
};

// Reverse: note → keyboard key label for display
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
    const octaveOffset = oct * 7 * WHITE_W;
    OCTAVE_PATTERN.forEach(({ note, type, whiteIndex, afterWhite }) => {
      const key = { note, type, octave: startOctave + oct };
      if (type === 'white') {
        key.left = octaveOffset + whiteIndex * WHITE_W;
        key.showLabel = note === 'C';
        white.push(key);
      } else {
        key.left = octaveOffset + (afterWhite + 1) * WHITE_W - BLACK_W / 2;
        black.push(key);
      }
    });
  }
  return { white, black };
}

const { white: WHITE_KEYS, black: BLACK_KEYS } = buildKeys(1);
const TOTAL_WIDTH = 7 * WHITE_W;

export default function Piano({ selectedNotes, onNoteClick, disabled }) {
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
    if (disabled) return;
    playNote(note, OCTAVE);
    onNoteClick(note);
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', my: 1 }}>
      <Box
        sx={{
          position: 'relative',
          width: TOTAL_WIDTH,
          height: WHITE_H,
          userSelect: 'none',
          filter: disabled ? 'grayscale(60%) opacity(0.6)' : 'none',
        }}
      >
        {WHITE_KEYS.map(key => {
          const selected = selectedNotes.has(key.note);
          return (
            <Box
              key={`${key.note}${key.octave}`}
              onClick={() => handleClick(key.note)}
              sx={{
                position: 'absolute',
                left: key.left,
                top: 0,
                width: WHITE_W - 2,
                height: WHITE_H,
                backgroundColor: selected ? '#ede9fe' : '#fff',
                border: '1px solid #ede8f5',
                borderRadius: '0 0 6px 6px',
                cursor: disabled ? 'default' : 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'space-between',
                pt: 1,
                pb: 0.75,
                boxShadow: selected
                  ? 'inset 0 -3px 0 #a78bfa'
                  : 'inset 0 -2px 0 #ede8f5',
                transition: 'background-color 0.1s',
                '&:hover': !disabled && {
                  backgroundColor: selected ? '#ddd6fe' : '#f5f0ff',
                },
              }}
            >
              <Typography sx={{ fontSize: '11px', color: '#c4b5fd', lineHeight: 1, fontWeight: 600 }}>
                {NOTE_KEY[key.note]}
              </Typography>
              <Typography
                sx={{
                  fontSize: '13px',
                  color: selected ? '#5b21b6' : '#9ca3af',
                  fontWeight: selected ? 700 : 400,
                  lineHeight: 1,
                }}
              >
                {key.note}
              </Typography>
            </Box>
          );
        })}

        {BLACK_KEYS.map(key => {
          const selected = selectedNotes.has(key.note);
          return (
            <Box
              key={`${key.note}${key.octave}`}
              onClick={() => handleClick(key.note)}
              sx={{
                position: 'absolute',
                left: key.left,
                top: 0,
                width: BLACK_W,
                height: BLACK_H,
                backgroundColor: selected ? '#8b5cf6' : '#1f2937',
                borderRadius: '0 0 5px 5px',
                cursor: disabled ? 'default' : 'pointer',
                zIndex: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'space-between',
                pt: 0.75,
                pb: 0.75,
                boxShadow: selected
                  ? '0 0 0 2px #c4b5fd'
                  : '1px 2px 4px rgba(0,0,0,0.2)',
                transition: 'background-color 0.1s',
                '&:hover': !disabled && {
                  backgroundColor: selected ? '#7c3aed' : '#374151',
                },
              }}
            >
              <Typography sx={{ fontSize: '9px', color: '#a78bfa', lineHeight: 1, fontWeight: 600 }}>
                {NOTE_KEY[key.note]}
              </Typography>
              <Typography
                sx={{
                  fontSize: '10px',
                  color: selected ? '#ede9fe' : '#6b7280',
                  fontWeight: selected ? 700 : 400,
                  lineHeight: 1,
                }}
              >
                {key.note}
              </Typography>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
