import { NavLink, Outlet } from 'react-router-dom'
import styles from './Layout.module.css'

function navClass({ isActive }: { isActive: boolean }): string {
  return isActive ? `${styles.link} ${styles.active}` : styles.link
}

export function Layout() {
  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <div className={styles.inner}>
          <NavLink to="/list" className={styles.brand}>
            <span className={styles.ball} aria-hidden="true" />
            Pokédex
          </NavLink>
          <nav className={styles.nav}>
            <NavLink to="/list" className={navClass}>
              List
            </NavLink>
            <NavLink to="/gallery" className={navClass}>
              Gallery
            </NavLink>
          </nav>
        </div>
      </header>
      <main className={styles.main}>
        <Outlet />
      </main>
      <footer className={styles.footer}>
        Data from <a href="https://pokeapi.co/">PokéAPI</a>
      </footer>
    </div>
  )
}
