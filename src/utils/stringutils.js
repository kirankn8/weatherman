const toTitleCase = (str) => {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
};

const arrayToString = (arrayOfStrings = []) => {
  if (typeof arrayOfStrings !== "object") return arrayOfStrings;
  return arrayOfStrings.join(", ");
};

export default { toTitleCase, arrayToString };
