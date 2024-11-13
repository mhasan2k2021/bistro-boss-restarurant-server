const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("this is bistro boss restaurant server.");
});

///////////////////////////////////////
// from her mongodb start
///////////////////////////////////////

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASSWORD}@cluster2.vcbrqie.mongodb.net/?retryWrites=true&w=majority&appName=Cluster2`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    // this server database and collection here

    const bistroBoss = client.db("bistroBoss");
    const bistroProduct = bistroBoss.collection("bistroProduct");
    const cartItems = bistroBoss.collection("cartItems");

    app.get("/products/:category", async (req, res) => {
      const category = req.params.category;
      const data = bistroProduct.find();
      const products = await data.toArray();
      const result = products.filter(
        (product) => product.category === category
      );
      res.send(result);
    });

    app.get("/one-product/:id", async (req, res) => {
      const id = req.params.id;
      const data = bistroProduct.find();
      const product = await data.toArray();
      const result = product.find((product) => product._id === id);
      res.send(result);
    });

    app.get("/cart-items", async (req, res) => {
      const product = cartItems.find();
      const result = await product.toArray();
      res.send(result);
    });

    // from here we will get only user data

    app.get("/added-product", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const allProduct = await cartItems.find(query).toArray();
      res.send(allProduct);
    });

    // from this line i will send added data  to server

    app.post("/add-cart", async (req, res) => {
      const body = req.body;
      const result = await cartItems.insertOne(body);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

///////////////////////////////////////
// this line make end mongodb
///////////////////////////////////////

app.listen(port, () => {
  console.log("this port is running at port:", port);
});
