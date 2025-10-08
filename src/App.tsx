import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { SignInForm } from "./SignInForm";
import { SignOutButton } from "./SignOutButton";
import { Toaster } from "sonner";
import { useState } from "react";
import PublicSite from "./components/PublicSite";
import AdminPanel from "./components/AdminPanel";

export default function App() {
  const [currentView, setCurrentView] = useState<"public" | "admin">("public");
  const loggedInUser = useQuery(api.auth.loggedInUser);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <h1 className="text-xl font-bold text-blue-600">Bio-Remediasi Platform</h1>
            <nav className="flex gap-4">
              <button
                onClick={() => setCurrentView("public")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentView === "public"
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:text-blue-600"
                }`}
              >
                Situs Publik
              </button>
              <Authenticated>
                <button
                  onClick={() => setCurrentView("admin")}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    currentView === "admin"
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-600 hover:text-blue-600"
                  }`}
                >
                  Panel Admin
                </button>
              </Authenticated>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <Authenticated>
              <span className="text-sm text-gray-600">
                {loggedInUser?.email}
              </span>
            </Authenticated>
            <Unauthenticated>
              <button
                onClick={() => setCurrentView("admin")}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Login Admin
              </button>
            </Unauthenticated>
            <Authenticated>
              <SignOutButton />
            </Authenticated>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {currentView === "public" ? (
          <PublicSite />
        ) : (
          <Authenticated>
            <AdminPanel />
          </Authenticated>
        )}
        
        <Unauthenticated>
          {currentView === "admin" && (
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="w-full max-w-md mx-auto p-6">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Login Admin</h2>
                  <p className="text-gray-600">Masuk untuk mengakses panel admin</p>
                </div>
                <SignInForm />
              </div>
            </div>
          )}
        </Unauthenticated>
      </main>
      
      <Toaster />
    </div>
  );
}
