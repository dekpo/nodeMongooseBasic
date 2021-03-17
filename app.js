// on importe le module mongoose
const mongoose = require('mongoose');
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
const listing = myModel.find({},{name:1}).limit(5);
listing.exec( (err, result) => {
    console.log( result );
});
