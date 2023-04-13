exports.generateOrderId = Math.floor(190000000 + Math.random() * 990000000);

exports.projectSlug = (type) => {
  let slug;
  if (type === "land_survey") {
    slug = "LNS";
  } else if (type === "construction_drawing") {
    slug = "CND";
  } else if (type === "building_approval") {
    slug = "BDA";
  } else if (type === "geotechnical_investigation") {
    slug = "GTI";
  } else if (type === "contractor") {
    slug = "CNT";
  } else {
    slug = type.toUpperCase().slice(0, 3);
  }
  return slug;
};

/**
 * List of the levels of administrators
 */
exports.adminLevels = [
  { level: 1, type: "super admin" },
  { level: 2, type: "article admin" },
  { level: 3, type: "finance admin" },
  { level: 4, type: "product admin" },
  { level: 5, type: "project admin" },
  { level: 6, type: "general admin" },
];

exports.adminPrivileges = [
  {
    type: "general admin",
    privileges: [
      "BLOG",
      "PROFILE",
      "TRANSACTION",
      "PRODUCT",
      "ORDER",
      "NOTIFICATION",
      "PROJECT",
      "MEETING",
    ],
  },
  { type: "article admin", privileges: ["BLOG", "PROFILE"] },
  { type: "finance admin", privileges: ["TRANSACTION", "PROFILE"] },
  {
    type: "product admin",
    privileges: ["PRODUCT", "ORDER", "NOTIFICATION", "PROFILE"],
  },
  {
    type: "project admin",
    privileges: ["PROJECT", "MEETING", "NOTIFICATION", "PROFILE"],
  },
];

exports.generalInformation = {
  foundationDesign: [{type: "strip", formula: ''}, "pad", "raft", "pile"],
  frameStructureDesign: ["concrete columns", "beams", "slab"],
  blockWork: [
    "225mm thick sandcrete block",
    "150mm thick sandcrete block",
    "100mm thick sandcrete block",
    "clay bricks",
  ],
  roofDesign: [
    "concrete roof slab & beam",
    "stonecoated roofing",
    "aluminium roofing",
  ],
};

exports.formula = {};
