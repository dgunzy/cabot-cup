
const { async } = require('@kinde-oss/kinde-nodejs-sdk/dist/KindeClient');
const axios = require('axios');


async function getFromJavaApi(url, jsonData) {
    try {
      const response = await axios.get(url, {
        params: jsonData
      });
      return response.data;
    } catch (error) {
      console.error('Error getting data from API:', error.message);
      throw error; 
    }
  }

  async function postToJavaApi(url, jsonData) {
    try {
      const response = await axios.post(url, jsonStuff);
      return response.data;
    } catch (error) {
      console.error('Error getting data from API:', error.message);
      throw error; 
    }
  }

  module.exports = { getFromJavaApi, postToJavaApi };

  const jsonStuff = {
    id: 'kp_21af9df10075469a95a58f617a445b57',
    given_name: 'Daniel',
    family_name: 'Guns',
    email: 'danbguns@gmail.com',
    picture: undefined
  };



async function testPostApi() {
  const apiData = await postToJavaApi('http://localhost:8080/getbets', jsonStuff);
   console.log(apiData);
}
  
async function testGetApi() {
  const apiData = await getFromJavaApi('http://localhost:8080/getbets', jsonStuff);
   console.log(apiData);
}
testPostApi();
