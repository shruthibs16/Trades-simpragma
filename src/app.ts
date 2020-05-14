import * as express from 'express';
import { Trade , User } from "../src/trade"


//  Express APP config
const app = express();
app.use(express.json());
app.set("port", process.env.PORT || 3000);
var ObjectId = require('mongodb').ObjectId; 

//create new user

app.post("/users", function(req, res) {
  User.create(req.body)
    .then(function(dbProduct) {
      // If we were able to successfully create a Product, send it back to the client
      res.status(201).json(dbProduct);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.status(500).json(err);
    });
});


//creating a new trade

app.post("/trades", function(req,res) {
  Trade.create(req.body)
    .then(function(dbProduct) {
      // If we were able to successfully create a Product, send it back 
      res.status(201).json(dbProduct);
    })
    .catch(function(err) {
      // If an error occurred, send it 
      res.status(500).json(err);
    });
});

//get all trades

app.get("/trades/",  function(req,res){
  Trade.find({}).sort({"_id":"asc"})
 .populate({path:"user"})
   .then(function(data) {
     console.log("data..",data)
     if(Object.keys(data).length == 0){
      return res.status(404).json({"err":"no trades avilable "});
     }
      return res.status(200).json(data);
   })
   .catch(function(err) {
     return res.status(500).send(err);
   });
});


//get individual trades

 app.get("/trades/:id",  function(req,res){
   Trade.findOne({ _id: req.params.id })
  .populate({path:"user"})
    .then(function(dbProduct) {
      console.log("data..",dbProduct)
      if(!dbProduct){
        return res.status(404).json({"err":"no trades avilable for given id"});
      }
      return res.status(200).json(dbProduct);
    })
    .catch(function(err) {
      return res.status(500).send(err);
    });
});

//get the trades on symbol a,type and time

app.get("/stocks/:stockSymbol/trades",function(req,res){
  let stockSymbol = req.params.stockSymbol;
  let tradeType = req.query.type
  let startDate = req.query.start
  let endDate = req.query.end;
  console.log("data...",stockSymbol,tradeType,startDate,endDate);
  Trade.find({symbol:stockSymbol,type:tradeType,timestamp:{ "$gte" :startDate,"$lte" :endDate}})  
  .populate({path:"user"}).sort({"_id":"asc"})
    .then(function(dbProduct) {
      if(Object.keys(dbProduct).length == 0){
        return res.status(404).json({"err":"no data available"});
      }
      console.log("data..",dbProduct)
      return res.json(dbProduct);
    })
    .catch(function(err) {
      // If an error occurred, send it 
      return res.status(500).send(err);
    });
})

//get the trades on symbol ,date and price

app.get("/stocks/:stockSymbol/price",function(req,res){
  let stockSymbol = req.params.stockSymbol;
  let startDate = req.query.start
  let endDate = req.query.end;
  console.log("data...",stockSymbol,startDate,endDate);
  Trade.find({symbol:stockSymbol,timestamp:{ "$gte" :startDate,"$lte" :endDate}})  
  .populate({path:"user"})
    .then(function(data:Array<any>) {
      let array = data;
      var min = Math.min.apply(Math, array.map(item => item.price))
      var max = Math.max.apply(Math, array.map(item => item.price))
      console.log("min...",min)
      console.log("max...",max)
      if(Object.keys(data).length == 0){
        return res.status(404).json({"message":"There are no trades in the given date range"});
      }
      console.log("data..",data)
      return res.json({"data":{stockSymbol:stockSymbol,lowest:min,highest:max}});
    })
    .catch(function(err) {
      return res.status(500).send(err);
    });
});

//getting the trades by userId

app.get("/trades/users/:userID",function(req,res){
  Trade.find({user: req.params.userID })
  .populate({path:"user"}).sort({"_id":"asc"})
  .then(function(dbProduct) {
    console.log("dbProducts...",dbProduct)
    if(Object.keys(dbProduct).length == 0){
      return res.status(404).json({"err":"user does not exist"});
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
      return res.status(404).json({"err":"no trades availble for the id"});
   }
    console.log("dbProducts...",dbProducts)
    return res.status(200).send({"msg":" trade deleted successfully"})
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
    return res.status(200).send({"msg":" trades deleted successfully"})
  })
  .catch(function(err) {
    return res.status(500).send(err);
  })
});

const server = app.listen(app.get("port"), () => {
  console.log("App is running on http://localhost:%d", app.get("port"));
});