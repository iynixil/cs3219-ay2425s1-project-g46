const axios = require('axios');

// Base URL for the User Service
const FEEDBACK_SERVICE_URL = process.env.FEEDBACK_SERVICE_URL || 'http://localhost:5004/feedback';

const addReview = async (feedbackData) => {
  try {
    const response = await axios.post(`${FEEDBACK_SERVICE_URL}/adduserreview`, feedbackData);
    return response;
  } catch (error) {
    throw error;
  }
}

const getReview = async (email) => {
  try {
    const response = await axios.get(`${FEEDBACK_SERVICE_URL}/getuserreview/${email}`);
    return response;
  } catch (error) {
    throw error;
  }
}

const addWebsiteFeedback = async (feedbackData) => {
  try {
    const response = await axios.post(`${FEEDBACK_SERVICE_URL}/submitCode`, feedbackData);
    return response;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  addReview,
  getReview,
  addWebsiteFeedback
};