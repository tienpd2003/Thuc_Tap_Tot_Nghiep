
import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import { useState } from "react";
import Sidebar from "../components/SideBar";

export default function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const drawerWidth = 280;

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <div className="flex flex-col h-screen">
      <Header role="admin" onMenuClick={handleDrawerToggle} />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar 
          drawerWidth={drawerWidth}
          mobileOpen={mobileOpen}
          onDrawerToggle={handleDrawerToggle}
        />

        <div className="flex-1 flex flex-col overflow-hidden">
          <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
              <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}