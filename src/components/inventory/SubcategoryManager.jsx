import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { STORES } from "../../utils/constants";

export default function SubcategoryManager() {
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
  const [form, setForm] = useState({ name: "", nameEn: "", categoryId: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.categoryId) {
      alert("براہ کرم نام اور زمرہ منتخب کریں");
      return;
    }
    const data = {
      id: editing || generateId(),
      name: form.name,
      nameEn: form.nameEn || form.name,
      categoryId: form.categoryId,
    };
    await dbPut(STORES.SUBCATEGORIES, data);
    await refreshAll();
    setShowAdd(false);
    setEditing(null);
    setForm({ name: "", nameEn: "", categoryId: "" });
  };

  const handleDelete = async (id) => {
    const prodCount = products.filter((p) => p.subcategoryId === id).length;
    if (prodCount > 0) {
      alert("اس ذیلی زمرے میں پروڈکٹس موجود ہیں۔ پہلے انہیں حذف کریں۔");
      return;
    }
    if (confirm("کیا آپ واقعی اس ذیلی زمرے کو حذف کرنا چاہتے ہیں؟")) {
      await dbDelete(STORES.SUBCATEGORIES, id);
      await refreshAll();
    }
  };

  const handleEdit = (sub) => {
    setEditing(sub.id);
    setForm({
      name: sub.name,
      nameEn: sub.nameEn || "",
      categoryId: sub.categoryId,
    });
    setShowAdd(true);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold urdu-text">📁 ذیلی زمرہ جات</h1>
        <button
          className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold urdu-text hover:bg-blue-700 transition flex items-center gap-2"
          onClick={() => {
            setShowAdd(true);
            setEditing(null);
            setForm({ name: "", nameEn: "", categoryId: "" });
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
          نیا ذیلی زمرہ
        </button>
      </div>

      {showAdd && (
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 fade-in">
          <h3 className="font-bold text-lg urdu-text mb-4">
            {editing ? "ذیلی زمرہ میں ترمیم کریں" : "نیا ذیلی زمرہ شامل کریں"}
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
            <div className="col-span-2">
              <label className="block text-sm text-gray-600 urdu-text mb-1">
                زمرہ *
              </label>
              <select
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none urdu-text"
                value={form.categoryId}
                onChange={(e) =>
                  setForm({ ...form, categoryId: e.target.value })
                }
              >
                <option value="">منتخب کریں</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
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
                  زمرہ
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
              {subcategories.map((sub) => {
                const cat = categories.find((c) => c.id === sub.categoryId);
                const prodCount = products.filter(
                  (p) => p.subcategoryId === sub.id,
                ).length;
                return (
                  <tr key={sub.id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3 urdu-text font-medium">
                      {sub.name}
                    </td>
                    <td className="px-4 py-3 text-sm">{sub.nameEn || "—"}</td>
                    <td className="px-4 py-3 urdu-text text-sm">
                      {cat ? cat.name : "—"}
                    </td>
                    <td className="px-4 py-3 text-sm">{prodCount}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          className="text-blue-600 hover:text-blue-800 p-1"
                          onClick={() => handleEdit(sub)}
                        >
                          ✏️
                        </button>
                        <button
                          className="text-red-500 hover:text-red-700 p-1"
                          onClick={() => handleDelete(sub.id)}
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
