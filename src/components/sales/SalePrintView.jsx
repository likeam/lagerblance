import React from "react";
import { formatCurrency } from "../../utils/helpers";

export default function SalePrintView({ sale, onClose, onPrint }) {
  if (!sale) return null;

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-auto print-container">
      <div className="max-w-2xl mx-auto p-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold urdu-text">📄 رسید / Invoice</h2>
          <p className="text-gray-500 urdu-text">نمبر: {sale.invoiceNo}</p>
          <p className="text-gray-500 urdu-text">
            تاریخ: {new Date(sale.date).toLocaleDateString("ur-PK")}
          </p>
          <p className="text-gray-500 urdu-text">کلائنٹ: {sale.clientName}</p>
        </div>
        <div className="border-t border-b py-3 my-4">
          <div className="flex justify-between font-bold urdu-text">
            <span>پروڈکٹ</span>
            <span>مقدار</span>
            <span>قیمت</span>
            <span>کل</span>
          </div>
          {sale.items.map((item, i) => (
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
            <span>{formatCurrency(sale.subtotal)}</span>
          </div>
          {sale.discount > 0 && (
            <div className="flex justify-between text-green-600 urdu-text">
              <span>چھوٹ ({sale.discount}%)</span>
              <span>-{formatCurrency(sale.discountAmount)}</span>
            </div>
          )}
          <div className="flex justify-between font-bold text-xl border-t-2 border-black pt-2 urdu-text">
            <span>کل:</span>
            <span>{formatCurrency(sale.total)}</span>
          </div>
          <div className="flex justify-between text-blue-600 urdu-text">
            <span>ادائیگی:</span>
            <span>{formatCurrency(sale.paid)}</span>
          </div>
          <div className="flex justify-between text-gray-500 urdu-text">
            <span>باقی:</span>
            <span>{formatCurrency(sale.paid - sale.total)}</span>
          </div>
        </div>
        <div className="text-center mt-8 text-gray-400 urdu-text">
          شکریہ! آپ کا دورہ مبارک ہو
        </div>
        <div className="flex gap-4 mt-8 no-print">
          <button
            className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold urdu-text"
            onClick={onPrint}
          >
            🖨️ پرنٹ کریں
          </button>
          <button
            className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-bold urdu-text"
            onClick={onClose}
          >
            بند کریں
          </button>
        </div>
      </div>
    </div>
  );
}
