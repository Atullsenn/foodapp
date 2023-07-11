const con = require('../config/database');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const sendMail = require('../helpers/sendMail')
const rendomString = require('randomstring');

async function hashPassword(password) {
    return await bcrypt.hash(password, 10);
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
            let findUserQuery = "SELECT id, first_name, last_name, profile, email, password FROM tbl_admin WHERE email = ?";
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
                            res.status(200).send({
                                success: true,
                                msg: "Admin Login Sucessfully !",
                                data: data[0]
                            })
                        }
                        else {
                            res.status(400).send({
                                success: false,
                                msg: "Password Incorrect !"
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

const forgotPassword = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }
    try {
        const { email } = req.body;
        let sql = "SELECT * FROM tbl_admin WHERE email=?";
        await con.query(sql, [email], (err, data) => {
            if (err) throw err;
            if (data.length < 1) {
                res.status(400).send({
                    success: false,
                    msg: "Email doesn't exist !"
                })
            }
            else {
                Email = data[0].email;
                mailSubject = "Forgot Password";
                const randomToken = rendomString.generate();
                content = `<table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8"
                style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); font-family: 'Open Sans', sans-serif;">
                <tr>
                    <td>
                        <table style="background-color: #f2f3f8; max-width:670px;  margin:0 auto;" width="100%" border="0"
                            align="center" cellpadding="0" cellspacing="0">
                            <tr>
                                <td style="height:80px;">&nbsp;</td>
                            </tr>
                            
                            <tr>
                                <td style="height:20px;">&nbsp;</td>
                            </tr>
                            <tr>
                                <td>
                                    <table width="95%" border="0" align="center" cellpadding="0" cellspacing="0"
                                        style="max-width:670px;background:#fff; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);">
                                        <tr>
                                            <td style="height:40px;">&nbsp;</td>
                                        </tr>
                                        <tr>
                                            <td style="padding:0 35px;">
                                                <h1 style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family:'Rubik',sans-serif;">You have
                                                    requested to reset your password</h1>
                                                
                                                <span
                                                    style="display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:1px solid #cecece; width:100px;"></span>
                                                    <h3 style="text-align: left;">Hi, ${data[0].first_name}</h3>
                                                    <p style="color:#455056; font-size:15px;line-height:24px; margin:0;">
                                                    We cannot simply send you your old password. A unique link to reset your
                                                    password has been generated for you. To reset your password, click the
                                                    following link and follow the instructions.
                                                </p>
                                                <a href="http://localhost:3000/reset-password?token='${randomToken}'"
                                                    style="background:#20e277;text-decoration:none !important; font-weight:500; margin-top:35px; color:#fff;text-transform:uppercase; font-size:14px;padding:10px 24px;display:inline-block;border-radius:50px;">Reset
                                                    Password</a>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="height:40px;">&nbsp;</td>
                                        </tr>
                                        <tr>
                                             <td><p style="color:#455056; font-size:15px;line-height:24px; margin:0;">If you did not forgot your password, please ignore this email and have a lovely day.</p></td>
                                        </tr>
                                        <tr>
                                            <td style="height:40px;">&nbsp;</td>
                                        </tr>
                                        <tr>
                                             <td style="padding:0 35px;"> <p style="color:#455056; font-size:13px;line-height:22px; margin:0;">If the above button doesn't work, you can reset your password by clicking the following link, <a href="http://localhost:3001/reset-password?token='${randomToken}'">Reset Password</a></p> 
                                             </td>
                                        </tr>
                                        <tr>
                                            <td style="height:80px;">&nbsp;</td>
                                        </tr>
                                    </table>
                                </td>
                            <tr>
                                <td style="height:20px;">&nbsp;</td>
                            </tr>
                            <tr>
                                <td style="text-align:center;">
                                    <p style="font-size:14px; color:rgba(69, 80, 86, 0.7411764705882353); line-height:18px; margin:0 0 0;">&copy; <strong>FoodApp</strong></p>
                                </td>
                            </tr>
                            <tr>
                                <td style="height:80px;">&nbsp;</td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>`
                //content = 'Hi ' + data[0].first_name + ', <p> Please click the below button to reset your password. </p> <p> <span style="background: #6495ED; padding: 5px;"> <a style="color: white; text-decoration: none;  font-weight: 600;" href="http://localhost:3001/reset-password?token=' + randomToken + '">Click Here </a> </span> </p>';
                sendMail(Email, mailSubject, content);
                token = randomToken;
                let delTokenQuery = "DELETE FROM resetpassword_token WHERE email = ?";
                con.query(delTokenQuery, [data[0].email], (err, data1) => {
                    if (err) throw err;
                });
                con.query(`insert into resetpassword_token (token, email) values('${token}','${Email}')`, (err, presult) => {
                    if (err) throw err;
                    res.status(200).send({
                        success: true,
                        msg: "Check your email a password reset email was sent.",
                        token: token
                    })
                })
            }
        })
    } catch (error) {
        res.status(400).send({
            success: false,
            msg: error.message
        })
    }
}

const ResetPassword = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }
    try {
        const { newPassword, confirmPassword } = req.body;
        let password = await hashPassword(newPassword);
        let sql = "Select * from resetpassword_token where token= ?";
        await con.query(sql, [req.query.token], (err, data) => {
            if (err) throw err;
            if (data.length < 1) {
                res.status(400).send({
                    success: false,
                    msg: "This link has been expired !"
                })
            }
            else {
                let sql = "Select * from tbl_admin where email=?";
                con.query(sql, [data[0].email], (err, newdata) => {
                    if (err) throw err;
                    if (newdata.length >= 1) {
                        if (newPassword != confirmPassword) {
                            res.status(400).send({
                                success: false,
                                msg: "new password and confirm password do not match !"
                            })
                        }
                        else {
                            let delTokenQuery = "DELETE FROM resetpassword_token WHERE email = ?";
                            con.query(delTokenQuery, [newdata[0].email], (err, data1) => {
                                if (err) throw err;
                            });
                            let updateQuery = "UPDATE tbl_admin SET password = ? WHERE email = ?";
                            con.query(updateQuery, [password, newdata[0].email], (err, data1) => {
                                if (err) throw err;
                                if (data1.affectedRows < 1) {
                                    res.status(400).send({
                                        success: false,
                                        msg: "Password Not Reset !"
                                    })
                                }
                                else {
                                    res.status(200).send({
                                        success: true,
                                        msg: "Password Reset Successfully  !"
                                    })
                                }
                            });

                        }
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

const AdminChangePassword = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }
    var { id, oldpassword, newpassword, confirmpassword } = req.body;
    try {
        if (!id) {
            res.status(400).send({
                success: false,
                msg: "Plesae Provide id !"
            })
        }
        else {
            var encrypassword = await hashPassword(newpassword);
            let sql = "Select password from tbl_admin where id= ?";
            await con.query(sql, [id], (err, data) => {
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
                            let updateQuery = "UPDATE tbl_admin SET password = ? WHERE id = ?";
                            con.query(updateQuery, [encrypassword, id], (err, data1) => {
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
        const { id } = req.body;
        if (!id) {
            res.status(400).send({
                success: false,
                msg: 'provide id !'
            })
        }
        else {
            let sql = "select * from tbl_admin where id=?";
            await con.query(sql, [id], (err, data) => {
                if (err) throw err;
                if (data.length < 1) {
                    res.status(400).send({
                        success: false,
                        msg: "Admin not Exist !"
                    })
                }
                else {
                    res.status(200).send({
                        success: true,
                        data: data[0]
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

const UpdateProfile = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }
    try {
        const { id } = req.body;
        var { firstname, lastname, email } = req.body;
        if (req.file == undefined) {
            let sql = "Update tbl_admin set first_name=?, last_name=?, email=? where id=?"
            await con.query(sql, [firstname, lastname, email, id], (err, data) => {
                if (err) throw err;
                if (data.affectedRows < 1) {
                    res.status(400).send({
                        success: false,
                        msg: "Details not updated !"
                    })
                }
                else {
                    res.status(200).send({
                        success: true,
                        msg: "Update details successfully"
                    })
                }
            })
        }
        else {
            let sql = "Update tbl_admin set first_name=?, last_name=?, email=?, profile=? where id=?"
            await con.query(sql, [firstname, lastname, email, req.file.filename, id], (err, data) => {
                if (err) throw err;
                if (data.affectedRows < 1) {
                    res.status(400).send({
                        success: false,
                        msg: "Details not updated !"
                    })
                }
                else {
                    res.status(200).send({
                        success: true,
                        msg: "Update details successfully"
                    })
                }
            })
        }

    } catch (error) {
        res.status(400).send({
            success: false,
            msg: error.message
        })
    }
}

const VisitorList = async (req, res) => {
    try {
        var sql = `Select * from tbl_visitors as a where not exists ( select * from tbl_hosts as b where a.id=b.visitor_id) AND NOT is_deleted=${1};`;
        await con.query(sql, (err, data) => {
            if (err) throw err;
            if (data.length < 1) {
                res.status(400).send({
                    success: false,
                    msg: "visitor not found"
                })
            }
            else {
                res.status(200).send({
                    success: true,
                    data: data
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

const DeleteVisitor = async (req, res) => {
    try {
        const { visitorId } = req.body;
        if (!visitorId) {
            res.status(400).send({
                success: false,
                msg: "Provide visitor id !"
            })
        }
        else {
            var sql = "select is_deleted from tbl_visitors where id=?";
            await con.query(sql, [visitorId], (err, data) => {
                if (err) throw err;
                if (data[0].is_deleted == 1) {
                    res.status(400).send({
                        success: false,
                        msg: "User not exist !"
                    })
                }
                else {
                    var sql = "update tbl_visitors set is_deleted=? where id=?";
                    con.query(sql, [1, visitorId], (err, data) => {
                        if (err) throw err;
                        res.status(200).send({
                            success: true,
                            msg: "User deleted successfully!"
                        })
                    })
                }
            })
        }

    } catch (error) {
        res.status(500).send({
            success: false,
            msg: error.message
        })
    }
}

const ChangeStatus = async (req, res) => {
    const { visitorId } = req.body;
    try {
        let sql = "select status from tbl_visitors where id=?";
        await con.query(sql, [visitorId], (err, data) => {
            if (err) throw err;
            if (data.length > 0) {
                let status;
                if (data[0].status == 1) {
                    status = 2;
                }
                else {
                    status = 1;
                }
                let updateQuery = "update tbl_visitors set status=? where id=?";
                con.query(updateQuery, [status, visitorId], (err, data) => {
                    if (err) throw err;
                    if (data.affectedRows < 1) {
                        res.status(400).send({
                            success: false,
                            msg: "User status has not been updated successfully!"
                        })
                    }
                    else {
                        res.status(200).send({
                            success: true,
                            msg: "User status has been updated successfully!"
                        })
                    }
                })
            }
            else {
                res.status(400).send({
                    success: false,
                    msg: "user not exist !"
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

const HostList = async (req, res) => {
    try {
        var sql = `Select tbl_visitors.*, tbl_hosts.* from tbl_visitors INNER JOIN tbl_hosts ON tbl_hosts.visitor_id= tbl_visitors.id where exists ( select * from tbl_hosts as b where tbl_visitors.id=b.visitor_id) AND NOT is_deleted=${1};`;
        await con.query(sql, (err, data) => {
            if (err) throw err;
            if (data.length < 1) {
                res.status(400).send({
                    success: false,
                    msg: "Hosts not found"
                })
            }
            else {
                res.status(200).send({
                    success: true,
                    data: data
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

module.exports = {
    Login, forgotPassword, ResetPassword, AdminChangePassword, VisitorList, GetProfile,
    UpdateProfile, DeleteVisitor, ChangeStatus, HostList
}
