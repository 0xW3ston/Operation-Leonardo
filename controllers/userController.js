const userModel = require('../models/userModel.js');
const crypto = require('crypto');

// Youssef's Libraries
const axios = require('axios');
const nodemailer = require("nodemailer");

////////////////////////////////////////////
require('dotenv').config();
// SETUP OF MAIL --------- START --------------
let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_EMAIL,
      pass: process.env.GMAIL_TOKEN
    }
  });

async function sendMail(to,subject,body){
  const options = {
    from: 'professionalidrissi@gmail.com',
    to: to,
    subject: subject,
    html:body
  };
  try {
    let info = await transporter.sendMail(options);
    console.log('Email sent: ' + info.response);
  } catch (error) {
    console.log(error);
  }
}
// SETUP OF MAIL --------- END --------------
//////////////////////////////////////////////

function hash_SHA256(val) {
  return crypto.createHash('sha256').update(val).digest('hex');
}

function generateRandomString(length = 10) {
  const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const charactersLength = characters.length;
  let randomString = '';
  for (let i = 0; i < length; i++) {
    randomString += characters[Math.floor(Math.random() * charactersLength)];
  }
  return randomString;
}

const userController = {
  getLoginPage: async function(req, res) {

      res.render('login', { title:"Se connecter",message:req.session.message});
      delete req.session.message;

  },

  login: async function(req, res,next) {
    const email = req.body.email;
    const password = req.body.password;
    const user = await userModel.getUserByEmail(email);
    console.log(user);
    //====> i took off && user.Mail_Verified 
      if(user && user.password === crypto.createHash('sha256').update(password).digest('hex')){ 
        const randomString = generateRandomString(10);
        const date = new Date().valueOf().toString();
        const userId = user.id;
        const salt = "my-app-secret-salt";
        const sessionKey = hash_SHA256(randomString + date + userId + salt);
        res.cookie('Cookie', sessionKey);
        await userModel.updateSessionKey(sessionKey,user.id);  
        res.redirect("/")
      }  
      else{
        req.session.message = "email or password not correct !";
        res.redirect("/login")
      }
  },
  getSignupPage: function(req, res) {
      res.render('signup', {title:"S'inscrire",message2:req.session.m});
    
  },
  
  signup: async function(req, res) {
    const email = req.body.email;
    const nom = req.body.nom;
    const prenom = req.body.prenom;
    const password = req.body.password;
    // Youssef's Captcha Verification Code [Backend]
    const recaptchaResponse = req.body['g-recaptcha-response'];
    const secretKey = process.env.CAPTCHA_PRIVATE_KEY;

    const verificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptchaResponse}`;

    try {
      const response = await axios.post(verificationUrl);
      const { success } = response.data;
          console.log(success);
      if (success) {
        console.log("verified")
      } else {
        console.log("not verified")
        req.session.m = "Captcha had an error, please try again";
        res.redirect('/signup');
        return;
      }
    } catch (error) {
      console.log(error)
      req.session.m = "Captcha had an error, please try again";
      res.redirect('/signup');
      return;
    }
    // Youssef's Email Verification Token generation
    const randomString = generateRandomString(10);
    const date = new Date().valueOf().toString();
    const salt = "my-app-secret-salt";
    const randomGeneratedVerifyToken = hash_SHA256(randomString + date + email + salt);
    const n = await userModel.getNumberUsersByEmail(email);

    console.log(n[0]['n']);
    if(n[0]['n'] === 0){
      await userModel.createUser(email,nom,prenom, crypto.createHash('sha256').update(password).digest('hex'),randomGeneratedVerifyToken);
      // Youssef's Email Verification: sending the actual email and verifying with it.
      await sendMail(email,"Verify Your Account...",`<a href="${process.env.DOMAIN_NAME}/verify?token=${randomGeneratedVerifyToken}">Verify My Account</a>`)
      req.session.message = 'Check your Email for verification Link';
      res.redirect('/login');
    }else{
      req.session.m = "email deja exist"
      res.redirect('/signup');
    }
  },
  verifySignup: async function(req,res) {
    // Add Encryption or Hashing to hide the User ID !!!!!!!!
    const { token } = req.query;
    console.log(token);
    // Redirect to Error Page or just Accueil.
    if(!token){
      res.redirect('/');
      return;
    }
    
    const user = await userModel.getUnverifiedUsersByToken(token);
    console.log(user);
    // Redirect to  Accueil Because already verified or if user doesn't exist or if the verification token is empty/NULL
    if(!user || user['Mail_Verified'] === 1 || !user['Verify_Token']){
      console.log(user);
      res.redirect('/');
      return;
    }

    
    const realToken = user['Verify_Token'];
    // If the token is real and correct
    // Then the SessionID will be updated on the Database + The user (the one with the link) will be redirected to "Accueil" as a logged in.
    // !!!!! VERIFICATION THEN LOGIN !!!!!!!!!
    if(token == realToken){
      //
      const randomString = generateRandomString(10);
      const date = new Date().valueOf().toString();
      const userId = user.id;
      const salt = "my-app-secret-salt";
      //
      await userModel.activateUserByToken(token);
      const sessionKey = hash_SHA256(randomString + date + userId + salt);
      res.cookie('Cookie', sessionKey);
      await userModel.updateSessionKey(sessionKey,user.id);
    }
    res.redirect("/");
    return;
  },
  logout: function(req, res) {
    delete req.session.user;
    res.clearCookie('Cookie');
    res.redirect('/login');
  }
};

module.exports = userController;
