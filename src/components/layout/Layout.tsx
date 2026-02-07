import "../../index.css";
import { AuthProvider } from "../../context/AuthContext";
import { Header } from "../Header/Header";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <Header />
      {children}
    </AuthProvider>
  );
}
