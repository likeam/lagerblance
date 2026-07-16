import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { formatCurrency } from "../../utils/helpers";
import { STORES } from "../../utils/constants";

export default function Clients() {
  const { clients, sales, refreshAll, dbPut, dbDelete, generateId } = useApp();
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    balance: "",
  });
  const [showBalanceModal, setShowBalanceModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [balanceAmount, setBalanceAmount] = useState("");
  const [balanceNote, setBalanceNote] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name) {
      alert("براہ کرم نام درج کریں");
      return;
    }
    const data = {
      id: editing || generateId(),
      name: form.name,
      phone: form.phone || "",
      address: form.address || "",
      balance: parseFloat(form.balance) || 0,
    };
    await dbPut(STORES.CLIENTS, data);
    await refreshAll();
    setShowAdd(false);
    setEditing(null);
    setForm({ name: "", phone: "", address: "", balance: "" });
  };

  const handleDelete = async (id) => {
    if (id === "walkin") {
      alert("واک ان کسٹمر کو حذف نہیں کر سکتے");
      return;
    }
    if (confirm("کیا آپ واقعی اس کلائنٹ کو حذف کرنا چاہتے ہیں؟")) {
      await dbDelete(STORES.CLIENTS, id);
      await refreshAll();
    }
  };

  const handleBalanceAdjust = async (e) => {
    e.preventDefault();
    const amount = parseFloat(balanceAmount);
    if (isNaN(amount) || amount === 0) {
      alert("درست رقم درج کریں");
      return;
    }
    const updatedClient = { ...selectedClient };
    updatedClient.balance = (updatedClient.balance || 0) + amount;
    await dbPut(STORES.CLIENTS, updatedClient);
    await refreshAll();
    setShowBalanceModal(false);
    setSelectedClient(null);
    setBalanceAmount("");
    setBalanceNote("");
  };

  const openBalanceModal = (client) => {
    setSelectedClient(client);
    setBalanceAmount("");
    setBalanceNote("");
    setShowBalanceModal(true);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold urdu-text">👥 کلائنٹس</h1>
        <button
          className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold urdu-text hover:bg-blue-700 transition flex items-center gap-2"
          onClick={() => {
            setShowAdd(true);
            setEditing(null);
            setForm({ name: "", phone: "", address: "", balance: "" });
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
          نیا کلائنٹ
        </button>
      </div>

      {showAdd && (
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 fade-in">
          <h3 className="font-bold text-lg urdu-text mb-4">
            {editing ? "کلائنٹ میں ترمیم کریں" : "نیا کلائنٹ شامل کریں"}
          </h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <div className="col-span-2 md:col-span-1">
              <label className="block text-sm text-gray-600 urdu-text mb-1">
                نام *
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
                فون
              </label>
              <input
                type="text"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm text-gray-600 urdu-text mb-1">
                پتہ
              </label>
              <input
                type="text"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none urdu-text"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
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

      {/* Balance Adjustment Modal */}
      {showBalanceModal && selectedClient && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-xl font-bold urdu-text mb-4">
              بیلنس میں اضافہ
            </h3>
            <p className="urdu-text text-gray-600 mb-2">
              کلائنٹ: {selectedClient.name}
            </p>
            <form onSubmit={handleBalanceAdjust}>
              <div className="mb-4">
                <label className="block text-sm text-gray-600 urdu-text mb-1">
                  رقم (مثبت = اضافہ، منفی = کمی)
                </label>
                <input
                  type="number"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                  value={balanceAmount}
                  onChange={(e) => setBalanceAmount(e.target.value)}
                  step="any"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm text-gray-600 urdu-text mb-1">
                  نوٹ (اختیاری)
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none urdu-text"
                  value={balanceNote}
                  onChange={(e) => setBalanceNote(e.target.value)}
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2.5 rounded-xl font-bold urdu-text hover:bg-blue-700 transition"
                >
                  محفوظ کریں
                </button>
                <button
                  type="button"
                  className="flex-1 bg-gray-200 text-gray-700 py-2.5 rounded-xl font-bold urdu-text hover:bg-gray-300 transition"
                  onClick={() => {
                    setShowBalanceModal(false);
                    setSelectedClient(null);
                  }}
                >
                  منسوخ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Clients Table */}
      <div className="bg-white rounded-2xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr className="text-right">
                <th className="px-4 py-3 text-sm font-semibold text-gray-600 urdu-text">
                  نام
                </th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-600 urdu-text">
                  فون
                </th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-600 urdu-text">
                  پتہ
                </th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-600 urdu-text">
                  بیلنس (کریڈٹ)
                </th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-600 urdu-text">
                  کل خریداری
                </th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-600 urdu-text">
                  فروخت کی تعداد
                </th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-600 urdu-text">
                  عمل
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {clients.map((c) => {
                const totalSales = sales
                  .filter((s) => s.clientId === c.id)
                  .reduce((sum, s) => sum + s.total, 0);
                const count = sales.filter((s) => s.clientId === c.id).length;
                return (
                  <tr key={c.id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3 urdu-text font-medium">
                      {c.name}
                    </td>
                    <td className="px-4 py-3 text-sm">{c.phone || "—"}</td>
                    <td className="px-4 py-3 text-sm urdu-text">
                      {c.address || "—"}
                    </td>
                    <td className="px-4 py-3 font-bold text-blue-600">
                      {formatCurrency(c.balance || 0)}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {formatCurrency(totalSales)}
                    </td>
                    <td className="px-4 py-3 text-sm">{count}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2 flex-wrap">
                        <button
                          className="text-green-600 hover:text-green-800 p-1 text-xs"
                          onClick={() => openBalanceModal(c)}
                          title="بیلنس میں اضافہ"
                        >
                          +💰
                        </button>
                        <button
                          className="text-blue-600 hover:text-blue-800 p-1"
                          onClick={() => {
                            setEditing(c.id);
                            setForm({
                              name: c.name,
                              phone: c.phone || "",
                              address: c.address || "",
                              balance: c.balance || "",
                            });
                            setShowAdd(true);
                          }}
                        >
                          ✏️
                        </button>
                        {c.id !== "walkin" && (
                          <button
                            className="text-red-500 hover:text-red-700 p-1"
                            onClick={() => handleDelete(c.id)}
                          >
                            🗑️
                          </button>
                        )}
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
