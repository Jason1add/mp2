import { capitalize } from '../utils/format'
import styles from './TypeBadge.module.css'

export function TypeBadge({ type }: { type: string }) {
  return <span className={`${styles.badge} ${styles[type] ?? ''}`}>{capitalize(type)}</span>
}
