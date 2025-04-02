import { useEffect, useState } from "react";
import { StatCard } from "@/components/shared/StatCard";
import {
  getPostsByCertificationStatus,
  updateCertificationStatus,
} from "@/lib/appwrite/api";
import { Certification } from "@/types";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"; // Import du modal

const AdminDashboard = () => {
  const [pendingCount, setPendingCount] = useState(0);
  const [approvedCount, setApprovedCount] = useState(0);
  const [rejectedCount, setRejectedCount] = useState(0);
  const [posts, setPosts] = useState<Certification[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Certification[]>([]);
  const [filter, setFilter] = useState<"en attente" | "validée" | "rejetée">(
    "en attente"
  );
  const [justification, setJustification] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false); // Contrôle l'ouverture du modal
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<
    "validée" | "rejetée" | null
  >(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [reopenPostId, setReopenPostId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const pendingPosts = await getPostsByCertificationStatus("en attente");
      const approvedPosts = await getPostsByCertificationStatus("validée");
      const rejectedPosts = await getPostsByCertificationStatus("rejetée");

      setPendingCount(pendingPosts.length);
      setApprovedCount(approvedPosts.length);
      setRejectedCount(rejectedPosts.length);

      const allPosts = [
        ...pendingPosts,
        ...approvedPosts,
        ...rejectedPosts,
      ] as Certification[];

      setPosts(allPosts);
      setFilteredPosts(pendingPosts as Certification[]);
    };

    fetchData();
  }, []);

  useEffect(() => {
    const filtered = posts.filter((post) => post.isCertified === filter);
    setFilteredPosts(filtered);
  }, [filter, posts]);

  const handleUpdateStatus = async (
    postId: string,
    status: "validée" | "rejetée"
  ) => {
    setSelectedPostId(postId);
    setSelectedStatus(status);
    setIsModalOpen(true); // Ouvrir le modal pour justifier la décision
  };

  const handleReopenPost = (postId: string) => {
    setReopenPostId(postId);
    setShowConfirmation(true); // Ouvrir la confirmation pour réouvrir
  };

  const handleModalSubmit = async () => {
    if (!justification.trim()) {
      alert("Veuillez entrer une justification.");
      return;
    }

    const updatedPost = await updateCertificationStatus(
      selectedPostId!,
      selectedStatus!,
      justification
    );
    if (updatedPost) {
      console.log(
        `Le statut du produit a été mis à jour en: ${selectedStatus}`
      );
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.$id === selectedPostId
            ? { ...post, isCertified: selectedStatus, justification }
            : post
        )
      );
      setJustification(""); // Réinitialiser la justification
      setIsModalOpen(false); // Fermer le modal
    } else {
      console.error("Erreur lors de la mise à jour du statut du produit");
    }
  };

  const handleConfirmReopen = async () => {
    if (reopenPostId) {
      const reopenedPost = await updateCertificationStatus(
        reopenPostId,
        "en attente", // Réouverture du statut à "en attente"
        ""
      );
      if (reopenedPost) {
        console.log("Produit réouvert avec succès.");
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.$id === reopenPostId
              ? { ...post, isCertified: "en attente" }
              : post
          )
        );
        setShowConfirmation(false); // Fermer la confirmation
      } else {
        console.error("Erreur lors de la réouverture du produit.");
      }
    }
  };

  return (
    <div className="mx-auto flex max-w-7xl flex-col space-y-14">
      <header className="sticky top-3 z-20 mx-3 flex items-center justify-between rounded-2xl bg-dark-200 px-[5%] py-5 shadow-lg xl:px-12;">
        <Link to="/" className="cursor-pointer">
          <img
            src="/assets/images/logocomplet.png"
            height={32}
            width={162}
            alt="logo"
            className="h-8 w-fit"
          />
        </Link>
        <p className="text-16-semibold">Admin Dashboard</p>
      </header>

      <main className="flex flex-col items-center space-y-6 px-[5%] pb-12 xl:space-y-12 xl:px-12">
        <section className="flex w-full flex-col justify-between gap-5 sm:flex-row xl:gap-10">
          <StatCard
            type="en attente"
            count={pendingCount}
            label="Certifications en attente"
            icon={"/assets/icons/pending.svg"}
            onClick={() => setFilter("en attente")}
          />
          <StatCard
            type="certifications"
            count={approvedCount}
            label="Certifications validées"
            icon={"/assets/icons/appointments.svg"}
            onClick={() => setFilter("validée")}
          />
          <StatCard
            type="rejetée"
            count={rejectedCount}
            label="Certifications rejetées"
            icon={"/assets/icons/cancelled.svg"}
            onClick={() => setFilter("rejetée")}
          />
        </section>
      </main>

      {/* Affichage des produits sous forme de tableau */}
      <div className="w-full overflow-x-auto">
        <h2 className="text-xl font-bold mb-4">
          Posts {filter === "en attente" ? "en attente" : filter}
        </h2>
        <table className="table-auto w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b">#</th>
              <th className="px-4 py-2 border-b">Nom du produit</th>
              <th className="px-4 py-2 border-b">Status</th>
              <th className="px-4 py-2 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPosts.map((post, index) => (
              <tr key={post.$id} className="border-b">
                <td className="px-4 py-2">{index + 1}</td>
                <td className="px-4 py-2">{post.location}</td>
                <td
                  className={`px-4 py-2 ${
                    post.isCertified === "en attente"
                      ? "text-yellow-500"
                      : post.isCertified === "validée"
                      ? "text-green-500"
                      : "text-[#FF6666]"
                  }`}>
                  {post.isCertified}
                </td>
                <td className="px-4 py-2">
                  {filter === "en attente" && (
                    <div className="flex gap-6">
                      <div className="flex space-x-2">
                        <button
                          onClick={() =>
                            handleUpdateStatus(post.$id, "validée")
                          }
                          className="px-4 py-2 bg-green-500 text-white rounded-md shadow hover:bg-green-600">
                          Valider
                        </button>
                        <button
                          onClick={() =>
                            handleUpdateStatus(post.$id, "rejetée")
                          }
                          className="px-4 py-2 bg-[#FF6666] text-white rounded-md shadow hover:bg-[#FF4C4C]">
                          Rejeter
                        </button>
                      </div>
                      {post.certificationUrl && (
                        <a
                          href={post.certificationUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 font-medium hover:underline hover:text-blue-700 transition duration-200 inline-flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-5 h-5 mr-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M12 4v16m8-8H4"
                            />
                          </svg>
                          Voir
                        </a>
                      )}
                    </div>
                  )}
                  {(filter === "validée" || filter === "rejetée") && (
                    <div className="flex gap-16">
                      <button
                        onClick={() => handleReopenPost(post.$id)}
                        className="px-4 py-2 bg-yellow-500 text-white rounded-md shadow hover:bg-yellow-600">
                        Réouvrir
                      </button>
                      {post.certificationUrl && (
                        <a
                          href={post.certificationUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 font-medium hover:underline hover:text-blue-700 transition duration-200 inline-flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-5 h-5 mr-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M12 4v16m8-8H4"
                            />
                          </svg>
                          Télécharger le document
                        </a>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal de confirmation pour la réouverture */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-70 z-50 flex justify-center items-center h-full">
          <div className="bg-dark-200 p-6 rounded-md shadow-lg max-w-xs w-full">
            <p className="text-lg font-semibold">Confirmer la réouverture</p>
            <p className="mt-2">Voulez-vous vraiment réouvrir ce produit ?</p>
            <div className="flex  space-x-4 mt-4">
              <button
                onClick={() => setShowConfirmation(false)}
                className="px-4 py-2 bg-[#FF6666] rounded-md">
                Annuler
              </button>
              <button
                onClick={handleConfirmReopen}
                className="px-4 py-2 bg-gray-500 text-white rounded-md">
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Modal pour la justification */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogTrigger asChild /> {/* Le déclencheur pour ouvrir le modal */}
        <DialogContent className="bg-black text-white p-6 rounded-lg shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold">
              Justification de la décision
            </DialogTitle>
            <DialogDescription className="text-light-3">
              Veuillez entrer votre justification avant de confirmer l'action.
            </DialogDescription>
          </DialogHeader>
          <textarea
            value={justification}
            onChange={(e) => setJustification(e.target.value)}
            placeholder="Entrez votre justification ici..."
            rows={4}
            className="w-full p-3 mt-4 bg-dark-200 text-white rounded-md border border-gray-600 focus:outline-none focus:border-blue-500"
          />
          <div className="mt-6 flex space-x-4">
            <button
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 bg-[#FF6666] text-white rounded-md hover:bg-[#FF4C4C]">
              Annuler
            </button>
            <button
              onClick={handleModalSubmit}
              className="px-4 py-2 bg-blue-700 text-white rounded-md hover:bg-blue-800">
              Soumettre
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;

// import { useEffect, useState } from "react";
// import { StatCard } from "@/components/shared/StatCard";
// import {
//   getPostsByCertificationStatus,
//   updateCertificationStatus,
// } from "@/lib/appwrite/api";
// import { Certification } from "@/types";
// import { Link } from "react-router-dom";

// const Dashboard = () => {
//   const [pendingCount, setPendingCount] = useState(0);
//   const [approvedCount, setApprovedCount] = useState(0);
//   const [rejectedCount, setRejectedCount] = useState(0);
//   const [posts, setPosts] = useState<Certification[]>([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       const pendingPosts = await getPostsByCertificationStatus("en attente");
//       const approvedPosts = await getPostsByCertificationStatus("validée");
//       const rejectedPosts = await getPostsByCertificationStatus("rejetée");

//       setPendingCount(pendingPosts.length);
//       setApprovedCount(approvedPosts.length);
//       setRejectedCount(rejectedPosts.length);

//       setPosts(pendingPosts as Certification[]);
//     };

//     fetchData();
//   }, []);

//   const handleUpdateStatus = async (
//     postId: string,
//     status: "validée" | "rejetée"
//   ) => {
//     const updatedPost = await updateCertificationStatus(postId, status);
//     if (updatedPost) {
//       console.log(`Le statut du produit a été mis à jour en: ${status}`);
//       setPosts((prevPosts) => prevPosts.filter((post) => post.$id !== postId));
//     } else {
//       console.error("Erreur lors de la mise à jour du statut du produit");
//     }
//   };

//   return (
//     <div className="mx-auto flex max-w-7xl flex-col space-y-14">
//       <header className="sticky top-3 z-20 mx-3 flex items-center justify-between rounded-2xl bg-dark-200 px-[5%] py-5 shadow-lg xl:px-12;">
//         <Link to="/" className="cursor-pointer">
//           <img
//             src="/assets/images/logocomplet.png"
//             height={32}
//             width={162}
//             alt="logo"
//             className="h-8 w-fit"
//           />
//         </Link>
//         <p className="text-16-semibold">Admin Dashboard</p>
//       </header>

//       <main className="flex flex-col items-center space-y-6 px-[5%] pb-12 xl:space-y-12 xl:px-12">
//         <section className="flex w-full flex-col justify-between gap-5 sm:flex-row xl:gap-10">
//           <StatCard
//             type="en attente"
//             count={pendingCount}
//             label="Certifications en attente"
//             icon={"/assets/icons/pending.svg"}
//           />
//           <StatCard
//             type="certifications"
//             count={approvedCount}
//             label="Certifications validées"
//             icon={"/assets/icons/appointments.svg"}
//           />
//           <StatCard
//             type="rejetée"
//             count={rejectedCount}
//             label="Certifications rejetées"
//             icon={"/assets/icons/cancelled.svg"}
//           />
//         </section>
//       </main>

//       {/* Affichage sous forme de tableau */}
//       <div className="w-full overflow-x-auto">
//         <table className="table-auto w-full text-left border-collapse">
//           <thead className="">
//             <tr>
//               <th className="px-4 py-2 border-b">#</th>
//               <th className="px-4 py-2 border-b">Nom du produit</th>
//               <th className="px-4 py-2 border-b">Status</th>
//               <th className="px-4 py-2 border-b">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {posts.map((post, index) => (
//               <tr key={post.$id} className="border-b">
//                 <td className="px-4 py-2">{index + 1}</td>{" "}
//                 {/* Affiche le numéro de ligne */}
//                 <td className="px-4 py-2 ">{post.location}</td>
//                 <td className="px-4 py-2 text-yellow-500">
//                   {post.isCertified}
//                 </td>
//                 <td className="px-4 py-2">
//                   <div className="flex space-x-2">
//                     <button
//                       onClick={() => handleUpdateStatus(post.$id, "validée")}
//                       className="px-4 py-2 bg-green-500 text-white rounded-md shadow hover:bg-green-600">
//                       Valider
//                     </button>
//                     <button
//                       onClick={() => handleUpdateStatus(post.$id, "rejetée")}
//                       className="px-4 py-2 bg-[#FF6666] text-white rounded-md shadow hover:bg-[#FF4C4C]">
//                       Rejeter
//                     </button>
//                   </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;

// import { useEffect, useState } from "react";
// import { StatCard } from "@/components/shared/StatCard";

// import { columns } from "@/components/shared/table/columns";
// import { DataTable } from "@/components/shared/table/DataTable";
// import { Link } from "react-router-dom";

// const AdminPage = () => {
//   const [certifications, setCertifications] = useState<any>(null);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         // const data = await getRecentCertificationsList();
//         // setCertifications(data);
//       } catch (error) {
//         console.error("Error fetching certifications:", error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   if (isLoading) {
//     return <div>Loading...</div>;
//   }

//   if (!certifications) {
//     return <div>Error: Failed to load certifications</div>;
//   }

//   return (
//     <div className="mx-auto flex max-w-7xl flex-col space-y-14">
//       <header className="admin-header">
//         <Link to={"/"} className="cursor-pointer">
//           <img
//             src="/assets/images/logocomplet.png"
//             height={32}
//             width={162}
//             alt="logo"
//             className="h-8 w-fit"
//           />
//         </Link>
//         <p className="text-16-semibold">Admin Dashboard</p>
//       </header>

//       <main className="admin-main">
//         <section className="admin-stat">
//           <StatCard
//             type="certifications"
//             count={certifications.scheduledCount}
//             label="Certifications validées"
//             icon={"/assets/icons/appointments.svg"}
//           />
//           <StatCard
//             type="attente"
//             count={certifications.pendingCount}
//             label="Certifications En attente"
//             icon={"/assets/icons/pending.svg"}
//           />
//           <StatCard
//             type="rejetee"
//             count={certifications.cancelledCount}
//             label="Certifications Rejetées"
//             icon={"/assets/icons/cancelled.svg"}
//           />
//         </section>

//         <DataTable columns={columns} data={certifications.documents} />
//       </main>
//     </div>
//   );
// };

// export default AdminPage;

// import { StatCard } from "@/components/shared/StatCard";
// import { getRecentCertificationsList } from "@/lib/appwrite/api";
// import { columns } from "@/components/shared/table/columns";
// import { DataTable } from "@/components/shared/table/DataTable";
// import { Link } from "react-router-dom";

// const AdminPage = async () => {
//   const certifications = await getRecentCertificationsList();

//   return (
//     <div className="mx-auto flex max-w-7xl flex-col space-y-14">
//       <header className="admin-header">
//         <Link to={"/"} className="cursor-pointer">
//           <img
//             src="/assets/images/logocomplet.png"
//             height={32}
//             width={162}
//             alt="logo"
//             className="h-8 w-fit"
//           />
//         </Link>

//         <p className="text-16-semibold">Admin Dashboard</p>
//       </header>

//       <main className="admin-main">
//         <section className="w-full space-y-4">
//           <h1 className="header">Welcome 👋</h1>
//           <p className="text-dark-700">
//             Start the day with managing new appointments
//           </p>
//         </section>

//         <section className="admin-stat">
//           <StatCard
//             type="certifications"
//             count={certifications.scheduledCount}
//             label="Scheduled appointments"
//             icon={"/assets/icons/appointments.svg"}
//           />
//           <StatCard
//             type="pending"
//             count={certifications.pendingCount}
//             label="Pending appointments"
//             icon={"/assets/icons/pending.svg"}
//           />
//           <StatCard
//             type="cancelled"
//             count={certifications.cancelledCount}
//             label="Cancelled appointments"
//             icon={"/assets/icons/cancelled.svg"}
//           />
//         </section>

//         <DataTable columns={columns} data={certifications.documents} />
//       </main>
//     </div>
//   );
// };

// export default AdminPage;
