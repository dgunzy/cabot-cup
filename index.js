const express = require("express");
const app = express();
require("dotenv").config();
const path = require("path");

const bodyParser = require("body-parser");

const axios = require("axios");
const { getFromJavaApi, postToJavaApi } = require("./javaApi");

const PORT = process.env.PORT || 3000;

const fs = require("fs");

const ejs = require("ejs");
const { time } = require("console");

app.set("view engine", "ejs");

app.use(express.static("views"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

class Golfer {
  constructor(
    id,
    name,
    imageSrc,
    teamWins,
    teamLoss,
    singlesWins,
    singlesLoss,
    singlesTie,
    doublesWins,
    doublesLoss,
    doublesTie
  ) {
    this._id = id;
    this.name = name;
    this.imageSrc = imageSrc;
    this.teamWins = teamWins;
    this.teamLoss = teamLoss;
    this.singlesWins = singlesWins;
    this.singlesLoss = singlesLoss;
    this.singlesTie = singlesTie;
    this.doublesWins = doublesWins;
    this.doublesLoss = doublesLoss;
    this.doublesTie = doublesTie;
    this.totalCups = teamWins + teamLoss;
    this.totalWins = singlesWins + doublesWins;
    this.totalLoss = singlesLoss + doublesLoss;
    this.totalTie = singlesTie + doublesTie;
    this.totalMatches =
      singlesWins +
      singlesLoss +
      singlesTie +
      doublesWins +
      doublesLoss +
      doublesTie;
    this.winningPercentage = this.calculateWinningPercentage();
  }
  calculateWinningPercentage() {
    return Math.round(
      ((this.singlesWins +
        this.doublesWins +
        (this.singlesTie + this.doublesTie) / 2) /
        this.totalMatches) *
        100 || 0
    );
  }
}
var golfers;

var numGolfers;

const golfersJson = require("./data.json");

async function loadFromDatabase() {
  const golfersData = golfersJson;
  golfers = golfersData.map(
    (data) =>
      new Golfer(
        data._id,
        data.name,
        data.imageSrc,
        data.teamWins,
        data.teamLoss,
        data.singlesWins,
        data.singlesLoss,
        data.singlesTie,
        data.doublesWins,
        data.doublesLoss,
        data.doublesTie
      )
  );

  numGolfers = golfers.length;
}

function checkGolferCount() {
  if (golfers.length < numGolfers) {
    golfers = [];
    loadFromDatabase();
  }
}

app.get("/", async (request, response) => {
  try {
    response.render("index");
  } catch {
    isMember = false;
    isAuthenticated = false;
    isAdmin = false;
    console.log("Error authenticating user");
    response.render("index");
  }
});

app.get("/listPlayers", async (request, response) => {
  checkGolferCount();

  response.render("playerList", { golfers });
});

app.get("/totalWinsLoss", async (request, response) => {
  checkGolferCount();
  response.render("totalWinsLoss", { golfers });
});

app.get("/singlesWinsLoss", async (request, response) => {
  checkGolferCount();
  response.render("singlesWinLoss", { golfers });
});

app.get("/teamWinsLoss", async (request, response) => {
  checkGolferCount();
  response.render("teamWinLoss", { golfers });
});

app.get("/percentageGraph", async (request, response) => {
  checkGolferCount();
  golfers.sort((a, b) => b.winningPercentage - a.winningPercentage);
  response.render("percentageGraph", { golfers });
});

app.get("/2019", async (request, response) => {
  response.render("2019");
});

app.get("/2020", async (request, response) => {
  response.render("2020");
});

app.get("/2021", async (request, response) => {
  response.render("2021");
});

app.get("/2022", async (request, response) => {
  response.render("2022");
});

app.get("/2023", async (request, response) => {
  response.render("2023");
});

app.get("/format", async (request, response) => {
  response.render("format");
});

app.post("/sort-name", (request, response) => {
  checkGolferCount();
  golfers.sort((a, b) => a.name.localeCompare(b.name));

  response.render("playerList", { golfers });
});

app.post("/sort-cups", (request, response) => {
  checkGolferCount();
  golfers.sort((a, b) => b.totalCups - a.totalCups);

  response.render("playerList", { golfers });
});

app.post("/sort-winning", (request, response) => {
  checkGolferCount();
  golfers.sort((a, b) => b.winningPercentage - a.winningPercentage);

  response.render("playerList", { golfers });
});

app.listen(3000, "0.0.0.0", () => {
  loadFromDatabase();
  console.log("Server is running on port 3000");
});

// app.get("/betPage", async (request, response) => {
//   try {
//     const isAuthenticated = await kindeClient.isAuthenticated(request);
//     const hasMemberPermissions =
//       userPermissions.permissions.includes("enable:member");

//     if (hasMemberPermissions && isAuthenticated) {
//       const apiData = await postToJavaApi(
//         JAVA_URL + "/getbets",
//         kindeClient.getUserDetails(request),
//         API_SECRET_KEY
//       );

//       response.render("betPage", { bets: apiData });
//     } else {
//       response.status(403);
//       return response.send("forbidden");
//     }
//   } catch {
//     isMember = false;
//     isAuthenticated = false;
//     isAdmin = false;
//     response.render("error", { isAuthenticated, isMember, isAdmin });
//   }
// });

// app.post("/userWager", async (request, response) => {
//   try {
//     const betResponse = await postToJavaApi(
//       `${JAVA_URL}/addbettouserpending/${request.body.horse}/${request.body.name}/${request.body.wager}/${request.body.odds}`,
//       kindeClient.getUserDetails(request),
//       API_SECRET_KEY
//     );
//     console.log(betResponse);
//   } catch {
//     console.log("Error sending bet");
//     response.render("error");
//   }

//   try {
//     const apiData = await postToJavaApi(
//       `${JAVA_URL}/getbets`,
//       kindeClient.getUserDetails(request),
//       API_SECRET_KEY
//     );
//     response.render("betPage", { bets: apiData });
//   } catch {
//     console.log("Error connecting to java api");
//   }
// });

// app.post("/deleteBet", async (request, response) => {
//   try {
//     const userId = kindeClient.getUserDetails(request).id;
//     const betResponse = await postToJavaApi(
//       `${JAVA_URL}/denypendingbet/${request.body.uniqueDescription}/${request.body.horse}/${userId}/${request.body.wager}`,
//       kindeClient.getUserDetails(request),
//       API_SECRET_KEY
//     );
//     console.log(betResponse);
//   } catch {
//     console.log("Error sending bet");
//     response.render("error");
//   }

//   try {
//     const isAuthenticated = await kindeClient.isAuthenticated(request);
//     const hasMemberPermissions =
//       userPermissions.permissions.includes("enable:member");

//     if (hasMemberPermissions && isAuthenticated) {
//       const apiData = await postToJavaApi(
//         JAVA_URL + "/checkuser",
//         kindeClient.getUserDetails(request),
//         API_SECRET_KEY
//       );
//       response.render("account", { user: apiData });
//     } else {
//       response.status(403);
//       return response.send("forbidden");
//     }
//   } catch {
//     isMember = false;
//     isAuthenticated = false;
//     isAdmin = false;
//     console.log("Error authenticating user");
//     response.render("error", { isAuthenticated, isMember, isAdmin });
//   }
// });

// app.get("/userDashboard", async (request, response) => {
//   try {
//     const isAuthenticated = await kindeClient.isAuthenticated(request);
//     const hasAdminPermissions =
//       userPermissions.permissions.includes("enable:admin");

//     if (isAuthenticated && hasAdminPermissions) {
//       try {
//         const apiData = await getFromJavaApi(
//           JAVA_URL + "/users",
//           API_SECRET_KEY
//         );

//         response.render("userDashboard", { user: apiData });
//       } catch {
//         console.log("Error connecting to java api");
//       }
//     } else {
//       response.status(403);
//       return response.send("forbidden");
//     }
//   } catch {
//     isMember = false;
//     isAuthenticated = false;
//     isAdmin = false;
//     console.log("Error authenticating user");
//     response.render("index", { isAuthenticated, isMember, isAdmin });
//   }
// });

// app.post("/approveUserBet", async (request, response) => {
//   try {
//     const betResponse = await postToJavaApi(
//       `${JAVA_URL}/addbettouserapproved/${request.body.description}/${request.body.horse}/${request.body.kindeId}/${request.body.wager}`,

//       kindeClient.getUserDetails(request),
//       API_SECRET_KEY
//     );
//     console.log(betResponse);
//   } catch {
//     console.log("Error sending bet");
//     response.render("error");
//   }

//   try {
//     const apiData = await getFromJavaApi(JAVA_URL + "/users", API_SECRET_KEY);
//     console.log(apiData);

//     response.render("userDashboard", { user: apiData });
//   } catch {
//     console.log("Error connecting to java api");
//   }
// });

// app.post("/denyUserBet", async (request, response) => {
//   try {
//     const betResponse = await postToJavaApi(
//       `${JAVA_URL}/denypendingbet/${request.body.description}/${request.body.horse}/${request.body.kindeId}/${request.body.wager}`,

//       kindeClient.getUserDetails(request),
//       API_SECRET_KEY
//     );
//   } catch {
//     console.log("Error sending bet");
//     response.render("error");
//   }

//   try {
//     const apiData = await getFromJavaApi(JAVA_URL + "/users", API_SECRET_KEY);
//     console.log(apiData);

//     response.render("userDashboard", { user: apiData });
//   } catch {
//     console.log("Error connecting to java api");
//   }
// });

// app.post("/winUserBet", async (request, response) => {
//   try {
//     const betResponse = await postToJavaApi(
//       `${JAVA_URL}/winapprovedbet/${request.body.description}/${request.body.horse}/${request.body.kindeId}/${request.body.wager}`,

//       kindeClient.getUserDetails(request),
//       API_SECRET_KEY
//     );
//   } catch {
//     console.log("Error sending bet");
//     response.render("error");
//   }

//   try {
//     const apiData = await getFromJavaApi(JAVA_URL + "/users", API_SECRET_KEY);

//     response.render("userDashboard", { user: apiData });
//   } catch {
//     console.log("Error connecting to java api");
//   }
// });

// app.post("/loseUserBet", async (request, response) => {
//   try {
//     const betResponse = await postToJavaApi(
//       `${JAVA_URL}/loseapprovedbet/${request.body.description}/${request.body.horse}/${request.body.kindeId}/${request.body.wager}`,
//       kindeClient.getUserDetails(request),
//       API_SECRET_KEY
//     );
//   } catch {
//     console.log("Error sending bet");
//     response.render("error");
//   }

//   try {
//     const apiData = await getFromJavaApi(JAVA_URL + "/users", API_SECRET_KEY);

//     response.render("userDashboard", { user: apiData });
//   } catch {
//     console.log("Error connecting to java api");
//   }
// });

// app.post("/updateUserBalance", async (request, response) => {
//   try {
//     const betResponse = await postToJavaApi(
//       `${JAVA_URL}/updatebalance/${request.body.balance}/${request.body.kindeId}`,
//       kindeClient.getUserDetails(request),
//       API_SECRET_KEY
//     );
//   } catch {
//     console.log("Error sending bet");
//     response.render("error");
//   }

//   try {
//     const apiData = await getFromJavaApi(JAVA_URL + "/users", API_SECRET_KEY);

//     response.render("userDashboard", { user: apiData });
//   } catch {
//     console.log("Error connecting to java api");
//   }
// });

// app.get("/betDashboard", async (request, response) => {
//   try {
//     const isAuthenticated = await kindeClient.isAuthenticated(request);
//     const hasMemberPermissions =
//       userPermissions.permissions.includes("enable:member");

//     if (hasMemberPermissions && isAuthenticated) {
//       const apiData = await postToJavaApi(
//         JAVA_URL + "/getbets",
//         kindeClient.getUserDetails(request),
//         API_SECRET_KEY
//       );

//       response.render("betDashboard", { bets: apiData });
//     } else {
//       response.status(403);
//       return response.send("forbidden");
//     }
//   } catch {
//     isMember = false;
//     isAuthenticated = false;
//     isAdmin = false;
//     console.log("Error authenticating user");
//     response.render("error", { isAuthenticated, isMember, isAdmin });
//   }
// });

// app.post("/createNewBet", async (request, response) => {
//   if (Array.isArray(request.body.horse)) {
//   } else if (typeof request.body.horse === "string") {
//     request.body.horse = [request.body.horse];
//     request.body.odds = [request.body.odds];
//   }

//   try {
//     const betResponse = await postToJavaApi(
//       `${JAVA_URL}/addbet`,
//       request.body,
//       API_SECRET_KEY
//     );
//     console.log(betResponse);
//   } catch {
//     console.log("Error sending bet");
//     response.render("error");
//   }

//   try {
//     const apiData = await postToJavaApi(
//       `${JAVA_URL}/getbets`,
//       kindeClient.getUserDetails(request),
//       API_SECRET_KEY
//     );
//     response.render("betDashboard", { bets: apiData });
//   } catch {
//     console.log("Error connecting to java api");
//   }
// });

// app.post("/updateBetOdds", async (request, response) => {
//   try {
//     const betResponse = await postToJavaApi(
//       `${JAVA_URL}/changebet/${request.body.name}/${request.body.horse}/${request.body.newOdds}`,
//       kindeClient.getUserDetails(request),
//       API_SECRET_KEY
//     );
//     console.log(betResponse);
//   } catch {
//     console.log("Error sending bet");
//     response.render("error");
//   }

//   try {
//     const apiData = await postToJavaApi(
//       `${JAVA_URL}/getbets`,
//       kindeClient.getUserDetails(request),
//       API_SECRET_KEY
//     );
//     response.render("betDashboard", { bets: apiData });
//   } catch {
//     console.log("Error connecting to java api");
//   }
// });

// app.post("/deleteBetFromBets", async (request, response) => {
//   try {
//     const betResponse = await postToJavaApi(
//       `${JAVA_URL}/deletebet/${request.body.name}`,
//       null,
//       API_SECRET_KEY
//     );
//     console.log(betResponse);
//   } catch {
//     console.log("Error sending bet");
//     response.render("error");
//   }

//   try {
//     const apiData = await postToJavaApi(
//       `${JAVA_URL}/getbets`,
//       kindeClient.getUserDetails(request),
//       API_SECRET_KEY
//     );
//     response.render("betDashboard", { bets: apiData });
//   } catch {
//     console.log("Error connecting to java api");
//   }
// });
