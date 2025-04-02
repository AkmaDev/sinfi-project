import { ID, Query } from "appwrite";
import { appwriteConfig, account, databases, storage, avatars } from "./config";
import { IUpdatePost, INewPost, INewUser, IUpdateUser } from "@/types";


// ============================================================
// AUTH
// ============================================================

// ============================== SIGN UP
export async function createUserAccount(user: INewUser) {
  try {
    const newAccount = await account.create(
      ID.unique(),
      user.email,
      user.password,
      user.name
    );

    if (!newAccount) throw Error;

    const avatarUrl = avatars.getInitials(user.name);

    const newUser = await saveUserToDB({
      accountId: newAccount.$id,
      name: newAccount.name,
      email: newAccount.email,
      username: user.username,
      imageUrl: avatarUrl,
    });

    return newUser;
  } catch (error) {
    console.log(error);
    return error;
  }
}

export const checkIfUserHasSession = async () => {
  try {
    const sessionList = await account.listSessions(); // Récupère la liste des sessions

    // Vérifie si la propriété 'sessions' existe et est un tableau
    if (sessionList.sessions && Array.isArray(sessionList.sessions)) {
      // Utilise `some` sur le tableau de sessions pour vérifier une condition
      const hasActiveSession = sessionList.sessions.some((session) => session.userId === "user_id"); // Remplace "user_id" par l'ID de l'utilisateur
      return hasActiveSession;
    }

    return false;
  } catch (error) {
    console.error("Erreur lors de la récupération des sessions", error);
    return false;
  }
};

// ============================== SAVE USER TO DB
export async function saveUserToDB(user: {
  accountId: string;
  email: string;
  name: string;
  imageUrl: URL;
  username?: string;
}) {
  try {
    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      user
    );

    return newUser;
  } catch (error) {
    console.log(error);
  }
}

// ============================== SIGN IN
export async function signInAccount(user: { email: string; password: string }) {
  try {
    const session = await account.createEmailSession(user.email, user.password);

    return session;
  } catch (error) {
    console.log(error);
  }
}

// ============================== GET ACCOUNT
export async function getAccount() {
  try {
    const currentAccount = await account.get();

    return currentAccount;
  } catch (error) {
    console.log(error);
  }
}

// ============================== GET USER
export async function getCurrentUser() {
  try {
    const currentAccount = await getAccount();

    if (!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (!currentUser) throw Error;

    return currentUser.documents[0];
  } catch (error) {
    console.log(error);
    return null;
  }
}

// ============================== SIGN OUT
export async function signOutAccount() {
  try {
    const session = await account.deleteSession("current");

    return session;
  } catch (error) {
    console.log(error);
  }
}

// ============================================================
// POSTS
// ============================================================

// ============================== CREATE POST
export async function createPost(post: INewPost) {
  try {
    // Upload file to appwrite storage
    const uploadedFile = await uploadFile(post.file[0]);

    
    if (!uploadedFile) throw Error;


    // Get file url
    const fileUrl = getFilePreview(uploadedFile.$id);
    if (!fileUrl) {
      await deleteFile(uploadedFile.$id);
      throw Error;
    }


    // Convert tags into array
    const tags = post.tags?.replace(/ /g, "").split(",") || [];

    // Create post
    const newPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      ID.unique(),
      {
        creator: post.userId,
        caption: post.caption,
        imageUrl: fileUrl,
        imageId: uploadedFile.$id,
        location: post.location,
        tags: tags,

      }
    );

    if (!newPost) {
      await deleteFile(uploadedFile.$id);
      
      throw Error;
    }


    return newPost;
  } catch (error) {
    console.log(error);
  }
}

// fichier api.ts
// Certification 

// export async function uploadCertificationFile(file: File) {
//   try {
    
//     const uploadedFile = await uploadFile(file);
//     if (!uploadedFile) throw new Error("Téléversement échoué");

    
//     const fileUrl = getFilePreview(uploadedFile.$id);
//     if (!fileUrl) {
//       await deleteFile(uploadedFile.$id); 
//       throw new Error("Impossible de générer l'URL du fichier");
//     }

//     return fileUrl; 
//   } catch (error) {
//     console.error("Erreur lors du téléversement : ", error);
//     throw error;
//   }
// }

// export async function createCertification(certification: Certification) {
//   try {
//     // Étape 1 : Upload du fichier
//     const uploadedFile = await uploadFile(certification.file![0]);
//     if (!uploadedFile) throw new Error("Échec de l'upload du fichier.");

//     // Étape 2 : Génération de l'URL
//     const fileUrl = getFilePreview(uploadedFile.$id);
//     if (!fileUrl) {
//       await deleteFile(uploadedFile.$id);
//       throw new Error("Échec de la génération du lien de prévisualisation.");
//     }

//     // Étape 3 : Création de la certification
//     const newCertification = await databases.createDocument(
//       appwriteConfig.databaseId,
//       appwriteConfig.certificationCollectionId,
//       ID.unique(),
//       {
//         product_id: certification.product_id,
//         user_id: certification.user.id,
//         status: "attente", 
//         comments: certification.comments,
//         certificationUrl: fileUrl, // Ajout de l'URL du fichier
//       }
//     );

//     return newCertification;
//   } catch (error) {
//     console.error("Erreur lors de la création de la certification :", error);
//     throw new Error(`Création échouée : ${error}`);
//   }
// }


// export async function updateCertification(certification: Certification) {
//   try {
//     let fileUrl = certification.file[0] ? await uploadCertificationFile(certification.file[0]) : certification.file[0];

//     const updatedCertification = await databases.updateDocument(
//       appwriteConfig.databaseId,
//       appwriteConfig.certificationCollectionId,
//       certification.certification_id,
//       {
//         product_id: certification.product_id,
//         user_id: certification.user_id,
//         status: certification.status,
//         comments: certification.comments,
//         file: [fileUrl], 
//       }
//     );

//     return updatedCertification;
//   } catch (error) {
//     console.error("Erreur lors de la mise à jour de la certification :", error);
//     throw error; 
//   }
// }

// export const updateCertificationStatus = async (certificationId: string, status: "approved" | "rejected") => {
//   try {
//     const updatedCertification = await databases.updateDocument(
//       appwriteConfig.databaseId,
//       appwriteConfig.certificationCollectionId,
//       certificationId,
//       {
//         status,
//       }
//     );
//     console.log("Certification mise à jour : ", updatedCertification);
//     return updatedCertification;
//   } catch (error) {
//     console.error("Erreur lors de la mise à jour de la certification : ", error);
//     return null;
//   }
// };

// export const getCertificationsByProduct = async (productId: string) => {
//   try {
//     const certifications = await databases.listDocuments(
//       appwriteConfig.databaseId,
//       appwriteConfig.certificationCollectionId,
//       [Query.equal("product_id", productId)]
//     );
//     return certifications.documents; 
//   } catch (error) {
//     console.error("Erreur lors de la récupération des certifications : ", error);
//     return [];
//   }
// };


// export const getRecentCertificationsList = async () => {
//   try {
//     const certifications = await databases.listDocuments(
//       appwriteConfig.databaseId,
//       appwriteConfig.certificationCollectionId,
//       [Query.orderDesc("$createdAt")] // Tri par date de création
//     );

//     const initialCounts = {
//       validatedCount: 0,
//       pendingCount: 0,
//       cancelledCount: 0,
//     };

//     const counts = (certifications.documents as Certification[]).reduce(
//       (acc, certification) => {
//         switch (certification.status) {
//           case "validée":
//             acc.validatedCount++;
//             break;
//           case "en attente":
//             acc.pendingCount++;
//             break;
//           case "refusée":
//             acc.cancelledCount++;
//             break;
//         }
//         return acc;
//       },
//       initialCounts
//     );

//     const data = {
//       totalCount: certifications.total,
//       ...counts,
//       documents: certifications.documents,
//     };

//     return parseStringify(data); // Vous pouvez choisir de retourner les données dans un format spécifique.
//   } catch (error) {
//     console.error(
//       "An error occurred while retrieving the recent certifications:",
//       error
//     );
//   }
// };



// ============================== UPLOAD FILE
export async function uploadFile(file: File) {
  try {
    const uploadedFile = await storage.createFile(
      appwriteConfig.storageId,
      ID.unique(),
      file
    );

    return uploadedFile;
  } catch (error) {
    console.log(error);
  }
}

// ============================== GET FILE URL
export function getFilePreview(fileId: string) {
  try {
    const fileUrl = storage.getFilePreview(
      appwriteConfig.storageId,
      fileId,
      2000,
      2000,
      "top",
      100
    );

    if (!fileUrl) throw Error;

    return fileUrl;
  } catch (error) {
    console.log(error);
  }
}

// ============================== DELETE FILE
export async function deleteFile(fileId: string) {
  try {
    await storage.deleteFile(appwriteConfig.storageId, fileId);

    return { status: "ok" };
  } catch (error) {
    console.log(error);
  }
}

// ============================== GET POSTS
export async function searchPosts(searchTerm: string) {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      [Query.search("caption", searchTerm)]
    );

    if (!posts) throw Error;

    return posts;
  } catch (error) {
    console.log(error);
  }
}

export async function getInfinitePosts({ pageParam }: { pageParam: number }) {
  const queries: any[] = [Query.orderDesc("$updatedAt"), Query.limit(9)];

  if (pageParam) {
    queries.push(Query.cursorAfter(pageParam.toString()));
  }

  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      queries
    );

    if (!posts) throw Error;

    return posts;
  } catch (error) {
    console.log(error);
  }
}

// ============================== GET POST BY ID
export async function getPostById(postId?: string) {
  if (!postId) throw Error;

  try {
    const post = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId
    );

    if (!post) throw Error;

    return post;
  } catch (error) {
    console.log(error);
  }
}


// ============================== UPDATE POST

// export async function updatePost(post: IUpdatePost) {
//   const hasFileToUpdate = post.file.length > 0;
//   const hasCertificationToUpdate = post.certificationFile && post.certificationFile?.length > 0;

//   try {
//     let image = {
//       imageUrl: post.imageUrl,
//       imageId: post.imageId,
//     };

//     let certification = {
//       certificationFileId: post.certificationFileId,
//       certificationUrl: post.certificationUrl,
//     };

//     if (hasFileToUpdate) {
//       // Upload new file to appwrite storage
//       const uploadedFile = await uploadFile(post.file[0]);
//       if (!uploadedFile) throw Error;

//       // Get new file url
//       const fileUrl = getFilePreview(uploadedFile.$id);
//       if (!fileUrl) {
//         await deleteFile(uploadedFile.$id);
//         throw Error;
//       }

//       image = { ...image, imageUrl: fileUrl, imageId: uploadedFile.$id };
//     }

//     if (hasCertificationToUpdate) {
//       // Upload new file to appwrite storage
//       if (!post.certificationFile) throw Error;
//       const uploadedFile = await uploadFile(post.certificationFile[0]);
//       if (!uploadedFile) throw Error;

//       // Get new file url
//       const fileUrl = getFilePreview(uploadedFile.$id);
//       if (!fileUrl) {
//         await deleteFile(uploadedFile.$id);
//         throw Error;
//       }

//       certification = {
//         ...certification,
//         certificationUrl: fileUrl,
//         certificationFileId: uploadedFile.$id,
//       }
//       post.isCertified = "en attente";
//     }
//     // Convert tags into array
//     const tags = post.tags?.replace(/ /g, "").split(",") || [];

//     //  Update post
//     const updatedPost = await databases.updateDocument(
//       appwriteConfig.databaseId,
//       appwriteConfig.postCollectionId,
//       post.postId,
//       {
//         caption: post.caption,
//         imageUrl: image.imageUrl,
//         imageId: image.imageId,
//         location: post.location,
//         tags: tags,
//         descriptionC: post.descriptionC,
//         ingredients: post.ingredients,
//         benefits: post.benefits,
//         usage: post.usage,
//         price: post.price,
//         certificationUrl: post.certificationUrl,
//         certificationFileId: post.certificationFileId,
//         isCertified: post.isCertified,
//       }
//     );

//     // Failed to update
//     if (!updatedPost) {
//       // Delete new file that has been recently uploaded
//       if (hasFileToUpdate) {
//         await deleteFile(image.imageId);
//       }

//       if (hasCertificationToUpdate) {
//         if (!certification.certificationFileId) throw Error;
//         await deleteFile(certification.certificationFileId);
//       }

//       // If no new file uploaded, just throw error
//       throw Error;
//     }


//     // Safely delete old file after successful update
//     if (hasFileToUpdate) {
//       await deleteFile(post.imageId);
//     }

//     if (hasCertificationToUpdate) {
//       if (!post.certificationFileId) throw Error;
//       await deleteFile(post.certificationFileId);
//     }

//     return updatedPost;
//   } catch (error) {
//     console.log(error);
//   }
// }

export async function updatePost(post: IUpdatePost) {
  const hasFileToUpdate = post.file.length > 0;
  const hasCertificationToUpdate = post.certificationFile && post.certificationFile.length > 0;

  let image = {
    imageUrl: post.imageUrl,
    imageId: post.imageId,
  };

  let certification = {
    certificationFileId: post.certificationFileId,
    certificationUrl: post.certificationUrl,
  };

  try {
    // Upload new image file if needed
    if (hasFileToUpdate) {
      const uploadedFile = await uploadFile(post.file[0]);
      if (!uploadedFile) throw new Error("Failed to upload image file.");

      const fileUrl = getFilePreview(uploadedFile.$id);
      if (!fileUrl) {
        await deleteFile(uploadedFile.$id);
        throw new Error("Failed to get file preview.");
      }

      image = { ...image, imageUrl: fileUrl, imageId: uploadedFile.$id };
    }

    // Upload new certification file if needed
    if (hasCertificationToUpdate) {
      if (!post.certificationFile) throw new Error("Certification file is missing.");

      const uploadedFile = await uploadFile(post.certificationFile[0]);
      if (!uploadedFile) throw new Error("Failed to upload certification file.");

      const fileUrl = getFilePreview(uploadedFile.$id);
      if (!fileUrl) {
        await deleteFile(uploadedFile.$id);
        throw new Error("Failed to get certification file preview.");
      }

      certification = {
        ...certification,
        certificationUrl: fileUrl,
        certificationFileId: uploadedFile.$id,
      };

      // Set certification status to "en attente" if certification file is updated
      post.isCertified = "en attente";
    }

    // Convert tags into array
    const tags = post.tags?.replace(/ /g, "").split(",") || [];

    // Update post with new values
    const updatedPost = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      post.postId,
      {
        caption: post.caption,
        imageUrl: image.imageUrl,
        imageId: image.imageId,
        location: post.location,
        tags: tags,
        descriptionC: post.descriptionC,
        ingredients: post.ingredients,
        benefits: post.benefits,
        usage: post.usage,
        price: post.price,
        certificationUrl: certification.certificationUrl,
        certificationFileId: certification.certificationFileId,
        isCertified: post.isCertified,
      }
    );

    // Check if update failed
    if (!updatedPost) {
      if (hasFileToUpdate) {
        await deleteFile(image.imageId);
      }
      if (hasCertificationToUpdate) {
        if (!certification.certificationFileId) throw new Error("Certification file ID is missing.");
        await deleteFile(certification.certificationFileId);
      }
      throw new Error("Failed to update post.");
    }

    // Safely delete old files after successful update
    if (hasFileToUpdate) {
      await deleteFile(post.imageId);
    }

    if (hasCertificationToUpdate) {
      if (!post.certificationFileId) throw new Error("Certification file ID is missing.");
      await deleteFile(post.certificationFileId);
    }

    return updatedPost;

  } catch (error) {
    console.error("Error during post update:", error);
    // Handle error gracefully, perhaps returning an error message
    throw error;
  }
}


export async function getPostsByCertificationStatus(status: "en attente" | "validée" | "rejetée") {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId, 
      appwriteConfig.postCollectionId, 
      [`equal("isCertified", "${status}")`] 
    );
    return posts.documents; 
  } catch (error) {
    console.error("Error fetching posts by certification status:", error);
    return [];
  }
}

// export async function updateCertificationStatus(postId: string, status: "validée" | "rejetée") {

//   try {
//     const updatedPost = await databases.updateDocument(
//       appwriteConfig.databaseId,
//       appwriteConfig.postCollectionId,
//       postId,
//       { isCertified: status }
//     );
//     return updatedPost;
//   } catch (error) {
//     console.error("Error updating certification status:", error);
//     return null;
//   }
// }

// export async function updateCertificationStatus(
//   postId: string,
//   status: "validée" | "rejetée" | "en attente"
// ) {
//   try {
//     // Vérifie si le statut est valide
//     const allowedStatuses = ["en attente", "validée", "rejetée"];
//     if (!allowedStatuses.includes(status)) {
//       throw new Error(`Statut non autorisé: ${status}`);
//     }

//     // Met à jour le document dans Appwrite
//     const updatedPost = await databases.updateDocument(
//       appwriteConfig.databaseId,
//       appwriteConfig.postCollectionId,
//       postId,
//       { isCertified: status }
//     );
//     return updatedPost;
//   } catch (error) {
//     console.error("Erreur lors de la mise à jour du statut de certification :", error);
//     return null;
//   }
// }


export async function updateCertificationStatus(
  postId: string,
  status: "validée" | "rejetée" | "en attente",
  comment: string = ""  // Ajout du champ de justification
) {
  try {
    // Vérifie si le statut est valide
    const allowedStatuses = ["en attente", "validée", "rejetée"];
    if (!allowedStatuses.includes(status)) {
      throw new Error(`Statut non autorisé: ${status}`);
    }

    // Mise à jour du post avec le statut et la justification
    const updatedPost = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId,
      { isCertified: status, comment }
    );
    return updatedPost;
  } catch (error) {
    console.error("Erreur lors de la mise à jour du statut de certification :", error);
    return null;
  }
}


// ============================== DELETE POST
export async function deletePost(postId?: string, imageId?: string) {
  if (!postId || !imageId) return;

  try {
    const statusCode = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId
    );

    if (!statusCode) throw Error;

    await deleteFile(imageId);


    return { status: "Ok" };
  } catch (error) {
    console.log(error);
  }
}

// ============================== LIKE / UNLIKE POST
export async function likePost(postId: string, likesArray: string[]) {
  try {
    const updatedPost = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId,
      {
        likes: likesArray,
      }
    );

    if (!updatedPost) throw Error;

    return updatedPost;
  } catch (error) {
    console.log(error);
  }
}

// ============================== SAVE POST
export async function savePost(userId: string, postId: string) {
  try {
    const updatedPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.savesCollectionId,
      ID.unique(),
      {
        user: userId,
        post: postId,
      }
    );

    if (!updatedPost) throw Error;

    return updatedPost;
  } catch (error) {
    console.log(error);
  }
}
// ============================== DELETE SAVED POST
export async function deleteSavedPost(savedRecordId: string) {
  try {
    const statusCode = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.savesCollectionId,
      savedRecordId
    );

    if (!statusCode) throw Error;

    return { status: "Ok" };
  } catch (error) {
    console.log(error);
  }
}

// ============================== GET USER'S POST
export async function getUserPosts(userId?: string) {
  if (!userId) return;

  try {
    const post = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      [Query.equal("creator", userId), Query.orderDesc("$createdAt")]
    );

    if (!post) throw Error;

    return post;
  } catch (error) {
    console.log(error);
  }
}

// ============================== GET POPULAR POSTS (BY HIGHEST LIKE COUNT)
export async function getRecentPosts() {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      [Query.orderDesc("$createdAt"), Query.limit(20)]
    );

    if (!posts) throw Error;

    return posts;
  } catch (error) {
    console.log(error);
  }
}

// ============================================================
// USER
// ============================================================

// ============================== GET USERS
export async function getUsers(limit?: number) {
  const queries: any[] = [Query.orderDesc("$createdAt")];

  if (limit) {
    queries.push(Query.limit(limit));
  }

  try {
    const users = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      queries
    );

    if (!users) throw Error;

    return users;
  } catch (error) {
    console.log(error);
  }
}

// ============================== GET USER BY ID
export async function getUserById(userId: string) {
  try {
    const user = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      userId
    );

    if (!user) throw Error;

    return user;
  } catch (error) {
    console.log(error);
  }
}



// ============================== UPDATE USER
export async function updateUser(user: IUpdateUser) {
  const hasFileToUpdate = user.file.length > 0;
  const hasVideoToUpdate = (user.videoFile ?? []).length > 0; // si vide renvoi tableau vide
  try {
    let image = {
      imageUrl: user.imageUrl,
      imageId: user.imageId,
    };
    let video = {
      videoUrl: user.videoUrl,
      videoId: user.videoId,
    };
    
    if (hasVideoToUpdate) {
      // Upload new video to appwrite storage
      const uploadedVideo = await uploadFile(user.videoFile![0]);
      if (!uploadedVideo) throw new Error("Échec du téléchargement de la vidéo");

       // Get new video url
      const videoUrl = getFilePreview(uploadedVideo.$id);
      if (!videoUrl) {
        await deleteFile(uploadedVideo.$id);
        throw new Error("Impossible de récupérer l'URL de la vidéo");
      }
      
      video = { ...video, videoUrl: videoUrl, videoId: uploadedVideo.$id };
    }

    if (hasFileToUpdate) {
     
        const uploadedFile = await uploadFile(user.file[0]);
        if (!uploadedFile) throw new Error("Échec du téléchargement du fichier");
  
      //   // Get new file url
        const fileUrl = getFilePreview(uploadedFile.$id);
        if (!fileUrl) {
               await deleteFile(uploadedFile.$id);
          throw new Error("Impossible de récupérer l'URL du fichier");
        }
  
        image = { ...image, imageUrl: fileUrl, imageId: uploadedFile.$id };
      }
      //  }


    // Update user
    const updatedUser = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      user.userId,
      {
        name: user.name,
        bio: user.bio,
        facebook: user.facebook,
        youtube: user.youtube,
        linkedin: user.linkedin,
        instagram: user.instagram,
        tiktok: user.tiktok,
        websiteLink: user.websiteLink,
        location: user.location,
        imageUrl: image.imageUrl,
        imageId: image.imageId,
        videoUrl: video.videoUrl,
        videoId: video.videoId,
        phoneNumber: user.phoneNumber,
      }
    );

    // Failed to update
    if (!updatedUser) {
      console.error("Échec de la mise à jour de l'utilisateur.");
      // Delete new file that has been recently uploaded
      if ( hasFileToUpdate) {
        await deleteFile(image.imageId);
      }
      if (hasVideoToUpdate) {
        await deleteFile(video.videoId!);
      }
      throw new Error("Échec de la mise à jour de l'utilisateur");
    }


    // Safely delete old file after successful update
    if (user.imageId && hasFileToUpdate) {
      await deleteFile(user.imageId);
    }

    if (user.videoId && hasVideoToUpdate) {
      await deleteFile(user.videoId);
    }

    return updatedUser;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log(error.message);
    } else {
      console.log("Une erreur inattendue est survenue.");
    }
  }
}



export async function uploadVideo(file: File) {
  try {
    const uploadedVideo= await storage.createFile(
      appwriteConfig.storageId,
      ID.unique(),
      file
    );

    return uploadedVideo.$id;
  } catch (error) {
    console.log(error);
  }
}

export const getVideoUrl = (videoId: string) => {
  return `https://cloud.appwrite.io/v1/storage/buckets/${appwriteConfig.storageId}/files/${videoId}/view?project=${appwriteConfig.projectId}`;
};

export async function searchUsers(searchTerm: string) {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.search("username", searchTerm)]
    );

    if (!posts) throw Error;

    return posts;
  } catch (error) {
    console.log(error);
  }
}



export async function getInfiniteUsers({ pageParam }: { pageParam: number }) {
  const queries: any[] = [Query.orderDesc("$updatedAt"), Query.limit(9)];

  if (pageParam) {
    queries.push(Query.cursorAfter(pageParam.toString()));
  }

  try {
    const users = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      queries
    );

    if (!users) throw Error;

    return users;
  } catch (error) {
    console.log(error);
  }
}