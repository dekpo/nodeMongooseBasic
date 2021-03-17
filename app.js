// on importe le module mongoose
const mongoose = require('mongoose');
// on importe Express pour servir les résultats en http
const express = require('express');
// on utilise Express sur le port 3000
const app = express();
app.listen(3000);
app.get('/', ( request , response ) => {
    response.send('Hello World! The Express Server IS RUNNING !!!');
  });

// on définit la constante uri qui est l'adresse de notre serveur MongoDB
const URI = "mongodb+srv://dekpo:qi08xn6@cluster0.dgrcq.mongodb.net/sample_airbnb?retryWrites=true&w=majority";
// on se connecte à notre serveur MongoDB
mongoose.connect(URI, {useNewUrlParser: true, useUnifiedTopology: true}, (err) => {
    if (err) console.log('ERROR !', err);
    console.log('CONNECTED TO MongoDB !!!');
});
// on définit un schema (obligatoire avec mongoose) même vide
const mySchema = new mongoose.Schema({}); 
// on définit un model sur la base du schema (obligatoire avec mongoose)
const myModel = mongoose.model('airbnb',mySchema,'listingsAndReviews');
// on effectue notre recherche find sur le model correspondant
const count = myModel.find().countDocuments();
count.exec((err,result)=>{
    console.log('Result Count:', result);
});
// on effetue une autre recherche avec find et les méthodes connues de MongoDB
const listing = myModel.find({name:/a/},{_id:1,name:1,listing_url:1}).skip(10).limit(20).sort({_id:1});
// on affiche les résultats de la requete Mongo sur le serveur Express
// à l'adresse /api
app.get('/api', ( request , response ) => {
    listing.exec( (err, result) => {
        response.send( result );
        console.log( result );
    });
});
