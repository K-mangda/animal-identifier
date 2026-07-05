import { AlertTriangle, CheckCircle2 } from "lucide-react";
import styles from "@/app/page.module.css";

const IUCN: Record<string, string> = {
  LC: "Least Concern", NT: "Near Threatened", VU: "Vulnerable",
  EN: "Endangered", CR: "Critically Endangered",
  EW: "Extinct in Wild", EX: "Extinct",
};

export default function ConservationBadge({ status }: { status: string }) {
  const code = (status ?? "").toUpperCase();
  const label = IUCN[code] ?? code;
  const danger = ["VU", "EN", "CR", "EW", "EX"].includes(code);
  return (
    <span className={styles.conservationBadge} data-status={code} title={`IUCN Red List: ${label}`}>
      {danger ? <AlertTriangle size={10} /> : <CheckCircle2 size={10} />}
      {code} · {label}
    </span>
  );
}
