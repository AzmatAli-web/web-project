import axiosClient from "../api/axiosClient";

/**
 * Login user
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{token, message}>}
 */
export const login = async (email, password) => {
  try {
    const response = await axiosClient.post("/auth/login", { email, password });
    if (response.data.token) {
      localStorage.setItem("authToken", response.data.token);
    }
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Login failed" };
  }
};

/**
 * Signup user
 * @param {string} fullName
 * @param {string} email
 * @param {string} studentId
 * @param {string} password
 * @returns {Promise<{message}>}
 */
export const signup = async (fullName, email, studentId, password) => {
  try {
    const response = await axiosClient.post("/auth/signup", {
      fullName,
      email,
      studentId,
      password,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Signup failed" };
  }
};

/**
 * Submit a new product listing with optional image
 * @param {string} title
 * @param {string} description
 * @param {number} price
 * @param {string} category
 * @param {File} image - optional image file
 * @returns {Promise<{message, productId}>}
 */
export const submitProduct = async (title, description, price, category, image = null) => {
  try {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("category", category);
    if (image) {
      formData.append("image", image);
    }

    const response = await axiosClient.post("/products", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Product submission failed" };
  }
};

/**
 * Get all listings
 * @returns {Promise<Array>}
 */
export const getListings = async () => {
  try {
    const response = await axiosClient.get("/listings");
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch listings" };
  }
};

/**
 * Approve a listing
 * @param {number} id - listing ID
 * @returns {Promise<{message}>}
 */
export const approveListing = async (id) => {
  try {
    const response = await axiosClient.put(`/listings/${id}`, { status: "Approved" });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to approve listing" };
  }
};

/**
 * Remove/delete a listing
 * @param {number} id - listing ID
 * @returns {Promise<{message}>}
 */
export const removeListing = async (id) => {
  try {
    const response = await axiosClient.delete(`/listings/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to remove listing" };
  }
};

/**
 * Get single product by ID
 * @param {number} id
 * @returns {Promise<{id, title, description, price, category, image, seller}>}
 */
export const getProductById = async (id) => {
  try {
    const response = await axiosClient.get(`/products/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch product" };
  }
};

/**
 * Get all products
 * @returns {Promise<Array>}
 */
export const getAllProducts = async () => {
  try {
    const response = await axiosClient.get("/products");
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch products" };
  }
};

/**
 * Get all users (admin)
 * @returns {Promise<Array>}
 */
export const getUsers = () => axiosClient.get("/users");

/**
 * Delete a user (admin)
 * @param {number} id
 * @returns {Promise}
 */
export const deleteUser = (id) => axiosClient.delete(`/users/${id}`);

/**
 * Update a user (admin)
 * @param {number} id
 * @param {object} updateData
 * @returns {Promise}
 */
export const updateUser = (id, updateData) => axiosClient.put(`/users/${id}`, updateData);