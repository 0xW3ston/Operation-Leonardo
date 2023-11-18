const coursModel = require('../models/coursModel');
const userModel = require('../models/userModel');
const courEtudiantModel = require('../models/courEtudiantModel');
const payementModel = require('../models/payementModel');
require('dotenv').config();
const paypal = require('paypal-rest-sdk');


module.exports = {
    getBuyCoursePage:
    async function(req, res){
        const allCours = await coursModel.getAllCours();

        res.render('course', 
            { title:"Update formations",user:"",cours:allCours}
        );
        return;
    },
    buyCourse:
    async function (req, res){
        const { courId } = req.body;
        const cookie = req.cookies.Cookie;
        let user;
        if(cookie){
          user = await userModel.getUserBySessionKey(req.cookies.Cookie);
        }
        if(!user){
          console.log("Not logged In");
          res.redirect('/');
          return;
        }
        const courEtudiant = await courEtudiantModel.findCourEtudiant(courId,user['id'])
        const selectedCour = await coursModel.findCourById(courId);

        if(courEtudiant || selectedCour['payant'] == 0){
            console.log("Déja purchased / Cour Gratuit");
            res.redirect('/');
            return;
            // Redirect to course Page.
        }
        
        
        if(!selectedCour){
           console.log("No Course Found");
            res.redirect('/');
            return;
            // Course Doesn't exist.
        }
        
        
        const paymentData = {
            intent: 'sale',
            payer: {
              payment_method: 'paypal'
            },
            redirect_urls: {
              return_url: `${process.env.DOMAIN_NAME}/checkout?amount=` + selectedCour['montant'] + "&courId=" + selectedCour['id'],
              cancel_url: `${process.env.DOMAIN_NAME}/cancel`
            },
            transactions: [{
              amount: {
                total: selectedCour['montant'],
                currency: 'USD'
              },
              description: "Course",
              item_list: {
                items: [{
                  name: selectedCour['titre'],
                  quantity: 1,
                  price: selectedCour['montant'],
                  currency: 'USD'
                }]
              }
            }]
          };
            
          paypal.payment.create(paymentData, (error, payment) => {
            if (error) {
              console.error(error);
              res.redirect('/error');
            } else {
              for (let i = 0; i < payment.links.length; i++) {
                if (payment.links[i].rel === 'approval_url') {
                  res.redirect(payment.links[i].href);
                }
              }
            }
          });
    },
    buyCourseCheckoutPage:
    async function (req, res){
        const { paymentId, PayerID ,amount, courId } = req.query
        const executePaymentData = {
            payer_id: PayerID,
            transactions: [{
            amount: {
                currency: 'USD',
                total: amount
            }
            }]
        }
        paypal.payment.execute(paymentId, executePaymentData,async (error, payment) => {
            if (error) {
            console.error(error);
            res.redirect('/');
            } else {

              if(payment.state === 'approved'){
                const user = await userModel.getUserBySessionKey(req.cookies.Cookie);
                await courEtudiantModel.addCourEtudiant(courId,user['id']);
                await payementModel.addPayement(courId, user['id'], payment.transactions[0]['amount']['total'], payment.payer.payment_method,PayerID,paymentId)
                res.redirect('/');
                return;
              }
            }
        });
    },
    buyCancelPage:
    function (req,res){
      console.log('cancel');
      res.redirect('/');
    },
    viewCourse: async (req,res) => {
      const cookie = req.cookies.Cookie || "";
      const etudient = await userModel.getUserBySessionKey(cookie);
      if(cookie && etudient){
        const {id} = req.params;
        const isCourseOwned = await courEtudiantModel.findCourEtudiant(id,etudient.id);
        const courData = await coursModel.findCourById(id);
        if(isCourseOwned || (courData && courData.payant == 0)){
          res.render('viewCourse',{ title:"Course View",user:etudient.type,cour:courData});
          return;
        };
        console.log("Course Not Owned/Or it doesn't exist");
        res.redirect('/');
        return;
      }else{
        res.redirect("/login");
      }
    }
}