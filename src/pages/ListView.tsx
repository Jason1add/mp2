import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Status } from '../components/Status'
import { TypeBadge } from '../components/TypeBadge'
import { usePokemon } from '../context/usePokemon'
import type { SortKey, SortOrder } from '../types'
import { capitalize, formatHeight, formatId, formatWeight } from '../utils/format'
import styles from './ListView.module.css'

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: 'id', label: 'Number' },
  { key: 'name', label: 'Name' },
  { key: 'height', label: 'Height' },
  { key: 'weight', label: 'Weight' },
  { key: 'baseExperience', label: 'Base experience' },
]

export function ListView() {
  const { pokemon, loading, error, reload } = usePokemon()
  const [query, setQuery] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('id')
  const [order, setOrder] = useState<SortOrder>('asc')

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    const filtered = q
      ? pokemon.filter((p) => p.name.includes(q) || String(p.id) === q.replace('#', ''))
      : pokemon
    const direction = order === 'asc' ? 1 : -1
    return [...filtered].sort((a, b) => {
      const av = a[sortKey]
      const bv = b[sortKey]
      const cmp = typeof av === 'string' && typeof bv === 'string' ? av.localeCompare(bv) : Number(av) - Number(bv)
      return cmp * direction || a.id - b.id
    })
  }, [pokemon, query, sortKey, order])

  const ids = useMemo(() => results.map((p) => p.id), [results])

  return (
    <section>
      <h1 className={styles.title}>Pokémon List</h1>

      <div className={styles.controls}>
        <label className={styles.field}>
          <span>Search</span>
          <input
            type="search"
            className={styles.input}
            placeholder="Search by name or number…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        <label className={styles.field}>
          <span>Sort by</span>
          <select className={styles.input} value={sortKey} onChange={(e) => setSortKey(e.target.value as SortKey)}>
            {SORT_OPTIONS.map((o) => (
              <option key={o.key} value={o.key}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
        <div className={styles.field} role="group" aria-label="Sort order">
          <span>Order</span>
          <div className={styles.toggle}>
            <button
              type="button"
              className={order === 'asc' ? `${styles.toggleBtn} ${styles.on}` : styles.toggleBtn}
              aria-pressed={order === 'asc'}
              onClick={() => setOrder('asc')}
            >
              Ascending ↑
            </button>
            <button
              type="button"
              className={order === 'desc' ? `${styles.toggleBtn} ${styles.on}` : styles.toggleBtn}
              aria-pressed={order === 'desc'}
              onClick={() => setOrder('desc')}
            >
              Descending ↓
            </button>
          </div>
        </div>
      </div>

      <Status loading={loading} error={error} onRetry={reload} />

      {!loading && !error && (
        <>
          <p className={styles.count}>
            {results.length} of {pokemon.length} Pokémon
          </p>
          {results.length === 0 ? (
            <p className={styles.empty}>No Pokémon match “{query}”.</p>
          ) : (
            <ul className={styles.list}>
              {results.map((p) => (
                <li key={p.id}>
                  <Link to={`/pokemon/${p.id}`} state={{ ids }} className={styles.row}>
                    <img className={styles.sprite} src={p.sprite} alt="" loading="lazy" />
                    <span className={styles.id}>{formatId(p.id)}</span>
                    <span className={styles.name}>{capitalize(p.name)}</span>
                    <span className={styles.types}>
                      {p.types.map((t) => (
                        <TypeBadge key={t} type={t} />
                      ))}
                    </span>
                    <span className={styles.stat}>{formatHeight(p.height)}</span>
                    <span className={styles.stat}>{formatWeight(p.weight)}</span>
                    <span className={styles.stat}>{p.baseExperience} XP</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </section>
  )
}
