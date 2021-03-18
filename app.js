// on importe le module mongoose
//const mongoose = require('mongoose'); // import CommonJS
import mongoose from 'mongoose';  // import ES6
// on importe Express pour servir les résultats en http
//const express = require('express');  // import CommonJS
import express from 'express'; // import ES6
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

// Je veux récupérer des infos du client :
    // rawHeaders => OS et du navigateur
    // url => tout le parcours depuis la racine du serveur
    // query => les params dans mon url
    // ajouter la date et l'heure dans mon enregistrement
    // on va sauvegarder ces infos dans une collection requestFromUsers
    // création du Schema
    const RequestSchema = new mongoose.Schema({
        rawHeaders: Array,
        url: String,
        query: Object,
        date: {
            type: Date,
            default: Date.now
        }
    });
    // création du Model
    const RequestModel = mongoose.model('request',RequestSchema,'requestFromUsers');

// on affiche les résultats de la requete Mongo sur le serveur Express
// à l'adresse /api
app.get('/api', ( request , response ) => {

    // console.log('REQUEST DU NAVIGATEUR CLIENT:', request);
    
    // instanciation de mon model
    let newRequest = new RequestModel( request );
    // on sauvegarde
    newRequest.save( (err,data) => {
        if (err) console.log(err);
        console.log('Request Saved: ', data );
    });

    // on affiche dans la console les variables provenant de l'URL
    console.log( request.query );
    // on définit une limite à partir d'une variable limit provenant de l'URL
    // avec une condition pour éviter de déclencher une erreur si la variable n'existe pas
    const limit = request.query.limit ? parseInt( request.query.limit ) : 30;
    console.log( limit );
    // même chose pour une variable skip
    const skip = request.query.skip ? parseInt( request.query.skip ) : 0;
    console.log( skip );
    // même chose pour une variable q qui est redéfinie en expression régulière
    const q = request.query.q ? new RegExp( '^' + request.query.q ) : new RegExp('^a');
    console.log( q );
    const q2 = request.query.q ? new RegExp( request.query.q ) : new RegExp('a');
    console.log( q2 );
    // on définie une condition pour rechercher les éventuelles termes q dans name et dans summary
    const condition = {$or:[ { name:q },{ summary:q2 } ]};
    // on effetue une recherche avec find et les méthodes connues de MongoDB
    const listing = myModel.find(condition,{_id:1,name:1,listing_url:1,summary:1,address:1}).skip(skip).limit( limit ).sort({_id:1});

    listing.exec( (err, result) => {
        response.send( result );
    });
});
