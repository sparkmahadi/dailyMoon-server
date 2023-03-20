const express = require("express");
const app = express();
const cors = require('cors');


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

// const articles = require('./data/news.json');

const port = 5000 || process.env.PORT

app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.gp7ekja.mongodb.net/?retryWrites=true&w=majority`;
// const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    const articlesCollection = client.db("dailyMoon").collection("articles");

    app.get('/articles', async(req, res)=>{
        const query = {};
        const articles = await articlesCollection.find(query).toArray();
        res.send(articles)
    });

    app.get('/articles/:id', async(req, res)=>{
        const id = req.params.id;
        console.log('article for view', id);
        const query = { _id: new ObjectId(id)};
        const article = await articlesCollection.findOne(query);
        res.send(article)
    });

    app.post("/articles/add-article", async(req, res)=>{
        const article = req.body;
        console.log('body for insert', article);
        const result = await articlesCollection.insertOne(article);
        res.send(result);
    });

    app.delete("/articles/:id", async(req, res)=>{
        const id = req.params.id;
        console.log('id for delete', id);
        const query = {_id : new ObjectId(id)}
        const result = await articlesCollection.deleteOne(query);
        res.send(result);
    })

    app.put("/articles/:id", async(req, res)=>{
        const id= req.params.id;
        const data = req.body;
        const query = { _id: new ObjectId(id)};
        const options = {upsert : true};
        const newArticle = {
            $set:{
                author: data.author,
                content: data.content,
                title: data.title,
                urlToImage: data.urlToImage,
                tags: data.tags,
            }
        };

        const result = await articlesCollection.updateOne(query, newArticle, options);
        res.send(result);
    })

}

run().catch(error => console.log(error));

app.get('/', (req, res) =>{
    res.send(`The daily planet server is running`)
});

app.listen(port, () =>{
    console.log(`The daily planet server is running on port: ${port}`);
})