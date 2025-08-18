require('dotenv').config()
const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000
const app = express();

app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.f1wcz6a.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        // Collections
        const coffeeCollections = client.db("coffee-store").collection("coffees");

        // Api for get coffee
        app.get('/coffees', async (req, res) => {
            const result = await coffeeCollections.find().toArray();
            res.send(result);
        })
        // Api for one item get coffee
        app.get('/coffees/:id', async (req, res) => {
            const id = req.params.id;
            const filter = {_id: new ObjectId(id)}
            const result = await coffeeCollections.findOne(filter);
            res.send(result);
        })
        // Api for add coffee
        app.post('/coffees', async (req, res) => {
            const newCoffee = req.body;
            const result = await coffeeCollections.insertOne(newCoffee);
            res.send(result);
        })
        // Api for update coffee
        app.put('/coffees/:id', async (req, res) => {
            const id = req.params.id;
            const filter = {_id: new ObjectId(id)}
            const option = {upsert: true};
            const coffeeData = req.body;
            const updateCoffee = {$set: coffeeData}
            

            const result = await coffeeCollections.updateOne(filter, updateCoffee, option)
            res.send(result);
        })
        // Api for delete coffee
        app.delete('/coffees/:id', async (req, res) => {
            const id = req.params.id;
            const filter = {_id: new ObjectId(id)}
            const result = await coffeeCollections.deleteOne(filter)
            res.send(result);
        })


        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('coffee server is hotter')
})
app.listen(port, () => {
    console.log(`coffee server is running on port ${port}`)
})