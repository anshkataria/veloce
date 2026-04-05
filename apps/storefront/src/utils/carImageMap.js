const LOCAL_CAR_IMAGES = {
  "lamborghini-huracan": "/images/cars/lamborghini-huracan-evo.jpg",
  "mercedes-amg-gt-black-series":
    "/images/cars/mercedes-amg-gt-black-series.jpg",
  "porsche-911-gt3-rs": "/images/cars/porsche-911-gt3-rs.jpg",
  "ferrari-sf90-stradale": "/images/cars/ferrari-sf90-stradale.jpg",
  "mclaren-720s": "/images/cars/mclaren-720s.jpg",
  "bmw-m4": "/images/cars/bmw-m4.jpg",
  "aston-martin-db12": "/images/cars/aston-martin-db12.jpg",
  "rolls-royce-ghost": "/images/cars/rolls-royce-ghost.jpg",
  "range-rover": "/images/cars/range-rover.jpg",
};

function normalize(text = "") {
  return text
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export function getCarImageByName(name, fallbackImage) {
  const n = normalize(name);

  if (n.includes("lamborghini") && n.includes("huracan")) {
    return LOCAL_CAR_IMAGES["lamborghini-huracan"];
  }

  if (n.includes("mercedes") && n.includes("black series")) {
    return LOCAL_CAR_IMAGES["mercedes-amg-gt-black-series"];
  }

  if (n.includes("porsche") && n.includes("gt3")) {
    return LOCAL_CAR_IMAGES["porsche-911-gt3-rs"];
  }

  if (n.includes("ferrari") && n.includes("sf90")) {
    return LOCAL_CAR_IMAGES["ferrari-sf90-stradale"];
  }

  if (n.includes("mclaren") && n.includes("720s")) {
    return LOCAL_CAR_IMAGES["mclaren-720s"];
  }

  if (n.includes("bmw") && n.includes("m4")) {
    return LOCAL_CAR_IMAGES["bmw-m4"];
  }

  if (n.includes("aston") && n.includes("db12")) {
    return LOCAL_CAR_IMAGES["aston-martin-db12"];
  }

  if (n.includes("rolls") && n.includes("ghost")) {
    return LOCAL_CAR_IMAGES["rolls-royce-ghost"];
  }

  if (n.includes("range") && n.includes("rover")) {
    return LOCAL_CAR_IMAGES["range-rover"];
  }

  return fallbackImage;
}
