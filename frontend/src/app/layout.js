import { AuthProvider } from "./context/AuthContext";
import "./globals.css";
import 'bootstrap/dist/css/bootstrap.min.css'
import Script from "next/script";

export const metadata = {
  title: "ElanTech",
  description: "Role Management",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" />
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
