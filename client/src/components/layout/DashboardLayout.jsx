import { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

function DashboardLayout({ children }) {
  const [activePage, setActivePage] = useState("Overview");

  return (
    <div className="min-h-screen bg-[#f8f9fc]">
      {/* Sidebar */}
      <Sidebar
        activePage={activePage}
        onNavigate={setActivePage}
      />

      {/* Main content area */}
      <div className="min-h-screen lg:pl-64">
        <Header activePage={activePage} />

        <main className="mx-auto w-full max-w-[1600px] p-5 sm:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;