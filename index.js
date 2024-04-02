const express = require('express')
const app = express()
const cors= require('cors')
require('dotenv').config()
const port = 5000


app.use(cors())
app.use(express.json())

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri= `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rqq4klv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

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
    const database= client.db('ToDoDB')
    const toDoCollection = database.collection('TodoCollection')



    app.get('/task', async(req,res)=>{
      const result = await toDoCollection.find().toArray()
      res.send(result)
    })

    
   app.post('/task', async(req,res)=>{
    const task = req.body;
    const result= await toDoCollection.insertOne(task)
    res.send(result)
   })



   app.delete('/task/:id', async(req,res)=>{
  const id = req.params.id;
  const query= {_id : new ObjectId(id)}
  const result = await toDoCollection.deleteOne(query)
  res.send(result)

   })

    // Connect the client to the server	(optional starting in v4.7)
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

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})