import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { formatCurrency, formatDateShort } from "../../utils/helpers";
import SalePrintView from "./SalePrintView";

export default function SalesHistory() {
  const { sales, clients } = useApp();
  const [selectedSale, setSelectedSale] = useState(null);
  const [showPrint, setShowPrint] = useState(false);

  const handleReprint = (sale) => {
    setSelectedSale(sale);
    setShowPrint(true);
  };

  const closePrint = () => {
    setShowPrint(false);
    setSelectedSale(null);
  };

  if (showPrint && selectedSale) {
    return (
      <SalePrintView
        sale={selectedSale}
        onClose={closePrint}
        onPrint={() => {
          window.print();
          closePrint();
        }}
      />
    );
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold urdu-text">📄 فروخت کی تاریخ</h1>
      <div className="bg-white rounded-2xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr className="text-right">
                <th className="px-4 py-3 text-sm font-semibold text-gray-600 urdu-text">
                  بل نمبر
                </th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-600 urdu-text">
                  کلائنٹ
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
              {sales.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="text-center py-8 text-gray-400 urdu-text"
                  >
                    کوئی فروخت نہیں
                  </td>
                </tr>
              ) : (
                sales
                  .slice()
                  .sort((a, b) => b.date - a.date)
                  .map((s) => {
                    const client = clients.find((c) => c.id === s.clientId);
                    return (
                      <tr key={s.id} className="hover:bg-gray-50 transition">
                        <td className="px-4 py-3 font-medium urdu-text">
                          {s.invoiceNo}
                        </td>
                        <td className="px-4 py-3 urdu-text">
                          {client ? client.name : s.clientName}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {formatDateShort(s.date)}
                        </td>
                        <td className="px-4 py-3 text-sm">{s.items.length}</td>
                        <td className="px-4 py-3 font-semibold">
                          {formatCurrency(s.total)}
                        </td>
                        <td className="px-4 py-3">
                          <button
                            className="text-blue-600 hover:text-blue-800 text-sm urdu-text flex items-center gap-1"
                            onClick={() => handleReprint(s)}
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                              />
                            </svg>
                            دوبارہ پرنٹ
                          </button>
                        </td>
                      </tr>
                    );
                  })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
