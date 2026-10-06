import { useMemo, useState } from 'react'
import { PokemonCard } from '../components/PokemonCard'
import { Status } from '../components/Status'
import { usePokemon } from '../context/usePokemon'
import { capitalize } from '../utils/format'
import styles from './GalleryView.module.css'

type MatchMode = 'any' | 'all'

export function GalleryView() {
  const { pokemon, loading, error, reload } = usePokemon()
  const [selected, setSelected] = useState<string[]>([])
  const [mode, setMode] = useState<MatchMode>('any')

  const allTypes = useMemo(() => [...new Set(pokemon.flatMap((p) => p.types))].sort(), [pokemon])

  const results = useMemo(() => {
    if (selected.length === 0) return pokemon
    return pokemon.filter((p) =>
      mode === 'any' ? selected.some((t) => p.types.includes(t)) : selected.every((t) => p.types.includes(t)),
    )
  }, [pokemon, selected, mode])

  const ids = useMemo(() => results.map((p) => p.id), [results])

  function toggleType(type: string) {
    setSelected((prev) => (prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]))
  }

  return (
    <section>
      <h1 className={styles.title}>Pokémon Gallery</h1>

      <div className={styles.filters}>
        <div className={styles.filterHead}>
          <span className={styles.label}>Filter by type</span>
          <div className={styles.modeGroup} role="group" aria-label="Match mode">
            <button
              type="button"
              className={mode === 'any' ? `${styles.modeBtn} ${styles.on}` : styles.modeBtn}
              aria-pressed={mode === 'any'}
              onClick={() => setMode('any')}
            >
              Any selected
            </button>
            <button
              type="button"
              className={mode === 'all' ? `${styles.modeBtn} ${styles.on}` : styles.modeBtn}
              aria-pressed={mode === 'all'}
              onClick={() => setMode('all')}
            >
              All selected
            </button>
          </div>
          <button type="button" className={styles.clear} onClick={() => setSelected([])} disabled={selected.length === 0}>
            Clear
          </button>
        </div>
        <div className={styles.chips}>
          {allTypes.map((type) => {
            const active = selected.includes(type)
            return (
              <button
                key={type}
                type="button"
                className={active ? `${styles.chip} ${styles.chipActive}` : styles.chip}
                aria-pressed={active}
                onClick={() => toggleType(type)}
              >
                {capitalize(type)}
              </button>
            )
          })}
        </div>
      </div>

      <Status loading={loading} error={error} onRetry={reload} />

      {!loading && !error && (
        <>
          <p className={styles.count}>
            {results.length} of {pokemon.length} Pokémon
          </p>
          {results.length === 0 ? (
            <p className={styles.empty}>No Pokémon have all of the selected types.</p>
          ) : (
            <div className={styles.grid}>
              {results.map((p) => (
                <PokemonCard key={p.id} pokemon={p} ids={ids} />
              ))}
            </div>
          )}
        </>
      )}
    </section>
  )
}
