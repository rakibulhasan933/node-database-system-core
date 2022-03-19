const express = require("express");
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// userId:rakibul1
// password:fNbIZMRWOy5zfJl1



const uri = "mongodb+srv://rakibul1:fNbIZMRWOy5zfJl1@cluster0.jyva3.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";



const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const database = client.db("foodMaster");
        const usersCollections = database.collection("foodItem");
        // GET API
        app.get('/users', async (req, res) => {
            const cursor = usersCollections.find({});
            const users = await cursor.toArray();
            res.send(users);
        });

        app.get('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const user = await usersCollections.findOne(query);
            // console.log('load user with id', id);
            res.send(user);
        });
        //  PUT API
        app.put('/users/:id', async (req, res) => {
            const id = req.params.id;
            const updatedUser = req.body;
            const filter = { _id: ObjectId(id) }
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    name: updatedUser.name,
                    email: updatedUser.email
                },
            };
            const result = await usersCollections.updateOne(filter, updateDoc, options);

            console.log(result);
            res.json(result);
        })

        // POST API
        app.post('/users', async (req, res) => {
            const newUser = req.body;
            const result = await usersCollections.insertOne(newUser)
            // console.log('got new user', req.body);
            // console.log('added user', result);
            res.json(result);
        });
        // DELETE API
        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await usersCollections.deleteOne(query);
            // console.log('delete in user with id', result);
            res.json(result);
        })
    } finally {
        // await client.close();
    }
}
run().catch(console.dir);

// Callback Promise

// client.connect(err => {
//     const collection = client.db("foodMaster").collection("foodItem");
//     // perform actions on the collection object
//     console.log('Hitting the Database');
//     const user = { name: 'rakibul', email: 'rakibul@gmail.com', phone: '01793874052' };
//     collection.insertOne(user)
//         .then(() => {
//             console.log('insert success');
//         })
//     // client.close();
// });




app.get('/', (req, res) => {
    res.send('Running my CRUD server');
})

app.listen(port, () => {
    console.log('Running server port', port);
});