const express = require('express');
const host_route = express();
const hostController = require('../controllers/hostController');
const { hostRegValidation } = require('../helpers/validation');
const { authMiddleWare } = require('../helpers/authJwt');

const path = require('path');
const multer = require('multer');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (file.fieldname === "trade_license" || file.fieldname === "address_document") {
            cb(null, path.join(__dirname, '../public/documents'));
        }
        if (file.fieldname === "profile" || file.fieldname === "area_video" || file.fieldname ==="area_image" || file.fieldname ==="dish_picture") {
            cb(null, path.join(__dirname, '../public/images'));
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
}).fields([{ name: 'trade_license' }, { name: 'profile' }, { name: 'address_document'}, { name: 'area_video'}, { name: 'area_image'}, { name: 'dish_picture'}]);

host_route.post('/host/register', upload, hostRegValidation, hostController.HostRegister);
host_route.post('/addhosting', authMiddleWare, upload, hostController.addHosting);
host_route.get('/hostingdetails', authMiddleWare, hostController.HostingDetails);

host_route.post('/upbookings', authMiddleWare, hostController.UpBookings);
host_route.post('/prebookings', authMiddleWare, hostController.PreBookings);
host_route.post('/accept', hostController.AcceptBooking);
host_route.post('/reject', hostController.RejectBooking);

module.exports = host_route;


// make api for find upcoming and previous booking list in node js