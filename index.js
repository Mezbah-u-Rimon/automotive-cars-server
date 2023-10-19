const express = require("express");
require('dotenv').config()
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require("cors");
const app = express();

const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fgd8wc9.mongodb.net/?retryWrites=true&w=majority`;


const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        const carCollection = client.db("carDB").collection("cars");

        app.post('/cars', async (req, res) => {
            const user = req.body;
            const result = await carCollection.insertOne(user);
            res.send(result);
        })


        await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get("/", (req, res) => {
    res.send("Car website is running...");
});

app.listen(port, () => {
    console.log(`Simple Crud is Running on port ${port}`);
});