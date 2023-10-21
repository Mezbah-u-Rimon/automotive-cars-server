const express = require("express");
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
        const myCartCollection = client.db("myCartDB").collection("myCart");


        app.post('/cars', async (req, res) => {
            const user = req.body;
            const result = await carCollection.insertOne(user);
            res.send(result);
        })

        app.get('/cars', async (req, res) => {
            const result = await carCollection.find().toArray();
            console.log(result);
            res.send(result);
        })


        app.get("/cars/:id", async (req, res) => {
            const id = req.params.id;
            console.log("id", id);
            const query = {
                _id: new ObjectId(id),
            };
            const result = await carCollection.findOne(query);
            console.log(result);
            res.send(result);
        });


        //updated car collection

        app.put("/cars/:id", async (req, res) => {
            const id = req.params.id;
            const data = req.body;
            console.log("id", id, data);

            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const updatedCar = {
                $set: {
                    name: data.name,
                    brand_name: data.brand_name,
                    price: data.price,
                    category: data.category,
                    rating: data.rating,
                    details: data.details,
                    photo: data.photo,
                },
            };
            const result = await carCollection.updateOne(
                filter,
                updatedCar,
                options
            );
            res.send(result);
        });


        // My Cart Collection
        app.post('/myCart', async (req, res) => {
            const cart = req.body;
            const result = await myCartCollection.insertOne(cart);
            res.send(result);
        })

        app.get('/myCart', async (req, res) => {
            const result = await myCartCollection.find().toArray();
            res.send(result);
        })

        app.delete('/myCart/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await myCartCollection.deleteOne(query)
            res.send(result)
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