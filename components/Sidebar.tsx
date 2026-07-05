import { Home, Clock, Heart, Settings } from "lucide-react";
import styles from "@/app/page.module.css";
import PawIcon from "@/components/icons/PawIcon";

type NavId = "home" | "history" | "saved" | "settings";

interface SidebarProps {
  activeNav: NavId;
  setActiveNav: (id: NavId) => void;
}

export const navItems = [
  { id: "home" as const,     icon: <Home size={20} />,     label: "Home" },
  { id: "history" as const,  icon: <Clock size={20} />,    label: "History" },
  { id: "saved" as const,    icon: <Heart size={20} />,    label: "Saved" },
  { id: "settings" as const, icon: <Settings size={20} />, label: "Settings" },
];

export default function Sidebar({ activeNav, setActiveNav }: SidebarProps) {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarLogo}>
        <svg className={styles.sidebarCorners} viewBox="0 0 44 44" fill="none" aria-hidden="true">
          <defs>
            <linearGradient id="cornerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4ade80" />
              <stop offset="100%" stopColor="#c8a84b" />
            </linearGradient>
          </defs>
          <path d="M 16 2 L 14 2 A 12 12 0 0 0 2 14 L 2 16" stroke="url(#cornerGrad)" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M 28 2 L 30 2 A 12 12 0 0 1 42 14 L 42 16" stroke="url(#cornerGrad)" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M 16 42 L 14 42 A 12 12 0 0 1 2 30 L 2 28" stroke="url(#cornerGrad)" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M 28 42 L 30 42 A 12 12 0 0 0 42 30 L 42 28" stroke="url(#cornerGrad)" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
        <PawIcon size={24} />
      </div>
      <nav className={styles.sidebarNav}>
        {navItems.map(({ id, icon }) => (
          <button
            key={id}
            id={`sidebar-nav-${id}`}
            className={`${styles.navItem} ${activeNav === id ? styles.active : ""}`}
            onClick={() => setActiveNav(id)}
            aria-label={id}
          >
            {icon}
          </button>
        ))}
        <a 
          href="https://github.com/K-mangda/animal-identifier" 
          target="_blank" 
          rel="noopener noreferrer"
          className={styles.navItem}
          style={{ opacity: 0.7, marginTop: "8px" }}
          title="Source Code"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
            <path d="M9 18c-4.51 2-5-2-7-2"></path>
          </svg>
        </a>
      </nav>
    </aside>
  );
}
