const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const paypalSDK = require('paypal-rest-sdk');
const logger = require('./utilities/log/format.js');
require('dotenv').config();

const controller = require('./controllers/controller.js');
const userController = require('./controllers/userController.js');
const eventsController = require('./controllers/eventsController.js');
const formationsController = require('./controllers/formationsController.js');
const formateursController = require('./controllers/formateursController.js');
const coursController = require('./controllers/coursController.js');
const etudiantController = require('./controllers/etudiantController.js')

const formationModel = require('./models/formationsModel.js')
const userModel = require('./models/userModel.js')
const coursModel = require('./models/coursModel.js');

paypalSDK.configure({
  mode: 'sandbox', // set to 'live' for production
  client_id: process.env.CLIENT_ID,
  client_secret: process.env.CLIENT_SECRET
});

const app = express();
const port = parseInt(process.env.PORT);
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
// allow json body (mine)
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(session({
  secret: 'secret1234',
  resave: false,
  saveUninitialized: true
}));

app.use(cookieParser());
app.use(express.static('public'));
app.use(expressLayouts);
app.set('layout','./layouts/layout');
app.use(express.static(__dirname + '/public'));

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

app.use(logger('FORMAT_MAIN'));

app.get('/', controller.index);
app.get('/manage',controller.getManagePage);
app.get('/eventDetails/:id',controller.eventDetails);
app.get('/formationDetails/:id',controller.formationDetails);
app.get('/allFormations',controller.allFormations);
app.get('/coursDetails/:id',controller.coursDetails);
app.get('/allCours',controller.allcours);

app.get('/addEvents', eventsController.getAddEventsPage);
app.post('/addEvents', eventsController.addEvent);
app.get('/manageEvents', eventsController.getManageEventsPage);
app.get('/deleteEvent/:id', eventsController.getdeleteEvent);
app.get('/updateEvent/:id', eventsController.getUpdateEvent);
app.post('/updateEvent', eventsController.updateEvent);
app.get('/deleteImage/:id', eventsController.getdeleteImage); //===>new

app.get('/addFormations',formationsController.getAddformationsPage);
app.post('/addFormations',formationsController.addformation);
app.get('/manageFormations',formationsController.getManageformationsPage);
app.get('/deleteFormation/:id',formationsController.getdeleteformation);
app.get('/updateFormation/:id',formationsController.getUpdateformation);
app.post('/updateFormation',formationsController.updateformation);
app.get('/deleteImage2/:id', formationsController.getdeleteImage);

app.get('/addformateur',formateursController.getAddformateursPage);
app.post('/addformateurs',formateursController.addformateur);
app.get('/manageformateurs',formateursController.getManageformateursPage);
app.get('/deleteformateur/:id',formateursController.getdeleteformateur);
app.get('/updateformateur/:id',formateursController.getUpdateformateur);
app.post('/updateformateur',formateursController.updateformateur);

app.get('/addCours',coursController.getAddCoursPage);
app.post('/addCours',coursController.addCours);
app.get('/manageCours',coursController.getManageCoursPage);
app.get('/deleteCours/:id',coursController.getdeleteCours);
app.get('/updateCours/:id',coursController.getUpdateCours);
app.post('/updateCours',coursController.updateCours);
app.get('/deleteCoursFile/:id', coursController.getdeleteCoursFile);

app.get('/login', userController.getLoginPage);
app.post('/login', userController.login);
app.get('/signup', userController.getSignupPage);
app.get('/verify', userController.verifySignup);
app.post('/signup', userController.signup);
app.get('/logout', userController.logout);

app.get('/pay',etudiantController.getBuyCoursePage);
app.post('/pay',etudiantController.buyCourse);
app.get('/checkout',etudiantController.buyCourseCheckoutPage);
app.get('/cancel',etudiantController.buyCancelPage);

// Cour Search
app.get('/api/cours',coursController.getCoursAPIEndpoint)
// PDF And Course
app.get('/cour/:id',etudiantController.viewCourse);