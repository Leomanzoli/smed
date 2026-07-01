import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LanguageToggle } from './LanguageToggle';

const LINKS = [
  { to: '/', key: 'nav.home', end: true },
  { to: '/projetos', key: 'nav.projects', end: false },
  { to: '/ajuda', key: 'nav.help', end: false },
  { to: '/privacidade', key: 'nav.privacy', end: false },
  { to: '/sobre', key: 'nav.about', end: false },
];

export function Header() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-brand text-white shadow">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <NavLink to="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-white text-base font-black text-brand">S</span>
          <span className="text-lg font-bold tracking-tight">SMED Up</span>
        </NavLink>

        <nav className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                `rounded-lg px-3 py-2 text-sm font-medium ${isActive ? 'bg-white/15' : 'hover:bg-white/10'}`
              }
            >
              {t(l.key)}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LanguageToggle />
          <button
            className="rounded-lg p-2 hover:bg-white/10 md:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-label="Menu"
            aria-expanded={open}
          >
            ☰
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-white/10 px-4 pb-3 md:hidden">
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `block rounded-lg px-3 py-2 text-sm font-medium ${isActive ? 'bg-white/15' : 'hover:bg-white/10'}`
              }
            >
              {t(l.key)}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  );
}
