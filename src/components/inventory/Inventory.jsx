import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { formatCurrency } from "../../utils/helpers";
import { STORES } from "../../utils/constants";

export default function Inventory() {
  const {
    products,
    categories,
    subcategories,
    refreshAll,
    dbPut,
    dbDelete,
    generateId,
  } = useApp();
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    name: "",
    nameEn: "",
    price: "",
    stock: "",
    subcategoryId: "",
    barcode: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.subcategoryId) {
      alert("براہ کرم تمام ضروری فیلڈز پر کریں");
      return;
    }
    const data = {
      id: editing || generateId(),
      name: form.name,
      nameEn: form.nameEn || form.name,
      price: parseFloat(form.price),
      stock: parseInt(form.stock) || 0,
      subcategoryId: form.subcategoryId,
      barcode: form.barcode || "",
    };
    await dbPut(STORES.PRODUCTS, data);
    await refreshAll();
    setShowAdd(false);
    setEditing(null);
    setForm({
      name: "",
      nameEn: "",
      price: "",
      stock: "",
      subcategoryId: "",
      barcode: "",
    });
  };

  const handleDelete = async (id) => {
    if (confirm("کیا آپ واقعی اس پروڈکٹ کو حذف کرنا چاہتے ہیں؟")) {
      await dbDelete(STORES.PRODUCTS, id);
      await refreshAll();
    }
  };

  const handleEdit = (product) => {
    setEditing(product.id);
    setForm({
      name: product.name || "",
      nameEn: product.nameEn || "",
      price: product.price || "",
      stock: product.stock || "",
      subcategoryId: product.subcategoryId || "",
      barcode: product.barcode || "",
    });
    setShowAdd(true);
  };

  const getSubName = (id) => {
    const sub = subcategories.find((s) => s.id === id);
    return sub ? sub.name : "—";
  };

  const getCatName = (subId) => {
    const sub = subcategories.find((s) => s.id === subId);
    if (!sub) return "—";
    const cat = categories.find((c) => c.id === sub.categoryId);
    return cat ? cat.name : "—";
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold urdu-text">📦 انوینٹری مینجمنٹ</h1>
        <button
          className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold urdu-text hover:bg-blue-700 transition flex items-center gap-2"
          onClick={() => {
            setShowAdd(true);
            setEditing(null);
            setForm({
              name: "",
              nameEn: "",
              price: "",
              stock: "",
              subcategoryId: "",
              barcode: "",
            });
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
          نیا پروڈکٹ
        </button>
      </div>

      {showAdd && (
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 fade-in">
          <h3 className="font-bold text-lg urdu-text mb-4">
            {editing ? "پروڈکٹ میں ترمیم کریں" : "نیا پروڈکٹ شامل کریں"}
          </h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <div className="col-span-2 md:col-span-1">
              <label className="block text-sm text-gray-600 urdu-text mb-1">
                پروڈکٹ کا نام (اردو) *
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
                پروڈکٹ کا نام (انگریزی)
              </label>
              <input
                type="text"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                value={form.nameEn}
                onChange={(e) => setForm({ ...form, nameEn: e.target.value })}
              />
            </div>
            <div className="col-span-2 md:col-span-1">
              <label className="block text-sm text-gray-600 urdu-text mb-1">
                قیمت (Rs) *
              </label>
              <input
                type="number"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
              />
            </div>
            <div className="col-span-2 md:col-span-1">
              <label className="block text-sm text-gray-600 urdu-text mb-1">
                اسٹاک
              </label>
              <input
                type="number"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
              />
            </div>
            <div className="col-span-2 md:col-span-1">
              <label className="block text-sm text-gray-600 urdu-text mb-1">
                ذیلی زمرہ *
              </label>
              <select
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none urdu-text"
                value={form.subcategoryId}
                onChange={(e) =>
                  setForm({ ...form, subcategoryId: e.target.value })
                }
              >
                <option value="">منتخب کریں</option>
                {subcategories.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} (
                    {categories.find((c) => c.id === s.categoryId)?.name || ""})
                  </option>
                ))}
              </select>
            </div>
            <div className="col-span-2 md:col-span-1">
              <label className="block text-sm text-gray-600 urdu-text mb-1">
                بارکوڈ
              </label>
              <input
                type="text"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                value={form.barcode}
                onChange={(e) => setForm({ ...form, barcode: e.target.value })}
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
                  نام
                </th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-600 urdu-text">
                  زمرہ
                </th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-600 urdu-text">
                  ذیلی زمرہ
                </th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-600 urdu-text">
                  قیمت
                </th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-600 urdu-text">
                  اسٹاک
                </th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-600 urdu-text">
                  بارکوڈ
                </th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-600 urdu-text">
                  عمل
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3 urdu-text font-medium">{p.name}</td>
                  <td className="px-4 py-3 urdu-text text-sm">
                    {getCatName(p.subcategoryId)}
                  </td>
                  <td className="px-4 py-3 urdu-text text-sm">
                    {getSubName(p.subcategoryId)}
                  </td>
                  <td className="px-4 py-3 font-semibold">
                    {formatCurrency(p.price)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-bold ${(p.stock || 0) > 10 ? "bg-green-100 text-green-700" : (p.stock || 0) > 0 ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`}
                    >
                      {p.stock || 0}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {p.barcode || "—"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        className="text-blue-600 hover:text-blue-800 p-1"
                        onClick={() => handleEdit(p)}
                      >
                        ✏️
                      </button>
                      <button
                        className="text-red-500 hover:text-red-700 p-1"
                        onClick={() => handleDelete(p.id)}
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
