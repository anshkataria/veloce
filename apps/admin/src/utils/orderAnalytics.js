const MONTH_LABELS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export function groupOrdersByMonth(orders, monthsBack = 6) {
  const now = new Date();
  const buckets = [];

  for (let i = monthsBack - 1; i >= 0; i -= 1) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    buckets.push({ year: d.getFullYear(), month: d.getMonth(), revenue: 0 });
  }

  for (const order of orders) {
    if (!order.createdAt) continue;
    const created = new Date(order.createdAt);
    const bucket = buckets.find(
      (b) => b.year === created.getFullYear() && b.month === created.getMonth(),
    );
    if (bucket) bucket.revenue += Number(order.totalAmount ?? 0);
  }

  return buckets.map((b) => ({
    month: MONTH_LABELS[b.month],
    revenue: b.revenue,
  }));
}

export function distinctCustomerCount(orders) {
  const emails = orders
    .map((o) => o.shippingEmail)
    .filter(Boolean)
    .map((email) => email.toLowerCase());
  return new Set(emails).size;
}
