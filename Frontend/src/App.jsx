import { useState } from "react";
import ConvertPage from "./pages/ConvertPage";
import QuickSearchPage from "./pages/QuickSearchPage";

export default function App() {
  const [activePage, setActivePage] = useState("dropdown");

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="pt-12 pb-4 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{
                background:
                  "linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)",
                boxShadow: "0 8px 24px rgba(139, 92, 246, 0.35)",
              }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </div>
            <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-purple-300">
              Address Converter
            </h1>
          </div>
          <p className="text-slate-400 text-base">
            Tra cứu thay đổi địa giới hành chính Việt Nam
          </p>
          <p className="text-slate-500 text-sm mt-1">
            Theo nghị quyết sáp nhập xã phường chính thức
          </p>
        </div>
      </header>

      {/* Page navigation */}
      <nav className="flex justify-center gap-2 px-4 pb-6">
        <button
          id="nav-dropdown"
          className={`nav-btn ${activePage === "dropdown" ? "active" : ""}`}
          onClick={() => setActivePage("dropdown")}
        >
          <span className="flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 6h18M3 12h18M3 18h18" />
            </svg>
            Tra cứu Dropdown
          </span>
        </button>
        <button
          id="nav-quick-search"
          className={`nav-btn ${activePage === "quick-search" ? "active" : ""}`}
          onClick={() => setActivePage("quick-search")}
        >
          <span className="flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            Tìm kiếm nhanh
          </span>
        </button>
      </nav>

      {/* Main */}
      <main className="flex-1 px-4 pb-12">
        {activePage === "dropdown" ? <ConvertPage /> : <QuickSearchPage />}
      </main>

      {/* Footer */}
      <footer className="py-6 text-center">
        <p className="text-xs text-slate-600">
          Mini Project Internship — Address Converter © 2025
        </p>
      </footer>
    </div>
  );
}
