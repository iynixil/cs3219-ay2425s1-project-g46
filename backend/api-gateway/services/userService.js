const axios = require('axios');

// Base URL for the Question Service
const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://localhost:5001/user';

const signup = async (userData) => {
  try {
    const response = await axios.post(`${USER_SERVICE_URL}/signup`, userData);
    return response;
  } catch (error) {
    throw error;
  }
}

const login = async (userData) => {
  try {
    const response = await axios.post(`${USER_SERVICE_URL}/login`, userData);
    return response;
  } catch (error) {
    throw error;
  }
}

const logout = async (userData) => {
  try {
    const response = await axios.post(`${USER_SERVICE_URL}/logout`, userData);
    return response;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  signup,
  login,
  logout
};