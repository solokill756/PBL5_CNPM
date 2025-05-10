import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Provider } from "@/components/ui/provider";
import { AuthProvider } from "./context/AuthProvider";
import { ToastContainer } from "react-toastify";
// import { AuthProvider } from './hooks/AuthContext';
// import { AuthProvider } from './hooks/useAuth';

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <Provider>
        <App />
        <ToastContainer
          toastClassName="!bg-white !text-gray-800 !text-base !font-medium !rounded-xl !shadow-lg border border-gray-200"
          bodyClassName="!text-sm leading-relaxed"
        />
      </Provider>
    </AuthProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
