const express = require("express");
const { MongoClient, ServerApiVersion } = require("mongodb");
const app = express();
const http = require("http");
const host = "localhost";
const port = 8000;

var bodyParser = require('body-parser')

var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.listen(port);

app.set('view engine','ejs'); 
const uri =
  "mongodb+srv://nicolastietz48:tbvjvmJ4KPRwdZwa@clusteragenziaviaggi.nncuvhn.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const database = client.db("AgenziaViaggi");

async function getCollection(name) {
  try {
    // Connect the client to the server (optional starting in v4.7)
    await client.connect();
    
    
    const users = database.collection(name);
    const allUsers = await users.find().toArray();
    return allUsers;
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

async function createUser(firstName,lastName,email){
  try{
    await client.connect()
    await database.collection('users').insertOne({firstName:firstName,lastName:lastName,email:email})
      
    
  } finally{
    await client.close()
  }
}



app.get("/", function (req, res) {
  res.send("homepage");
});
//Per aggiungere user, penso di fare una page con form per inserire i dati dell'utente da inserire
//Controllare anche SQL injection e pericoli vari
app.get("/newUser", function (req, res) {
  
  res.render('newUser')
});


app.post('/add-user',urlencodedParser,function(req,res){
  createUser(req.body.firstName,req.body.lastName,req.body.email)
    .then(()=>{

      console.log(req.body)
      res.render('newUser',{user: req.body});

    })
  
})

//Aggiungere sorting?
app.get("/listUsers", function (req, res) {
  getCollection("users")
    .catch(console.dir)
    .then((users) => res.send(users));
});

app.post("modifyUser", function (req, res) {});

app.post("addProduct", function (req, res) {});
app.post("deleteProduct", function (req, res) {});

app.post("modifyProduct", function (req, res) {});
