import clsx from "clsx";

type StatCardProps = {
  type: "certifications" | "en attente" | "rejetée";
  count: number;
  label: string;
  icon: string;
  onClick?: () => void; // Ajout de la propriété onClick
};

export const StatCard = ({
  count = 0,
  label,
  icon,
  type,
  onClick,
}: StatCardProps) => {
  return (
    <div
      onClick={onClick} // Applique l'action onClick si elle est définie
      className={clsx("stat-card cursor-pointer", {
        "bg-appointments": type === "certifications",
        "bg-pending": type === "en attente",
        "bg-cancelled": type === "rejetée",
      })}>
      <div className="flex items-center gap-4">
        <img
          src={icon}
          height={32}
          width={32}
          alt="appointments"
          className="size-8 w-fit"
        />
        <h2 className="text-32-bold text-white">{count}</h2>
      </div>

      <p className="text-14-regular">{label}</p>
    </div>
  );
};

// import clsx from "clsx";

// type StatCardProps = {
//   type: "certifications" | "en attente" | "rejetée"; // Ajoute un type pour chaque statut
//   count: number; // Le nombre de produits dans ce statut
//   label: string; // Le label (par exemple "Certifications en attente")
//   icon: string; // Le chemin vers l'icône correspondante
// };

// export const StatCard = ({ count = 0, label, icon, type }: StatCardProps) => {
//   return (
//     <div
//       className={clsx("stat-card", {
//         "bg-appointments": type === "certifications",
//         "bg-pending": type === "en attente",
//         "bg-cancelled": type === "rejetée",
//       })}>
//       <div className="flex items-center gap-4">
//         <img
//           src={icon}
//           height={32}
//           width={32}
//           alt="appointments"
//           className="size-8 w-fit"
//         />
//         <h2 className="text-32-bold text-white">{count}</h2>
//       </div>

//       <p className="text-14-regular">{label}</p>
//     </div>
//   );
// };
