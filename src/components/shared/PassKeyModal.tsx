"use client";

// import { useEffect, useState } from "react";

// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from "@/components/ui/alert-dialog";
// import {
//   InputOTP,
//   InputOTPGroup,
//   InputOTPSlot,
// } from "@/components/ui/input-otp";
// import { decryptKey, encryptKey } from "@/lib/utils";
// import { useNavigate } from "react-router-dom";
// import { appwriteConfig } from "@/lib/appwrite/config";

// export const PasskeyModal = () => {
//   const navigate = useNavigate();
//   const [open, setOpen] = useState(false);
//   const [passkey, setPasskey] = useState("");
//   const [error, setError] = useState("");

//   const encryptedKey =
//     typeof window !== "undefined"
//       ? window.localStorage.getItem("accessKey")
//       : null;

//   useEffect(() => {
//     const accessKey = encryptedKey && decryptKey(encryptedKey);

//     if (accessKey === appwriteConfig.passkeyAmdin!.toString()) {
//       setOpen(false);
//       navigate("/admin");
//     } else {
//       setOpen(true);
//     }
//   }, [encryptedKey]);

//   const closeModal = () => {
//     setOpen(false);
//     navigate("/");
//   };

//   const validatePasskey = (
//     e: React.MouseEvent<HTMLButtonElement, MouseEvent>
//   ) => {
//     e.preventDefault();

//     if (passkey === appwriteConfig.passkeyAmdin) {
//       const encryptedKey = encryptKey(passkey);

//       localStorage.setItem("accessKey", encryptedKey);

//       setOpen(false);
//     } else {
//       setError("Invalid passkey. Please try again.");
//     }
//   };

//   return (
//     <AlertDialog open={open} onOpenChange={setOpen}>
//       <AlertDialogContent className="shad-alert-dialog">
//         <AlertDialogHeader>
//           <AlertDialogTitle className="flex items-start justify-between">
//             Admin Access Verification
//             <img
//               src="/assets/icons/close.svg"
//               alt="close"
//               width={20}
//               height={20}
//               onClick={() => closeModal()}
//               className="cursor-pointer"
//             />
//           </AlertDialogTitle>
//           <AlertDialogDescription>
//             To access the admin page, please enter the passkey.
//           </AlertDialogDescription>
//         </AlertDialogHeader>
//         <div>
//           <InputOTP
//             maxLength={6}
//             value={passkey}
//             onChange={(value) => setPasskey(value)}>
//             <InputOTPGroup className="shad-otp">
//               <InputOTPSlot className="shad-otp-slot" index={0} />
//               <InputOTPSlot className="shad-otp-slot" index={1} />
//               <InputOTPSlot className="shad-otp-slot" index={2} />
//               <InputOTPSlot className="shad-otp-slot" index={3} />
//               <InputOTPSlot className="shad-otp-slot" index={4} />
//               <InputOTPSlot className="shad-otp-slot" index={5} />
//             </InputOTPGroup>
//           </InputOTP>

//           {error && (
//             <p className="shad-error text-14-regular mt-4 flex justify-center">
//               {error}
//             </p>
//           )}
//         </div>
//         <AlertDialogFooter>
//           <AlertDialogAction
//             onClick={(e) => validatePasskey(e)}
//             className="shad-primary-btn w-full">
//             Enter Admin Passkey
//           </AlertDialogAction>
//         </AlertDialogFooter>
//       </AlertDialogContent>
//     </AlertDialog>
//   );
// };

"use client";

import { useState } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useNavigate } from "react-router-dom";
import { appwriteConfig } from "@/lib/appwrite/config";

export const PasskeyModal = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(true); // Toujours ouvert au départ
  const [passkey, setPasskey] = useState("");
  const [error, setError] = useState("");

  const closeModal = () => {
    setOpen(false);
    navigate("/"); // Redirige vers la page d'accueil si l'utilisateur ferme le modal
  };

  const validatePasskey = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();

    if (passkey === appwriteConfig.passkeyAmdin) {
      setOpen(false); // Ferme le modal après validation
      navigate("/admin"); // Redirige vers la page admin
    } else {
      setError("Mot de passe incorrect. Essayer encore une fois svp.");
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className="shad-alert-dialog">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-start justify-between">
            Admin Access Verification
            <img
              src="/assets/icons/close.svg"
              alt="close"
              width={20}
              height={20}
              onClick={() => closeModal()}
              className="cursor-pointer"
            />
          </AlertDialogTitle>
          <AlertDialogDescription>
            Pour accéder à la page admin, svp entrez le mot de passe.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div>
          <InputOTP
            maxLength={6}
            value={passkey}
            onChange={(value) => setPasskey(value)}>
            <InputOTPGroup className="shad-otp">
              <InputOTPSlot className="shad-otp-slot" index={0} />
              <InputOTPSlot className="shad-otp-slot" index={1} />
              <InputOTPSlot className="shad-otp-slot" index={2} />
              <InputOTPSlot className="shad-otp-slot" index={3} />
              <InputOTPSlot className="shad-otp-slot" index={4} />
              <InputOTPSlot className="shad-otp-slot" index={5} />
            </InputOTPGroup>
          </InputOTP>

          {error && (
            <p className="shad-error text-14-regular mt-4 flex justify-center">
              {error}
            </p>
          )}
        </div>
        <AlertDialogFooter>
          <AlertDialogAction
            onClick={(e) => validatePasskey(e)}
            className="shad-primary-btn w-full">
            Entrer le mot de passe admin
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
