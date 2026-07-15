import React from "react";
import Icon from "./Icon";

export default function Sidebar({ activeTab, setActiveTab }) {
  const items = [
    { key: "pos", label: "پوائنٹ آف سیل", icon: "shopping" },
    { key: "dashboard", label: "ڈیش بورڈ", icon: "chart" },
    { key: "inventory", label: "پروڈکٹس", icon: "box" },
    { key: "categories", label: "زمرہ جات", icon: "folder" },
    { key: "subcategories", label: "ذیلی زمرہ جات", icon: "folder-open" },
    { key: "clients", label: "کلائنٹس", icon: "users" },
    { key: "suppliers", label: "سپلائرز", icon: "truck" },
    { key: "sales", label: "فروخت کی تاریخ", icon: "file" }, // NEW
    { key: "purchases", label: "خریداری", icon: "file" },
  ];

  return (
    <div className="w-64 bg-white border-l border-gray-200 h-screen sticky top-0 overflow-y-auto no-print">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-blue-600 urdu-text">
          📦 نظام POS
        </h1>
      </div>
      <nav className="p-3 space-y-1">
        {items.map((item) => (
          <div
            key={item.key}
            className={`sidebar-link ${activeTab === item.key ? "active" : ""}`}
            onClick={() => setActiveTab(item.key)}
          >
            <Icon name={item.icon} />
            <span className="urdu-text">{item.label}</span>
          </div>
        ))}
      </nav>
    </div>
  );
}
