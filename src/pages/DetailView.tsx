import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { Status } from '../components/Status'
import { TypeBadge } from '../components/TypeBadge'
import { usePokemon } from '../context/usePokemon'
import type { DetailLocationState } from '../types'
import { capitalize, formatHeight, formatId, formatWeight } from '../utils/format'
import styles from './DetailView.module.css'

const MAX_STAT = 255

export function DetailView() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { pokemon, loading, error, reload } = usePokemon()

  const state = location.state as DetailLocationState | null
  const currentId = Number(id)
  const current = pokemon.find((p) => p.id === currentId)

  if (loading || error) {
    return <Status loading={loading} error={error} onRetry={reload} />
  }

  if (!current) {
    return (
      <div className={styles.notFound}>
        <h1>Pokémon not found</h1>
        <p>There is no Pokémon with the number “{id}”.</p>
        <Link to="/list">Back to the list</Link>
      </div>
    )
  }

  // Step through the collection the user came from; fall back to every Pokémon (direct URL visits).
  const knownIds = new Set(pokemon.map((p) => p.id))
  const fromState = state?.ids?.filter((i) => knownIds.has(i)) ?? []
  const sequence = fromState.includes(currentId) ? fromState : pokemon.map((p) => p.id)
  const index = sequence.indexOf(currentId)
  const prevId = sequence[(index - 1 + sequence.length) % sequence.length]
  const nextId = sequence[(index + 1) % sequence.length]
  const prev = pokemon.find((p) => p.id === prevId)
  const next = pokemon.find((p) => p.id === nextId)

  function go(targetId: number) {
    navigate(`/pokemon/${targetId}`, { state: { ids: sequence } })
  }

  return (
    <article className={styles.detail}>
      <div className={styles.pager}>
        <button type="button" className={styles.navBtn} onClick={() => go(prevId)} aria-label="Previous Pokémon">
          ← {prev ? capitalize(prev.name) : 'Previous'}
        </button>
        <span className={styles.position}>
          {index + 1} / {sequence.length}
        </span>
        <button type="button" className={styles.navBtn} onClick={() => go(nextId)} aria-label="Next Pokémon">
          {next ? capitalize(next.name) : 'Next'} →
        </button>
      </div>

      <div className={styles.card}>
        <div className={styles.hero}>
          <span className={styles.id}>{formatId(current.id)}</span>
          <img className={styles.image} src={current.image} alt={capitalize(current.name)} />
        </div>

        <div className={styles.info}>
          <h1 className={styles.name}>{capitalize(current.name)}</h1>
          <div className={styles.types}>
            {current.types.map((t) => (
              <TypeBadge key={t} type={t} />
            ))}
          </div>

          <dl className={styles.facts}>
            <div>
              <dt>Height</dt>
              <dd>{formatHeight(current.height)}</dd>
            </div>
            <div>
              <dt>Weight</dt>
              <dd>{formatWeight(current.weight)}</dd>
            </div>
            <div>
              <dt>Base experience</dt>
              <dd>{current.baseExperience}</dd>
            </div>
            <div>
              <dt>Abilities</dt>
              <dd>{current.abilities.map(capitalize).join(', ')}</dd>
            </div>
          </dl>

          <h2 className={styles.heading}>Base stats</h2>
          <ul className={styles.stats}>
            {current.stats.map((s) => (
              <li key={s.name} className={styles.stat}>
                <span className={styles.statName}>{capitalize(s.name)}</span>
                <span className={styles.statValue}>{s.value}</span>
                <progress className={styles.bar} max={MAX_STAT} value={s.value} />
              </li>
            ))}
          </ul>
        </div>
      </div>

      <Link to="/list" className={styles.back}>
        ← Back to the list
      </Link>
    </article>
  )
}
