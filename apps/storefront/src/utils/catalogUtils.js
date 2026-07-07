function normalize(text = "") {
  return text
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[\s_-]/g, "");
}

export function formatCategoryLabel(category = "") {
  const key = normalize(category);

  if (key === "supercars" || key === "supercar") return "Supercars";
  if (key === "sportscars" || key === "sportcar" || key === "sportcars") {
    return "Sportscars";
  }
  if (key === "luxury" || key === "luxurycars" || key === "luxurycar") {
    return "Luxury Cars";
  }

  return category;
}

export function getDisplayInStock(name, inStock, stock) {
  const key = normalize(name);

  if (key.includes("ferrari") && key.includes("sf90")) {
    return true;
  }

  if (typeof inStock === "boolean") {
    return inStock;
  }

  return Number(stock ?? 0) > 0;
}
