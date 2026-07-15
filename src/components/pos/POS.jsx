import React, { useState, useMemo, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import { formatCurrency } from "../../utils/helpers";
import { STORES } from "../../utils/constants";

export default function POS() {
  const {
    categories,
    subcategories,
    products,
    clients,
    refreshAll,
    dbAdd,
    dbPut,
    dbGet,
    generateId,
  } = useApp();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [cart, setCart] = useState([]);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [selectedClient, setSelectedClient] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showPrint, setShowPrint] = useState(false);
  const [currentSale, setCurrentSale] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState("");

  // Auto-select walk-in client
  useEffect(() => {
    if (clients.length > 0 && !selectedClient) {
      const walkin = clients.find((c) => c.id === "walkin") || clients[0];
      setSelectedClient(walkin);
    }
  }, [clients]);

  // Compute filtered products based on selection and search
  const filteredProducts = useMemo(() => {
    let list = products;
    if (selectedSubcategory) {
      list = list.filter((p) => p.subcategoryId === selectedSubcategory);
    } else if (selectedCategory) {
      const subIds = subcategories
        .filter((s) => s.categoryId === selectedCategory)
        .map((s) => s.id);
      list = list.filter((p) => subIds.includes(p.subcategoryId));
    }
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.nameEn.toLowerCase().includes(q) ||
          p.barcode?.includes(q),
      );
    }
    return list;
  }, [
    products,
    selectedCategory,
    selectedSubcategory,
    subcategories,
    searchQuery,
  ]);

  // Categories with product counts
  const categoryItems = useMemo(() => {
    return categories.map((c) => ({
      ...c,
      subCount: subcategories.filter((s) => s.categoryId === c.id).length,
      productCount: products.filter((p) => {
        const subs = subcategories
          .filter((s) => s.categoryId === c.id)
          .map((s) => s.id);
        return subs.includes(p.subcategoryId);
      }).length,
    }));
  }, [categories, subcategories, products]);

  // Subcategories for the selected category
  const subcategoryItems = useMemo(() => {
    if (!selectedCategory) return [];
    return subcategories
      .filter((s) => s.categoryId === selectedCategory)
      .map((s) => ({
        ...s,
        productCount: products.filter((p) => p.subcategoryId === s.id).length,
      }));
  }, [subcategories, selectedCategory, products]);

  // Cart calculations
  const cartTotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  }, [cart]);

  const discountAmount = useMemo(() => {
    return (cartTotal * discountPercent) / 100;
  }, [cartTotal, discountPercent]);

  const netTotal = cartTotal - discountAmount;

  // Cart operations
  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.productId === product.id);
      if (existing) {
        return prev.map((item) =>
          item.productId === product.id ? { ...item, qty: item.qty + 1 } : item,
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          productName: product.name,
          price: product.price,
          qty: 1,
          stock: product.stock,
        },
      ];
    });
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.productId !== productId));
  };

  const updateQty = (productId, qty) => {
    if (qty < 1) return;
    setCart((prev) =>
      prev.map((item) =>
        item.productId === productId ? { ...item, qty } : item,
      ),
    );
  };

  const clearCart = () => {
    setCart([]);
    setDiscountPercent(0);
    setSelectedClient(null);
    setPaymentAmount("");
    // re-select walk-in
    const walkin = clients.find((c) => c.id === "walkin") || clients[0];
    setSelectedClient(walkin || null);
  };

  // Checkout
  const handleCheckout = async () => {
    if (cart.length === 0) {
      alert("کارٹ خالی ہے");
      return;
    }
    if (!selectedClient) {
      alert("براہ کرم کلائنٹ منتخب کریں");
      return;
    }
    const paid = parseFloat(paymentAmount) || netTotal;
    if (paid < netTotal) {
      alert("ادائیگی کی رقم کل سے کم ہے");
      return;
    }

    const invoiceNo = "INV-" + String(Date.now()).slice(-6);
    const sale = {
      id: generateId(),
      invoiceNo,
      clientId: selectedClient.id,
      clientName: selectedClient.name,
      items: cart.map((item) => ({
        productId: item.productId,
        productName: item.productName,
        price: item.price,
        qty: item.qty,
        total: item.price * item.qty,
      })),
      subtotal: cartTotal,
      discount: discountPercent,
      discountAmount,
      total: netTotal,
      paid: paid,
      date: Date.now(),
    };
    await dbAdd(STORES.SALES, sale);
    // Update stock
    for (const item of cart) {
      const prod = await dbGet(STORES.PRODUCTS, item.productId);
      if (prod) {
        prod.stock = (prod.stock || 0) - item.qty;
        await dbPut(STORES.PRODUCTS, prod);
      }
    }
    setCurrentSale(sale);
    setShowPrint(true);
    await refreshAll();
  };

  // Print handlers
  const handlePrint = () => {
    window.print();
    setShowPrint(false);
    clearCart();
    setCurrentSale(null);
  };

  const handleClosePrint = () => {
    setShowPrint(false);
    clearCart();
    setCurrentSale(null);
  };

  // ----- Print view -----
  if (showPrint && currentSale) {
    return (
      <div className="fixed inset-0 bg-white z-50 overflow-auto print-container">
        <div className="max-w-2xl mx-auto p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold urdu-text">📄 رسید / Invoice</h2>
            <p className="text-gray-500 urdu-text">
              نمبر: {currentSale.invoiceNo}
            </p>
            <p className="text-gray-500 urdu-text">
              تاریخ: {new Date(currentSale.date).toLocaleDateString("ur-PK")}
            </p>
            <p className="text-gray-500 urdu-text">
              کلائنٹ: {currentSale.clientName}
            </p>
          </div>
          <div className="border-t border-b py-3 my-4">
            <div className="flex justify-between font-bold urdu-text">
              <span>پروڈکٹ</span>
              <span>مقدار</span>
              <span>قیمت</span>
              <span>کل</span>
            </div>
            {currentSale.items.map((item, i) => (
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
            <div className="flex justify-between urdu-text">
              <span>ذیلی کل:</span>
              <span>{formatCurrency(currentSale.subtotal)}</span>
            </div>
            {currentSale.discount > 0 && (
              <div className="flex justify-between text-green-600 urdu-text">
                <span>چھوٹ ({currentSale.discount}%)</span>
                <span>-{formatCurrency(currentSale.discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-xl border-t-2 border-black pt-2 urdu-text">
              <span>کل:</span>
              <span>{formatCurrency(currentSale.total)}</span>
            </div>
            <div className="flex justify-between text-blue-600 urdu-text">
              <span>ادائیگی:</span>
              <span>{formatCurrency(currentSale.paid)}</span>
            </div>
            <div className="flex justify-between text-gray-500 urdu-text">
              <span>باقی:</span>
              <span>
                {formatCurrency(currentSale.paid - currentSale.total)}
              </span>
            </div>
          </div>
          <div className="text-center mt-8 text-gray-400 urdu-text">
            شکریہ! آپ کا دورہ مبارک ہو
          </div>
          <div className="flex gap-4 mt-8 no-print">
            <button
              className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold urdu-text"
              onClick={handlePrint}
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

  // ----- Main POS UI -----
  return (
    <div className="flex gap-6 p-6">
      {/* Left: Category/Subcategory/Product Grids stacked */}
      <div className="flex-1">
        {/* Search Bar and Client Selector */}
        <div className="mb-4 flex gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none urdu-text"
              placeholder="🔍 پروڈکٹ تلاش کریں..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <select
            className="px-4 py-3 rounded-xl border border-gray-200 bg-white urdu-text"
            value={selectedClient?.id || ""}
            onChange={(e) => {
              const c = clients.find((cl) => cl.id === e.target.value);
              setSelectedClient(c || null);
            }}
          >
            <option value="">کلائنٹ منتخب کریں</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Category Grid - always visible */}
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-gray-500 urdu-text mb-2">
            زمرہ جات
          </h3>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
            {categoryItems.map((cat) => (
              <div
                key={cat.id}
                className={`grid-card text-center urdu-text ${selectedCategory === cat.id ? "selected" : ""}`}
                onClick={() => {
                  // Toggle: if same category, deselect; else select
                  setSelectedCategory((prev) =>
                    prev === cat.id ? null : cat.id,
                  );
                  setSelectedSubcategory(null); // clear subcategory when category changes
                }}
              >
                <div className="text-3xl mb-2">📂</div>
                <div className="font-semibold text-base">{cat.name}</div>
                <div className="text-xs text-gray-400 mt-1">
                  {cat.productCount} پروڈکٹس
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Subcategory Grid - visible only if a category is selected */}
        {selectedCategory && (
          <div className="mb-4 fade-in">
            <h3 className="text-sm font-semibold text-gray-500 urdu-text mb-2">
              ذیلی زمرہ جات —{" "}
              {categories.find((c) => c.id === selectedCategory)?.name || ""}
            </h3>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
              {subcategoryItems.map((sub) => (
                <div
                  key={sub.id}
                  className={`grid-card text-center urdu-text ${selectedSubcategory === sub.id ? "selected" : ""}`}
                  onClick={() => {
                    setSelectedSubcategory((prev) =>
                      prev === sub.id ? null : sub.id,
                    );
                  }}
                >
                  <div className="text-2xl mb-2">📁</div>
                  <div className="font-semibold text-base">{sub.name}</div>
                  <div className="text-xs text-gray-400 mt-1">
                    {sub.productCount} پروڈکٹس
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Product Grid - visible if subcategory selected OR search is active */}
        {(selectedSubcategory || searchQuery.trim()) && (
          <div className="fade-in">
            <h3 className="text-sm font-semibold text-gray-500 urdu-text mb-2">
              {searchQuery.trim()
                ? "نتائج تلاش"
                : selectedSubcategory
                  ? subcategories.find((s) => s.id === selectedSubcategory)
                      ?.name || "پروڈکٹس"
                  : "پروڈکٹس"}
            </h3>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
              {filteredProducts.length === 0 ? (
                <p className="col-span-full text-center text-gray-400 urdu-text py-4">
                  کوئی پروڈکٹ نہیں
                </p>
              ) : (
                filteredProducts.map((prod) => (
                  <div
                    key={prod.id}
                    className="product-card urdu-text"
                    onClick={() => addToCart(prod)}
                  >
                    <div className="text-2xl mb-1">📦</div>
                    <div className="font-semibold text-sm">{prod.name}</div>
                    <div className="text-blue-600 font-bold mt-1">
                      {formatCurrency(prod.price)}
                    </div>
                    <div className="text-xs text-gray-400">
                      اسٹاک: {prod.stock || 0}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* If no category selected and no search, show a hint */}
        {!selectedCategory && !searchQuery.trim() && (
          <div className="text-center text-gray-400 urdu-text mt-8">
            براہ کرم زمرہ منتخب کریں یا تلاش کریں
          </div>
        )}
      </div>

      {/* Right: Cart - unchanged */}
      <div className="w-96 bg-white rounded-2xl shadow-lg p-5 h-[calc(100vh-3rem)] sticky top-6 flex flex-col no-print">
        <h2 className="text-xl font-bold urdu-text mb-4">🛒 کارٹ</h2>
        <div className="flex-1 overflow-y-auto scrollbar-thin">
          {cart.length === 0 ? (
            <p className="text-gray-400 text-center py-10 urdu-text">
              کارٹ خالی ہے
            </p>
          ) : (
            cart.map((item) => (
              <div key={item.productId} className="cart-item urdu-text">
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate">
                    {item.productName}
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatCurrency(item.price)} × {item.qty}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-sm font-bold"
                    onClick={() => updateQty(item.productId, item.qty - 1)}
                  >
                    −
                  </button>
                  <span className="w-8 text-center font-semibold">
                    {item.qty}
                  </span>
                  <button
                    className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-sm font-bold"
                    onClick={() => updateQty(item.productId, item.qty + 1)}
                  >
                    +
                  </button>
                  <button
                    className="w-7 h-7 rounded-full bg-red-50 hover:bg-red-100 text-red-500 flex items-center justify-center"
                    onClick={() => removeFromCart(item.productId)}
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="border-t pt-4 space-y-3">
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500 urdu-text">چھوٹ %</span>
            <input
              type="number"
              className="w-24 px-3 py-1.5 rounded-lg border border-gray-200 text-center urdu-text"
              value={discountPercent}
              onChange={(e) =>
                setDiscountPercent(Math.max(0, parseFloat(e.target.value) || 0))
              }
              min="0"
              max="100"
            />
            <span className="text-sm text-gray-400 urdu-text">
              {formatCurrency(discountAmount)}
            </span>
          </div>
          <div className="flex justify-between text-sm urdu-text">
            <span>ذیلی کل:</span>
            <span>{formatCurrency(cartTotal)}</span>
          </div>
          <div className="flex justify-between font-bold text-lg urdu-text">
            <span>کل:</span>
            <span className="text-blue-600">{formatCurrency(netTotal)}</span>
          </div>
          <div className="flex gap-2">
            <input
              type="number"
              className="flex-1 px-3 py-2 rounded-lg border border-gray-200 urdu-text"
              placeholder="ادائیگی کی رقم"
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(e.target.value)}
            />
            <button
              className="px-3 py-2 bg-gray-100 rounded-lg text-sm urdu-text"
              onClick={() => setPaymentAmount(String(netTotal))}
            >
              پورا
            </button>
          </div>
          <div className="flex gap-3">
            <button
              className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold urdu-text hover:bg-blue-700 transition"
              onClick={handleCheckout}
            >
              ✅ چیک آؤٹ
            </button>
            <button
              className="px-4 bg-red-50 text-red-500 rounded-xl font-bold urdu-text hover:bg-red-100 transition"
              onClick={clearCart}
            >
              🗑️
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
