const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const crypto = require('crypto');
// Youssef's Libraries
const logger = require('./utilities/log/format.js');
const axios = require('axios');
require('dotenv').config();

//----------- Controllers ------------
const controller = require('./controllers/controller.js');
const userController = require('./controllers/userController.js');
const eventsController = require('./controllers/eventsController.js');
const formationsController = require('./controllers/formationsController.js');
const formateursController = require('./controllers/formateursController.js');
const coursController = require('./controllers/coursController.js');
const etudiantController = require('./controllers/etudiantController.js')
//============models =====
const formationModel = require('./models/formationsModel.js')
const userModel = require('./models/userModel.js')
const coursModel = require('./models/coursModel.js');



// PAYPAL:
const paypal = require('paypal-rest-sdk');

paypal.configure({
  mode: 'sandbox', // Change to 'live' for production
  client_id: process.env.CLIENT_ID,
  client_secret: process.env.CLIENT_SECRET
});


//----------------------------



const app = express();
const port = parseInt(process.env.PORT);
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
// allow json body (mine)
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: true
}));

app.use(cookieParser());
app.use(express.static('public'));
app.use(expressLayouts);
app.set('layout','./layouts/layout');
app.use(express.static(__dirname + '/public'));

//============> chaymae's middlewar

app.use(async(req, res, next) => {
        const cookie = req.cookies.Cookie;
        const user = await userModel.getUserBySessionKey(cookie || " ");
        if(cookie && user){
                res.locals.user = user.type;
        }
        else{
                res.locals.user = "";
        }
        const formations = await formationModel.getAllFormations();
        res.locals.formations = formations; // Set the user's name as a local variable
        const courses = await coursModel.getAllCours();
        res.locals.courses = courses;
        next();
});

//=============

// Youssef's Middlewares
app.use(logger('FORMAT_MAIN'));

// //-- Routes ---------------
app.get('/', controller.index);
app.get('/manage',controller.getManagePage);
app.get('/eventDetails/:id',controller.eventDetails);
app.get('/formationDetails/:id',controller.formationDetails);
app.get('/allFormations',controller.allFormations);
app.get('/coursDetails/:id',controller.coursDetails);
app.get('/allCours',controller.allcours);



        //--------------
app.get('/addEvents', eventsController.getAddEventsPage);
app.post('/addEvents', eventsController.addEvent);
app.get('/manageEvents', eventsController.getManageEventsPage);
app.get('/deleteEvent/:id', eventsController.getdeleteEvent);
app.get('/updateEvent/:id', eventsController.getUpdateEvent);
app.post('/updateEvent', eventsController.updateEvent);
app.get('/deleteImage/:id', eventsController.getdeleteImage); //===>new



         //-----------------
app.get('/addFormations',formationsController.getAddformationsPage);
app.post('/addFormations',formationsController.addformation);
app.get('/manageFormations',formationsController.getManageformationsPage);
app.get('/deleteFormation/:id',formationsController.getdeleteformation);
app.get('/updateFormation/:id',formationsController.getUpdateformation);
app.post('/updateFormation',formationsController.updateformation);
app.get('/deleteImage2/:id', formationsController.getdeleteImage);
        //-------------------
app.get('/addformateur',formateursController.getAddformateursPage);
app.post('/addformateurs',formateursController.addformateur);
app.get('/manageformateurs',formateursController.getManageformateursPage);
app.get('/deleteformateur/:id',formateursController.getdeleteformateur);
app.get('/updateformateur/:id',formateursController.getUpdateformateur);
app.post('/updateformateur',formateursController.updateformateur);

        //============= cours routes
app.get('/addCours',coursController.getAddCoursPage);
app.post('/addCours',coursController.addCours);
app.get('/manageCours',coursController.getManageCoursPage);
app.get('/deleteCours/:id',coursController.getdeleteCours);
app.get('/updateCours/:id',coursController.getUpdateCours);
app.post('/updateCours',coursController.updateCours);
app.get('/deleteCoursFile/:id', coursController.getdeleteCoursFile); //===>new


//================


         

        //------------------
app.get('/login', userController.getLoginPage);
app.post('/login', userController.login);
app.get('/signup', userController.getSignupPage);
// Youssef's Route
app.get('/verify', userController.verifySignup);
//
app.post('/signup', userController.signup);
app.get('/logout', userController.logout);

// Payement
app.get('/pay',etudiantController.getBuyCoursePage);
app.post('/pay',etudiantController.buyCourse);
app.get('/checkout',etudiantController.buyCourseCheckoutPage);
app.get('/cancel',etudiantController.buyCancelPage);

// Cour Search
app.get('/api/cours',coursController.getCoursAPIEndpoint)
// PDF And Course
app.get('/cour/:id',etudiantController.viewCourse);





// // Payement
// app.get('/pay',(req,res) => {
//   res.render('course', { title:"Update formations",user:""});
// })

// app.post('/pay', (req, res) => {
//   const { amount, currency } = req.body;

//   const paymentData = {
//     intent: 'sale',
//     payer: {
//       payment_method: 'paypal'
//     },
//     redirect_urls: {
//       return_url: 'http://hightower.ddns.net/success?amount=' + amount,
//       cancel_url: 'http://hightower.ddns.net/cancel'
//     },
//     transactions: [{
//       amount: {
//         total: amount,
//         currency
//       },
//       description: 'Russian Made Intercontinental Thermonuclear Weapon',
//       item_list: {
//         items: [{
//           name: 'Russian Made Intercontinental Thermonuclear Weapon',
//           description: 'Following by the interpol',
//           quantity: 1,
//           price: amount,
//           currency: currency
//         }]
//       }
//     }]
//   };

//   paypal.payment.create(paymentData, (error, payment) => {
//     if (error) {
//       console.error(error);
//       res.redirect('/error');
//     } else {
//       for (let i = 0; i < payment.links.length; i++) {
//         if (payment.links[i].rel === 'approval_url') {
//           res.redirect(payment.links[i].href);
//         }
//       }
//     }
//   });
// });

// app.get('/success', (req, res) => {
//   const { paymentId, PayerID ,amount } = req.query;

//   const executePaymentData = {
//     payer_id: PayerID,
//     transactions: [{
//       amount: {
//         currency: 'USD',
//         total: amount
//       }
//     }]
//   };

//   paypal.payment.execute(paymentId, executePaymentData, (error, payment) => {
//     if (error) {
//       console.error(error);
//       res.redirect('/');
//     } else {
//       console.log(payment);
//       res.redirect('/');
//     }
//   });
// });

// app.get('/cancel', (req, res) => {
//   console.log("cancel");
//   res.redirect('/');
// });


// // app.get('/login', (req, res) => {
// //   res.render('login',{'title':'Se connecter'});
// // });
// // for a special layout
// // app.get("/a",(req,res)=>{res.render('view',{layout:"path of special layout"})});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

