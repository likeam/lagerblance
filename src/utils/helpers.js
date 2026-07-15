export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

export function formatCurrency(n) {
  return (
    "Rs. " +
    Number(n)
      .toFixed(0)
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  );
}

export function formatDate(d) {
  return new Date(d).toLocaleDateString("ur-PK", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatDateShort(d) {
  return new Date(d).toLocaleDateString("ur-PK", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
