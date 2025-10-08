import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import Dashboard from "./admin/Dashboard";
import DataManagement from "./admin/DataManagement";
import LocationManagement from "./admin/LocationManagement";
import SampleManagement from "./admin/SampleManagement";

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState("dashboard");
  
  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: "📊" },
    { id: "locations", label: "Lokasi", icon: "📍" },
    { id: "samples", label: "Sampel", icon: "🧪" },
    { id: "labdata", label: "Data Lab", icon: "🔬" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-sm border-r">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900">Panel Admin</h2>
          <p className="text-sm text-gray-600">Manajemen Data Penelitian</p>
        </div>
        <nav className="px-4 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                activeTab === tab.id
                  ? "bg-blue-50 text-blue-700 border border-blue-200"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <span className="text-lg">{tab.icon}</span>
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {activeTab === "dashboard" && <Dashboard />}
          {activeTab === "locations" && <LocationManagement />}
          {activeTab === "samples" && <SampleManagement />}
          {activeTab === "labdata" && <DataManagement />}
        </div>
      </div>
    </div>
  );
}
