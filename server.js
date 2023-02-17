const express = require('express');
const bodyParser = require('body-parser');
const Amadeus = require('amadeus');
const res = require('express/lib/response');
require('dotenv').config();
const port = 3000;


const app = express();
// app.use(express.static('public'));

//BodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// API Configs
var amadeus = new Amadeus({
    clientId:"8atLeUIV0qA14tbTgk2lRUommae4y1Mb",
    clientSecret:"nmDY8XrIdblsf5Hi",
    logLevel: 'debug'

});

//Routes
app.get('/flightoffers', (req, res)=>{
   res.send("Hello, 200!")
});


app.post('/flightoffers', (req, res)=>{
    const Source = req.body.source;
    const Destination = req.body.destination;
    const Date = req.body.date;
    const Adults = req.body.adults;
    const TravelClass = req.body.travelClass;

    let flightResults = getFlights(Source, Destination,Date,Adults,TravelClass);
    console.log(flightResults)
    res.send(flightResults);

});


app.get('/bookings/:bookingId', (req, res)=>{

   const BookingId = req.params.bookingId;
    
     
});

app.post('/bookings/:bookingId', (req, res)=>{

    const travellers = req.body.travellers;
    const flightOffers = req.body.flightOffers;

    let booking_response = makeBooking(flightOffers, travellers);

    console.log(booking_response);
});




//Get Flights
function getFlights(source, destination,date, adults,travelClass) {

    amadeus.shopping.flightOffersSearch.get({
        originLocationCode: `${source}`,
        destinationLocationCode: `${destination}`,
        departureDate: `${date}`, // YYYY-MM-DD
        adults: `${adults}`,
        travelClass: `${travelClass}`,
        currencyCode: 'USD',
        max:2,
        }).then(function(response){
                console.log("=====", response.data);
        }).catch(function(responseError){
                console.log("Error getting the data.");
                console.log(responseError.code);
        });
}



// Booking API
function makeBooking(flightOffers, travellers){

    amadeus.booking.flightOrders.post(
          JSON.stringify({
            'data': {
              'type': 'flight-order',
              'flightOffers': [flightOffers],
              'travelers': travellers,
            }
          })
        ).then(function (response) {
        console.log("This the DATA====",response.data);
      }).catch(function (response) {
        console.error(response);
      });
}



app.listen(port, ()=>{
    console.log(`Server listening on ${port}`);
});