import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { STORES } from "../../utils/constants";

export default function CategoryManager() {
  const {
    categories,
    subcategories,
    products,
    refreshAll,
    dbAdd,
    dbPut,
    dbDelete,
    generateId,
  } = useApp();
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "", nameEn: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name) {
      alert("براہ کرم نام درج کریں");
      return;
    }
    const data = {
      id: editing || generateId(),
      name: form.name,
      nameEn: form.nameEn || form.name,
    };
    await dbPut(STORES.CATEGORIES, data);
    await refreshAll();
    setShowAdd(false);
    setEditing(null);
    setForm({ name: "", nameEn: "" });
  };

  const handleDelete = async (id) => {
    const subCount = subcategories.filter((s) => s.categoryId === id).length;
    const productCount = products.filter((p) => {
      const subIds = subcategories
        .filter((s) => s.categoryId === id)
        .map((s) => s.id);
      return subIds.includes(p.subcategoryId);
    }).length;
    if (subCount > 0 || productCount > 0) {
      alert("اس زمرے میں ذیلی زمرے یا پروڈکٹس موجود ہیں۔ پہلے انہیں حذف کریں۔");
      return;
    }
    if (confirm("کیا آپ واقعی اس زمرے کو حذف کرنا چاہتے ہیں؟")) {
      await dbDelete(STORES.CATEGORIES, id);
      await refreshAll();
    }
  };

  const handleEdit = (cat) => {
    setEditing(cat.id);
    setForm({ name: cat.name, nameEn: cat.nameEn || "" });
    setShowAdd(true);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold urdu-text">📂 زمرہ جات</h1>
        <button
          className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold urdu-text hover:bg-blue-700 transition flex items-center gap-2"
          onClick={() => {
            setShowAdd(true);
            setEditing(null);
            setForm({ name: "", nameEn: "" });
          }}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
          نیا زمرہ
        </button>
      </div>

      {showAdd && (
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 fade-in">
          <h3 className="font-bold text-lg urdu-text mb-4">
            {editing ? "زمرہ میں ترمیم کریں" : "نیا زمرہ شامل کریں"}
          </h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <div className="col-span-2 md:col-span-1">
              <label className="block text-sm text-gray-600 urdu-text mb-1">
                نام (اردو) *
              </label>
              <input
                type="text"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none urdu-text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="col-span-2 md:col-span-1">
              <label className="block text-sm text-gray-600 urdu-text mb-1">
                نام (انگریزی)
              </label>
              <input
                type="text"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                value={form.nameEn}
                onChange={(e) => setForm({ ...form, nameEn: e.target.value })}
              />
            </div>
            <div className="col-span-2 flex gap-3 mt-2">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold urdu-text hover:bg-blue-700 transition"
              >
                {editing ? "اپ ڈیٹ کریں" : "شامل کریں"}
              </button>
              <button
                type="button"
                className="bg-gray-200 text-gray-700 px-6 py-2.5 rounded-xl font-bold urdu-text hover:bg-gray-300 transition"
                onClick={() => {
                  setShowAdd(false);
                  setEditing(null);
                }}
              >
                منسوخ کریں
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr className="text-right">
                <th className="px-4 py-3 text-sm font-semibold text-gray-600 urdu-text">
                  نام (اردو)
                </th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-600 urdu-text">
                  نام (انگریزی)
                </th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-600 urdu-text">
                  ذیلی زمرے
                </th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-600 urdu-text">
                  پروڈکٹس
                </th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-600 urdu-text">
                  عمل
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {categories.map((cat) => {
                const subCount = subcategories.filter(
                  (s) => s.categoryId === cat.id,
                ).length;
                const prodCount = products.filter((p) => {
                  const subIds = subcategories
                    .filter((s) => s.categoryId === cat.id)
                    .map((s) => s.id);
                  return subIds.includes(p.subcategoryId);
                }).length;
                return (
                  <tr key={cat.id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3 urdu-text font-medium">
                      {cat.name}
                    </td>
                    <td className="px-4 py-3 text-sm">{cat.nameEn || "—"}</td>
                    <td className="px-4 py-3 text-sm">{subCount}</td>
                    <td className="px-4 py-3 text-sm">{prodCount}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          className="text-blue-600 hover:text-blue-800 p-1"
                          onClick={() => handleEdit(cat)}
                        >
                          ✏️
                        </button>
                        <button
                          className="text-red-500 hover:text-red-700 p-1"
                          onClick={() => handleDelete(cat.id)}
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
