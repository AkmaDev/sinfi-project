import { useState, useEffect } from "react";
import { appwriteConfig, databases, storage } from "@/lib/appwrite/config";
// import { FileUploader } from "@/components/shared";
import { ID } from "node-appwrite";
import { IUpdatePost } from "@/types";

const SubmitCertificationPage = () => {
  const [file, setFile] = useState<File[]>([]);
  const [products, setProducts] = useState<IUpdatePost[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<string>("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const fetchProducts = async () => {
    try {
      const response = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.postCollectionId
      );

      // Mapper les documents vers le type IUpdatePost
      const mappedProducts = response.documents.map((doc) => ({
        postId: doc.$id,
        caption: doc.caption || "",
        imageId: doc.imageId || "",
        imageUrl: new URL(doc.imageUrl || ""),
        file: doc.file || [],
        location: doc.location || "",
        tags: doc.tags || "",
        descriptionC: doc.descriptionC || "",
        ingredients: doc.ingredients || "",
        benefits: doc.benefits || "",
        usage: doc.usage || "",
        price: doc.price || 0,
        certificationFileId: doc.certificationFileId || "",
      }));

      setProducts(mappedProducts);
    } catch (error) {
      console.error("Erreur lors de la récupération des produits :", error);
    }
  };

  // Appeler fetchProducts dès que le composant est monté
  useEffect(() => {
    fetchProducts();
  }, []);

  //   const handleFileChange = (files: File[]) => {
  //     setFile(files);
  //   };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (file.length === 0) {
      setError("Un fichier est requis pour la certification.");
      return;
    }

    if (!selectedProduct) {
      setError("Veuillez sélectionner un produit.");
      return;
    }

    try {
      const uploadedFile = await storage.createFile(
        appwriteConfig.storageId,
        ID.unique(),
        file[0]
      );

      const response = await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.certificationCollectionId,
        ID.unique(),
        {
          product_id: selectedProduct,
          status: "en attente",
          certificationUrl: uploadedFile.$id,
        }
      );

      setFile([]);
      setSelectedProduct("");
      setError("");
      setSuccessMessage("Certification soumise avec succès !");
    } catch (error) {
      setError("Une erreur est survenue lors de la soumission.");
      console.error(error);
    }
  };

  return (
    <div>
      <h1>Soumettre une Certification</h1>

      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        {/* Sélectionner un produit */}
        <div>
          <label htmlFor="product">Choisissez un produit :</label>
          <select
            id="product"
            className="bg-slate-700"
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}>
            <option value="">Sélectionner un produit</option>
            {products.map((product) => (
              <option key={product.postId} value={product.postId}>
                {product.location} {/* Affiche le nom du produit */}
              </option>
            ))}
          </select>
        </div>

        {/* Utilisation du composant FileUploader */}
        {/* <FileUploader fieldChange={handleFileChange} mediaUrl={certificationUrl} /> */}

        <button type="submit">Soumettre</button>
      </form>
    </div>
  );
};

export default SubmitCertificationPage;
