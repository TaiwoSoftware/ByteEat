import { Link } from "react-router-dom";

export const AdminDashboard = () => {
    return (
      <div className="min-h-screen bg-gray-100 flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Admin Panel</h2>
          <nav className="space-y-4">
            <Link to="#" className="block text-gray-700 hover:text-orange-600">Dashboard</Link>
            <Link to="#" className="block text-gray-700 hover:text-orange-600">Users</Link>
            <Link to="#" className="block text-gray-700 hover:text-orange-600">Vendors</Link>
            <Link to="#" className="block text-gray-700 hover:text-orange-600">Content</Link>
            <Link to="#" className="block text-gray-700 hover:text-orange-600">Security</Link>
            <Link to="#" className="block text-gray-700 hover:text-orange-600">Settings</Link>
          </nav>
        </aside>
  
        {/* Main Content */}
        <main className="flex-1 p-10">
          <h1 className="text-2xl font-bold mb-6">Welcome, Admin</h1>
          {/* Add dashboard widgets or routed pages here */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">Total Users</div>
            <div className="bg-white p-6 rounded-lg shadow">Total Vendors</div>
            <div className="bg-white p-6 rounded-lg shadow">System Status</div>
          </div>
        </main>
      </div>
    );
  };
  