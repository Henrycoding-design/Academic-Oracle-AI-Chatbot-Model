// src/router.tsx
import { createBrowserRouter, Navigate } from "react-router-dom";

import App from "./App";

// utility pages
import Home from "./pages/home/Home";
import Products from "./pages/products/Products";
import Developers from "./pages/developers/Developers";
import Changelog from "./pages/changelog/Changelog";

// docs
import DocPage from "./pages/docs/DocPage";

export const Router = createBrowserRouter([
  // 🔹 Utility pages
  {
    path: "/home",
    element: <Home />,
  },
  {
    path: "/products",
    element: <Products />,
  },
  {
    path: "/developers",
    element: <Developers />,
  },
  {
    path: "/changelog",
    element: <Changelog />,
  },

  // 🔹 Docs system
  {
    path: "/docs",
    children: [
      {
        index: true,
        element: <Navigate to="/docs/getting-started" replace />,
      },
      {
        path: ":slug",
        element: <DocPage />,
      },
    ],
  },

  // 🔥 CHAT APP (catch-all LAST)
  {
    path: "/*",
    element: <App />,
  },
]);
