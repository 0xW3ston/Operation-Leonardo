const formationModel = require('../models/formationsModel.js');
const userModel = require('../models/userModel.js');
const fs = require('fs');
const multer = require('multer');
const path = require('path');


const storage = multer.diskStorage({
  destination: (req, file,cb) => {
    cb(null, 'public/formationsUploads'); // specify the destination directory for uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '.' + Date.now() + '.' + Math.round(Math.random() * 1E6) + path.extname(file.originalname)); // specify the file name format

  }
});

const upload =multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1000 * 1000 }, // 1 MB, can also write it as 1 * 1E6
  fileFilter: (req, file,cb) => {
    const filetypes = /jpeg|jpg|png|gif|webp/; /// <== Added webp

    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype); // Check mime type

    if(mimetype && extname){
      cb(null,true); // No need to return the callback's result, I think that's why it kept stuck.
    } else {
      cb('Error: Images only!', false);
    } 
  }
}).fields([
  { name: 'myImage' }, // specify the field that accepts files and the max number of files
  { name: 'label' }, // specify a non-file field
  { name: 'duree' }, // specify a non-file field
  { name: 'description' } // specify a non-file field
]);

//===========================

const formationsController = {
      getAddformationsPage:async function(req, res) {
          res.render('addFormations', { title:"Add formations"});
      },

      getManageformationsPage:async function(req, res) {
          const formations = await formationModel.getAllFormations();
          res.render('manageFormations', { title:"Manage formations",formations:formations});
      },

//======================================
      addformation:  function(req, res){ 
        upload(req, res, async (err) => {
          const label = req.body.label;
          const duree = req.body.duree;
          const description = req.body.description;
          const images=req.files.myImage;
          if (err) return res.send({ error: 'error:' + err })
          await formationModel.createFormation(label,duree,description)        
          const Id = await formationModel.maxFormationId()
          const maxId = Id[0].maxId ;
            console.log("maxid  ",maxId);
            console.log(images);
            images && images.map(async file => 
              await formationModel.insertFormationimages(
                maxId,path.join('/formationsUploads', file.filename)
              )
            );
            res.redirect('/manageFormations')
          });
      },
    
//=====================================

      getdeleteformation:async function(req,res){
        const formationId = req.params.id ;
        const paths = await formationModel.getPathByFormationId(formationId);
        console.log("ppaaathhss  ",paths)
        paths.map((p)=>{    
          console.log("ppaaathhss1111  ",p)  
          console.log("ppaaathhss2222  ",p.path) 
          fs.unlink("public/"+p.path, async (err) => {

            if (err) {
              console.error(err);
            }
          })  
       
        })
        await formationModel.deleteFormation(formationId)
        res.redirect("/manageFormations")
      },

      getdeleteImage: async function(req,res){
        const imageId = req.params.id ;
        console.log("iddddddd" ,imageId);
        const p = await formationModel.getPathByImage(imageId)
        console.log("pathdelete  ", p)
        formationModel.deleteImage(imageId)
        fs.unlink("public/"+p.path, async (err) => {
            if (err) {
              console.error(err);}
            res.json({ message: "Image deleted successfully." });
          })
    },
      // 
      getUpdateformation:async function(req,res){
          const formationId = req.params.id ;
          const formation = await formationModel.getFormationById(formationId)
           const images = await formationModel.getFormationImages(formationId)
           console.log("immgg111", images)
            const img = [];
            const ids = [];
            images && images.map(image => {
               img.push(image.path)
               ids.push(image.id)    
            });
            console.log("imaagggee ",img);
          res.render('updateFormation', { title:"Update formations",formation:formation,images:img,ids:ids});
      },
      updateformation:async function(req, res) {
        upload(req, res, async(err) => {
        const Id = req.body.id ;
        const label = req.body.label;
        const duree = req.body.duree;
        const description = req.body.description;
        console.log(label,duree,description,Id)
        await formationModel.updateFormations(Id,label,duree,description)
        const images=req.files.myImage;
        images && images.map(async file => 
          await formationModel.insertFormationimages(
              Id,path.join('/formationsUploads', file.filename)
            )
          )
        }
        );
        res.redirect('/manageFormations')
          },
      
}

module.exports = formationsController;

