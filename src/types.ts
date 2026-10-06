export interface PokemonStat {
  name: string
  value: number
}

export interface Pokemon {
  id: number
  name: string
  height: number // decimetres
  weight: number // hectograms
  baseExperience: number
  types: string[]
  abilities: string[]
  stats: PokemonStat[]
  image: string
  sprite: string
}

export type SortKey = 'id' | 'name' | 'height' | 'weight' | 'baseExperience'
export type SortOrder = 'asc' | 'desc'

/** Router state passed to the detail view so prev/next follows the list the user came from. */
export interface DetailLocationState {
  ids?: number[]
}
