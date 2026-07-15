import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { formatCurrency, formatDateShort } from "../../utils/helpers";
import { STORES } from "../../utils/constants";

export default function Purchases() {
  const {
    purchases,
    suppliers,
    products,
    refreshAll,
    dbAdd,
    dbPut,
    dbGet,
    generateId,
  } = useApp();
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({
    supplierId: "",
    items: [],
    date: Date.now(),
  });
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [price, setPrice] = useState(0);
  const [showPrint, setShowPrint] = useState(false);
  const [currentPurchase, setCurrentPurchase] = useState(null);

  const handleAddItem = () => {
    if (!selectedProduct) {
      alert("پروڈکٹ منتخب کریں");
      return;
    }
    if (qty < 1) {
      alert("مقدار درست کریں");
      return;
    }
    const existing = form.items.find((i) => i.productId === selectedProduct.id);
    if (existing) {
      setForm({
        ...form,
        items: form.items.map((i) =>
          i.productId === selectedProduct.id
            ? {
                ...i,
                qty: i.qty + qty,
                total: (i.price || price) * (i.qty + qty),
              }
            : i,
        ),
      });
    } else {
      setForm({
        ...form,
        items: [
          ...form.items,
          {
            productId: selectedProduct.id,
            productName: selectedProduct.name,
            price: price || selectedProduct.price || 0,
            qty,
            total: (price || selectedProduct.price || 0) * qty,
          },
        ],
      });
    }
    setSelectedProduct(null);
    setQty(1);
    setPrice(0);
  };

  const removeItem = (productId) => {
    setForm({
      ...form,
      items: form.items.filter((i) => i.productId !== productId),
    });
  };

  const subtotal = form.items.reduce((sum, i) => sum + i.total, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.supplierId) {
      alert("سپلائر منتخب کریں");
      return;
    }
    if (form.items.length === 0) {
      alert("کم از کم ایک آئٹم شامل کریں");
      return;
    }
    const supplier = suppliers.find((s) => s.id === form.supplierId);
    const data = {
      id: generateId(),
      invoiceNo: "PUR-" + String(Date.now()).slice(-6),
      supplierId: form.supplierId,
      supplierName: supplier ? supplier.name : "",
      items: form.items,
      subtotal,
      total: subtotal,
      date: form.date || Date.now(),
    };
    await dbAdd(STORES.PURCHASES, data);
    // Update product stock
    for (const item of form.items) {
      const prod = await dbGet(STORES.PRODUCTS, item.productId);
      if (prod) {
        prod.stock = (prod.stock || 0) + item.qty;
        await dbPut(STORES.PRODUCTS, prod);
      }
    }
    await refreshAll();
    setCurrentPurchase(data);
    setShowPrint(true);
    setShowAdd(false);
    setForm({ supplierId: "", items: [], date: Date.now() });
    setSelectedProduct(null);
    setQty(1);
    setPrice(0);
  };

  const handlePrintPurchase = () => {
    window.print();
    setShowPrint(false);
    setCurrentPurchase(null);
  };

  const handleClosePrint = () => {
    setShowPrint(false);
    setCurrentPurchase(null);
  };

  if (showPrint && currentPurchase) {
    return (
      <div className="fixed inset-0 bg-white z-50 overflow-auto print-container">
        <div className="max-w-2xl mx-auto p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold urdu-text">🧾 خریداری کی رسید</h2>
            <p className="text-gray-500 urdu-text">
              نمبر: {currentPurchase.invoiceNo}
            </p>
            <p className="text-gray-500 urdu-text">
              تاریخ:{" "}
              {new Date(currentPurchase.date).toLocaleDateString("ur-PK")}
            </p>
            <p className="text-gray-500 urdu-text">
              سپلائر: {currentPurchase.supplierName}
            </p>
          </div>
          <div className="border-t border-b py-3 my-4">
            <div className="flex justify-between font-bold urdu-text">
              <span>پروڈکٹ</span>
              <span>مقدار</span>
              <span>قیمت</span>
              <span>کل</span>
            </div>
            {currentPurchase.items.map((item, i) => (
              <div
                key={i}
                className="flex justify-between py-2 border-b border-gray-100 urdu-text"
              >
                <span className="flex-1">{item.productName}</span>
                <span className="w-16 text-center">{item.qty}</span>
                <span className="w-20 text-left">
                  {formatCurrency(item.price)}
                </span>
                <span className="w-24 text-left font-semibold">
                  {formatCurrency(item.total)}
                </span>
              </div>
            ))}
          </div>
          <div className="space-y-2 text-lg">
            <div className="flex justify-between font-bold text-xl border-t-2 border-black pt-2 urdu-text">
              <span>کل:</span>
              <span>{formatCurrency(currentPurchase.total)}</span>
            </div>
          </div>
          <div className="text-center mt-8 text-gray-400 urdu-text">شکریہ!</div>
          <div className="flex gap-4 mt-8 no-print">
            <button
              className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold urdu-text"
              onClick={handlePrintPurchase}
            >
              🖨️ پرنٹ کریں
            </button>
            <button
              className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-bold urdu-text"
              onClick={handleClosePrint}
            >
              بند کریں
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold urdu-text">📄 خریداری کے بل</h1>
        <button
          className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold urdu-text hover:bg-blue-700 transition flex items-center gap-2"
          onClick={() => {
            setShowAdd(true);
            setForm({ supplierId: "", items: [], date: Date.now() });
            setSelectedProduct(null);
            setQty(1);
            setPrice(0);
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
          نیا بل
        </button>
      </div>

      {showAdd && (
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 fade-in">
          <h3 className="font-bold text-lg urdu-text mb-4">نیا خریداری بل</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm text-gray-600 urdu-text mb-1">
                  سپلائر *
                </label>
                <select
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none urdu-text"
                  value={form.supplierId}
                  onChange={(e) =>
                    setForm({ ...form, supplierId: e.target.value })
                  }
                >
                  <option value="">منتخب کریں</option>
                  {suppliers.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="w-48">
                <label className="block text-sm text-gray-600 urdu-text mb-1">
                  تاریخ
                </label>
                <input
                  type="date"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                  value={
                    form.date
                      ? new Date(form.date).toISOString().slice(0, 10)
                      : ""
                  }
                  onChange={(e) =>
                    setForm({
                      ...form,
                      date: new Date(e.target.value).getTime(),
                    })
                  }
                />
              </div>
            </div>
            <div className="flex gap-3 items-end">
              <div className="flex-1">
                <label className="block text-sm text-gray-600 urdu-text mb-1">
                  پروڈکٹ
                </label>
                <select
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none urdu-text"
                  value={selectedProduct?.id || ""}
                  onChange={(e) => {
                    const p = products.find((pr) => pr.id === e.target.value);
                    setSelectedProduct(p || null);
                    if (p) setPrice(p.price || 0);
                  }}
                >
                  <option value="">منتخب کریں</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({formatCurrency(p.price)})
                    </option>
                  ))}
                </select>
              </div>
              <div className="w-24">
                <label className="block text-sm text-gray-600 urdu-text mb-1">
                  مقدار
                </label>
                <input
                  type="number"
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-center"
                  value={qty}
                  onChange={(e) =>
                    setQty(Math.max(1, parseInt(e.target.value) || 1))
                  }
                  min="1"
                />
              </div>
              <div className="w-32">
                <label className="block text-sm text-gray-600 urdu-text mb-1">
                  قیمت (Rs)
                </label>
                <input
                  type="number"
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                  value={price}
                  onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                />
              </div>
              <button
                type="button"
                className="bg-green-600 text-white px-4 py-2.5 rounded-xl font-bold urdu-text hover:bg-green-700 transition"
                onClick={handleAddItem}
              >
                شامل کریں
              </button>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 max-h-48 overflow-y-auto">
              {form.items.length === 0 ? (
                <p className="text-gray-400 text-center urdu-text">
                  کوئی آئٹم نہیں
                </p>
              ) : (
                form.items.map((item, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center py-2 border-b border-gray-200 last:border-0 urdu-text"
                  >
                    <span className="flex-1">{item.productName}</span>
                    <span className="w-16 text-center">{item.qty}</span>
                    <span className="w-24 text-left">
                      {formatCurrency(item.price)}
                    </span>
                    <span className="w-28 text-left font-semibold">
                      {formatCurrency(item.total)}
                    </span>
                    <button
                      type="button"
                      className="text-red-500 hover:text-red-700 px-2"
                      onClick={() => removeItem(item.productId)}
                    >
                      ✕
                    </button>
                  </div>
                ))
              )}
            </div>
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold urdu-text">
                ذیلی کل: {formatCurrency(subtotal)}
              </span>
              <span className="text-xl font-bold text-blue-600 urdu-text">
                کل: {formatCurrency(subtotal)}
              </span>
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                className="bg-blue-600 text-white px-8 py-2.5 rounded-xl font-bold urdu-text hover:bg-blue-700 transition"
              >
                بل محفوظ کریں
              </button>
              <button
                type="button"
                className="bg-gray-200 text-gray-700 px-8 py-2.5 rounded-xl font-bold urdu-text hover:bg-gray-300 transition"
                onClick={() => {
                  setShowAdd(false);
                  setForm({ supplierId: "", items: [], date: Date.now() });
                  setSelectedProduct(null);
                  setQty(1);
                  setPrice(0);
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
                  بل نمبر
                </th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-600 urdu-text">
                  سپلائر
                </th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-600 urdu-text">
                  تاریخ
                </th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-600 urdu-text">
                  آئٹمز
                </th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-600 urdu-text">
                  کل
                </th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-600 urdu-text">
                  عمل
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {purchases.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3 font-medium urdu-text">
                    {p.invoiceNo}
                  </td>
                  <td className="px-4 py-3 urdu-text">
                    {p.supplierName || "—"}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {formatDateShort(p.date)}
                  </td>
                  <td className="px-4 py-3 text-sm">{p.items.length}</td>
                  <td className="px-4 py-3 font-semibold">
                    {formatCurrency(p.total)}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      className="text-blue-600 hover:text-blue-800 text-sm urdu-text"
                      onClick={() => {
                        setCurrentPurchase(p);
                        setShowPrint(true);
                      }}
                    >
                      🖨️ پرنٹ
                    </button>
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
