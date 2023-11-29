const express = require('express');
const app = express();
require('dotenv').config();
const path = require('path');
const { MongoClient } = require("mongodb");

const PORT = process.env.PORT || 3000;
const DATABASE_URI = process.env.DATABASE_URI;
const DATABASE_NAME = process.env.DATABASE_NAME;
const COLLECTION_NAME = process.env.COLLECTION_NAME;
const fs = require('fs');

const ejs = require('ejs');

app.set('view engine', 'ejs');

app.use(express.static('views'));


class Golfer {
    constructor(id, name, imageSrc, teamWins, teamLoss, singlesWins, singlesLoss, singlesTie, doublesWins, doublesLoss, doublesTie) {
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
        this.totalMatches = singlesWins + singlesLoss + singlesTie + doublesWins + doublesLoss + doublesTie;
        this.winningPercentage = this.calculateWinningPercentage();

    }
    calculateWinningPercentage() {
        return Math.round(((((this.singlesWins + this.doublesWins) + ((this.singlesTie + this.doublesTie) / 2))/ this.totalMatches) * 100 || 0)); 
    }
}
var golfers;

var numGolfers;

async function loadFromDatabase() {
    try {

        await client.connect();

        const database = client.db(DATABASE_NAME);
        const collection = database.collection(COLLECTION_NAME);

        const golfersData = await collection.find().toArray();

        golfers = golfersData.map(data => new Golfer(data._id, data.name, data.imageSrc, data.teamWins, data.teamLoss, data.singlesWins, data.singlesLoss, data.singlesTie, data.doublesWins, data.doublesLoss, data.doublesTie));

    } catch (error) {
        console.error('Error fetching golfers:', error);
    } finally {
        await client.close();
    }
    numGolfers = golfers.length;
}

function checkGolferCount() {
    if(golfers.length < numGolfers) {
        golfers = [];
        loadFromDatabase();
    } 
};

app.get('/listPlayers', async (request, response) => {
    checkGolferCount();

    response.render('playerList', { golfers });
    }
);

app.get('/totalWinsLoss', async (request, response) => {
    checkGolferCount();
        response.render('totalWinsLoss', { golfers });
    }
);

app.get('/singlesWinsLoss', async (request, response) => {
    checkGolferCount();
        response.render('singlesWinLoss', { golfers });
    }
)

app.get('/teamWinsLoss', async (request, response) => {
    checkGolferCount();
        response.render('teamWinLoss', { golfers });
    }
);

app.get('/percentageGraph', async (request, response) => {
    checkGolferCount();
        golfers.sort((a, b) => b.winningPercentage - a.winningPercentage);
        response.render('percentageGraph', { golfers });
    }
);

app.get('/2019', async (request, response) => {

        response.render('2019');
    }
);

app.get('/2020', async (request, response) => {

    response.render('2020');
}
);

app.get('/2021', async (request, response) => {

    response.render('2021');
}
);

app.get('/2022', async (request, response) => {
    
    response.render('2022');
}
);

app.get('/2023', async (request, response) => {
    
    response.render('2023');
}
);

app.get('/format', async (request, response) => {
    
    response.render('format');
}
);


app.post('/sort-name', (request, response) => {
    checkGolferCount();
    golfers.sort((a,b) => a.name.localeCompare(b.name));

    response.render('playerList', { golfers });
});

app.post('/sort-cups', (request, response) => {
    checkGolferCount();
    golfers.sort((a,b) => b.totalCups - a.totalCups );

    response.render('playerList', { golfers });
});

app.post('/sort-winning', (request, response) => {
    checkGolferCount();
    golfers.sort((a, b) => b.winningPercentage - a.winningPercentage);


    response.render('playerList', { golfers });
});



app.listen(PORT, () => {

    client = new MongoClient(DATABASE_URI);
    database = client.db(DATABASE_NAME);
    collection = database.collection(COLLECTION_NAME);
    loadFromDatabase();

    console.log(`Server is running on http://localhost:${PORT}`);
  });

