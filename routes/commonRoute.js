const express = require('express');
const common_route = express();
const commonController = require('../controllers/commonController');
const { authMiddleWare } = require('../helpers/authJwt');


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

common_route.post('/activity', commonController.activityList);
common_route.post('/allergens', commonController.allergensList);
common_route.post('/arealist', commonController.areaList);
common_route.post('/cuisinelist', commonController.cuisineList);
common_route.post('/placelist', commonController.placeList);

common_route.get('/activity', commonController.GetActivity);
common_route.get('/allergens', commonController.GetAllergens);
common_route.get('/arealist', commonController.GetArea);
common_route.get('/cuisinelist', commonController.GetCuisine);
common_route.get('/placelist', commonController.GetPlace);

common_route.put('/activity', commonController.UpdateActivity);
common_route.put('/allergens', commonController.UpdateAllergens);
common_route.put('/arealist', commonController.UpdateArea);
common_route.put('/cuisinelist', commonController.UpdateCuisine);
common_route.put('/placelist', commonController.Updateplace);

common_route.delete('/activity/:id', commonController.DeleteActivity);
common_route.delete('/allergens/:id', commonController.DeleteAllergens);
common_route.delete('/arealist/:id', commonController.DeleteArea);
common_route.delete('/cuisinelist/:id', commonController.DeleteCuisine);
common_route.delete('/placelist/:id', commonController.Deleteplace);

common_route.post('/termsconditions', commonController.termsConditions);
common_route.get('/termsconditions', commonController.GetTerms);

common_route.post('/privacypolicy', commonController.PrivacyPolicy);
common_route.get('/privacypolicy', commonController.GetPrivacy);

common_route.post('/cancel/policy', commonController.CancelationPolicy);
common_route.get('/cancel/policy', commonController.getCancelPolicy);

common_route.post('/booking/require', commonController.bookingRequire);
common_route.get('/booking/require', commonController.GetBookRequire);

common_route.post('/count/all', commonController.countAll);

common_route.post('/send-friend-request', authMiddleWare, commonController.friendRequest);
common_route.post('/accept-friend-request', commonController.acceptRequest);
common_route.post('/send-message', authMiddleWare, commonController.sendMessage )
common_route.post('/get-messages', commonController.getMessages)

common_route.post('/country/list', commonController.countryList);
common_route.get('/country/list', commonController.GetCountry);
common_route.put('/country/list', commonController.UpdateCountry);
common_route.delete('/country/list/:id', commonController.DeleteCountry);

module.exports = common_route;
