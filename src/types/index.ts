import { Models } from "node-appwrite";

export type INavLink = {
  imgURL: string;
  route: string;
  label: string;
};

export type IUpdateUser = {
  userId: string;
  name: string;
  bio: string;
  imageId: string;
  imageUrl: URL | string;
  file: File[];
  facebook?: string; // Je suis passé ici
  youtube?: string; 
  linkedin?: string; 
  instagram?: string; 
  tiktok?: string;  
  websiteLink?: string; 
  location?: string;
  videoId?: string;
  videoUrl?: URL | string;
  videoFile?: File[];
  phoneNumber?: string;
};

export type INewPost = {
  userId: string;
  caption: string;
  file: File[];
  location?: string;
  tags?: string;
  descriptionC?: string;
  ingredients?: string;
  benefits?: string;
  usage?: string;
  price?: number;
  certificationFileId?: string;
};

export type IUpdatePost = {
  postId: string;
  caption: string;
  imageId: string;
  imageUrl: URL;
  file: File[];
  location?: string;
  tags?: string;
  descriptionC?: string;
  ingredients?: string;
  benefits?: string;
  usage?: string;
  price?: number;
  certificationFileId?: string;
  certificationUrl?: URL | string;
  certificationFile?: File[];
  isCertified?: "en attente" | "validée" | "rejetée";
  comment?: string;
};

export type IUser = {
  id: string;
  name: string;
  username: string;
  email: string;
  imageUrl: string;
  bio: string;
  facebook?: string;  // Je suis passé ici 
  youtube?: string; 
  linkedin?: string; 
  instagram?: string; 
  tiktok?: string;  
  websiteLink?: string;
  location?: string;
  videoUrl?: string;
  videoFile?: File[];
  phoneNumber?: string;

};

export type INewUser = {
  name: string;
  email: string;
  username: string;
  password: string;
};

export interface Certification extends Models.Document {
  $id: string; 
  product_id: string; 
  status: "en attente" | "validée" | "refusée"; 
  verified_by?: string; 
  comments?: string; 
  certificationUrl?: string; 
  file?: File[]; 

}