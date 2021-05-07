const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const { check, validationResult } = require('express-validator');

// Utilities and Beans
const rootDir = require('../Utilities/path')
const mysqlUtilities = require('../Utilities/MysqlUtilities');
const User = require('../Beans/User')
const Mail = require('../Beans/Mail')


// LocalStorage for Node
if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./scratch');
}

// Router
const router = express.Router();
const app = express();
app.use(bodyParser.json());

//nodemailer
const nodemailer = require('nodemailer');
const sgTransport = require('nodemailer-sendgrid-transport');
const options = {
    auth: {

        api_key: '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'

    }
}



// index page
router.get('/', function(req, res) {
    res.render('./pages/index');
});

// Content pages

router.get('/attractions', function(req, res) {
    res.render('./pages/attractions');
});
router.get('/attraction1', function(req, res) {
    res.render('./pages/attraction1');
});
router.get('/attraction2', function(req, res) {
    res.render('./pages/attraction2');
});
router.get('/attraction3', function(req, res) {
    res.render('./pages/attraction3');
});
router.get('/attraction4', function(req, res) {
    res.render('./pages/attraction4');
});

// Login and Sign-in pages

router.get('/connexion', function(req, res) {
    res.render('./pages/connexion', { message: "" });
});
router.get('/inscription', function(req, res) {
    res.render('./pages/inscription', { message: "" });
});
router.get('/new-account', function(req, res) {
    res.render('./pages/new-account');
});
router.get('/deconnexion', function(req, res) {
    localStorage.removeItem('user');
    res.render('./pages/index');
});
router.get('/account', function(req, res) {

    res.render('./pages/account', { user: JSON.parse(localStorage.getItem('user')) });
});

// Login and Sign-in Methods

router.post('/account', function(req, res) {
    let user = new User
    user = req.body

    mysqlUtilities.getUserByCredentials((results, error) => {
        if (!error) {
            if (results.length === 0) {
                res.render('./pages/connexion', { message: "Veuillez vérifier vos identifiants ou créer un compte" })
            } else {
                user = results[0]
                localStorage.setItem('user', JSON.stringify(user));
                res.render('./pages/account', { user: JSON.parse(localStorage.getItem('user')) })
            }
        } else {
            res.status(500).send(error);
        }
    }, user)
});

router.post('/new-account', function(req, res) {

    let user = new User
    user = req.body
    passwordVerif = req.body.password2

    mysqlUtilities.getUserByMail((results, error) => {
        if (!error) {
            if (results.length === 0) {
                if (user.gender === 'sexe') {
                    res.render('./pages/inscription', { message: "Veuillez sélectionner votre sexe" })
                } else if (user.password !== passwordVerif) {
                    res.render('./pages/inscription', { message: "Les mots de passe ne sont pas identiques" })
                } else {
                    mysqlUtilities.createUser((results, error) => {
                        if (!error) {
                            localStorage.setItem('user', JSON.stringify(user));
                            res.render('./pages/new-account', { user: JSON.parse(localStorage.getItem('user')) })
                        } else {
                            res.status(500).send(error);
                        }
                    }, user)
                }
            } else if (results[0].mail === user.mail) {
                res.render('./pages/inscription', { message: "Votre compte existe déja" })
            }
        } else {
            res.status(500).send(error);
        }
    }, user)
});

// Contact page

router.get('/contact', function(req, res) {
    res.render('./pages/contact', { message: "" });
});

router.post('/send-mail', function(req, res) {
    let mail = new Mail;
    mail = req.body

    let client = nodemailer.createTransport(sgTransport(options));

    let email = {
        from: 'joel.lourenco.pro@gmail.com',
        to: 'joel.lourenco.pro@gmail.com',
        subject: mail.subject,
        html: `<b>User ${mail.firstname} ${mail.lastname} ${mail.mail}</b><br>
            Send a message: <br>
            ${mail.message}
            `
    };
    let copy = {
        from: 'joel.lourenco.pro@gmail.com',
        to: mail.mail,
        subject: 'Copie de votre message envoyé sur le site ...',
        html: `<b>Ceci est un message automatique</b><br>
            Nous avons reçu votre message, il sera traité dans les plus brefs délais<br>
            Message:<br>
            ${mail.message}`
    };
    client.sendMail(email, function(err, info) {
        if (err) {
            console.log(err);
        } else {
            console.log('Message sent: ' + info.response);
        }
    });
    client.sendMail(copy, function(err, info) {
        if (err) {
            console.log(err);
        } else {
            console.log('Message sent: ' + info.response);
        }
    });


    res.render('./pages/contact', { message: "Votre message a été envoyé" });


});


// Reservation page

router.get('/reservation', function(req, res) {
    res.render('./pages/reservation');
});






module.exports = router;