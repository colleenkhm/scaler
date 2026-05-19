import { useState, useMemo } from 'react';
import { ThemeProvider, createTheme, CssBaseline, Container, Chip, Button } from '@mui/material';
import Piano from './components/Piano';
import KeySuggestions from './components/KeySuggestions';
import { suggestKeys } from './utils/musicTheory';
import styles from './App.module.css';

const MAX_NOTES = 7;

const theme = createTheme({
  palette: {
    mode: 'light',
    primary:   { main: '#8b5cf6', light: '#ede9fe', dark: '#7c3aed' },
    success:   { main: '#16a34a', light: '#f0fdf4' },
    warning:   { main: '#d97706', light: '#fffbeb' },
    error:     { main: '#e11d48', light: '#fff1f2' },
    background: { default: '#faf5ff', paper: '#ffffff' },
  },
  typography: {
    fontFamily: '"Nunito", "Roboto", sans-serif',
  },
});

export default function App() {
  const [selectedNotes, setSelectedNotes] = useState(new Set());

  const handleNoteClick = (note) => {
    setSelectedNotes(prev => {
      const next = new Set(prev);
      if (next.has(note)) {
        next.delete(note);
      } else if (next.size < MAX_NOTES) {
        next.add(note);
      }
      return next;
    });
  };

  const handleClear = () => setSelectedNotes(new Set());

  const selectedArray = useMemo(() => Array.from(selectedNotes), [selectedNotes]);
  const suggestions   = useMemo(() => suggestKeys(selectedArray), [selectedArray]);
  const atLimit       = selectedNotes.size >= MAX_NOTES;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className={styles.root} style={{ backgroundColor: '#faf5ff' }}>
        <Container maxWidth="md">

          <div className={styles.header}>
            <h1 className={styles.title}>Scaler</h1>
            <p className={styles.subtitle}>Select notes to narrow down what key a song might be in</p>
          </div>

          <Piano selectedNotes={selectedNotes} onNoteClick={handleNoteClick} />

          <div className={styles.notesPanel}>
            <div className={styles.notesPanelHeader}>
              <span className={styles.notesPanelLabel}>
                Selected notes ({selectedNotes.size}/{MAX_NOTES})
                {atLimit && <span className={styles.atLimit}>— limit reached</span>}
              </span>
              {selectedNotes.size > 0 && (
                <Button size="small" onClick={handleClear} color="inherit"
                  sx={{ color: 'rgba(0,0,0,0.5)', fontSize: '0.75rem' }}>
                  Clear all
                </Button>
              )}
            </div>

            <div className={styles.chips}>
              {selectedArray.length === 0
                ? <span className={styles.emptyChips}>No notes selected</span>
                : selectedArray.map(note => (
                    <Chip key={note} label={note} onDelete={() => handleNoteClick(note)}
                      color="primary" variant="filled" sx={{ fontWeight: 600 }} />
                  ))
              }
            </div>
          </div>

          <div className={styles.suggestions}>
            <KeySuggestions suggestions={suggestions} selectedCount={selectedNotes.size} />
          </div>

        </Container>
      </div>
    </ThemeProvider>
  );
}
