import * as express from 'express';
//import { loggerMiddleware } from "./logger.middleware"
import { Trade , User } from "../src/trade"


// Our Express APP config
const app = express();
app.use(express.json());
//app.use(loggerMiddleware);
app.set("port", process.env.PORT || 3000);
var ObjectId = require('mongodb').ObjectId; 


app.post("/trades", function(req, res) {
  Trade.create(req.body)
    .then(function(dbProduct) {
      // If we were able to successfully create a Product, send it back to the client
      res.json(dbProduct);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

app.get("/trades", async function(req,res) {
  await Trade.find({}).sort({_id: 'asc'}).populate({path:"user"})
  .then(function(dbProducts) {
    res.json(dbProducts);
  })
  .catch(function(err) {
    res.json(err);
  })
});

 app.get("/trades/:id",  function(req,res){
   Trade.findOne({ _id: req.params.id })
  .populate({path:"user"})
    .then(function(dbProduct) {
      console.log("data..",dbProduct)
      res.status(200).json(dbProduct);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.status(400).send(err);
    });
});

app.get("/stocks/:stockSymbol/trades",function(req,res){
  let stockSymbol = req.params.stockSymbol;
  let tradeType = req.query.type
  let startDate = req.query.start
  let endDate = req.query.end;
  console.log("data...",stockSymbol,tradeType,startDate,endDate);
  Trade.find({symbol:stockSymbol,type:tradeType,timestamp:{ "$gte" :startDate,"$lte" :endDate}})  
  .populate({path:"user"})
    .then(function(dbProduct) {
      console.log("data..",dbProduct)
      res.json(dbProduct);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.status(400).send(err);
    });
})

app.get("/trades/users/:userID",function(req,res){
  Trade.find({user: req.params.userID })
  .then(function(dbProducts) {
    console.log("dbProducts...",dbProducts)
    res.status(200).send(dbProducts)
  })
  .catch(function(err) {
    res.status(404).send("user not found....");
  })
});

app.delete("/trades/:id", function(req,res) {
  Trade.deleteOne({_id: req.params.id })
  .then(function(dbProducts) {
    console.log("dbProducts...",dbProducts)
    res.status(200).send(" trade deleted successfully")
  })
  .catch(function(err) {
    res.status(404).send("id not found");
  })
});

const server = app.listen(app.get("port"), () => {
  console.log("App is running on http://localhost:%d", app.get("port"));
});