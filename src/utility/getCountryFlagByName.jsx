import { countryList } from "../utility/countryList";

export const getCountryFlagByName = (countryName) => {
  if (!countryName) return null;

  const country = countryList.find(
    (c) => c.name.toLowerCase() === countryName.toLowerCase()
  );

  return country?.image || null;
};
