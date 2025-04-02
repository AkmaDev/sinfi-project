import * as z from "zod";

// ============================================================
// USER
// ============================================================
export const SignupValidation = z.object({
  name: z.string().min(2, { message: "Le nom doit contenir au moins 2 caractères." }),
  username: z.string().min(2, { message: "Le nom d'utilisateur doit contenir au moins 2 caractères." }),
  email: z.string().email(),
  password: z.string().min(8, { message: "Le mot de passe doit contenir au moins 8 caractères." }),
});

export const SigninValidation = z.object({
  email: z.string().email(),
  password: z.string().min(8, { message: "Le mot de passe doit contenir au moins 8 caractères." }),
});

export const ProfileValidation = z.object({
  file: z.custom<File[]>(),
  name: z.string().min(2, { message: "Le nom doit contenir au moins 2 caractères." }),
  username: z.string().min(2, { message: "Le nom d'utilisateur doit contenir au moins 2 caractères." }),
  email: z.string().email(),
  bio: z.string(),
  facebook: z.string().url().optional().or(z.literal('')).or(z.string().regex(/^www\..+/).transform(url => `https://${url}`)),        //Je suis passé ici 
  youtube: z.string().url().optional().or(z.literal('')).or(z.string().regex(/^www\..+/).transform(url => `https://${url}`)),    
  linkedin: z.string().url().optional().or(z.literal('')).or(z.string().regex(/^www\..+/).transform(url => `https://${url}`)),
  instagram: z.string().url().optional().or(z.literal('')).or(z.string().regex(/^www\..+/).transform(url => `https://${url}`)),
  tiktok: z.string().url().optional().or(z.literal('')).or(z.string().regex(/^www\..+/).transform(url => `https://${url}`)),
  websiteLink: z.string().url().optional().or(z.literal('')).or(z.string().regex(/^www\..+/).transform(url => `https://${url}`)),
  location: z.string().min(1, { message: "Ce champ est requis" }).max(1000, { message: "Maximum 1000 caractères" }),
  videoFile: z.custom<File[]>().optional(),
  phoneNumber: z
  .string()
  .optional()
  .refine(value => {
    return value === undefined || /^\+?[0-9]*$/.test(value);
  }, { message: "Svp Vérifiez que le numéro commence par '+' et contient seulement des chiffres" })
  .transform((value) => value?.replace(/\s+/g, "")),
});

// ============================================================
// POST
// ============================================================
export const PostValidation = z.object({
  caption: z.string().min(5, { message: "Minimum 5 caracters" }).max(2200, { message: " Maximum 2200 caracters" }),
  file: z.custom<File[]>(),
  certificationFile: z.custom<File[]>().optional(),
  location: z.string().min(1, { message: "Ce champ est requis" }).max(1000, { message: "Maximum 1000 caractères" }),
  tags: z.string(),
  descriptionC: z.string().optional(),
  ingredients: z.string().optional(),
  benefits: z.string().optional(),
  usage: z.string().optional(),
  price: z.preprocess((val) => Number(val), z.number().optional()),
});
