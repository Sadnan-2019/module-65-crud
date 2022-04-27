const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
const ObjectId = require("mongodb").ObjectId

const app = express();

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// userName:dbuser1
// password:TK5wkacVqRTBSMtp

const uri =
  "mongodb+srv://dbuser1:TK5wkacVqRTBSMtp@cluster0.fx7vs.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
async function run() {
  try {
    await client.connect();
    const userCollection = client.db("foodexpress").collection("user");


    ///get all user
    app.get("/user",async(req,res)=>{

      const query={};
      const cursor = userCollection.find(query)
      const users = await cursor.toArray()
      // await cursor.toArray(console.dir);
      res.send(users)

    })


    //get id for updatewith specific data
      app.get("/user/:id",async(req,res)=>{
 
        const id= req.params.id;
        const query = {_id : ObjectId(id)}
        const result = await userCollection.findOne(query);
        res.send(result)
      })

      //update data

      app.put("/user/:id",async(req,res)=>{

        const id = req.params.id;
        const updateUser = req.body;
        const filter = {_id : ObjectId(id)};
        const options = { upsert: true };
        const updateDoc={

          $set :{
            name : updateUser.name,
            email :updateUser.email
          }
         
        }
        const result = await userCollection.updateOne(filter,updateDoc,options);
        res.send(result)


      })

    ///add userr

    app.post("/user",async(req,res)=>{

      const newUser = req.body;
      console.log("adding new user",newUser);
      const result = await userCollection.insertOne(newUser);
      res.send(result)
    });
///delete data
    app.delete("/user/:id", async(req,res)=>{

      const id = req.params.id;
      const query = {_id: ObjectId(id)}
      const result = await userCollection.deleteOne(query)
      res.send(result)



    })




   
  } finally {
    // await client.close();
  }
}
//  run().catch(console.dir);
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Running my node crud server");
});

app.listen(port, () => {
  console.log(`CRUD IS RUNING ${port}`);
});
