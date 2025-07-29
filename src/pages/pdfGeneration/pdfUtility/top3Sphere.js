export const top3Sphere = (interestProfileData) => {
  // Create a copy of the array before sorting
  const sortedData = [...(interestProfileData?.results?.result || [])].sort((a, b) => b.score - a.score);

  // Extract the top 3 areas
  const top3Sphere = sortedData.slice(0, 3).map((interest) => interest.area);

  return top3Sphere;
};
