const API_BASE_URL = "https://podcast-api.netlify.app";

export const fetchShows = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/shows`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching shows:", error);
    return [];
  }
};
