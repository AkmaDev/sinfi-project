import { ColumnDef } from "@tanstack/react-table";
import { IUpdatePost } from "@/types"; // Assurez-vous que le type IUpdatePost est correctement défini
import { StatusBadge } from "../StatusBadge";

// Définir les colonnes
export const columns: ColumnDef<IUpdatePost, any>[] = [
  {
    header: "Product ID", // Titre de la colonne
    accessorKey: "product_id", // Accès à la propriété product_id dans les données
  },
  {
    accessorKey: "isCertified", // La clé des données pour accéder au statut
    header: "Status",
    cell: ({ row }) => {
      const isCertified = row.getValue("isCertified");

      if (
        isCertified === "en attente" ||
        isCertified === "validée" ||
        isCertified === "rejetée"
      ) {
        return <StatusBadge isCertified={isCertified} />;
      } else {
        // Si la valeur n'est pas valide, afficher un statut par défaut
        return <StatusBadge isCertified="en attente" />;
      }
    },
  },

  // {
  //   header: "Comments",
  //   accessorKey: "comments", // Commentaires liés à la mise à jour
  // },
  {
    header: "Certification File",
    accessorKey: "certificationFile", // Fichier de certification lié
    cell: ({ row }) => {
      const file = row.getValue("certificationFile");
      if (file && Array.isArray(file) && file[0]) {
        return (
          <a
            href={URL.createObjectURL(file[0])}
            target="_blank"
            rel="noopener noreferrer">
            View Certificate
          </a>
        );
      }
      return "No File"; // Si aucun fichier n'est attaché
    },
  },
];
