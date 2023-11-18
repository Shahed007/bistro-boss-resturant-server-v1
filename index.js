const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();
const port = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());

const api = "/api/v1/";

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster1.77jbz4j.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
async function run() {
  try {
    const bistroBossDB = client.db("bistroBossDB");
    const menusCollection = bistroBossDB.collection("menus");
    const reviewsCollection = bistroBossDB.collection("reviews");
    const usersCollection = bistroBossDB.collection("users");
    const cartCollection = bistroBossDB.collection("cart");

    app.get(`${api}menus`, async (req, res) => {
      try {
        const menus = await menusCollection.find().toArray();
        res.send(menus);
      } catch (err) {
        console.log(err);
      }
    });

    app.get(`${api}reviews`, async (req, res) => {
      try {
        const menus = await reviewsCollection.find().toArray();
        res.send(menus);
      } catch (err) {
        console.log(err);
      }
    });

    // Add to cart route
    app.post(`${api}cart`, async (req, res) => {
      try {
        const cart = req.body;

        const result = await cartCollection.insertOne(cart);
        res.send(result);
      } catch (err) {
        console.log(err);
      }
    });

    app.put(`${api}users`, async (req, res) => {
      try {
        const user = req.body;
        const filter = { email: user?.email };
        const options = { upsert: true };

        const updateDoc = {
          $set: {
            ...user,
          },
        };

        const result = await usersCollection.updateOne(
          filter,
          updateDoc,
          options
        );
        res.send(result);
      } catch (err) {
        console.log(err);
      }
    });
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", async (req, res) => {
  res.send("My bistro boss server is coming soon");
});

app.listen(port, () => {
  console.log(`my bistro boss server is ranging port ${port}`);
});
