import axiosInstance from './AxiosInstance'; // Adjust path as per your project structure

// Fetch all restaurants
export function getRestaurants() {
  return axiosInstance.get('/restaurants');
}

// Fetch a single restaurant by ID
export function getRestaurantById(restaurantId) {
  return axiosInstance.get(`/restaurants/${restaurantId}`);
}

// Create a new restaurant
export function createRestaurant(restaurantData) {
  // Format data to match Mongoose schema expectations
  const formattedData = {
    name: restaurantData.name?.trim() || null,
    address: restaurantData.address?.trim() || null,
    cuisineType: restaurantData.cuisineType || 'Other', // Default from schema
    taxeTPS: restaurantData.taxeTPS ? `${restaurantData.taxeTPS}%` : null, // e.g., "5%"
    taxeTVQ: restaurantData.taxeTVQ ? `${restaurantData.taxeTVQ}%` : null, // e.g., "9.975%"
    color: restaurantData.color ? `#${restaurantData.color.replace('#', '')}` : null, // e.g., "#FF5733"
    logo: restaurantData.logo || null, // Must be a valid URL or null
    promotion: restaurantData.promotion || null,
    payCashMethod: restaurantData.payCashMethod || 'not-accepted', // Default from schema
    images: restaurantData.images || [], // Array of strings, max 10
  };
  return axiosInstance.post('/restaurants', formattedData);
}

// Update an existing restaurant by ID
export function updateRestaurant(restaurant, restaurantId) {
  // Format data to match Mongoose schema expectations
  const formattedData = {
    name: restaurant.name?.trim() || null,
    address: restaurant.address?.trim() || null,
    cuisineType: restaurant.cuisineType || 'Other',
    taxeTPS: restaurant.taxeTPS ? `${restaurant.taxeTPS.replace('%', '')}%` : null,
    taxeTVQ: restaurant.taxeTVQ ? `${restaurant.taxeTVQ.replace('%', '')}%` : null,
    color: restaurant.color ? `#${restaurant.color.replace('#', '')}` : null,
    logo: restaurant.logo || null,
    promotion: restaurant.promotion || null,
    payCashMethod: restaurant.payCashMethod || 'not-accepted',
    images: restaurant.images || [],
  };
  return axiosInstance.put(`/restaurants/${restaurantId}`, formattedData);
}

// Delete a restaurant by ID
export function deleteRestaurant(restaurantId) {
  return axiosInstance.delete(`/restaurants/${restaurantId}`);
}

// Search restaurants (assuming query parameter support in backend)
export function searchRestaurants(searchTerm) {
  return axiosInstance.get('/restaurants/search', {
    params: { q: searchTerm }, // Adjust based on your backend's expected query param
  });
}

// Upload an image for a restaurant
export function uploadImage(restaurantId, imageData) {
  // Assuming imageData is a FormData object for file upload
  return axiosInstance.post(`/restaurants/${restaurantId}/images`, imageData, {
    headers: {
      'Content-Type': 'multipart/form-data', // Required for file uploads
    },
  });
}

// Get tables by restaurant ID
export function getTablesByRestaurant(restaurantId) {
  return axiosInstance.get(`/restaurants/${restaurantId}/tables`);
}

// Create a table for a restaurant
export function createTable(restaurantId, tableData) {
  return axiosInstance.post(`/restaurants/${restaurantId}/tables`, tableData);
}

// Get table by ID
export function getTableById(restaurantId, tableId) {
  return axiosInstance.get(`/restaurants/${restaurantId}/tables/${tableId}`);
}

// Update table by ID
export function updateTable(restaurantId, tableId, tableData) {
  return axiosInstance.put(`/restaurants/${restaurantId}/tables/${tableId}`, tableData);
}

// Delete table by ID
export function deleteTable(restaurantId, tableId) {
  return axiosInstance.delete(`/restaurants/${restaurantId}/tables/${tableId}`);
}
