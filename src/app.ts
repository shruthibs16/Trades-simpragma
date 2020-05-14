import * as express from 'express';
//import { loggerMiddleware } from "./logger.middleware"
import { Trade , User } from "../src/trade"


// Our Express APP config
const app = express();
app.use(express.json());
//app.use(loggerMiddleware);
app.set("port", process.env.PORT || 3000);
var ObjectId = require('mongodb').ObjectId; 

//creating a new trade

app.post("/trades", function(req, res) {
  Trade.create(req.body)
    .then(function(dbProduct) {
      // If we were able to successfully create a Product, send it back to the client
      res.status(201).json(dbProduct);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.status(500).json(err);
    });
});

//getting all trades

app.get("/trades/",  function(req,res){
  Trade.find({})
 .populate({path:"user"})
   .then(function(data) {
     console.log("data..",data)
     if(Object.keys(data).length == 0){
      return res.status(404).json("no trades avilable ");
     }
      return res.status(200).json(data);
   })
   .catch(function(err) {
     return res.status(500).send(err);
   });
});


//getting individual trades

 app.get("/trades/:id",  function(req,res){
   Trade.findOne({ _id: req.params.id })
  .populate({path:"user"})
    .then(function(dbProduct) {
      console.log("data..",dbProduct)
      if(!dbProduct){
        return res.status(404).json("no trades avilable for given id");
      }
      return res.status(200).json(dbProduct);
    })
    .catch(function(err) {
      return res.status(500).send(err);
    });
});

//filtering the trades on symbol a,type and time

app.get("/stocks/:stockSymbol/trades",function(req,res){
  let stockSymbol = req.params.stockSymbol;
  let tradeType = req.query.type
  let startDate = req.query.start
  let endDate = req.query.end;
  console.log("data...",stockSymbol,tradeType,startDate,endDate);
  Trade.find({symbol:stockSymbol,type:tradeType,timestamp:{ "$gte" :startDate,"$lte" :endDate}})  
  .populate({path:"user"})
    .then(function(dbProduct) {
      if(Object.keys(dbProduct).length == 0){
        return res.status(404).json({"err":"no data available"});
      }
      console.log("data..",dbProduct)
      return res.json(dbProduct);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      return res.status(500).send(err);
    });
})

//getting the trades by userId

app.get("/trades/users/:userID",function(req,res){
  Trade.find({user: req.params.userID })
  .populate({path:"user"})
  .then(function(dbProduct) {
    console.log("dbProducts...",dbProduct)
    if(Object.keys(dbProduct).length == 0){
      return res.status(404).json("user does not exist");
   }
   return res.status(200).send(dbProduct)
  })
  .catch(function(err) {
    return res.status(500).send(err);
  })
});

//erase one trade record by trade_id

app.delete("/trades/:id", function(req,res) {
  Trade.findOneAndDelete({_id: req.params.id })
  .then(function(dbProducts) {
    if(!dbProducts){
      return res.status(404).json("no trades availble for the id");
   }
    console.log("dbProducts...",dbProducts)
    return res.status(200).send(" trade deleted successfully")
  })
  .catch(function(err) {
    return res.status(500).send(err);
  })
});

//erase all trades

app.delete("/trades", function(req,res) {
  Trade.collection.remove({})
  .then(function(data) {
    console.log("dbProducts...",data)
    return res.status(200).send(" trades deleted successfully")
  })
  .catch(function(err) {
    return res.status(500).send(err);
  })
});

const server = app.listen(app.get("port"), () => {
  console.log("App is running on http://localhost:%d", app.get("port"));
});