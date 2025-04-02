import { Models } from "appwrite";
import { Loader, PostCard, UserCard } from "@/components/shared";
import { useGetRecentPosts, useGetUsers } from "@/lib/react-query/queries";
import { PasskeyModal } from "@/components/shared/PassKeyModal";
import { Link, useLocation } from "react-router-dom";

const Home = () => {
  const { search } = useLocation(); // Utilisation de useLocation pour obtenir l'URL actuelle
  const searchParams = new URLSearchParams(search); // Convertir en SearchParams pour accéder aux paramètres
  const isAdmin = searchParams.get("admin") === "true"; // Vérifier si le paramètre admin est "true"

  const {
    data: posts,
    isLoading: isPostLoading,
    isError: isErrorPosts,
  } = useGetRecentPosts();
  const {
    data: creators,
    isLoading: isUserLoading,
    isError: isErrorCreators,
  } = useGetUsers(10);

  if (isErrorPosts || isErrorCreators) {
    return (
      <div className="flex flex-1">
        <div className="home-container">
          <p className="body-medium text-light-1">
            Quelque chose de mal s'est passée
          </p>
        </div>
        <div className="home-creators">
          <p className="body-medium text-light-1">
            Quelque chose de mal s'est passée
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1">
      {isAdmin && <PasskeyModal />}
      <div className="home-container">
        <div className="home-posts">
          <h2 className="h3-bold md:h2-bold text-left w-full"></h2>
          {isPostLoading && !posts ? (
            <Loader />
          ) : (
            <ul className="flex flex-col flex-1 gap-9 w-full ">
              {posts?.documents.map((post: Models.Document) => (
                <li key={post.$id} className="flex justify-center w-full">
                  <PostCard post={post} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="home-creators">
        <h3 className="h3-bold text-light-1">Les Producteurs</h3>
        {isUserLoading && !creators ? (
          <Loader />
        ) : (
          <ul className="grid 2xl:grid-cols-2 gap-6">
            {creators?.documents.map((creator) => (
              <li key={creator?.$id}>
                <UserCard user={creator} />
              </li>
            ))}
          </ul>
        )}
        {!isAdmin && (
          <Link to="/?admin=true" className="text-green-500 mt-4 inline-block">
            Devenir Admin
          </Link>
        )}
      </div>
    </div>
  );
};

export default Home;
