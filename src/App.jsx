import React, { useState } from "react";
import { AppProvider } from "./context/AppContext";
import Sidebar from "./components/common/Sidebar";
import POS from "./components/pos/POS";
import Dashboard from "./components/dashboard/Dashboard";
import Inventory from "./components/inventory/Inventory";
import CategoryManager from "./components/inventory/CategoryManager";
import SubcategoryManager from "./components/inventory/SubcategoryManager";
import Clients from "./components/clients/Clients";
import Suppliers from "./components/suppliers/Suppliers";
import Purchases from "./components/purchases/Purchases";
import SalesHistory from "./components/sales/SalesHistory"; // NEW

function App() {
  const [activeTab, setActiveTab] = useState("pos");

  const renderContent = () => {
    switch (activeTab) {
      case "pos":
        return <POS />;
      case "dashboard":
        return <Dashboard />;
      case "inventory":
        return <Inventory />;
      case "categories":
        return <CategoryManager />;
      case "subcategories":
        return <SubcategoryManager />;
      case "clients":
        return <Clients />;
      case "suppliers":
        return <Suppliers />;
      case "purchases":
        return <Purchases />;
      case "sales":
        return <SalesHistory />; // NEW
      default:
        return <POS />;
    }
  };

  return (
    <AppProvider>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="flex-1 overflow-auto">{renderContent()}</div>
      </div>
    </AppProvider>
  );
}

export default App;
