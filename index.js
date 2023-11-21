const express = require('express');
const app = express();
require('dotenv').config();
const path = require('path');
const { MongoClient, ObjectId } = require("mongodb");

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

    }
    calculateWinningPercentage() {
        return Math.round(((((this.singlesWins + this.doublesWins) + ((this.singlesTie + this.doublesTie) / 2))/ this.totalMatches) * 100 || 0)) +  "%"; 
    }
}
var golfers;




app.get('/listPlayers', async (request, response) => {
    if(golfers == null || golfers === 'undefined') {
        try {
            // Connect to MongoDB
            const client = new MongoClient(DATABASE_URI);
            await client.connect();
    
            // Access the database and collection
            const database = client.db(DATABASE_NAME);
            const collection = database.collection(COLLECTION_NAME);
    
            // Fetch golfer data from MongoDB
            const golfersData = await collection.find().toArray();
    
            // Create Golfer objects
            golfers = golfersData.map(data => new Golfer(data._id, data.name, data.imageSrc, data.teamWins, data.teamLoss, data.singlesWins, data.singlesLoss, data.singlesTie, data.doublesWins, data.doublesLoss, data.doublesTie));
    
            // Use the golfers array for various displays
            
            response.render('playerList', { golfers });
        } catch (error) {
            console.error('Error fetching golfers:', error);
        } finally {
            await client.close();
        } 
    } else {
        response.render('playerList', { golfers });
    }
})

app.get('/totalWinsLoss', async (request, response) => {
    if(golfers == null || golfers === 'undefined') {
        try {
            // Connect to MongoDB
            const client = new MongoClient(DATABASE_URI);
            await client.connect();
    
            // Access the database and collection
            const database = client.db(DATABASE_NAME);
            const collection = database.collection(COLLECTION_NAME);
    
            // Fetch golfer data from MongoDB
            const golfersData = await collection.find().toArray();
    
            // Create Golfer objects
            golfers = golfersData.map(data => new Golfer(data._id, data.name, data.imageSrc, data.teamWins, data.teamLoss, data.singlesWins, data.singlesLoss, data.singlesTie, data.doublesWins, data.doublesLoss, data.doublesTie));
    
            // Use the golfers array for various displays
            response.render('totalWinsLoss', { golfers });
        } catch (error) {
            console.error('Error fetching golfers:', error);
        } finally {
            await client.close();
        } 
    } else {
        response.render('totalWinsLoss', { golfers });
    }
})




app.listen(PORT, () => {

    client = new MongoClient(DATABASE_URI);
    database = client.db(DATABASE_NAME);
    collection = database.collection(COLLECTION_NAME);

    console.log(`Server is running on http://localhost:${PORT}`);
  });