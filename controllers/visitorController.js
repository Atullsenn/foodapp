const con = require('../config/database');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const { genrateToken, verifyRefreshToken } = require('../helpers/authJwt');
const jwt = require("jsonwebtoken");

async function hashPassword(password) {
    return await bcrypt.hash(password, 10);
}

async function validatePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
}

const Register = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array()
        });
    }
    const { firstname, lastname, email, password, phoneNo, address, identify_name } = req.body;
    var encrypassword = await hashPassword(password);

    let identify_document = req.files.identify_document[0].filename;

    try {
        await con.query(`select * from tbl_visitors where email='${email}' and is_deleted='${0}'`, (err, result) => {
            if (err) throw err;
            if (result.length > 0) {
                res.status(400).send({
                    success: false,
                    message: "Email is already exists !"
                })
            }
            else {
                con.query(`select * from tbl_visitors where mobile_no='${phoneNo}' and is_deleted='${0}'`, (err, result1) => {
                    if (err) throw err;
                    if (result1.length > 0) {
                        res.status(400).send({
                            success: false,
                            message: "phone number is already exists !"
                        })
                    }
                    else {
                        con.query(`insert into tbl_visitors (first_name, last_name, address, mobile_no, email, password, Identify_name,	Identify_document, login_type) 
                        values('${firstname}','${lastname}','${address}' ,'${phoneNo}','${email}', '${encrypassword}', '${identify_name}', '${identify_document}', '${1}')`, (err, presult) => {
                            if (err) throw err;
                            res.status(200).send({
                                success: true,
                                message: "Your account has been successfully created !"
                            })
                        })
                    }
                })
            }
        })
    }
    catch (error) {
        res.status(500).send({
            success: false,
            message: error.message
        })
    }
}

const Login = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array()
        });
    }
    const { email, password } = req.body;
    try {
        let findUserQuery = "SELECT * FROM tbl_visitors WHERE email = ?";
        await con.query(findUserQuery, [email], (err, data) => {
            if (err) {
                res.json(err);
            }
            // User found
            if (data.length <= 0) {
                return res.status(400).send({ success: false, message: "Email does not Exist !" });
            }
            else {
                bcrypt.compare(password, data[0].password, (err, password) => {
                    if (err) throw err;
                    if (password) {
                        var selectQuery = "Select * from tbl_hosts where visitor_id=?";
                        con.query(selectQuery, [data[0].id], (err, result) => {
                            var host_type;
                            if (result.length > 0) {
                                host_type = 1;
                            }
                            else {
                                host_type = 0;
                            }
                            if (data[0].status == 1 && data[0].is_deleted == 0) {
                                const user = {
                                    id: data[0].id
                                };
                                genrateToken(user).then((userdata) => {
                                    res.status(200).send({
                                        success: true,
                                        message: "Login Sucessfully !",
                                        data: data[0],
                                        host_type: host_type,
                                        token: userdata
                                    })
                                });
                            }
                            else {
                                if (data[0].is_deleted == 1) {
                                    res.status(400).send({
                                        success: false,
                                        message: "Your account is Deleted by admin !"
                                    })
                                }
                                else {
                                    res.status(400).send({
                                        success: false,
                                        message: "Your account is Deactivate by admin !"
                                    })
                                }
                            }
                        })
                    }
                    else {
                        res.status(400).send({
                            success: false,
                            message: "Password is incorrect !"
                        })
                    }
                });
            }
        });
    }
    catch (error) {
        res.status(500).send({
            success: false,
            message: error.message
        })
    }
}

const newAccessToken = async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        res.status(400).send({
            success: false,
            message: "Enter Refresh Token !"
        })
    }
    else {
        verifyRefreshToken(refreshToken)
            .then(({ tokenDetails }) => {
                ACCESS_TOKEN_PRIVATE_KEY = "thisismyaccesstoken";
                //console.log(tokenDetails)
                const payload = { id: tokenDetails.id };
                //console.log(payload)
                const accessToken = jwt.sign(
                    payload,
                    ACCESS_TOKEN_PRIVATE_KEY,
                    { expiresIn: "60m" }
                );
                res.status(200).json({
                    success: true,
                    message: "Access token created successfully",
                    accessToken
                });
            })
            .catch((err) => res.status(400).json(err));
    }
}

const logout = async (req, res) => {
    try {
        // Find Token And Remove It from Database
        const { refreshToken } = req.body;
        if (!refreshToken) {
            res.status(400).send({
                success: false,
                message: "Provide Refresh Token !"
            })
        }
        else {
            let delTokenQuery = "DELETE FROM usertoken WHERE token = ?";
            con.query(delTokenQuery, [refreshToken], (err, data) => {
                if (err) throw err;
                return res.status(200).send({
                    success: true,
                    message: "You've been signed out!",
                });
            });
        }
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const ChangePassword = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array()
        });
    }
    var { oldpassword, newpassword, confirmpassword } = req.body;
    try {
        var encrypassword = await hashPassword(newpassword);
        let sql = "Select password from tbl_visitors where id= ?";
        await con.query(sql, [req.user.id], (err, data) => {
            if (err) throw err;
            bcrypt.compare(oldpassword, data[0].password, (err, password) => {
                if (err) throw err;
                if (password) {
                    if (newpassword !== confirmpassword) {
                        res.status(400).send({
                            success: false,
                            message: "New Password and Confirm Password doesn't match !"
                        })
                    }
                    else {
                        let updateQuery = "UPDATE tbl_visitors SET password = ? WHERE id = ?";
                        con.query(updateQuery, [encrypassword, req.user.id], (err, data1) => {
                            if (err) throw err;
                            if (data1.affectedRows < 1) {
                                res.status(400).send({
                                    success: false,
                                    message: "Password Not Changed !"
                                })
                            }
                            else {
                                res.status(200).send({
                                    success: true,
                                    message: "Password has been successfully changed !"
                                })
                            }
                        });
                    }
                }
                else {
                    res.status(400).send({
                        success: false,
                        message: "Old password was entered Incorrectly !"
                    })
                }
            });
        })
    }
    catch (error) {
        res.status(500).send({
            success: false,
            message: error.message
        })
    }
}

const EditProfile = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array()
        });
    }
    const { firstname, lastname, email, phoneNo, address, identify_name, host_name, about_me, trade_license } = req.body;
    try {
        let sql = "Select * from tbl_visitors where (email = ? OR mobile_no = ?) AND id <> ?";
        await con.query(sql, [email, phoneNo, req.user.id], (err, data) => {
            if (err) throw err;
            if (data.length < 1) {
                var selectQuery = "Select * from tbl_hosts where visitor_id=?";
                con.query(selectQuery, [req.user.id], (err, result) => {
                    if (err) throw err;
                    if (result.length > 0) {
                        let updateQuery = "Update tbl_visitors set first_name=?, last_name=?, email=?, mobile_no=? WHERE id=?";
                        con.query(updateQuery, [firstname, lastname, email, phoneNo, req.user.id], (err, result) => {
                            if (err) throw err;
                            if (result.affectedRows > 0) {
                                if (req.files.profile) {
                                    // let trade_license = req.files.trade_license[0].filename;
                                    let profile = req.files.profile[0].filename
                                    let updateQuery = "Update tbl_visitors set profile=? WHERE id=?";
                                    con.query(updateQuery, [profile, req.user.id], (err, result) => {
                                        if (err) throw err;
                                        let updateQuery2 = "Update tbl_hosts set host_name=?, about_me=?, trade_license=? WHERE visitor_id=?";
                                        con.query(updateQuery2, [host_name, about_me, trade_license, req.user.id], (err, result1) => {
                                            if (err) throw err;
                                            res.status(200).send({
                                                success: true,
                                                message: 'Your profile has been successfully updated  !'
                                            })
                                        })
                                    })
                                }
                                else {
                                    let updateQuery2 = "Update tbl_hosts set host_name=?, about_me=?, trade_license=? WHERE visitor_id=?";
                                    con.query(updateQuery2, [host_name, about_me, trade_license, req.user.id], (err, result1) => {
                                        if (err) throw err;
                                        res.status(200).send({
                                            success: true,
                                            message: 'Your profile has been successfully updated  !'
                                        })
                                    })
                                }
                            }
                            else {
                                res.status(400).send({
                                    success: false,
                                    msg: "Failed to update profile !"
                                })
                            }
                        })
                    }
                    else {
                        if (Object.keys(req.files).length === 0) {
                            let updateQuery = "Update tbl_visitors set first_name=?,  last_name=?, email=?, mobile_no=?, address=? WHERE id=?";
                            con.query(updateQuery, [firstname, lastname, email, phoneNo, address, req.user.id], (err, result) => {
                                if (err) throw err;
                                res.status(200).send({
                                    success: true,
                                    message: 'Your profile has been successfully updated  !'
                                })
                            })
                        }
                        else {
                            if (req.files.identify_document && req.files.profile) {
                                let identify_document = req.files.identify_document[0].filename;
                                let profile = req.files.profile[0].filename
                                let updateQuery = "Update tbl_visitors set first_name=?,  last_name=?, profile=?, email=?, mobile_no=?, address=?, Identify_name=?, Identify_document=? WHERE id=?";
                                con.query(updateQuery, [firstname, lastname, profile, email, phoneNo, address, identify_name, identify_document, req.user.id], (err, result) => {
                                    if (err) throw err;
                                    res.status(200).send({
                                        success: true,
                                        message: 'Your profile has been successfully updated  !'
                                    })
                                })
                            }
                            else if (req.files.profile) {
                                let profile = req.files.profile[0].filename;
                                let updateQuery = "Update tbl_visitors set first_name=?,  last_name=?, profile=?, email=?, mobile_no=?, address=? WHERE id=?";
                                con.query(updateQuery, [firstname, lastname, profile, email, phoneNo, address, req.user.id], (err, result) => {
                                    if (err) throw err;
                                    //console.log(result)
                                    res.status(200).send({
                                        success: true,
                                        message: 'Your profile has been successfully updated  !'
                                    })
                                })
                            }
                            else {
                                let identify_document = req.files.identify_document[0].filename;
                                let updateQuery = "Update tbl_visitors set first_name=?,  last_name=?,  email=?, mobile_no=?, address=?, Identify_name=?, Identify_document=? WHERE id=?";
                                con.query(updateQuery, [firstname, lastname, email, phoneNo, address, identify_name, identify_document, req.user.id], (err, result) => {
                                    if (err) throw err;
                                    //console.log(result)
                                    res.status(200).send({
                                        success: true,
                                        message: 'Your profile has been successfully updated !'
                                    })
                                })
                            }
                        }
                    }
                })
            }
            else {
                res.status(400).send({
                    success: false,
                    message: "Email or Phone Number Already Exists !"
                })
            }
        })
    }
    catch (error) {
        res.status(500).send({
            success: false,
            message: error.message
        })
    }
}

const GetProfile = async (req, res) => {
    try {
        let sql = "Select * from tbl_hosts where visitor_id=? ";
        await con.query(sql, [req.user.id], (err, result) => {
            if (err) throw err;
            if (result.length < 1) {
                let sqlQuery = "select * from tbl_visitors where id=?";
                con.query(sqlQuery, [req.user.id], (err, result) => {
                    if (err) throw err;
                    if (result.length > 0) {
                        res.status(200).send({
                            success: true,
                            data: result[0]
                        })
                    }
                    else {
                        res.status(400).send({
                            success: false,
                            message: "User not found!"
                        })
                    }
                })
            }
            else {
                let sqlQuery = "select first_name, last_name, profile, mobile_no, email, status, login_type from tbl_visitors where id=?";
                con.query(sqlQuery, [req.user.id], (err, resultdata) => {
                    if (err) throw err;
                    if (resultdata.length > 0) {
                        var data = resultdata[0];
                        var host = result[0];
                        //console.log(data)
                        var user = {
                            first_name: data.first_name,
                            last_name: data.last_name,
                            profile: data.profile,
                            mobile_no: data.mobile_no,
                            email: data.email,
                            status: data.status,
                            login_type: data.login_type,
                            host_name: host.host_name,
                            about_me: host.about_me,
                            trade_license: host.trade_license
                        }
                        res.status(200).send({
                            success: true,
                            data: user
                        })
                    }
                    else {
                        res.status(400).send({
                            success: false,
                            message: "User not found!"
                        })
                    }
                })

            }
        })
    }
    catch (error) {
        res.status(500).send({
            success: false,
            message: error.message
        })
    }
}

const GoogleLogin = async (req, res) => {
    const user = {
        googleId: req.body.id,
        firstName: req.body.given_name,
        lastName: req.body.family_name,
        email: req.body.email,
        profilePic: req.files.picture[0].filename,
    };
    try {
        const sql = "select * from tbl_visitors where google_id= ?";
        await con.query(sql, [user.googleId], (err, result) => {
            if (err) throw err;
            if (result.length < 1) {
                let sql = "insert into tbl_visitors (google_id, first_name, last_name, email, profile, login_type) values (?,?,?,?,?,?)";
                con.query(sql, [user.googleId, user.firstName, user.lastName, user.email, user.profilePic, 2], (err, data) => {
                    if (err) throw err;
                    let sqlQuery = "select * from tbl_visitors where id= ?";
                    con.query(sqlQuery, [data.insertId], (err, visitor) => {
                        if (err) throw err;
                        const user = {
                            id: visitor[0].id,
                            login_type: visitor[0].login_type
                        };
                        genrateToken(user).then((userdata) => {
                            res.status(200).send({
                                success: true,
                                message: "Sucessfully Login via Google!",
                                data: visitor[0],
                                token: userdata
                            })
                        });
                    })

                })
            }
            else {
                const user = {
                    id: result[0].id,
                    login_type: result[0].login_type
                };
                genrateToken(user).then((userdata) => {
                    res.status(200).send({
                        success: true,
                        message: "Sucessfully Login via Google !",
                        data: result[0],
                        token: userdata
                    })
                });
            }
        })
    }
    catch (error) {
        res.status(500).send({
            success: false,
            message: error.message
        })
    }
}

const FacebookLogin = async (req, res) => {
    var user = {
        facebookId: req.body.id,
        firstName: req.body.givenName,
        lastName: req.body.familyName,
        email: req.body.email,
        profile: req.files.photo[0].filename
    };

    try {
        var sql = "SELECT * FROM tbl_visitors WHERE facebook_id= ?";
        await con.query(sql, user.facebookId, (err, result) => {
            if (err) throw err;
            if (result.length < 1) {
                let sql = "insert into tbl_visitors (facebook_id, first_name, last_name, email, profile, login_type) values (?,?,?,?,?,?)";
                con.query(sql, [user.facebookId, user.firstName, user.lastName, user.email, user.profile, 3], (err, data) => {
                    if (err) throw err;
                    let sqlQuery = "select * from tbl_visitors where id= ?";
                    con.query(sqlQuery, [data.insertId], (err, visitor) => {
                        if (err) throw err;
                        const user = {
                            id: visitor[0].id,
                            login_type: visitor[0].login_type
                        };
                        genrateToken(user).then((userdata) => {
                            res.status(200).send({
                                success: true,
                                message: "Sucessfully Login via Facebook!",
                                data: visitor[0],
                                token: userdata
                            })
                        });
                    })
                })
            }
            else {
                const user = {
                    id: result[0].id,
                    login_type: result[0].login_type
                };
                genrateToken(user).then((userdata) => {
                    res.status(200).send({
                        success: true,
                        message: "Sucessfully Login via Facebook !",
                        data: result[0],
                        token: userdata
                    })
                });
            }
        })
    }
    catch (error) {
        res.status(500).send({
            success: false,
            message: error.messages
        })
    }
}

const visittohost = async (req, res) => {
    try {
        const { hostName, aboutme } = req.body;
        var sql = "select * from tbl_hosts where visitor_id= ?";
        await con.query(sql, [req.user.id], (err, data) => {
            if (err) throw err;
            if (data.length > 0) {
                res.status(400).send({
                    success: false,
                    message: "You are already logged in as host!"
                })
            }
            else {
                if (Object.keys(req.files).length === 0) {
                    con.query(`insert into tbl_hosts ( visitor_id, host_name, about_me ) 
                            values( '${req.user.id}', '${hostName}', '${aboutme}')`, (err, presult) => {
                        if (err) throw err;
                        res.status(200).send({
                            success: true,
                            message: "You are successfully become a host!"
                        })
                    })
                }
                else {
                    let trade_license = req.files.trade_license[0].filename;
                    con.query(`insert into tbl_hosts ( visitor_id, trade_license, host_name, about_me ) 
                            values('${req.user.id}','${trade_license}', '${hostName}', '${aboutme}')`, (err, presult) => {
                        if (err) throw err;
                        res.status(200).send({
                            success: true,
                            message: "You are successfully become a host!"
                        })
                    })
                }
            }
        })
    }
    catch (error) {
        res.status(500).send({
            success: false,
            message: error.message
        })
    }
}

const HostingDetails = async (req, res) => {
    try {
        await con.query(`select tbl_hosting.*, tbl_hosts.host_name, tbl_hosts.trade_license, tbl_hosts.about_me, tbl_visitors.first_name, tbl_visitors.last_name from tbl_hosting INNER JOIN tbl_visitors 
        ON tbl_visitors.id= tbl_hosting.host_id INNER JOIN tbl_hosts on tbl_hosts.visitor_id=tbl_hosting.host_id`, (err, data) => {
            if (err) throw err;
            // console.log(data)
            if (data.length < 1) {
                res.status(400).send({
                    success: false,
                    message: "Details not found !"
                })
            }
            else {
                // console.log(data.length)
                var arr = [];
                for (let i = 0; i < data.length; i++) {
                    con.query(`select * from hosting_images where hosting_id='${data[i].id}' and host_id='${data[i].host_id}'`, (err, result) => {
                        if (err) throw err;
                        // console.log(result)
                        var images = [];
                        result.forEach(item => {
                            images.push(item.image);
                        })
                        con.query(`select * from hosting_rules where hosting_id='${data[i].id}' and host_id='${data[i].host_id}'`, (err, response) => {
                            if (err) throw err;
                            var rules = [];
                            response.forEach(item => {
                                rules.push(item.rules);
                            })
                            con.query(`select * from hosting_menu where hosting_id='${data[i].id}' and host_id='${data[i].host_id}'`, (err, menudata) => {
                                if (err) throw err;
                                var menus = [];
                                menudata.forEach(item => {
                                    menus.push(item);
                                })
                                con.query(`select * from cuisine_style where hosting_id='${data[i].id}' and host_id='${data[i].host_id}'`, (err, cuisine) => {
                                    if (err) throw err;
                                    var cuisines = [];
                                    cuisine.forEach(item => {
                                        cuisines.push(item.type);
                                    })
                                    con.query(`select * from time_slots where hosting_id='${data[i].id}' and host_id='${data[i].host_id}'`, (err, timeslots) => {
                                        if (err) throw err;
                                        var time_slots = [];
                                        timeslots.forEach(item => {
                                            time_slots.push(item);
                                        })
                                        con.query(`select * from fav_hosting where visitor_id='${req.user.id}' and hosting_id='${data[i].id}'`, (err, find) => {
                                            if (err) throw err;
                                            var is_favorite = 0;
                                            if (find.length > 0) {
                                                is_favorite = 1;
                                            }
                                            con.query(`select heading, description from book_requirement`, (err, requr) => {
                                                if (err) throw err;
                                                con.query(`select heading, description from cancel_policy`, (err, canpolicy) => {
                                                    if (err) throw err;
                                                    var values = {
                                                        id: data[i].id,
                                                        host_id: data[i].host_id,
                                                        place_type: data[i].place_type,
                                                        country: data[i].country,
                                                        state: data[i].state,
                                                        city: data[i].city,
                                                        street: data[i].street,
                                                        building_name: data[i].building_name,
                                                        flat_no: data[i].flat_no,
                                                        address_document: data[i].address_document,
                                                        lat: data[i].lat,
                                                        lng: data[i].lng,
                                                        area_type: data[i].area_type,
                                                        area_video: data[i].area_video,
                                                        no_of_guests: data[i].no_of_guests,
                                                        activities: data[i].activities,
                                                        dress_code: data[i].dress_code,
                                                        no_of_courses: data[i].no_of_courses,
                                                        fees_per_person: data[i].fees_per_person,
                                                        fees_per_group: data[i].fees_per_group,
                                                        bank_country: data[i].bank_country,
                                                        bank_name: data[i].bank_name,
                                                        bank_iban: data[i].bank_iban,
                                                        bank_swift_code: data[i].bank_swift_code,
                                                        account_currency: data[i].account_currency,
                                                        host_name: data[i].host_name,
                                                        trade_license: data[i].trade_license,
                                                        about_me: data[i].about_me,
                                                        first_name: data[i].first_name,
                                                        last_name: data[i].last_name,
                                                        created_at: data[i].created_at,
                                                        updated_at: data[i].updated_at,
                                                        // data: data[i],
                                                        area_images: images,
                                                        rules: rules,
                                                        menus: menus,
                                                        cuisines: cuisines,
                                                        time_slots: time_slots,
                                                        is_favorite: is_favorite,
                                                        book_requirement: requr[0],
                                                        cancellation_policy: canpolicy[0]
                                                    }
                                                    arr.push(values)
                                                })
                                            })
                                        })
                                    })

                                })
                            })
                        })
                    });
                }
                setTimeout(function () {
                    res.status(200).send({
                        success: true,
                        data: arr
                    })
                }, 1000)
            }
        })
    }
    catch (error) {
        res.status(500).send({
            success: false,
            message: error.message
        })
    }
}

const Seatbooking = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array()
        });
    }
    try {
        const { host_id, hosting_id, booking_date, booking_time, adult, child, pets, amount, payment_id, payment_method, status } = req.body;
        let sqlQuery = "select * from tbl_hosting where host_id= ?";
        await con.query(sqlQuery, [req.user.id], (err, data) => {
            if (err) throw err;
            if (data.length < 1) {
                let document = req.files.identify_document[0].filename;
                var sql = "insert into tbl_booking ( visitor_id, host_id, hosting_id, booking_date, booking_time, adult, child, pets, document ) values (?,?,?,?,?,?,?,?,?)";
                con.query(sql, [req.user.id, host_id, hosting_id, booking_date, booking_time, adult, child, pets, document], (err, result) => {
                    if (err) throw err;
                    if (result.affectedRows < 1) {
                        res.status(400).send({
                            success: false,
                            message: "Reservation failed !"
                        })
                    }
                    else {
                        let InsertQuery = "insert into tbl_payment (booking_id, visitor_id, host_id, payment_id, amount, payment_method, status) values (?, ?, ?, ?, ?, ?, ?)";
                        con.query(InsertQuery, [result.insertId, req.user.id, host_id, payment_id, amount, payment_method, status], (err, details) => {
                            if (err) throw err;
                            if (details.affectedRows > 0) {
                                let guests = adult + child;
                                let sqlQuery = "select no_of_guests as guests from tbl_hosting where id=?"
                                con.query(sqlQuery, [hosting_id], (err, result) => {
                                    if (err) throw err;
                                    if (result.length > 0) {
                                        let total_guests = result[0].guests;
                                        let remain_seat = total_guests - guests;
                                        let updateQuery = "update tbl_hosting set no_of_guests=? where id=?";
                                        con.query(updateQuery, [remain_seat, hosting_id], (err, update) => {
                                            if (err) throw err;
                                        })
                                    }
                                })
                                res.status(200).send({
                                    success: true,
                                    message: "Reservation completed !"
                                })
                            }
                            else {
                                res.status(400).send({
                                    success: false,
                                    message: "Reservation failed !"
                                })
                            }
                        })
                    }
                })
            }
            else {
                res.status(400).send({
                    success: false,
                    message: "You cannot reserve your own hosting!"
                })
            }
        })
    }
    catch (error) {
        res.status(500).send({
            success: false,
            message: error.message
        })
    }
}

const PreviousBooking = async (req, res) => {
    const today = new Date();
    let date = ("0" + today.getDate()).slice(-2);
    let month = ("0" + (today.getMonth() + 1)).slice(-2);
    let year = today.getFullYear();
    let hours = today.getHours();
    let minutes = ("0" + (today.getMinutes())).slice(-2)//today.getMinutes();
    let second = today.getSeconds();
    const date_find = year + "-" + month + "-" + date;
    const time = hours + ":" + minutes + ":" + second;
    const date_time = date_find.concat(' ', time);

    let sqlQuery = `select tbl_booking.*, DATE_FORMAT(tbl_booking.booking_date ,'%Y-%m-%d') as booking_date, tbl_visitors.first_name, tbl_visitors.last_name, tbl_hosting.place_type, tbl_hosting.country, tbl_hosting.state, tbl_hosting.city, tbl_hosting.street, tbl_hosting.building_name, tbl_hosting.flat_no, tbl_hosting.dress_code
    from tbl_booking INNER JOIN tbl_visitors on tbl_booking.host_id=tbl_visitors.id INNER JOIN tbl_hosting on tbl_booking.hosting_id=tbl_hosting.id where visitor_id=? and 
    CONCAT(booking_date, ' ',booking_time) <= ? and tbl_booking.is_deleted=? ORDER BY CONCAT(booking_date, ' ',booking_time) DESC`;

    try {
        await con.query(sqlQuery, [req.user.id, date_time, 0], (err, data) => {
            if (err) throw err;
            if (data.length > 0) {
                res.status(200).send({
                    success: true,
                    data: data
                })
            }
            else {
                res.status(400).send({
                    success: false,
                    message: "No bookings yet"
                })
            }
        })
    }
    catch (error) {
        res.status(500).send({
            success: false,
            message: error.message
        })
    }
}

const upcomingBooking = async (req, res) => {
    const today = new Date();
    let date = ("0" + today.getDate()).slice(-2);
    let month = ("0" + (today.getMonth() + 1)).slice(-2);
    let year = today.getFullYear();
    let hours = today.getHours();
    let minutes = ("0" + (today.getMinutes())).slice(-2)//today.getMinutes();
    let second = today.getSeconds();
    const date_find = year + "-" + month + "-" + date;
    const time = hours + ":" + minutes + ":" + second;
    const date_time = date_find.concat(' ', time);
    let sqlQuery = `select tbl_booking.*, DATE_FORMAT(tbl_booking.booking_date ,'%Y-%m-%d') as booking_date, tbl_visitors.first_name, tbl_visitors.last_name, tbl_hosting.place_type, tbl_hosting.country, tbl_hosting.state, tbl_hosting.city, tbl_hosting.street, tbl_hosting.building_name, tbl_hosting.flat_no, tbl_hosting.dress_code
    from tbl_booking INNER JOIN tbl_visitors on tbl_booking.host_id=tbl_visitors.id INNER JOIN tbl_hosting on tbl_booking.hosting_id=tbl_hosting.id where visitor_id=? and 
    CONCAT(booking_date, ' ', booking_time) >= ? and tbl_booking.is_deleted=? ORDER BY CONCAT(booking_date, ' ',booking_time) DESC`;
    try {
        await con.query(sqlQuery, [req.user.id, date_time, 0], (err, data) => {
            if (err) throw err;
            if (data.length > 0) {
                res.status(200).send({
                    success: true,
                    data: data
                })
            }
            else {
                res.status(400).send({
                    success: false,
                    message: "No bookings yet"
                })
            }
        })
    }
    catch (error) {
        res.status(500).send({
            success: false,
            message: error.message
        })
    }
}

const cancelBooking = async (req, res) => {
    const { booking_id, cancel_reason } = req.body;
    try {
        if (!booking_id || !cancel_reason) {
            res.status(400).send({
                success: false,
                message: "provide booking id or cancellation reason !"
            })
        }
        else {
            let selectQuery = "select * from tbl_booking where id=? and visitor_id=?"
            await con.query(selectQuery, [booking_id, req.user.id], (err, result) => {
                if (err) throw err;
                if (result.length > 0) {
                    if (result[0].status == 3) {
                        res.status(400).send({
                            success: false,
                            message: "Already cancelled this booking!"
                        })
                    }
                    else {
                        let updateQuery = "update tbl_booking set status=?, cancellation_reason=? where id=? and visitor_id=?";
                        con.query(updateQuery, [3, cancel_reason, booking_id, req.user.id], (err, data) => {
                            if (err) throw err;
                            if (data.affectedRows > 0) {
                                let guests = result[0].adult + result[0].child;
                                let sqlQuery = "select no_of_guests as guests from tbl_hosting where id=?"
                                con.query(sqlQuery, [result[0].hosting_id], (err, seat) => {
                                    if (err) throw err;
                                    if (seat.length > 0) {
                                        let total_guests = seat[0].guests;
                                        let add_seat = total_guests + guests;
                                        let updateQuery = "update tbl_hosting set no_of_guests=? where id=?";
                                        con.query(updateQuery, [add_seat, result[0].hosting_id], (err, update) => {
                                            if (err) throw err;
                                        })
                                    }
                                })
                                res.status(200).send({
                                    success: true,
                                    message: "Booking cancelled successfully"
                                })
                            }
                            else {
                                res.status(400).send({
                                    success: false,
                                    message: "Failed to cancel booking"
                                })
                            }
                        })
                    }
                }
                else {
                    res.status(400).send({
                        success: false,
                        message: "Booking not found !"
                    })
                }
            })
        }
    }
    catch (error) {
        res.status(500).send({
            success: false,
            message: error.message
        })
    }
}

const favHosting = async (req, res) => {
    const { hosting_id } = req.body;
    try {
        if (!hosting_id) {
            res.status(400).send({
                success: false,
                message: "Provide hosting id !"
            })
        }
        else {
            let selectQuery = `select * from fav_hosting where visitor_id='${req.user.id}' and hosting_id='${hosting_id}'`;
            await con.query(selectQuery, (err, result) => {
                if (err) throw err;
                if (result.length > 0) {
                    let DeleteQuery = "delete from fav_hosting where visitor_id=? and hosting_id=?";
                    con.query(DeleteQuery, [req.user.id, hosting_id], (err, data) => {
                        if (err) throw err;
                        if (data.affectedRows > 0) {
                            res.status(200).send({
                                success: true,
                                message: "Successfully removing from favourite"
                            })
                        }
                        else {
                            res.status(400).send({
                                success: false,
                                message: "failed to remove from favourite"
                            })
                        }
                    })
                }
                else {
                    let InsertQuery = "insert into fav_hosting (visitor_id, hosting_id) values (?,?)";
                    con.query(InsertQuery, [req.user.id, hosting_id], (err, data) => {
                        if (err) throw err;
                        if (data.affectedRows > 0) {
                            res.status(200).send({
                                success: true,
                                message: "Successfully add to favourite"
                            })
                        }
                        else {
                            res.status(400).send({
                                success: false,
                                message: "failed to add favourite"
                            })
                        }
                    })
                }
            })
        }
    }
    catch (error) {
        res.status(500).send({
            success: false,
            message: error.message
        })
    }
}

const NearbyHosts = async (req, res) => {
    const { latitude, longitude } = req.body;
    try {
        await con.query(`select  tbl_hosting.*, tbl_hosts.host_name, tbl_hosts.trade_license, tbl_hosts.about_me, tbl_visitors.first_name, tbl_visitors.last_name, (6371 * ACOS(COS(RADIANS(?)) * COS(RADIANS(lat)) * COS(RADIANS(lng) - RADIANS(?)) + SIN(RADIANS(?)) * SIN(RADIANS(lat)))) AS distance from tbl_hosting INNER JOIN tbl_visitors 
        ON tbl_visitors.id= tbl_hosting.host_id INNER JOIN tbl_hosts on tbl_hosts.visitor_id=tbl_hosting.host_id HAVING distance < 10 ORDER BY distance`, [latitude, longitude, latitude], (err, data) => {
            if (err) throw err;
            // console.log(data)
            if (data.length < 1) {
                res.status(400).send({
                    success: false,
                    message: "Details not found !"
                })
            }
            else {
                // console.log(data.length)
                var arr = [];
                for (let i = 0; i < data.length; i++) {
                    con.query(`select * from hosting_images where hosting_id='${data[i].id}' and host_id='${data[i].host_id}'`, (err, result) => {
                        if (err) throw err;
                        // console.log(result)
                        var images = [];
                        result.forEach(item => {
                            images.push(item.image);
                        })
                        con.query(`select * from hosting_rules where hosting_id='${data[i].id}' and host_id='${data[i].host_id}'`, (err, response) => {
                            if (err) throw err;
                            // console.log(response)
                            var rules = [];
                            response.forEach(item => {
                                rules.push(item.rules);
                            })
                            con.query(`select * from hosting_menu where hosting_id='${data[i].id}' and host_id='${data[i].host_id}'`, (err, menudata) => {
                                if (err) throw err;
                                var menus = [];
                                // console.log(menudata)
                                menudata.forEach(item => {
                                    menus.push(item);
                                })
                                con.query(`select * from cuisine_style where hosting_id='${data[i].id}' and host_id='${data[i].host_id}'`, (err, cuisine) => {
                                    if (err) throw err;
                                    var cuisines = [];
                                    // console.log(cuisine)
                                    cuisine.forEach(item => {
                                        cuisines.push(item.type);
                                    })
                                    con.query(`select * from time_slots where hosting_id='${data[i].id}' and host_id='${data[i].host_id}'`, (err, timeslots) => {
                                        if (err) throw err;
                                        var time_slots = [];
                                        timeslots.forEach(item => {
                                            time_slots.push(item);
                                        })
                                        con.query(`select * from fav_hosting where visitor_id='${req.user.id}' and hosting_id='${data[i].id}'`, (err, find) => {
                                            if (err) throw err;
                                            var is_favorite = 0;
                                            if (find.length > 0) {
                                                is_favorite = 1;
                                            }
                                            con.query(`select heading, description from book_requirement`, (err, requr) => {
                                                if (err) throw err;
                                                con.query(`select heading, description from cancel_policy`, (err, canpolicy) => {
                                                    if (err) throw err;
                                                    var values = {
                                                        id: data[i].id,
                                                        host_id: data[i].host_id,
                                                        place_type: data[i].place_type,
                                                        country: data[i].country,
                                                        state: data[i].state,
                                                        city: data[i].city,
                                                        street: data[i].street,
                                                        building_name: data[i].building_name,
                                                        flat_no: data[i].flat_no,
                                                        address_document: data[i].address_document,
                                                        lat: data[i].lat,
                                                        lng: data[i].lng,
                                                        area_type: data[i].area_type,
                                                        area_video: data[i].area_video,
                                                        no_of_guests: data[i].no_of_guests,
                                                        activities: data[i].activities,
                                                        dress_code: data[i].dress_code,
                                                        no_of_courses: data[i].no_of_courses,
                                                        fees_per_person: data[i].fees_per_person,
                                                        fees_per_group: data[i].fees_per_group,
                                                        bank_country: data[i].bank_country,
                                                        bank_name: data[i].bank_name,
                                                        bank_iban: data[i].bank_iban,
                                                        bank_swift_code: data[i].bank_swift_code,
                                                        account_currency: data[i].account_currency,
                                                        host_name: data[i].host_name,
                                                        trade_license: data[i].trade_license,
                                                        about_me: data[i].about_me,
                                                        first_name: data[i].first_name,
                                                        last_name: data[i].last_name,
                                                        created_at: data[i].created_at,
                                                        updated_at: data[i].updated_at,
                                                        // details: data[i],
                                                        area_images: images,
                                                        rules: rules,
                                                        menus: menus,
                                                        cuisines: cuisines,
                                                        time_slots: time_slots,
                                                        is_favorite: is_favorite,
                                                        book_requirement: requr[0],
                                                        cancellation_policy: canpolicy[0]
                                                    }
                                                    arr.push(values)
                                                })
                                            })
                                        })
                                    })
                                })
                            })
                        })
                    });
                }
                setTimeout(function () {
                    res.status(200).send({
                        success: true,
                        data: arr
                    })
                }, 1000)
            }
        })
    }
    catch (error) {
        res.status(500).send({
            success: false,
            message: error.message
        })
    }
}

const changeBookingDate = async (req, res) => {
    const { booking_id, booking_date, booking_time } = req.body;
    try {
        let updateQuery = `update tbl_booking set booking_date=?, booking_time=? where id=?`;
        await con.query(updateQuery, [booking_date, booking_time, booking_id], (err, data) => {
            if (err) throw err;
            if (data.affectedRows > 0) {
                res.status(200).send({
                    success: true,
                    message: "Booking date changed successfully !"
                })
            }
            else {
                res.status(400).send({
                    success: false,
                    message: "Failed to changed booking date !"
                })
            }
        })
    }
    catch (error) {
        res.status(500).send({
            success: false,
            message: error.message
        })
    }
}

module.exports = {
    Register, Login, newAccessToken, logout, ChangePassword, EditProfile, GetProfile,
    GoogleLogin, FacebookLogin, visittohost, Seatbooking, PreviousBooking, upcomingBooking, cancelBooking,
    favHosting, HostingDetails, NearbyHosts, changeBookingDate
}
