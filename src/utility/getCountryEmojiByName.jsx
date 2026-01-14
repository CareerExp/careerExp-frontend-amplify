import { countryList } from "../utility/countryList";

export const getCountryEmojiByName = (countryName) => {
  if (!countryName) return "";

  const country = countryList.find(
    (c) => c.name.toLowerCase() === countryName.toLowerCase()
  );

  return country?.code || "";
};
