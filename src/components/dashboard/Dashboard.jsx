import React, { useState, useMemo } from "react";
import { useApp } from "../../context/AppContext";
import { formatCurrency } from "../../utils/helpers";

export default function Dashboard() {
  const { sales, products, clients, suppliers, purchases } = useApp();
  const [period, setPeriod] = useState("daily");

  const periodSales = useMemo(() => {
    const now = Date.now();
    let start = now;
    if (period === "daily") start = now - 86400000;
    else if (period === "weekly") start = now - 7 * 86400000;
    else if (period === "monthly") start = now - 30 * 86400000;
    return sales.filter((s) => s.date >= start);
  }, [sales, period]);

  const totalRevenue = periodSales.reduce((sum, s) => sum + s.total, 0);
  const totalSales = periodSales.length;
  const totalItems = periodSales.reduce(
    (sum, s) => sum + s.items.reduce((a, i) => a + i.qty, 0),
    0,
  );
  const avgOrder = totalSales > 0 ? totalRevenue / totalSales : 0;

  const productSales = {};
  sales.forEach((s) => {
    s.items.forEach((item) => {
      if (!productSales[item.productId]) {
        productSales[item.productId] = {
          name: item.productName,
          qty: 0,
          revenue: 0,
        };
      }
      productSales[item.productId].qty += item.qty;
      productSales[item.productId].revenue += item.total;
    });
  });
  const topProducts = Object.values(productSales)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 10);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold urdu-text">📊 ڈیش بورڈ</h1>
      <div className="flex gap-3">
        {["daily", "weekly", "monthly"].map((p) => (
          <button
            key={p}
            className={`tab-btn urdu-text ${period === p ? "active" : ""}`}
            onClick={() => setPeriod(p)}
          >
            {p === "daily" ? "روزانہ" : p === "weekly" ? "ہفتہ وار" : "ماہانہ"}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="stat-card">
          <div className="label urdu-text">کل فروخت</div>
          <div className="value">{totalSales}</div>
          <div className="sub urdu-text">
            {period === "daily"
              ? "آج"
              : period === "weekly"
                ? "اس ہفتے"
                : "اس مہینے"}
          </div>
        </div>
        <div className="stat-card">
          <div className="label urdu-text">آمدنی</div>
          <div className="value">{formatCurrency(totalRevenue)}</div>
          <div className="sub urdu-text">
            {period === "daily"
              ? "آج"
              : period === "weekly"
                ? "اس ہفتے"
                : "اس مہینے"}
          </div>
        </div>
        <div className="stat-card">
          <div className="label urdu-text">اوسط آرڈر</div>
          <div className="value">{formatCurrency(avgOrder)}</div>
          <div className="sub urdu-text">فی فروخت</div>
        </div>
        <div className="stat-card">
          <div className="label urdu-text">کل آئٹمز</div>
          <div className="value">{totalItems}</div>
          <div className="sub urdu-text">فروخت شدہ</div>
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="stat-card">
          <h3 className="font-bold urdu-text mb-3">🏆 سب سے زیادہ فروخت</h3>
          <div className="space-y-2">
            {topProducts.length === 0 ? (
              <p className="text-gray-400 urdu-text">کوئی ڈیٹا نہیں</p>
            ) : (
              topProducts.map((p, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center border-b border-gray-100 py-2 urdu-text"
                >
                  <span>{p.name}</span>
                  <span className="text-blue-600 font-semibold">
                    {formatCurrency(p.revenue)} ({p.qty})
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
        <div className="stat-card">
          <h3 className="font-bold urdu-text mb-3">📋 خلاصہ</h3>
          <div className="space-y-2 urdu-text">
            <div className="flex justify-between">
              <span>کل پروڈکٹس:</span>
              <span className="font-semibold">{products.length}</span>
            </div>
            <div className="flex justify-between">
              <span>کل کلائنٹس:</span>
              <span className="font-semibold">{clients.length}</span>
            </div>
            <div className="flex justify-between">
              <span>کل سپلائرز:</span>
              <span className="font-semibold">{suppliers.length}</span>
            </div>
            <div className="flex justify-between">
              <span>کل خریداری:</span>
              <span className="font-semibold">{purchases.length}</span>
            </div>
            <div className="flex justify-between">
              <span>کل فروخت:</span>
              <span className="font-semibold">{sales.length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
