
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



const dataFun = { name: 'fsdfsd', horse: [ 'sdfs', '2222' ], odds: [ '120', '130' ] }
const dataBad = { }

function convertToAmerican(decimalOdds) {
    if (decimalOdds < 2) {
        return Math.round((-100 / (decimalOdds - 1)));
    } else {
        return "+" + Math.round((decimalOdds - 1) * 100);
    }
}

function convertToDecimal(usOdds) {
  if (usOdds < 0) {
      return (100 / Math.abs(usOdds)) + 1;
  } else {
      return (usOdds / 100) + 1;
  }
}

function convertToNewFormat(jsonData) {
  const name = jsonData.name;
  const betOdds = [];

  const horseKeys = Object.keys(jsonData).filter(key => key.startsWith('horse'));
  const oddsKeys = Object.keys(jsonData).filter(key => key.startsWith('odds'));

  const maxLength = Math.min(horseKeys.length, oddsKeys.length);

  for (let i = 0; i < maxLength; i++) {
      const horseKey = horseKeys[i];
      const oddsKey = oddsKeys[i];

      if (jsonData[horseKey] && jsonData[oddsKey]) {
          const horse = jsonData[horseKey];
          const odds = jsonData[oddsKey];
          

          betOdds.push({ horse, odds });
      }
  }

  return { name, betOdds };
}

function convertOddsToInt(jsonData) {
  if (!jsonData || !jsonData.betOdds || !Array.isArray(jsonData.betOdds)) {
      console.error('Invalid JSON data format');
      return null;
  }

  const processedData = {
      name: jsonData.name,
      betOdds: jsonData.betOdds.map(odds => ({
          horse: odds.horse,
          odds: odds.odds.map(odd => parseInt(odd, 10))
      }))
  };

  return processedData;
}

// console.log('Response Data:', JSON.stringify(convertOddsToInt(convertToNewFormat(dataFun)), null, 2));



// testPostApi6();


