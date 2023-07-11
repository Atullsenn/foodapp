const express = require('express');
const admin_route = express();
const adminController = require('../controllers/adminController');
const { forgotPasswordValidation, resetPasswordValidation, changePasswordValidations, updateProfileValidation } = require('../helpers/validation');

const path = require('path');
const multer = require('multer');

var storage = multer.diskStorage({
    destination: function (err, file, cb) {
        cb(null, path.join(__dirname, '../public/images'), (err, success) => {
            if (err) {
                console.log(err)
            }
        });
    },
    filename: function (err, file, cb) {
        cb(null, Date.now() + '-' + file.originalname, (err, success) => {
            if (err) {
                console.log(err);
            }
        });
    }
})

var upload = multer({ storage: storage })

admin_route.post('/admin/login', adminController.Login);
admin_route.post('/forgotPassword', forgotPasswordValidation, adminController.forgotPassword);
admin_route.post('/reset-password', resetPasswordValidation, adminController.ResetPassword);
admin_route.post('/admin/changePassword', changePasswordValidations, adminController.AdminChangePassword);
admin_route.post('/admin/profile', adminController.GetProfile);
admin_route.put('/admin/profile',  upload.single('profile'), updateProfileValidation, adminController.UpdateProfile);

admin_route.get('/visitorlist', adminController.VisitorList);
admin_route.delete('/visitor', adminController.DeleteVisitor);
admin_route.post('/status', adminController.ChangeStatus);

admin_route.get('/hostlist', adminController.HostList);

module.exports = admin_route;