import styles from './Status.module.css'

interface StatusProps {
  loading: boolean
  error: string | null
  onRetry: () => void
}

/** Renders a loading or error message; returns null when there is nothing to report. */
export function Status({ loading, error, onRetry }: StatusProps) {
  if (loading) {
    return (
      <div className={styles.status} role="status">
        <div className={styles.spinner} aria-hidden="true" />
        <p>Catching Pokémon…</p>
      </div>
    )
  }
  if (error) {
    return (
      <div className={styles.status} role="alert">
        <p>{error}</p>
        <button type="button" className={styles.retry} onClick={onRetry}>
          Try again
        </button>
      </div>
    )
  }
  return null
}
