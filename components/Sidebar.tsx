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
      </nav>
    </aside>
  );
}
