import Notfound from "@/components/common/notfound";
import Dashboard from "@/pages/dashboard";
import Planimetrie from "@/pages/planimetrie";
import { createBrowserRouter } from "react-router-dom";
const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Planimetrie />,
    },
    {
      path: "dashboard",
      element: <Dashboard />,
    },
    {
      path: "*",
      element: <Notfound />,
    },
  ],
  {
    basename: import.meta.env.BASE_URL,
  }
);
export default router;
