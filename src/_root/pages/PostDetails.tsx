import { useParams, Link, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui";
import { Loader } from "@/components/shared";
import { GridPostList, PostStats } from "@/components/shared";

import {
  useGetPostById,
  useGetUserPosts,
  useDeletePost,
} from "@/lib/react-query/queries";
import { multiFormatDateString } from "@/lib/utils";
import { useUserContext } from "@/context/AuthContext";
import ProductQRCode from "@/components/shared/ProductQRCode";
// import { useState } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { CheckCircleIcon } from "lucide-react";

const PostDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useUserContext();

  // const [isModalOpen, setIsModalOpen] = useState(false);

  // // Fonction pour ouvrir/fermer le modal
  // const toggleModal = () => {
  //   setIsModalOpen(!isModalOpen);
  // };

  const { data: post, isLoading } = useGetPostById(id);
  const { data: userPosts, isLoading: isUserPostLoading } = useGetUserPosts(
    post?.creator.$id
  );
  const { mutate: deletePost } = useDeletePost();

  const relatedPosts = userPosts?.documents.filter(
    (userPost) => userPost.$id !== id
  );

  const handleDeletePost = () => {
    deletePost({ postId: id, imageId: post?.imageId });
    navigate(-1);
  };

  return (
    <div className="flex flex-col flex-1 gap-10 overflow-scroll py-10 px-5 md:p-14 custom-scrollbar">
      <div className="hidden md:flex max-w-5xl w-full">
        <Button
          onClick={() => navigate(-1)}
          variant="ghost"
          className="shad-button_ghost">
          <img
            src={"/assets/icons/back.svg"}
            alt="back"
            width={24}
            height={24}
          />
          <p className="small-medium lg:base-medium">Retour</p>
        </Button>
      </div>

      {isLoading || !post ? (
        <Loader />
      ) : (
        <div className="post_details-card">
          <div className="post_details-info">
            <img src={post?.imageUrl} alt="creator" className="" />
            <ProductQRCode productId={post.$id} />
          </div>

          <div className="post_details-info">
            <div className="flex-between w-full">
              <Link
                to={`/profile/${post?.creator.$id}`}
                className="flex items-center gap-3">
                <img
                  src={
                    post?.creator.imageUrl ||
                    "/assets/icons/profile-placeholder.svg"
                  }
                  alt="creator"
                  className="w-8 h-8 lg:w-12 lg:h-12 rounded-full"
                />
                <div className="flex gap-1 flex-col">
                  <p className="base-medium lg:body-bold text-light-1">
                    {post?.creator.name}
                  </p>
                  <div className="flex-center gap-2 text-light-3">
                    <p className="subtle-semibold lg:small-regular ">
                      {multiFormatDateString(post?.$createdAt)}
                    </p>
                    •
                    <p className="subtle-semibold lg:small-regular">
                      {post?.location}
                    </p>
                  </div>
                </div>
              </Link>

              <div className="flex-center gap-4">
                <Link
                  to={`/update-product/${post?.$id}`}
                  className={`${user.id !== post?.creator.$id && "hidden"}`}>
                  <img
                    src={"/assets/icons/edit.svg"}
                    alt="edit"
                    width={24}
                    height={24}
                  />
                </Link>
                <Button
                  onClick={handleDeletePost}
                  variant="ghost"
                  className={`ost_details-delete_btn ${
                    user.id !== post?.creator.$id && "hidden"
                  }`}>
                  <img
                    src={"/assets/icons/delete.svg"}
                    alt="delete"
                    width={24}
                    height={24}
                  />
                </Button>
              </div>
            </div>

            <hr className="border w-full border-dark-4/80" />

            <div className="flex flex-col flex-1 w-full small-medium lg:base-regular">
              <div className="flex justify-between space-x-2">
                {post?.isCertified === "validée" && (
                  <>
                    <Badge
                      className="flex items-center bg-green-500 text-white text-sm font-semibold py-1 px-3 rounded-full shadow-md hover:bg-green-600 transition duration-300"
                      aria-label="Produit certifié">
                      <CheckCircleIcon className="mr-2 w-5 h-5" />
                      Certifié
                    </Badge>
                    {/* Lien pour voir ou télécharger la certification */}
                    <a
                      href={post?.certificationUrl} // Remplacez cela par l'URL de la certification
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-gray-400 hover:text-white underline pt-2"
                      aria-label="Voir la certification">
                      Voir certification
                    </a>
                  </>
                )}
              </div>

              {post?.descriptionC && (
                <div className="mt-4">
                  <h4 className="font-semibold text-lg">Description Courte</h4>
                  <p className="text-light-3">{post.descriptionC}</p>
                </div>
              )}

              {/* Description longue */}
              {post?.caption && (
                <div className="mt-4">
                  <h4 className="font-semibold text-lg">Description Longue</h4>
                  <p className="text-light-3">{post.caption}</p>
                </div>
              )}
              <ul className="flex gap-1 mt-2">
                {post?.tags.map((tag: string, index: string) => (
                  <li
                    key={`${tag}${index}`}
                    className="text-light-3 small-regular">
                    #{tag}
                  </li>
                ))}
              </ul>

              {/* Ingrédients */}
              {post?.ingredients && (
                <div className="mt-4">
                  <h4 className="font-semibold text-lg">Ingrédients</h4>
                  <p className="text-light-3">{post.ingredients}</p>
                </div>
              )}

              {/* Avantages */}
              {post?.benefits && (
                <div className="mt-4">
                  <h4 className="font-semibold text-lg">
                    Avantages du Produit
                  </h4>
                  <p className="text-light-3">{post.benefits}</p>
                </div>
              )}

              {/* Utilisation */}
              {post?.usage && (
                <div className="mt-4">
                  <h4 className="font-semibold text-lg">Comment Utiliser</h4>
                  <p className="text-light-3">{post.usage}</p>
                </div>
              )}

              {/* Prix */}
              {post?.price && (
                <div className="mt-4">
                  <h4 className="font-semibold text-lg">Prix</h4>
                  <p className="text-light-3">{post.price} FCFA</p>
                </div>
              )}
            </div>

            <div className="w-full">
              <PostStats post={post} userId={user.id} />
            </div>
          </div>
        </div>
      )}
      {/* Modal pour afficher le statut et la justification de certification */}

      {post?.isCertified && (
        <AlertDialog>
          <AlertDialogTrigger>
            <Button
              variant="outline"
              className="rounded-full border p-3 bg-black flex items-center justify-start">
              {" "}
              {/* Ajout de justify-start pour aligner à gauche */}
              <span className="text-yellow-500 font-bold text-xl">!</span>
            </Button>
          </AlertDialogTrigger>

          <AlertDialogContent className="bg-black">
            <AlertDialogHeader>
              <AlertDialogTitle>Statut de la Certification</AlertDialogTitle>
              <AlertDialogDescription>
                {post?.isCertified === "validée" ? (
                  <p className="text-white">
                    Status : <strong className="text-green-500">Validée</strong>
                  </p>
                ) : post?.isCertified === "rejetée" ? (
                  <p className="text-white">
                    Status : <span className="text-[#FF6666]">Non validée</span>
                  </p>
                ) : post?.isCertified === "en attente" ? (
                  <p className="text-white">
                    Status : <span className="text-[#FFCC00]">En attente</span>
                  </p>
                ) : null}
                {post?.isCertified !== "en attente" && (
                  <p className="text-white">
                    Justification de l'admin :{" "}
                    <span className="text-light-3">
                      {post?.comment || "Aucune justification fournie."}
                    </span>
                  </p>
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel className="bg-black">Fermer</AlertDialogCancel>
              {/* <AlertDialogAction onClick={toggleModal}>OK</AlertDialogAction> */}
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
      <div className="w-full max-w-5xl">
        <hr className="border w-full border-dark-4/80" />

        <h3 className="body-bold md:h3-bold w-full my-10">
          Produits similaires
        </h3>
        {isUserPostLoading || !relatedPosts ? (
          <Loader />
        ) : (
          <GridPostList posts={relatedPosts} />
        )}
      </div>
    </div>
  );
};

export default PostDetails;
