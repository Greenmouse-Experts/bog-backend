exports.generateOrderId = Math.floor(190000000 + Math.random() * 990000000);

exports.projectSlug = type => {
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
  }
  return slug;
};
