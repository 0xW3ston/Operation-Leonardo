const userModel = require('../models/userModel.js');
const eventModel = require('../models/eventsModel.js')
const formationModel = require('../models/formationsModel.js');
const coursModel = require('../models/coursModel.js');
const courEtudiantModel = require('../models/courEtudiantModel.js');

const controller = {
    index: async (req, res) => {
      const events = await eventModel.getAllEvents();
      const images = await  eventModel.getTopSixEventsImages();
      const formationLongDuree = await formationModel.getFormationsLongDuree();
      const formationImages = await formationModel.getFormationsImages();
      const formation1jDuree =await formationModel.getFormations1jDuree()
      res.render('acceuil',{title : 'acceuil page',events:events,images:images,formationLongDuree:formationLongDuree,formationImages:formationImages,formation1jDuree:formation1jDuree});
  },
  getManagePage:async function(req, res) {
    
    res.render('Manage', { title:"Manage"});
  },

  eventDetails: async (req, res) => {
    const  id= req.params.id ;
    const events = await eventModel.getEventById(id);
    const images = await  eventModel.getPathByEventId(id);
      res.render('eventDetails',{title : 'Details',events:events,images:images});
    },

    formationDetails: async (req, res) => {
      const  id= req.params.id ;
      const formations = await formationModel.getFormationById(id);
      const images = await  formationModel.getPathByFormationId(id);
        res.render('formationDetails',{title : 'Details',formationsD:formations,images:images});
      },

      allFormations: async (req, res) => {
          res.render('allFormations',{title : 'All formations'});
        },

    coursDetails: async (req, res) => {
      const cookie = req.cookies.Cookie || "";
      const etudient = await userModel.getUserBySessionKey(cookie);
      if(cookie && etudient){
        const  id= req.params.id ;
        const cours = await coursModel.findCourById(id);
        const etudientsAcces = await courEtudiantModel.findEtudiantParCours(id);
        const etudientAcces=[];
        etudientsAcces.map((e)=>etudientAcces.push(e.id_etudiant))
        console.log("etudieant ",etudient , etudientAcces)
        res.render('coursDetails',{title : 'Details',cours:cours,etudientAcces:etudientAcces,etudient:etudient.id});
      }else{
        res.redirect("/login");
      }
      },
    allcours: async (req, res) => {
        res.render('allCours',{title : 'All cours'});
      }

}
module.exports = controller;
