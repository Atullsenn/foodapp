const con = require('../config/database');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");

const { genrateToken, verifyRefreshToken } = require('../helpers/authJwt');
const host_route = require('../routes/hostRoute');

async function hashPassword(password) {
    return await bcrypt.hash(password, 10);
}

const HostRegister = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }
    const { firstname, lastname, email, password, phoneNo, hostName, aboutme } = req.body;
    var encrypassword = await hashPassword(password);
    try {
        await con.query(`select * from  tbl_visitors where email='${email}'`, (err, result) => {
            if (err) throw err;
            if (result.length > 0) {
                res.status(400).send({
                    success: false,
                    msg: "Email is already exist"
                })
            }
            else {
                con.query(`select * from  tbl_visitors where mobile_no='${phoneNo}'`, (err, result1) => {
                    if (err) throw err;
                    if (result1.length > 0) {
                        res.status(400).send({
                            success: false,
                            msg: "phone number is already exist"
                        })
                    }
                    else {
                        var sql = "Insert into tbl_visitors (first_name, last_name, mobile_no, email, password, login_type) values(?,?,?,?,?,?)";
                        con.query(sql, [firstname, lastname, phoneNo, email, encrypassword, 1], (err, presult) => {
                            if (err) throw err;
                            if (presult.insertId > 0) {
                                if (Object.keys(req.files).length === 0) {
                                    con.query(`insert into tbl_hosts ( visitor_id, host_name, about_me ) 
                                    values( '${presult.insertId}', '${hostName}', '${aboutme}')`, (err, presult) => {
                                        if (err) throw err;
                                        res.status(200).send({
                                            success: true,
                                            msg: "Your account has been successfully created !"
                                        })
                                    })
                                }
                                else {
                                    let trade_license = req.files.trade_license[0].filename;
                                    con.query(`insert into tbl_hosts ( visitor_id, trade_license, host_name, about_me ) 
                                    values('${presult.insertId}','${trade_license}', '${hostName}', '${aboutme}')`, (err, presult) => {
                                        if (err) throw err;
                                        res.status(200).send({
                                            success: true,
                                            msg: "Your account has been successfully created !"
                                        })
                                    })

                                }
                            }
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

const addHosting = async (req, res) => {
    try {
        const { place_type, country, state, city, street, building_name, flat_no, lat, lng, area_type, no_of_guests, activities, dress_code, rules, no_of_courses, fees_per_person, fees_per_group, bank_country, bank_name, bank_iban, bank_swift_code, account_currency, day, cuisine_type, opening_time, closing_time, conditions, discount, dish_name, allergens, cuisines } = req.body;
        var sql = "select * from tbl_hosts where visitor_id = ?";
        await con.query(sql, req.user.id, (err, result) => {
            if (err) throw err;
            if (result.length > 0) {
                let address_document = req.files.address_document[0].filename;
                let area_video = req.files.area_video[0].filename;

                var InsertQuery = `insert into tbl_hosting ( host_id, place_type, country, state, city, street, building_name, flat_no, address_document, lat, lng, area_type, area_video, no_of_guests, activities, dress_code, no_of_courses,fees_per_person, fees_per_group, bank_country, bank_name, bank_iban, bank_swift_code, account_currency) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
                con.query(InsertQuery, [req.user.id, place_type, country, state, city, street, building_name, flat_no, address_document, lat, lng, area_type, area_video, no_of_guests, activities, dress_code, no_of_courses, fees_per_person, fees_per_group, bank_country, bank_name, bank_iban, bank_swift_code, account_currency], (err, result) => {
                    if (err) throw err;

                    if (result.affectedRows > 0) {
                        let area_images = req.files.area_image;
                        area_images.forEach(image => {
                            var Query = `insert into hosting_images (host_id, hosting_id, image) values(?,?,?)`;
                            con.query(Query, [req.user.id, result.insertId, image.filename]), (err, data) => {
                                if (err) throw err;
                            };
                        })
                        var Query2 = `insert into hosting_rules (host_id, hosting_id, rules) values(?,?,?)`;
                        var Rules = rules;
                        ArrayRules = Rules.split(', ');
                        ArrayRules.forEach(Rule => {
                            con.query(Query2, [req.user.id, result.insertId, Rule], (err, data1) => {
                                if (err) throw err;
                            })
                        })

                        var Query2 = `insert into time_slots (host_id, hosting_id, day, cuisine_type, opening_time, closing_time) values(?,?,?,?,?,?)`;
                        con.query(Query2, [req.user.id, result.insertId, day, cuisine_type, opening_time, closing_time], (err, data2) => {
                            if (err) throw err;
                        })

                        var Query2 = `insert into discounts ( host_id, hosting_id, conditions, discount ) values(?,?,?,?)`;
                        con.query(Query2, [req.user.id, result.insertId, conditions, discount], (err, data3) => {
                            if (err) throw err;
                        })

                        var Query3 = `insert into hosting_menu (host_id, hosting_id, dish_name, allergens, dish_picture) values(?,?,?,?,?)`;
                        let dish_picture = req.files.dish_picture[0].filename;
                        con.query(Query3, [req.user.id, result.insertId, dish_name, allergens, dish_picture], (err, data4) => {
                            if (err) throw err;
                        })

                        var Cuisines = cuisines;
                        ArrayCuisines = Cuisines.split(', ');
                        ArrayCuisines.forEach(Cuisines => {
                            var Query4 = `insert into cuisine_style (host_id, hosting_id, type) values(?,?,?)`;
                            con.query(Query4, [req.user.id, result.insertId, Cuisines], (err, data1) => {
                                if (err) throw err;
                            })
                        })

                        res.status(200).send({
                            success: true,
                            msg: "Successfully added details !"
                        })
                    }
                })
            }
            else {
                res.status(400).send({
                    success: false,
                    msg: "Your are not a host !"
                })
            }
        })
    }
    catch (error) {
        res.status(500).send({
            success: false,
            msssg: error.message
        })
    }
}

const HostingDetails = async (req, res) => {
    try {
        await con.query(`select tbl_hosting.*, tbl_visitors.first_name, tbl_visitors.last_name from tbl_hosting INNER JOIN tbl_visitors 
        ON tbl_visitors.id= tbl_hosting.host_id`, (err, data) => {
            if (err) throw err;
            // console.log(data)
            if (data.length < 1) {
                res.status(400).send({
                    success: false,
                    msg: "Details not found !"
                })
            }
            else {
                con.query(`select * from hosting_images where hosting_id='${data[0].id}'`, (err, result) => {
                    if (err) throw err;
                    // console.log(result)
                    var images = [];
                    result.forEach(item => {
                        images.push(item.image);
                    })
                    con.query(`select * from hosting_rules where hosting_id='${data[0].id}'`, (err, response) => {
                        if (err) throw err;
                        var rules = [];
                        response.forEach(item => {
                            rules.push(item.rules);
                        })
                        con.query(`select * from hosting_menu where hosting_id='${data[0].id}'`, (err, menudata) => {
                            if (err) throw err;
                            var menus = [];
                            menudata.forEach(item => {
                                menus.push(item);
                            })
                            con.query(`select * from cuisine_style where hosting_id='${data[0].id}'`, (err, cuisine) => {
                                if (err) throw err;
                                var cuisines = [];
                                cuisine.forEach(item => {
                                    cuisines.push(item.type);
                                })
                                res.status(200).send({
                                    success: true,
                                    data: data[0],
                                    area_images: images,
                                    rules: rules,
                                    menus: menus,
                                    cuisines: cuisines
                                })
                            })
                        })
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

const UpBookings = async (req, res) => {
    const today = new Date();
    let date = ("0" + today.getDate()).slice(-2);
    let month = ("0" + (today.getMonth() + 1)).slice(-2);
    let year = today.getFullYear();
    const date_find = date + "/" + month + "/" + year
    try {
        let sql = "select tbl_booking.*, tbl_visitors.first_name, tbl_visitors.last_name from tbl_booking INNER JOIN tbl_visitors ON tbl_visitors.id= tbl_booking.visitor_id where host_id=? and booking_date >= ?";
        await con.query(sql, [req.user.id, date_find], (err, data) => {
            if (err) throw err;
            if (data.length < 1) {
                res.status(400).send({
                    success: false,
                    msg: "Booking not found !"
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

const PreBookings = async (req, res) => {
    const today = new Date();
    let date = ("0" + today.getDate()).slice(-2);
    let month = ("0" + (today.getMonth() + 1)).slice(-2);
    let year = today.getFullYear();
    const date_find = date + "/" + month + "/" + year
    try {
        let sql = "select tbl_booking.*, tbl_visitors.first_name, tbl_visitors.last_name from tbl_booking INNER JOIN tbl_visitors ON tbl_visitors.id= tbl_booking.visitor_id where host_id=? and booking_date < ?";
        await con.query(sql, [req.user.id, date_find], (err, data) => {
            if (err) throw err;
            if (data.length < 1) {
                res.status(400).send({
                    success: false,
                    msg: "Booking not found !"
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

const AcceptBooking = async (req, res) => {
    const { BookingId } = req.body;
    if (!BookingId) {
        res.status(400).send({
            success: false,
            msg: "Provide booking id!"
        })
    }
    else {
        try {
            let sql = "select status from tbl_booking where id=?";
            await con.query(sql, [BookingId], (err, data) => {
                if (err) throw err;
                if (data.length < 1) {
                    res.status(400).send({
                        success: false,
                        msg: 'Booking not found !'
                    })
                }
                else {
                    if (data[0].status == 1) {
                        res.status(400).send({
                            success: false,
                            msg: "Already accepted this booking !"
                        })
                    }
                    else {
                        let updateQuery = "update tbl_booking set status=? where id=?";
                        con.query(updateQuery, [1, BookingId], (err, result) => {
                            if (err) throw err;
                            res.status(200).send({
                                success: true,
                                msg: "Booking Accepted!"
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
}

const RejectBooking = async (req, res) => {
    const { BookingId } = req.body;
    if (!BookingId) {
        res.status(400).send({
            success: false,
            msg: "Provide booking id !"
        })
    }
    else {
        let sql = "select status from tbl_booking where id=?";
        await con.query(sql, [BookingId], (err, result) => {
            if (err) throw err;
            if (result.length < 1) {
                res.status(400).send({
                    success: false,
                    msg: 'Booking not found !'
                })
            }
            else {
                if (result[0].status == 2) {
                    res.status(400).send({
                        success: false,
                        msg: 'Already rejected this booking !'
                    })
                }
                else {
                    let updateQuery = "update tbl_booking set status=? where id=?";
                    con.query(updateQuery, [2, BookingId], (err, data) => {
                        if (err) throw err;
                        res.status(200).send({
                            success: true,
                            msg: "Booking Rejected!"
                        })
                    })
                }
            }
        })
    }
}

module.exports = { HostRegister, addHosting, HostingDetails, UpBookings, PreBookings, AcceptBooking, RejectBooking }