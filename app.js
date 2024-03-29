const express = require("express");

const cors = require("cors");

const path = require("path");

const dotenv = require("dotenv");

const MongoClient = require("mongodb").MongoClient;

dotenv.config({
  path: "./config.env",
});

const app = express();

const PORT = process.env.PORT || 5001;
//connecting to MonogoDB

const uri = process.env.MONGO_URI;

MongoClient.connect(uri)
  .then((client) => {
    console.log("Connected to MonogoDB");

    const db = client.db("moviesdb");

    const movies = db.collection("movies");

    //settings
    app.use(cors());
    app.use(express.json());

    app.listen(PORT, async () =>
      console.log("server listening on port " + PORT)
    );

    app.post("/add-movie", (req, res) => {
      movies
        .insertOne(req.body)
        .then((result) => {
          res.status(201).json({ success: true, data: result });
        })
        .catch((err) => {
          res.status(500).json({
            success: false,
          });
        });
    });

    app.get("/get-all", async (req, res) => {
      movies
        .find({})
        .toArray()
        .then((results) => {
          res.status(200).json({ success: true, data: results });
        })
        .catch((err) => {
          res.status(500).json({ success: false, massage: err });
        });
    });

    app.put("/movies", (req, res) => {
      movies
        .findOneAndUpdate(
          { title: req.body.title },
          {
            $set: {
              director: req.body.author,
            },
          },
          { upsert: true }
        )
        .then((results) => {
          res.status(201).json({ success: true, data: results });
        })
        .catch((err) => {
          res.status(500).json({ success: false });
        });
    });

    app.get("/get-single", (req, res) => {
      movies
        .find({ title: req.params.title }).toArray()
        

        .then((results) => {
          res.status(201).json({ success: true, data: results });
        })
        .catch((err) => {
          res.status(500).json({ success: false });
        });
    });

    app.delete("/movies", (req, res) => {
      movies
        .deleteOne({
          title: req.body.title,
        })
        .then((results) => {
          res.status(200).json({ success: true ,data:results});
        })
        .catch((err) => {
          res.status(500).json({ success: false });
        });
    });
  })
  .catch((error) => {
    console.log(error.massage);
  });
