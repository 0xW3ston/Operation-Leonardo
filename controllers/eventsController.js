const eventModel = require('../models/eventsModel.js');
const userModel = require('../models/userModel.js');
const fs = require('fs/promises');
const multer = require('multer');
const path = require('path');


const storage = multer.diskStorage({
  destination: (req, file,cb) => {
    cb(null, 'public/eventsUploads'); // specify the destination directory for uploaded files
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
  { name: 'caption' }, // specify a non-file field
  { name: 'description' } // specify a non-file field
]);

//===========================

const eventsController = {
      getAddEventsPage:async function(req, res) {
          res.render('addEvents', { title:"Add events"});
      },

      getManageEventsPage:async function(req, res) {
          const events = await eventModel.getAllEvents();
          res.render('manageEvents', { title:"Manage events",events:events});
      },

//======================================
      addEvent:  function(req, res){ 
        console.log("before " , req.body.label)
        upload(req, res, async (err) => {
          console.log("after " , req.body.label)
          const label = req.body.label;
          const caption = req.body.caption;
          const description = req.body.description;
          await eventModel.createEvent(label,caption,description)        
          console.log('save the file', req.files)
          const images=req.files.myImage;
          const Id = await eventModel.maxEventId()
          console.log("iddd  ",Id)
            const maxId = Id[0].maxId ;
            console.log("maxid  ",maxId)
            images && images.map(async file => 
              await eventModel.insertEventimages(
                maxId,path.join('/eventsUploads', file.filename)
              )
            );
            res.redirect('/manageEvents')
          });
      },
    
//=====================================

      getdeleteEvent:async function(req,res){
        const eventId = req.params.id ;
        const paths = await eventModel.getPathByEventId(eventId);
        console.log("ppaaathhss  ",paths)
        paths && paths.map(async (p)=>{    
          console.log("ppaaathhss1111  ",p)  
          console.log("ppaaathhss2222  ",p.path) 
          await fs.unlink("public/"+p.path, async (err) => {

            if (err) {
              console.error(err);
            }
          }) 
        })
        await eventModel.deleteEvent(eventId)
        res.redirect("/manageEvents")
      },

      getdeleteImage: async function(req,res){
        const imageId = req.params.id ;
        console.log("iddddddd" ,imageId);
        const p = await eventModel.getPathByImage(imageId)
        console.log("pathdelete  ", p)
        await eventModel.deleteImage(imageId)    
        await fs.unlink("public/"+p.path, async (err) => {
            if (err) {
              console.error(err);}
            res.json({ message: "Image deleted successfully." });
          })
    },


      getUpdateEvent:async function(req,res){
        const cookie = req.cookies.Cookie;
        if(cookie !== undefined){
          const user = await userModel.getUserBySessionKey(cookie);
          const eventId = req.params.id ;
          const event = await eventModel.getEventById(eventId)
           const images = await eventModel.getEventImages(eventId)
           console.log("immgg111", images)
            const img = [];
            const ids = [];
            images && images.map(image => {
               img.push(image.path)
               ids.push(image.id)    
            });console.log("imaagggee ",img)

          res.render('updateEvent', { title:"Update events",user:user.type,event:event,images:img,ids:ids});
        }else{
          res.render('updateEvent', { title:"Update events",user:""});
        }
      },
      updateEvent:async function(req, res) {
        upload(req, res, async(err) => {
        const Id = req.body.id ;
        const label = req.body.label;
        const caption = req.body.caption;
        const description = req.body.description;
        console.log(label,caption,description,Id)
        await eventModel.updateEvents(Id,label,caption,description)
        const images=req.files.myImage;
        if (images !== undefined){
        images.map(async file => 
          await eventModel.insertEventimages(
            Id,path.join('/eventsUploads', file.filename)
            )
          )}
        }
        );

        res.redirect('/manageEvents')
          },
      
}

module.exports = eventsController;

