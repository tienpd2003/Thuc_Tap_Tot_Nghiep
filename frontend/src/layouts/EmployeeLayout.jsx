import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import { useAuth } from "../contexts/AuthContext";

export default function EmployeeLayout() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="flex flex-col h-screen">
      <Header 
        role="employee" 
        user={user}
        onLogout={handleLogout}
      />

      <div className="flex-1 overflow-y-auto bg-gray-50 p-6">
        <Outlet />
      </div>
    </div>
  );
}
