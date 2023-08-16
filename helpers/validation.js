const { check } = require('express-validator');

exports.userRegValidation = [
    check('firstname', 'please enter firstname').not().isEmpty(),
    check('lastname', 'please enter lastname').not().isEmpty(),
    check('email', 'please enter a valid email').isEmail().normalizeEmail({ gmail_remove_dots: false }),
    check('password', 'Password must be greater than 6 and contains at least one uppercase letter, one lowercase letter, and one number, and one special character')
        .isStrongPassword({
            minLength: 6,
            minUppercase: 1,
            minLowercase: 1,
            minNumber: 1,
            minSpecialCharacter: 1
        })
]
exports.userLoginValidation = [
    check('email', 'please enter email').not().isEmpty(),
    check('password', 'please enter password').not().isEmpty(),
]

exports.hostRegValidation = [
    check('firstname', 'please enter firstname').not().isEmpty(),
    check('lastname', 'please enter lastname').not().isEmpty(),
    check('email', 'please enter a valid email').isEmail().normalizeEmail({ gmail_remove_dots: false }),
    check('password', 'Password must be greater than 6 and contains at least one uppercase letter, one lowercase letter, and one number, and one special character')
        .isStrongPassword({
            minLength: 6,
            minUppercase: 1,
            minLowercase: 1,
            minNumber: 1,
            minSpecialCharacter: 1
        }),
    check('phoneNo', 'please enter a valid Phone Number').not().isEmpty(),
]

exports.forgotPasswordValidation = [
    check('email', 'please enter a valid email').isEmail().normalizeEmail({ gmail_remove_dots: false })
]

exports.resetPasswordValidation = [
    check('newPassword', 'Password must be greater than 6 and contains at least one uppercase letter, one lowercase letter, and one number, and one special character')
        .isStrongPassword({
            minLength: 6,
            minUppercase: 1,
            minLowercase: 1,
            minNumber: 1,
            minSpecialCharacter: 1
        }),
]

exports.changePasswordValidations = [
    check('oldpassword', 'Please enter your old password').not().isEmpty(),
    check('newpassword', 'Password must be greater than 6 and contains at least one uppercase letter, one lowercase letter, and one number, and one special character')
        .isStrongPassword({
            minLength: 6,
            minUppercase: 1,
            minLowercase: 1,
            minNumber: 1,
            minSpecialCharacter: 1
        })
]

exports.visitorProfileValidation = [
    check('firstname', 'please enter firstname').not().isEmpty(),
    check('lastname', 'please enter lastname').not().isEmpty(),
    check('email', 'please enter a valid email').isEmail().normalizeEmail({ gmail_remove_dots: false })
]

exports.updateProfileValidation=[
    check('firstname','please enter firstname').not().isEmpty(),
    check('lastname','please enter lastname').not().isEmpty(),
    check('email','please enter a valid email').isEmail().normalizeEmail({gmail_remove_dots:false})
]

exports.UserAddvalidation=[
    check('name', 'please provide name').not().isEmpty(),
   check('email', 'please enter a valid email').isEmail().normalizeEmail({gmail_remove_dots: false})
]

exports.bookingValidation=[
    check('host_id','please provide host_id').not().isEmpty(),
    check('hosting_id','please provide hosting_id').not().isEmpty(),
    check('booking_date','please provide booking_date').not().isEmpty(),
    check('booking_time','please provide booking_time').not().isEmpty()
]


/* check('identify_document').custom((value, { req }) => {
    if (req.files.identify_document[0].mimetype === 'application/pdf') {
        return true;
    }
    else {
        return false;
    }
}).withMessage('Please upload documnet only pdf format') */