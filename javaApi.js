
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

  const jsonStuff = {
    id: 'kp_21af9df10075469a95a58f617a445b57',
    given_name: 'Daniel',
    family_name: 'Guns',
    email: 'danbguns@gmail.com',
    picture: undefined
  };

  const newBet = {
    "name": "Walker and Mau",
    "betOdds": [
      { "horse": "Walker", "odds": 2.5 },
      { "horse": "Mau", "odds": 1.5 }
    ]
  }
  
  const newBet1 = {
    "name": "Rum and Bill and Ramy",
    "betOdds": [
      { "horse": "Walker", "odds": 2.5 },
      { "horse": "Mau", "odds": 1.5 },
      {"horse" : "Rum", "odds" : 3}
    ]
  }
  const jsonId = {
    id: 'kp_21af9df10075469a95a58f617a445b57'
  }


async function testPostApi() {
  const apiData = await postToJavaApi('http://localhost:8080/addbettouserpending/mau/ryan_mau/100/1.5', jsonStuff, API_SECRET_KEY);
   console.log(apiData);
}
  
async function testPostApi1() {
  const apiData = await postToJavaApi('http://localhost:8080/getbets', jsonStuff, API_SECRET_KEY);
   console.log(apiData);
   console.log('Response Data:', JSON.stringify(apiData, null, 2));
}

async function testPostApi2() {
  const apiData = await postToJavaApi('http://localhost:8080/checkuser', jsonStuff, API_SECRET_KEY);
   console.log(apiData);
}

async function testPostApi3() {
  const apiData = await postToJavaApi('http://localhost:8080/addbettouserapproved/ryan_mau/kp_21af9df10075469a95a58f617a445b57', jsonStuff,API_SECRET_KEY);
   console.log(apiData);
}

async function testPostApi4() {
  const apiData = await postToJavaApi('http://localhost:8080/denypendingbet/ryan_mau/kp_21af9df10075469a95a58f617a445b57', jsonStuff,API_SECRET_KEY);
   console.log(apiData);
}

async function testPostApi5() {
  const apiData = await postToJavaApi('http://localhost:8080/addbet', newBet ,API_SECRET_KEY);
   console.log(apiData);
}
async function testPostApi6() {
  const apiData = await postToJavaApi('http://localhost:8080/addbet', newBet1 ,API_SECRET_KEY);
   console.log(apiData);
}


testPostApi6();


