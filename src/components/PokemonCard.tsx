import { Link } from 'react-router-dom'
import type { Pokemon } from '../types'
import { capitalize, formatId } from '../utils/format'
import { TypeBadge } from './TypeBadge'
import styles from './PokemonCard.module.css'

interface PokemonCardProps {
  pokemon: Pokemon
  /** Ids of the currently displayed collection, so the detail view can step through it. */
  ids: number[]
}

export function PokemonCard({ pokemon, ids }: PokemonCardProps) {
  return (
    <Link to={`/pokemon/${pokemon.id}`} state={{ ids }} className={styles.card}>
      <span className={styles.id}>{formatId(pokemon.id)}</span>
      <img className={styles.image} src={pokemon.image} alt={capitalize(pokemon.name)} loading="lazy" />
      <span className={styles.name}>{capitalize(pokemon.name)}</span>
      <span className={styles.types}>
        {pokemon.types.map((t) => (
          <TypeBadge key={t} type={t} />
        ))}
      </span>
    </Link>
  )
}
