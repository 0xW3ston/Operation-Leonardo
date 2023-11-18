const coursModel = require('../models/coursModel');
const userModel = require('../models/userModel.js');
const muhammara = require('muhammara');
const fs = require('fs').promises;
const multer = require('multer');
const path = require('path');

//==================

//=========> password for pdf
async function PasswordForPDF(input,output,pass){
  const Recipe = muhammara.Recipe;
  // Set the password and the file paths
  const password = pass;
  const inputFile = input;
  const outputFile = 'public/cours/' + output;
  console.log(outputFile)
  const pdfDoc = new Recipe(inputFile, outputFile);
  pdfDoc
  .encrypt({
    userPassword: password,
    ownerPassword: password,
    userProtectionFlag: 4,
  })
  .endPDF();
}
//=============> generate a random password
function generateRandomString(length) {
  const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const charactersLength = characters.length;
  let randomString = '';
  for (let i = 0; i < length; i++) {
    randomString += characters[Math.floor(Math.random() * charactersLength)];
  }
  return randomString;
}

//=======> multer

const storage = multer.diskStorage({
    destination: (req, file,cb) => {
      cb(null, 'public/cours'); // specify the destination directory for uploaded files
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname); // specify the file name format
    }
  });
  
  const upload =multer({ 
    storage: storage,
    // limits: { fileSize: 1 * 1000 * 1000 }, // 1 MB, can also write it as 1 * 1E6
    fileFilter: (req, file,cb) => {
      const filetypes = /pdf/; /// <== Added webp
  
      const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
      const mimetype = filetypes.test(file.mimetype); // Check mime type
  
      if(mimetype && extname){
        cb(null,true); // No need to return the callback's result, I think that's why it kept stuck.
      } else {
        cb('Error: Images only!', false);
      } 
    }
  }).fields([
    { name: 'coursPdf' }, // specify the field that accepts files and the max number of files
    { name: 'label' }, // specify a non-file field
    { name: 'montant' },
    { name: 'description' },
    { name : 'payant'}
  ]);


//====================

const coursController = {
  getCoursAPIEndpoint: async function(req,res){
    const { q } = req.query;
    if(!q){
        res.sendStatus(302);
    }
    const matchedData = await coursModel.Top10CoursByKeyword(q);
    console.log(matchedData);
    res.json(matchedData);
    return;
  },

    getAddCoursPage:async function(req, res) {
          res.render('addCours', { title:"Add cours"});
      },

    getManageCoursPage:async function(req, res) {
          const cours = await coursModel.getAllCours();
          const cookie = req.cookies.Cookie;
        if(cookie){
                const user = await userModel.getUserBySessionKey(cookie);
                formateurId = user.id;
        }
          res.render('manageCours', { title:"Manage cours",cours:cours,formateurId:formateurId}); 
      },
//============================

    addCours:  function(req, res){ 
        upload(req, res, async (err) => {
          const label = req.body.label;
          const montant = req.body.montant ? req.body.montant : 0.00;
          const description = req.body.description
          const coursPdf=req.files.coursPdf;
          const cookie = req.cookies.Cookie;
          //=========== payant
          const payant = req.body.payant== '0' ? 0 : 1;
          //======= generate password here ==
          const password = generateRandomString(32);
          //====
          const formateurId = await userModel.getUserBySessionKey(cookie) ;
          if (err) return res.send({ error: 'error:' + err })
          coursPdf.map(async (file) =>{ 
            const toInsertPDFname =  file.fieldname + '.' + Date.now() + '.' + Math.round(Math.random() * 1E6) + path.extname(file.originalname);
            const unEncryptedPDF = file.path;
            await PasswordForPDF(unEncryptedPDF,toInsertPDFname,password);
            const coursPath = '\\\\cours\\\\' + toInsertPDFname;
            await coursModel.addCour(formateurId.id,label, coursPath,description,montant,payant,password);
            try{
                await fs.unlink(file.path);
            }catch(err){
                // Error as in the old unEncrypted files were not removed.
                console.log("Not removed file error");
            }
          }
          );
            res.redirect('/manageCours')
          });
    },
//==========================

//=============> delete cours file in update 

    getdeleteCoursFile: async function(req,res){
      const coursId = req.params.id ;
      const coursPath = await coursModel.findCourById(coursId);
      await coursModel.updateCoursPathById(coursId,null);
      fs.unlink("public/"+coursPath.cours_path, (err) => {
          if (err) {
            console.error(err);}
          res.json({ message: "Image deleted successfully." });
        })
  },

//==========> update

    getUpdateCours:async function(req,res){
        const coursId = req.params.id ;
        const cours = await coursModel.findCourById(coursId)  //cours by id
        console.log(cours, coursId);
        res.render('updateCours', { title:"Update events",cours:cours});
    },

    updateCours:async function(req, res) {
      upload(req, res, async (err) => {
        const Id = req.body.id ;
        const label = req.body.label;
        const montant = req.body.montant ? req.body.montant : 0.00;
        const description = req.body.description;
        const cookie = req.cookies.Cookie;
        //=========== payant 
        const payant = req.body.payant== '0' ? 0 : 1;
        //====
        const formateurId = await userModel.getUserBySessionKey(cookie) ;
        if (err) return res.send({ error: 'error:' + err })
        if(req.files.coursPdf !== undefined){
          var coursPdf=req.files.coursPdf;  
          coursPdf && coursPdf.map(async (file) =>{ 
            const toInsertPDFname =  file.fieldname + '.' + Date.now() + '.' + Math.round(Math.random() * 1E6) + path.extname(file.originalname);
            const unEncryptedPDF = file.path;
            const password = generateRandomString(32);
            await PasswordForPDF(unEncryptedPDF,toInsertPDFname,password);
            const coursPath = '\\\\cours\\\\' + toInsertPDFname;
            await coursModel.updateCourById(Id,formateurId.id,label,coursPath,description,montant,payant,password);
            try{
              await fs.unlink(file.path);
            }catch(err){
                // Error as in the old unEncrypted files were not removed.
                console.log("Not removed file error");
            }
        });
        } else {
          const cours = await coursModel.findCourById(Id);
          const coursPdf = cours.cours_path;
          console.log(cours);
          await coursModel.updateCourById(Id,formateurId.id,label,coursPdf,description,montant,payant)
        }
          res.redirect('/manageCours')
        });

    },
    
    getdeleteCours:async function(req,res){
      const coursId = req.params.id ;
      const coursPath = await coursModel.findCourById(coursId);
      await coursModel.deleteCourById(coursId)
      try{
        await fs.unlink("public"+coursPath.cours_path);
      }catch(err){
        // throw err;
      }
      res.redirect("/manageCours")
    },

}
module.exports = coursController;
