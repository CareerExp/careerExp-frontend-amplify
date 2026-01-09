import React from "react";
import { getCountryFlagByName } from "../../../utility/getCountryFlagByName";

const flagCache = {};

export const PdfSafeFlag = ({ country }) => {
  const [src, setSrc] = React.useState(null);

  const imageUrlToBase64 = async (url) => {
    const response = await fetch(url);
    const blob = await response.blob();

    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  };

  React.useEffect(() => {
    const loadFlag = async () => {
      const url = getCountryFlagByName(country);
      if (!url) return;

      if (!flagCache[url]) {
        flagCache[url] = await imageUrlToBase64(url);
      }

      setSrc(flagCache[url]);
    };

    loadFlag();
  }, [country]);

  if (!src) return null;

  return (
    <img
      src={src}
      alt={country}
      style={{ width: 40, height: 26, objectFit: "contain" }}
    />
  );
};
