const express = require('express');
const visitor_route = express();
const visitorController = require('../controllers/visitorController.js');
const { userRegValidation, userLoginValidation, changePasswordValidations, visitorProfileValidation, bookingValidation } = require('../helpers/validation');
const { authMiddleWare } = require('../helpers/authJwt');

const path = require('path');
const multer = require('multer');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (file.fieldname === "identify_document") {
            cb(null, path.join(__dirname, '../public/identification'));
        }
        if (file.fieldname === "profile" || file.fieldname === "picture" || file.fieldname === "photo") {
            cb(null, path.join(__dirname, '../public/images'));
        }
        if (file.fieldname === "trade_license") {
            cb(null, path.join(__dirname, '../public/documents'));
        }
    },
    filename: function (err, file, cb) {
        cb(null, Date.now() + '-' + file.originalname, (err, success) => {
            if (err) {
                console.log(err);
            }
        });
    }
})

/* const fileFilter = (req,file,cb) => {
    if (file.fieldname === "identify_document") {
        ( file.mimetype === 'application/pdf')
        ? cb(null,true)
        : cb(null,false);
    }
} */

var upload = multer({
    storage: storage,
    // fileFilter:fileFilter
}).fields([{ name: 'identify_document' }, { name: 'profile' }, { name: 'picture' }, { name: 'photo' }, { name: 'trade_license' }]);


visitor_route.post('/customer/register', upload, userRegValidation, visitorController.Register);
visitor_route.post('/login', userLoginValidation, visitorController.Login);
visitor_route.post('/accessToken', visitorController.newAccessToken);
visitor_route.delete('/logout', visitorController.logout);

visitor_route.post('/changepassword', authMiddleWare, changePasswordValidations, visitorController.ChangePassword);
visitor_route.post('/update/profile', authMiddleWare, upload, visitorProfileValidation, visitorController.EditProfile);
visitor_route.get('/profile', authMiddleWare, visitorController.GetProfile);

visitor_route.post('/googlelogin', upload, visitorController.GoogleLogin);
visitor_route.post('/facebooklogin', upload, visitorController.FacebookLogin);

visitor_route.post('/visittohost', upload, authMiddleWare, visitorController.visittohost);

visitor_route.post('/hosting/details', authMiddleWare, visitorController.HostingDetails);

visitor_route.post('/booking', authMiddleWare, upload, bookingValidation, visitorController.Seatbooking);
visitor_route.post('/previousbooking', authMiddleWare, visitorController.PreviousBooking);
visitor_route.post('/upcomingbooking', authMiddleWare, visitorController.upcomingBooking);
visitor_route.post('/cancelbooking', authMiddleWare, visitorController.cancelBooking);

visitor_route.post('/fav/hosting', authMiddleWare, visitorController.favHosting);

visitor_route.post('/nearby/hosts', authMiddleWare, visitorController.NearbyHosts);

visitor_route.post('/change/booking', visitorController.changeBookingDate);

module.exports = visitor_route;

