import { appwriteConfig, databases } from "@/lib/appwrite/config";
import { useGetCurrentUser } from "@/lib/react-query/queries";
import { useEffect, useState } from "react";

interface Certification {
  $id: string;
  product_id: string;
  type: string;
  status: "en attente" | "validée" | "refusée";
  verified_by?: string;
}

const AdminCertificationValidation = () => {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [adminId, setAdminId] = useState<string | null>(null);

  // Utilisation correcte de useGetCurrentUser dans un composant fonctionnel
  const { data: currentUser } = useGetCurrentUser();

  useEffect(() => {
    const fetchAdminId = async () => {
      try {
        if (currentUser) {
          setAdminId(currentUser?.$id); // Récupère l'ID de l'utilisateur connecté
        }
      } catch (error) {
        console.error(
          "Erreur lors de la récupération de l'utilisateur :",
          error
        );
      }
    };

    fetchAdminId();
  }, [currentUser]); // Ajout de la dépendance à currentUser

  const fetchCertifications = async () => {
    try {
      const response = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.certificationCollectionId,
        []
      );

      const certificationsList = response.documents.map((doc) => ({
        $id: doc.$id,
        product_id: doc.product_id,
        type: doc.type,
        status: doc.status,
        verified_by: doc.verified_by,
      }));

      setCertifications(
        certificationsList.filter((cert) => cert.status === "en attente")
      );
    } catch (error) {
      console.error("Erreur lors du chargement des certifications :", error);
    }
  };

  const updateCertificationStatus = async (
    certificationId: string,
    status: "validée" | "refusée"
  ) => {
    if (!adminId) {
      alert("Erreur : Admin non identifié.");
      return;
    }

    try {
      await databases.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.certificationCollectionId,
        certificationId,
        { status, verified_by: adminId }
      );
      alert("Certification mise à jour avec succès !");
      setCertifications(
        certifications.filter((cert) => cert.$id !== certificationId)
      );
    } catch (error) {
      console.error("Erreur lors de la mise à jour :", error);
      alert("Erreur lors de la mise à jour.");
    }
  };

  useEffect(() => {
    fetchCertifications();
  }, []);

  return (
    <div>
      <h1>Certifications en attente</h1>
      {certifications.length > 0 ? (
        <ul>
          {certifications.map((cert) => (
            <li key={cert.$id}>
              Certification pour le produit {cert.product_id} ({cert.type})
              <button
                onClick={() => updateCertificationStatus(cert.$id, "validée")}>
                Valider
              </button>
              <button
                onClick={() => updateCertificationStatus(cert.$id, "refusée")}>
                Refuser
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>Aucune certification en attente.</p>
      )}
    </div>
  );
};

export default AdminCertificationValidation;
