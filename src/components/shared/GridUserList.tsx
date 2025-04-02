import { Models } from "appwrite";
import { Link } from "react-router-dom";
import UserCard from "./UserCard";
import { Button } from "../ui";

type GridUserListProps = {
  users: Models.Document[];
  showUser?: boolean;
  showStats?: boolean;
};

interface StabBlockProps {
  value: string | number;
  label: string;
}

const StatBlock = ({ value, label }: StabBlockProps) => (
  <div className="flex-center gap-2">
    <p className="small-semibold lg:body-bold text-primary-500">{value}</p>
    <p className="small-medium lg:base-medium text-light-2">{label}</p>
  </div>
);

const GridUserList = ({
  users,
  showUser = true,
  showStats = false,
}: GridUserListProps) => {
  return (
    <ul className="grid-container">
      {users.map((user) => (
        <li key={user.$id} className="relative min-w-80 h-80">
          <Link to={`/users/${user.$id}`} className="grid-post_link">
            <img
              src={user.imageUrl || "/assets/icons/profile-placeholder.svg"}
              alt="creator"
              className="w-8 h-8 rounded-full"
            />
          </Link>

          <div className="grid-post_user">
            <div className="grid-post_user p-4">
              <div className="flex items-center gap-2">
                <p className="text-lg font-bold">{user.name}</p>
                <p className="text-sm text-gray-500">@{user.username}</p>
              </div>

              {showStats && (
                <div className="flex gap-8 mt-4 items-center justify-center">
                  <StatBlock value={user.posts?.length || 0} label="Produits" />
                  <StatBlock
                    value={user.followersCount ?? 20}
                    label="Followers"
                  />
                  <StatBlock
                    value={user.followingCount ?? 20}
                    label="Following"
                  />
                </div>
              )}

              {user.bio && (
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                  {user.bio}
                </p>
              )}

              <Button
                type="button"
                size="sm"
                className="shad-button_primary px-5">
                Suivre
              </Button>
            </div>
            {showUser && <UserCard user={user} />}
          </div>
        </li>
      ))}
    </ul>
  );
};

export default GridUserList;
