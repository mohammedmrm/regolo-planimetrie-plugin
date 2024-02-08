import { RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MainProvider } from "./contexts/context";
import "./index.css";
import router from "./router";

function App() {
  return (
    <MainProvider>
      <ToastContainer className={"top-1"} closeOnClick />
      <RouterProvider router={router} />
    </MainProvider>
  );
}

export default App;
