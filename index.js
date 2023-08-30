const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;
require('dotenv').config();

// middleware

app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.9z7i3.mongodb.net/?retryWrites=true&w=majority`;

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




        //  Notes

        const notesCollection = client.db("LikhoDB").collection('notes');

        app.post('/notes', async  (req,res)=>{
            const item = req.body;
            const result = await notesCollection.insertOne(item);
            res.send(result)
        });

        app.get('/note/:id', async (req, res) => {
            const noteId = req.params.id;
            const query ={_id: new ObjectId(noteId)}
            const result = await notesCollection.find(query).toArray();
            res.send(result)
        });
        app.delete('/note/:id', async (req, res) => {
            const noteId = req.params.id;
            const query ={_id: new ObjectId(noteId)}
            const result = await notesCollection.deleteOne(query);
            res.send(result)
        });

        app.get('/notes', async (req,res)=>{
            const email = req.query.email;
            console.log(email)
            if(!email){
                res.send([])
            }
            const query = {email: email};
            const result =  await notesCollection.find(query).toArray();
            res.send(result);
        });


        // Edit SECTION

        app.get('/edit/:id', async(req,res)=>{
            const editId = req.params.id;
            const query = {_id: new ObjectId(editId)};
            const result = await notesCollection.findOne(query).toArray();
            res.send(result);


        });


        app.put('/edit/:id', async (req,res)=>{

            const id = req.params.id;
            const editNote = req.body;
            const filter = {_id: new ObjectId(id)};
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    title: editNote.title,
                    details: editNote.details
                },
            };

            const result = await notesCollection.updateOne(filter, updateDoc, options);
            res.send(result)

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
    res.send('Boss is Watching')

});

app.listen(port, () => {
    console.log(`Boss is watching ${port}`)
})
