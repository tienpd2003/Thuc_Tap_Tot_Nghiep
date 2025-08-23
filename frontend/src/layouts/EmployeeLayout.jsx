import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function EmployeeLayout() {
  return (
    <div className="flex flex-col h-screen">
      <Header role="employee" />

      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="container mx-auto px-8 py-8 max-w-7xl">
            <Outlet />
          </div>
          <Footer />
        </main>
        
      </div>
    </div>
  );
}
