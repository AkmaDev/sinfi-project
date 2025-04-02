import { Routes, Route } from "react-router-dom";

import {
  Home,
  Explore,
  Saved,
  CreatePost,
  Profile,
  EditPost,
  PostDetails,
  UpdateProfile,
  AllUsers,
} from "@/_root/pages";
import AuthLayout from "./_auth/AuthLayout";
import RootLayout from "./_root/RootLayout";
import SignupForm from "@/_auth/forms/SignupForm";
import SigninForm from "@/_auth/forms/SigninForm";
import { Toaster } from "@/components/ui/toaster";

import "./globals.css";
import AdminPage from "./_root/pages/Admin";
// import AdminCertificationValidation from "./_root/pages/AdminCertificationValidation";
import SubmitCertificationPage from "./_root/pages/SubmitCertificationPage";

// import AdminProtectedRoute from "./_root/pages/AdminProtectRoute";

const App = () => {
  return (
    <main className="flex h-screen">
      <Routes>
        {/* public routes */}
        <Route element={<AuthLayout />}>
          <Route path="/sign-in" element={<SigninForm />} />
          <Route path="/sign-up" element={<SignupForm />} />
        </Route>

        {/* private routes */}
        <Route element={<RootLayout />}>
          <Route index element={<Home />} />
          {/* <Route
            path="/admin/certifications"
            element={<AdminCertificationValidation />}
          /> */}
          <Route
            path="/soumettre-certification"
            element={<SubmitCertificationPage />}
          />
          <Route path="/explore" element={<Explore />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/saved" element={<Saved />} />
          <Route path="/all-users" element={<AllUsers />} />
          <Route path="/create-product" element={<CreatePost />} />
          <Route path="/update-product/:id" element={<EditPost />} />
          <Route path="/products/:id" element={<PostDetails />} />
          <Route path="/profile/:id/*" element={<Profile />} />
          <Route path="/update-profile/:id" element={<UpdateProfile />} />
        </Route>
      </Routes>

      <Toaster />
    </main>
  );
};

export default App;
