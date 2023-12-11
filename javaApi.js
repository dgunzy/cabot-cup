
const { async } = require('@kinde-oss/kinde-nodejs-sdk/dist/KindeClient');
const axios = require('axios');
require('dotenv').config();


const API_SECRET_KEY = process.env.API_SECRET_KEY;


async function getFromJavaApi(url, apiHeader) {
  try {
    const response = await axios.get(url, {
      headers: {
        'Authorization': apiHeader
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error getting data from API:', error.message);
    return null;
  }
}

  async function postToJavaApi(url, jsonData, apiHeader) {
    try {
      const response = await axios.post(url, jsonData, {
        headers: {
          'Authorization': apiHeader
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error getting data from API:', error.message);
      return null;
    }
  }
  module.exports = { getFromJavaApi, postToJavaApi };



