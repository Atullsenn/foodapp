const con = require('../config/database');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const { genrateToken, verifyRefreshToken } = require('../helpers/authJwt');
const jwt = require("jsonwebtoken");
const { check } = require('express-validator');

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
            errors: errors.array()
        });
    }
    const { firstname, lastname, email, password, phoneNo, address, identify_name } = req.body;
    var encrypassword = await hashPassword(password);

    let identify_document = req.files.identify_document[0].filename;
    try {
        await con.query(`select * from tbl_visitors where email='${email}'`, (err, result) => {
            // or mobile_no='${phoneNo}'
            //or phone number
            if (err) throw err;
            if (result.length > 0) {
                res.status(400).send({
                    success: false,
                    msg: "Email is already exist !"
                })
            }
            else {
                con.query(`select * from tbl_visitors where mobile_no='${phoneNo}'`, (err, result1) => {
                    // or mobile_no='${phoneNo}'
                    //or phone number
                    if (err) throw err;
                    if (result1.length > 0) {
                        res.status(400).send({
                            success: false,
                            msg: "phone number is already exist !"
                        })
                    }
                    else {
                        con.query(`insert into tbl_visitors (first_name, last_name, address, mobile_no, email, password, Identify_name,	Identify_document, login_type) 
                        values('${firstname}','${lastname}','${address}' ,'${phoneNo}','${email}', '${encrypassword}', '${identify_name}', '${identify_document}', '${1}')`, (err, presult) => {
                            if (err) throw err;
                            res.status(200).send({
                                success: true,
                                msg: "Your account has been successfully created !"
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
            msg: error.message
        })
    }
}

const Login = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            res.status(400).send({
                success: false,
                msg: 'please enter email or password !'
            })
        }
        else {
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
                                            msg: "User Login Sucessfully !",
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
                                            msg: "Your account is Deleted by admin !"
                                        })
                                    }
                                    else {
                                        res.status(400).send({
                                            success: false,
                                            msg: "Your account is Deactivate by admin !"
                                        })
                                    }
                                }
                            })
                        }
                        else {
                            res.status(400).send({
                                success: false,
                                msg: "Password is incorrect !"
                            })
                        }
                    });
                }
            });
        }
    }
    catch (error) {
        res.status(500).send({
            success: false,
            msg: error.message
        })
    }
}

const newAccessToken = async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        res.status(400).send({
            success: false,
            msg: "Provide Refresh Token !"
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
                msg: "Provide Refresh Token !"
            })
        }
        else {
            let delTokenQuery = "DELETE FROM usertoken WHERE token = ?";
            con.query(delTokenQuery, [refreshToken], (err, data) => {
                if (err) throw err;
                return res.status(200).send({
                    success: false,
                    message: "User Logout Sucessfully",
                });
            });
        }
    } catch (err) {
        return res.status(500).json({
            success: false,
            msg: error.message
        })
    }
}

const ChangePassword = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
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
                            msg: "New Password and Confirm Password doesn't match !"
                        })
                    }
                    else {
                        let updateQuery = "UPDATE tbl_visitors SET password = ? WHERE id = ?";
                        con.query(updateQuery, [encrypassword, req.user.id], (err, data1) => {
                            if (err) throw err;
                            if (data1.affectedRows < 1) {
                                res.status(400).send({
                                    success: false,
                                    msg: "Password Not Changed !"
                                })
                            }
                            else {
                                res.status(200).send({
                                    success: true,
                                    msg: "Password has been successfully changed !"
                                })
                            }
                        });
                    }
                }
                else {
                    res.status(400).send({
                        success: false,
                        msg: "Old password Incorrect !"
                    })
                }
            });
        })
    }
    catch (error) {
        res.status(500).send({
            success: false,
            msg: error.message
        })
    }
}

const EditProfile = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }
    const { firstname, lastname, email, phoneNo, address, identify_name, host_name, about_me } = req.body;
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
                            if (req.files.trade_license && req.files.profile) {
                                let trade_license = req.files.trade_license[0].filename;
                                let profile = req.files.profile[0].filename
                                let updateQuery = "Update tbl_visitors set profile=? WHERE id=?";
                                con.query(updateQuery, [profile, req.user.id], (err, result) => {
                                    if (err) throw err;
                                    let updateQuery2 = "Update tbl_hosts set host_name=?, about_me=?, trade_license=? WHERE visitor_id=?";
                                    con.query(updateQuery2, [host_name, about_me, trade_license, req.user.id], (err, result1) => {
                                        if (err) throw err;
                                        res.status(200).send({
                                            success: true,
                                            msg: 'Updated profile successfully !'
                                        })
                                    })
                                })
                            }
                            else if (req.files.profile) {
                                let profile = req.files.profile[0].filename;
                                let updateQuery = "Update tbl_visitors set profile=? WHERE id=?";
                                con.query(updateQuery, [profile, req.user.id], (err, result) => {
                                    if (err) throw err;
                                    //console.log(result)
                                    res.status(200).send({
                                        success: true,
                                        msg: 'Updated profile successfully !'
                                    })
                                })
                            }
                            else if (req.files.trade_license) {
                                let trade_license = req.files.trade_license[0].filename;
                                let updateQuery = "Update tbl_hosts set host_name=?, about_me=?, trade_license=? WHERE visitor_id=?";
                                con.query(updateQuery, [host_name, about_me, trade_license, req.user.id], (err, result) => {
                                    if (err) throw err;
                                    //console.log(result)
                                    res.status(200).send({
                                        success: true,
                                        msg: 'Updated profile successfully !'
                                    })
                                })
                            }
                            else {
                                res.status(200).send({
                                    success: true,
                                    msg: 'Updated profile successfully !'
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
                                    msg: 'Updated profile successfully !'
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
                                        msg: 'Updated profile successfully !'
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
                                        msg: 'Updated profile successfully !'
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
                                        msg: 'Updated profile successfully !'
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
                    msg: "Email or Phone Number Already Registered !"
                })
            }
        })
    }
    catch (error) {
        res.status(500).send({
            success: false,
            msg: error.message
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
                            msg: "User not found!"
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
                            msg: "User not found!"
                        })
                    }
                })

            }
        })
    }
    catch (error) {
        res.status(500).send({
            success: false,
            msg: error.message
        })
    }
}

const GoogleLogin = async (req, res) => {
    const user = {
        googleId: req.body.sub,
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
                                msg: "Sucessfully Login via Google!",
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
                        msg: "Sucessfully Login via Google !",
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
            msg: error.message
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
                                msg: "Sucessfully Login via Facebook!",
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
                        msg: "Sucessfully Login via Facebook !",
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
            msg: error.messages
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
                    msg: "You are already a Host !"
                })
            }
            else {
                if (Object.keys(req.files).length === 0) {
                    con.query(`insert into tbl_hosts ( visitor_id, host_name, about_me ) 
                            values( '${req.user.id}', '${hostName}', '${aboutme}')`, (err, presult) => {
                        if (err) throw err;
                        res.status(200).send({
                            success: true,
                            msg: "You are successfully become a host!"
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
                            msg: "You are successfully become a host!"
                        })
                    })

                }
            }
        })
    }
    catch (error) {
        res.status(500).send({
            success: false,
            msg: error.message
        })
    }
}

const Seatbooking = async (req, res) => {
    try {
        const { host_id, hosting_id, booking_date, booking_time, adult, child, pets } = req.body;
        if (!host_id || !hosting_id || !booking_date || !booking_time) {
            res.status(400).send({
                success: false,
                msg: "Provide host_id or hosting_id or booking_date or booking_time"
            })
        }
        else {
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
                                msg: "Reservation faield !"
                            })
                        }
                        else {
                            res.status(200).send({
                                success: true,
                                msg: "Reservation completed !"
                            })
                        }
                    })
                }
                else {
                    res.status(400).send({
                        success: false,
                        msg: "You cannot reserve your own hosts!"
                    })
                }
            })

        }
    }
    catch (error) {
        res.status(500).send({
            success: false,
            msg: error.message
        })
    }
}


module.exports = {
    Register, Login, newAccessToken, logout, ChangePassword, EditProfile, GetProfile,
    GoogleLogin, FacebookLogin, visittohost, Seatbooking
}