import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { fetchAllPokemon } from '../api/pokemon'
import type { Pokemon } from '../types'
import { PokemonContext } from './PokemonContext'

export function PokemonProvider({ children }: { children: ReactNode }) {
  const [pokemon, setPokemon] = useState<Pokemon[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    fetchAllPokemon()
      .then((data) => {
        if (!cancelled) setPokemon(data)
      })
      .catch(() => {
        if (!cancelled) setError('Could not load Pokémon from PokéAPI. Check your connection and try again.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [attempt])

  const reload = useCallback(() => setAttempt((n) => n + 1), [])
  const value = useMemo(() => ({ pokemon, loading, error, reload }), [pokemon, loading, error, reload])

  return <PokemonContext.Provider value={value}>{children}</PokemonContext.Provider>
}
