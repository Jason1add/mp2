import axios from 'axios'
import type { Pokemon } from '../types'

const client = axios.create({
  baseURL: 'https://pokeapi.co/api/v2',
  timeout: 15000,
})

const POKEMON_COUNT = 151
const CACHE_KEY = 'pokedex-cache-v1'

interface PokemonListResponse {
  results: { name: string; url: string }[]
}

interface PokemonDetailResponse {
  id: number
  name: string
  height: number
  weight: number
  base_experience: number | null
  types: { slot: number; type: { name: string } }[]
  abilities: { ability: { name: string } }[]
  stats: { base_stat: number; stat: { name: string } }[]
  sprites: {
    front_default: string | null
    other?: { 'official-artwork'?: { front_default: string | null } }
  }
}

function toPokemon(data: PokemonDetailResponse): Pokemon {
  const sprite = data.sprites.front_default ?? ''
  return {
    id: data.id,
    name: data.name,
    height: data.height,
    weight: data.weight,
    baseExperience: data.base_experience ?? 0,
    types: [...data.types].sort((a, b) => a.slot - b.slot).map((t) => t.type.name),
    abilities: data.abilities.map((a) => a.ability.name),
    stats: data.stats.map((s) => ({ name: s.stat.name, value: s.base_stat })),
    image: data.sprites.other?.['official-artwork']?.front_default ?? sprite,
    sprite,
  }
}

function readCache(): Pokemon[] | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const parsed: unknown = JSON.parse(raw)
    return Array.isArray(parsed) && parsed.length === POKEMON_COUNT ? (parsed as Pokemon[]) : null
  } catch {
    return null
  }
}

function writeCache(pokemon: Pokemon[]): void {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(pokemon))
  } catch {
    // Storage may be full or unavailable; caching is only an optimisation.
  }
}

/** Fetches the first generation of Pokémon (list + details). Results are cached in localStorage. */
export async function fetchAllPokemon(): Promise<Pokemon[]> {
  const cached = readCache()
  if (cached) return cached

  const list = await client.get<PokemonListResponse>('/pokemon', { params: { limit: POKEMON_COUNT } })
  const details = await Promise.all(
    list.data.results.map((entry) => client.get<PokemonDetailResponse>(entry.url)),
  )
  const pokemon = details.map((res) => toPokemon(res.data)).sort((a, b) => a.id - b.id)
  writeCache(pokemon)
  return pokemon
}
