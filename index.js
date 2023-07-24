const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require("cors");
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

//set Middlewar
const corsConfig = {
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
  app.use(cors(corsConfig))
  app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.5a8lj4m.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

const dbConnect = async () => {
  try {
    client.connect();
    console.log(" Database Connected Successfully✅ ");

  } catch (error) {
    console.log(error.name, error.message);
  }
}
dbConnect()


    const collegeCollection = client.db('collegeDb').collection('collegeService');
    const admissionCollection = client.db('collegeDb').collection('admission');
    const feedbackCollection = client.db('collegeDb').collection('feedback');

    app.get('/', (req, res) => {
          res.send('Boss is sitting');
      })


    //all college data load for display
    app.get('/college', async(req, res) => {
      const curson = collegeCollection.find();
      const result = await curson.toArray();
      res.send(result);
    })

    //search college
    app.get("/searchcollege/:text", async (req, res) => {
      const text = req.params.text;
      const result = await collegeCollection
        .find({
          $or: [
            { collegeName: { $regex: text, $options: "i" } },
            // { category: { $regex: text, $options: "i" } },
          ],
        })
        .toArray();
      res.send(result);
    });

    //feedback 
    app.get('/feedback', async(req, res) => {
      const curson = feedbackCollection.find();
      const result = await curson.toArray();
      res.send(result);
    })

    // Add feedback
  app.put('/feedback', async (req, res) => {
    const addingFeedback = req.body;
    const result = await feedbackCollection.insertOne(addingFeedback);
    res.send(result);
})

    //admission form data load for college name
    app.get('/college/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await collegeCollection.findOne(query);
      res.send(result);
  })

  // Add toys 
  app.put('/admission', async (req, res) => {
    const addingAdmission = req.body;
    const result = await admissionCollection.insertOne(addingAdmission);
    res.send(result);
})

//my college and admission
app.get('/mycollege', async (req, res) => {
  let query = {}
    if(req.query?.email){
      query = {email: req.query.email}
    }
  const result = await admissionCollection.find(query).toArray();
  res.send(result);
})


app.listen(port, () => {
    console.log(`Bistro boss is sitting on port ${port}`);
})
