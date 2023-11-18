const formateurModel = require('../models/formateursModel.js');
const userModel = require('../models/userModel.js');
const crypto = require('crypto');

const formateursController = {
    getAddformateursPage: async function(req, res) {    
          res.render('addformateur', { title:"Add formateurs",message2:req.session.m});
    },
    getManageformateursPage: async function(req, res) {
        const cookie = req.cookies.Cookie;
        const formateurs = await formateurModel.getAllformateurs()
        res.render('manageformateurs', { title:"Manage formateurs",formateurs:formateurs});
    },
      addformateur: async function(req, res) {
        const nom = req.body.nom;
        const prenom = req.body.prenom;
        const email = req.body.email;
        const password = req.body.password;
        const n = await userModel.getNumberUsersByEmail(email);
        console.log(n);
        if(n[0].n === 0){
          await formateurModel.createformateur(nom,prenom,email,crypto.createHash('sha256').update(password).digest('hex'));
          res.redirect('/manageformateurs');
        }
        else{
          req.session.m = "email deja exist"
          res.redirect('/addformateur');
        }
            
      },
      deletformateur: async function(req,res){
        req.formateur = { id: req.params.id };
        await formateurModel.deleteformateur(req.formateur.id)
        res.redirect("/manageformateurs");

      },
      getdeleteformateur:async function(req,res){
        const formateurId = req.params.id ;
        await formateurModel.deleteformateur(formateurId)
        res.redirect("/manageformateurs");
      },
 
      getUpdateformateur:async function(req,res){
          const formateurId = req.params.id ;
          const formateur = await formateurModel.getformateurById(formateurId);
          res.render('updateformateur', { title:"Update formateurs",formateur:formateur,message2:req.session.m});
      },

      updateformateur: async function(req, res) {
        const Id = req.body.id ;
        const nom = req.body.nom;
        const prenom = req.body.prenom;
        const email = req.body.email;
        const n = await userModel.getNumberUsersByEmail(email)
        const f = await formateurModel.getformateurById(Id);
        let Password = req.body.password;
        if((n[0].n === 1 && f.email === email) ||n[0].n === 0 ){
          if(Password === '12345'){
            await formateurModel.updateformateurs(Id,nom,prenom,email,f.password)
            res.redirect('/manageformateurs');
          } else{
            await formateurModel.updateformateurs(Id,nom,prenom,email,crypto.createHash('sha256').update(Password).digest('hex'))
            res.redirect('/manageformateurs');
          }
        }else{
          req.session.m = "email deja exist"
          res.redirect(`/updateformateur/${Id}`);
        }
           
      },
      
}
module.exports = formateursController;

