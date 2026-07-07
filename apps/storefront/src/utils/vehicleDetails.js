const VEHICLE_DETAILS = [
  {
    match: ["lamborghini", "huracan"],
    specs: {
      engine: "5.2L naturally aspirated V10",
      horsepower: "630 hp",
      acceleration: "2.9s",
      transmission: "7-speed dual-clutch",
      drivetrain: "AWD",
      topSpeed: "325 km/h",
    },
  },
  {
    match: ["mercedes", "black series"],
    specs: {
      engine: "4.0L biturbo V8",
      horsepower: "730 hp",
      acceleration: "3.2s",
      transmission: "7-speed dual-clutch",
      drivetrain: "RWD",
      topSpeed: "325 km/h",
    },
  },
  {
    match: ["porsche", "gt3"],
    specs: {
      engine: "4.0L naturally aspirated flat-six",
      horsepower: "525 hp",
      acceleration: "3.2s",
      transmission: "7-speed PDK",
      drivetrain: "RWD",
      topSpeed: "296 km/h",
    },
  },
  {
    match: ["ferrari", "sf90"],
    specs: {
      engine: "4.0L hybrid twin-turbo V8",
      horsepower: "1000 hp",
      acceleration: "2.5s",
      transmission: "8-speed dual-clutch",
      drivetrain: "AWD",
      topSpeed: "340 km/h",
    },
  },
  {
    match: ["bmw", "m4"],
    specs: {
      engine: "3.0L twin-turbo inline-six",
      horsepower: "510 hp",
      acceleration: "3.9s",
      transmission: "8-speed M Steptronic",
      drivetrain: "RWD / xDrive",
      topSpeed: "290 km/h",
    },
  },
  {
    match: ["rolls", "ghost"],
    specs: {
      engine: "6.75L twin-turbo V12",
      horsepower: "563 hp",
      acceleration: "4.8s",
      transmission: "8-speed automatic",
      drivetrain: "AWD",
      topSpeed: "250 km/h",
    },
  },
  {
    match: ["aston", "db12"],
    specs: {
      engine: "4.0L twin-turbo V8",
      horsepower: "671 hp",
      acceleration: "3.6s",
      transmission: "8-speed automatic",
      drivetrain: "RWD",
      topSpeed: "325 km/h",
    },
  },
  {
    match: ["mclaren", "720s"],
    specs: {
      engine: "4.0L twin-turbo V8",
      horsepower: "720 hp",
      acceleration: "2.9s",
      transmission: "7-speed seamless-shift",
      drivetrain: "RWD",
      topSpeed: "341 km/h",
    },
  },
];

function normalize(text = "") {
  return text
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function findVehicleDetail(name) {
  const normalizedName = normalize(name);

  return VEHICLE_DETAILS.find(({ match }) =>
    match.every((token) => normalizedName.includes(token)),
  );
}

export function getVehicleSpecs(name, category) {
  const detail = findVehicleDetail(name);

  return {
    engine: detail?.specs.engine ?? "Performance powertrain",
    horsepower: detail?.specs.horsepower ?? "Factory rated",
    acceleration: detail?.specs.acceleration ?? "Validated on request",
    transmission: detail?.specs.transmission ?? "Automatic",
    drivetrain: detail?.specs.drivetrain ?? "Configured by variant",
    topSpeed:
      detail?.specs.topSpeed ??
      (category === "LUXURY" ? "Limited touring setup" : "Track capable"),
  };
}

export function getVehicleGallery(name, imageUrl) {
  const normalizedName = normalize(name);
  const isLuxury =
    normalizedName.includes("rolls") ||
    normalizedName.includes("aston") ||
    normalizedName.includes("range");

  return [
    {
      label: "Exterior",
      note: "Primary inspection view",
      src: imageUrl,
      objectPosition: "center",
    },
    {
      label: isLuxury ? "Presence" : "Profile",
      note: isLuxury ? "Luxury stance" : "Performance stance",
      src: imageUrl,
      objectPosition: "52% 42%",
    },
    {
      label: "Detail",
      note: "Finish and proportion",
      src: imageUrl,
      objectPosition: "62% 50%",
    },
  ];
}
