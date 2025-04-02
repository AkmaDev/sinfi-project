import { Models } from "appwrite";
import { Link } from "react-router-dom";

import { PostStats } from "@/components/shared";
import { multiFormatDateString } from "@/lib/utils";
import { useUserContext } from "@/context/AuthContext";
import { CheckCircleIcon } from "lucide-react";
import { Badge } from "../ui/badge";

type PostCardProps = {
  post: Models.Document;
};

const PostCard = ({ post }: PostCardProps) => {
  const { user } = useUserContext();

  if (!post.creator) return;

  return (
    <div className="post-card">
      <div className="flex-between">
        <div className="flex items-center gap-3">
          <Link to={`/profile/${post.creator.$id}`}>
            <img
              src={
                post.creator?.imageUrl ||
                "/assets/icons/profile-placeholder.svg"
              }
              alt="creator"
              className="w-12 lg:h-12 rounded-full"
            />
          </Link>

          <div className="flex flex-col">
            <p className="base-medium lg:body-bold text-light-1">
              {post.creator.name}
            </p>
            <div className="flex-center gap-2 text-light-3">
              <p className="subtle-semibold lg:small-regular ">
                {multiFormatDateString(post.$createdAt)}
              </p>
              •
              <p className="subtle-semibold lg:small-regular">
                {post.location}
              </p>
            </div>
          </div>
          <div className="flex justify-between gap-10 pt-4 pl-5">
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
                  className="text-xs text-gray-400 hover:text-white underline pt-3"
                  aria-label="Voir la certification">
                  Voir certification
                </a>
              </>
            )}
          </div>
        </div>

        <Link
          to={`/update-product/${post.$id}`}
          className={`${user.id !== post.creator.$id && "hidden"}`}>
          <img
            src={"/assets/icons/edit.svg"}
            alt="edit"
            width={20}
            height={20}
          />
        </Link>
      </div>

      <Link to={`/products/${post.$id}`}>
        <div className="small-medium lg:base-medium py-5">
          <p>{post.descriptionC}</p>
          <ul className="flex gap-1 mt-2">
            {post.tags.map((tag: string, index: string) => (
              <li key={`${tag}${index}`} className="text-light-3 small-regular">
                #{tag}
              </li>
            ))}
          </ul>
        </div>

        <img
          src={post.imageUrl || "/assets/icons/profile-placeholder.svg"}
          alt="post image"
          className="post-card_img"
        />
      </Link>

      <PostStats post={post} userId={user.id} />
    </div>
  );
};

export default PostCard;
