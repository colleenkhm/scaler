import { Grid, LinearProgress } from '@mui/material';
import styles from './KeySuggestions.module.css';

function scoreTier(score) {
  if (score === 1)   return 'perfect';
  if (score >= 0.75) return 'high';
  if (score >= 0.5)  return 'medium';
  return null;
}

function scoreColor(pct) {
  if (pct === 100) return 'success';
  if (pct >= 75)   return 'primary';
  if (pct >= 50)   return 'warning';
  return 'error';
}

function SuggestionCard({ suggestion, rank }) {
  const pct = Math.round(suggestion.score * 100);
  const tier = scoreTier(suggestion.score);

  return (
    <div className={styles.card} data-tier={tier}>
      <div className={styles.cardHeader}>
        {rank <= 3 && (
          <span className={styles.rankBadge} data-rank={rank}>#{rank}</span>
        )}
        <span className={styles.cardTitle}>{suggestion.key}</span>
      </div>

      <div className={styles.scoreBar}>
        <LinearProgress
          variant="determinate"
          value={pct}
          color={scoreColor(pct)}
          sx={{ flexGrow: 1, height: 8, borderRadius: 4 }}
        />
        <span className={styles.scoreLabel}>{pct}%</span>
      </div>

      <span className={styles.cardMeta}>
        {suggestion.matches} of {suggestion.total} note{suggestion.total !== 1 ? 's' : ''} match
      </span>

      <span className={styles.scaleNotes}>
        {suggestion.scaleNotes.join(' – ')}
      </span>

      {suggestion.missingNotes.length > 0 && (
        <span className={styles.missingNotes}>
          Outside this key: {suggestion.missingNotes.join(', ')}
        </span>
      )}
    </div>
  );
}

export default function KeySuggestions({ suggestions, selectedCount, selectedRoot }) {
  if (selectedCount === 0) {
    return (
      <div className={styles.emptyState}>
        <span className={styles.emptyIcon}>♪</span>
        <span className={styles.emptyTitle}>Discover possible scales</span>
        <span className={styles.emptySubtitle}>Select up to 7 notes</span>
      </div>
    );
  }

  const topScore = suggestions[0]?.score ?? 0;
  const visible = suggestions.filter(s => s.score >= 0.5).slice(0, 12);
  const shown = visible.length >= 4 ? visible : suggestions.slice(0, 4);

  return (
    <div>
      <div className={styles.header}>
        <span className={styles.title}>Key Suggestions</span>
        {selectedCount < 3 && (
          <span className={styles.headerHint}>(add more notes for better results)</span>
        )}
      </div>

      {selectedRoot && (
        <p className={styles.rootHint}>
          Showing only scales starting on <strong>{selectedRoot}</strong>
        </p>
      )}

      {topScore === 1 && (
        <p className={styles.perfectHint}>
          All selected notes fit perfectly in the {selectedRoot ? 'scale' : 'keys'} marked 100%
        </p>
      )}

      <Grid container spacing={2}>
        {shown.map((s, i) => (
          <Grid key={s.id} size={{ xs: 12, sm: 6, md: 4 }}>
            <SuggestionCard suggestion={s} rank={i + 1} />
          </Grid>
        ))}
      </Grid>

      {suggestions.filter(s => s.score >= 0.5).length > 12 && (
        <p className={styles.overflowHint}>
          Many keys match — try adding more specific notes to narrow it down
        </p>
      )}
    </div>
  );
}
