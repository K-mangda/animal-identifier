import styles from "@/app/page.module.css";
import { navItems } from "./Sidebar";

type NavId = "home" | "history" | "saved" | "settings";

interface BottomNavProps {
  activeNav: NavId;
  setActiveNav: (id: NavId) => void;
}

export default function BottomNav({ activeNav, setActiveNav }: BottomNavProps) {
  return (
    <nav className={styles.bottomNav} aria-label="Mobile navigation">
      {navItems.map(({ id, icon, label }) => (
        <button
          key={id}
          id={`bottom-nav-${id}`}
          className={`${styles.bottomNavItem} ${activeNav === id ? styles.active : ""}`}
          onClick={() => setActiveNav(id)}
          aria-label={label}
        >
          {icon}
          <span>{label}</span>
        </button>
      ))}
    </nav>
  );
}
