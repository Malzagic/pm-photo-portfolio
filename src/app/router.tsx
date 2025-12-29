import { createBrowserRouter } from "react-router-dom";
import { HomePage } from "@/pages/public/HomePage";
import { AboutPage } from "@/pages/public/AboutPage";
import { ContactPage } from "@/pages/public/ContactPage";
import { AdminLoginPage } from "@/pages/admin/AdminLoginPage";
import { AdminPhotosPage } from "@/pages/admin/AdminPhotosPage";
import { AdminRoute } from "@/features/auth/AdminRoute";
import { AdminPhotoCreatePage } from "@/pages/admin/AdminPhotoCreatePage";
import { AdminPhotoEditPage } from "@/pages/admin/AdminPhotoEditPage";
import { PortfolioPage } from "@/pages/public/PortfolioPage";
import { CategoryPage } from "@/pages/public/CategoryPage";
import { PhotoPage } from "@/pages/public/PhotoPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/about",
    element: <AboutPage />,
  },
  {
    path: "/contact",
    element: <ContactPage />,
  },
  {
    path: "/portfolio",
    element: <PortfolioPage />,
  },
  {
    path: "/portfolio/:category",
    element: <CategoryPage />,
  },
  {
    path: "/photo/:slug",
    element: <PhotoPage />,
  },

  // ADMIN
  {
    path: "/admin/login",
    element: <AdminLoginPage />,
  },
  {
    path: "/admin",
    element: (
      <AdminRoute>
        <AdminPhotosPage />
      </AdminRoute>
    ),
  },
  {
    path: "/admin/photos/new",
    element: (
      <AdminRoute>
        <AdminPhotoCreatePage />
      </AdminRoute>
    ),
  },
  {
    path: "/admin/photos/:id",
    element: (
      <AdminRoute>
        <AdminPhotoEditPage />
      </AdminRoute>
    ),
  },
]);
