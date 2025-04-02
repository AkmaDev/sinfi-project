import { StatusIcon } from "@/constants";
import clsx from "clsx";

declare type IsCertified = "en attente" | "validée" | "rejetée";

export const StatusBadge = ({ isCertified }: { isCertified: IsCertified }) => {
  return (
    <div
      className={clsx("status-badge", {
        "bg-green-600": isCertified === "validée",
        "bg-blue-600": isCertified === "en attente",
        "bg-red-600": isCertified === "rejetée",
      })}>
      <img
        src={StatusIcon[isCertified]}
        alt="produit"
        width={24}
        height={24}
        className="h-fit w-3"
      />
      <p
        className={clsx("text-12-semibold capitalize", {
          "text-green-500": isCertified === "validée",
          "text-blue-500": isCertified === "en attente",
          "text-red-500": isCertified === "rejetée",
        })}>
        {isCertified}
      </p>
    </div>
  );
};
