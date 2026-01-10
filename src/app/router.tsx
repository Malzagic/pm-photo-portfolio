import { createBrowserRouter } from "react-router-dom";

import { PublicLayout } from "@/components/layout/PublicLayout";
import { AdminLayout } from "@/components/layout/AdminLayout";

import { HomePage } from "@/pages/public/HomePage";
import { AboutPage } from "@/pages/public/AboutPage";
import { ContactPage } from "@/pages/public/ContactPage";
import { PortfolioPage } from "@/pages/public/PortfolioPage";
import { CategoryPage } from "@/pages/public/CategoryPage";
import { PhotoPage } from "@/pages/public/PhotoPage";

import { AdminLoginPage } from "@/pages/admin/AdminLoginPage";
import { AdminPhotosPage } from "@/pages/admin/AdminPhotosPage";
import { AdminPhotoCreatePage } from "@/pages/admin/AdminPhotoCreatePage";
import { AdminPhotoEditPage } from "@/pages/admin/AdminPhotoEditPage";

import { AdminRoute } from "@/features/auth/AdminRoute";

export const router = createBrowserRouter([
  // PUBLIC
  {
    element: <PublicLayout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/about", element: <AboutPage /> },
      { path: "/contact", element: <ContactPage /> },
      { path: "/portfolio", element: <PortfolioPage /> },
      { path: "/portfolio/:category", element: <CategoryPage /> },
      { path: "/photo/:slug", element: <PhotoPage /> },
    ],
  },

  // ADMIN LOGIN (BEZ LAYOUTU, BEZ OCHRONY)
  {
    path: "/admin/login",
    element: <AdminLoginPage />,
  },

  // ADMIN (CHRONIONE + LAYOUT)
  {
    element: (
      <AdminRoute>
        <AdminLayout />
      </AdminRoute>
    ),
    children: [
      { path: "/admin", element: <AdminPhotosPage /> },
      { path: "/admin/photos/new", element: <AdminPhotoCreatePage /> },
      { path: "/admin/photos/:id", element: <AdminPhotoEditPage /> },
    ],
  },
]);
