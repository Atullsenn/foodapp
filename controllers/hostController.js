const con = require('../config/database');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

async function hashPassword(password) {
    return await bcrypt.hash(password, 10);
}

const HostRegister = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array()
        });
    }
    const { firstname, lastname, email, password, phoneNo, hostName, aboutme, tradelicense } = req.body;
    var encrypassword = await hashPassword(password);
    try {
        await con.query(`select * from  tbl_visitors where email='${email}' and is_deleted='${0}'`, (err, result) => {
            if (err) throw err;
            if (result.length > 0) {
                res.status(400).send({
                    success: false,
                    message: "Email is already exists"
                })
            }
            else {
                con.query(`select * from  tbl_visitors where mobile_no='${phoneNo}' and is_deleted='${0}'`, (err, result1) => {
                    if (err) throw err;
                    if (result1.length > 0) {
                        res.status(400).send({
                            success: false,
                            message: "phone number is already exists"
                        })
                    }
                    else {
                        var sql = "Insert into tbl_visitors (first_name, last_name, mobile_no, email, password,  login_type) values(?,?,?,?,?,?)";
                        con.query(sql, [firstname, lastname, phoneNo, email, encrypassword, 1], (err, presult) => {
                            if (err) throw err;
                            if (presult.insertId > 0) {
                                con.query(`insert into tbl_hosts ( visitor_id, host_name, about_me, trade_license) 
                                    values( '${presult.insertId}', '${hostName}', '${aboutme}', '${tradelicense}' )`, (err, presult) => {
                                    if (err) throw err;
                                    if (presult.affectedRows > 0) {
                                        res.status(200).send({
                                            success: true,
                                            message: "Your account has been successfully created !"
                                        })
                                    }
                                    else {
                                        res.status(400).send({
                                            success: false,
                                            message: "Failed to create account !"
                                        })
                                    }
                                })
                            }
                            else {
                                res.status(400).send({
                                    success: false,
                                    message: "Failed to create account !"
                                })
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
            message: error.message
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
                            con.query(Query, [req.user.id, result.insertId, image.filename], (err, data) => {
                                if (err) throw err;
                            });
                        })
                        var Query2 = `insert into hosting_rules (host_id, hosting_id, rules) values(?,?,?)`;
                        var Rules = rules;
                        ArrayRules = Rules.split(', ');
                        ArrayRules.forEach(Rule => {
                            con.query(Query2, [req.user.id, result.insertId, Rule], (err, data1) => {
                                if (err) throw err;
                            })
                        })
                        for (var i = 0; i < day.length; i++) {
                            var Query2 = `insert into time_slots (host_id, hosting_id, day, cuisine_type, opening_time, closing_time) values(?,?,?,?,?,?)`;
                            con.query(Query2, [req.user.id, result.insertId, day[i], cuisine_type[i], opening_time[i], closing_time[i]], (err, data2) => {
                                if (err) throw err;
                            })
                        }

                        var Query2 = `insert into discounts ( host_id, hosting_id, conditions, discount ) values(?,?,?,?)`;
                        con.query(Query2, [req.user.id, result.insertId, conditions, discount], (err, data3) => {
                            if (err) throw err;
                        })
                        console.log(req.files.dish_picture.length);
                        for (var i = 0; i < req.files.dish_picture.length; i++) {
                            var Query3 = `insert into hosting_menu (host_id, hosting_id, dish_name, allergens, dish_picture) values(?,?,?,?,?)`;
                            let dish_picture = req.files.dish_picture[i].filename;
                            con.query(Query3, [req.user.id, result.insertId, dish_name[i], allergens[i], dish_picture], (err, data4) => {
                                if (err) throw err;
                            })
                            
                        }

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
                            message: "Successfully added details !"
                        })
                    }
                })
            }
            else {
                res.status(400).send({
                    success: false,
                    message: "Your are not a host !"
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

const GetHostings = async (req, res) => {
    try {
        await con.query(`select tbl_hosting.*, tbl_hosts.host_name, tbl_hosts.trade_license, tbl_hosts.about_me, tbl_visitors.first_name, tbl_visitors.last_name from tbl_hosting INNER JOIN tbl_visitors 
        ON tbl_visitors.id= tbl_hosting.host_id INNER JOIN tbl_hosts on tbl_hosts.visitor_id=tbl_hosting.host_id where tbl_hosting.host_id='${req.user.id}'`, (err, data) => {
            if (err) throw err;
            // console.log(data)
            if (data.length < 1) {
                res.status(400).send({
                    success: false,
                    message: "No hosts Added yet !"
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
                        con.query(`select * from hosting_rules where hosting_id='${data[i].id}'and host_id='${data[i].host_id}'`, (err, response) => {
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
                                    con.query(`select * from time_slots where hosting_id='${data[i].id}' and host_id='${data[i].host_id}'`, (err, timeDay) => {
                                        if (err) throw err;
                                        var time = [];
                                        timeDay.forEach(item => {
                                            time.push(item);
                                        })
                                    
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
                                            time_slots: time
                                        }
                                        arr.push(values)
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

const UpBookings = async (req, res) => {
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
    try {
        let sql = `select tbl_booking.*, DATE_FORMAT(tbl_booking.booking_date ,'%Y-%m-%d') as booking_date, tbl_visitors.first_name, tbl_visitors.last_name from tbl_booking 
        INNER JOIN tbl_visitors ON tbl_visitors.id= tbl_booking.visitor_id where host_id=? and
        CONCAT(booking_date,' ',booking_time) >= ? and tbl_booking.status <> ? and tbl_booking.is_deleted=?
        ORDER BY CONCAT(booking_date, ' ',booking_time) DESC`;
        await con.query(sql, [req.user.id, date_time, 2, 0], (err, data) => {
            if (err) throw err;
            if (data.length < 1) {
                res.status(400).send({
                    success: false,
                    message: "No bookings yet"
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
            message: error.message
        })
    }
}

const PreBookings = async (req, res) => {
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
    try {
        let sql = `select tbl_booking.*, DATE_FORMAT(tbl_booking.booking_date ,'%Y-%m-%d') as booking_date, tbl_visitors.first_name, tbl_visitors.last_name from tbl_booking INNER JOIN tbl_visitors ON tbl_visitors.id= tbl_booking.visitor_id where host_id=? and 
        CONCAT(booking_date, ' ', booking_time) <= ? and tbl_booking.status <> ? and tbl_booking.is_deleted=? 
        ORDER BY CONCAT(booking_date, ' ',booking_time) DESC`;
        await con.query(sql, [req.user.id, date_time, 2, 0], (err, data) => {
            if (err) throw err;
            if (data.length < 1) {
                res.status(400).send({
                    success: false,
                    message: "No bookings yet"
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
            message: error.message
        })
    }
}

const AcceptBooking = async (req, res) => {
    const { BookingId } = req.body;
    if (!BookingId) {
        res.status(400).send({
            success: false,
            message: "Provide booking id!"
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
                        message: 'Booking not found !'
                    })
                }
                else {
                    if (data[0].status == 1) {
                        res.status(400).send({
                            success: false,
                            message: "Already accepted this booking !"
                        })
                    }
                    else {
                        let updateQuery = "update tbl_booking set status=? where id=?";
                        con.query(updateQuery, [1, BookingId], (err, result) => {
                            if (err) throw err;
                            res.status(200).send({
                                success: true,
                                message: "Booking Accepted successfully!"
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
}

const RejectBooking = async (req, res) => {
    try {
        const { BookingId } = req.body;
        if (!BookingId) {
            res.status(400).send({
                success: false,
                message: "Provide booking id !"
            })
        }
        else {
            let sql = "select status from tbl_booking where id=?";
            await con.query(sql, [BookingId], (err, result) => {
                if (err) throw err;
                if (result.length < 1) {
                    res.status(400).send({
                        success: false,
                        message: 'Booking not found !'
                    })
                }
                else {
                    if (result[0].status == 2) {
                        res.status(400).send({
                            success: false,
                            message: 'Already rejected this booking !'
                        })
                    }
                    else {
                        let updateQuery = "update tbl_booking set status=? where id=?";
                        con.query(updateQuery, [2, BookingId], (err, data) => {
                            if (err) throw err;
                            res.status(200).send({
                                success: true,
                                message: "Booking Rejected!"
                            })
                        })
                    }
                }
            })
        }
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message
        })
    }
}

const Ratings = async (req, res) => {
    try {
        const { visitor_id, host_id, rating, review } = req.body;
        let sql = "select * from tbl_hosts where visitor_id =?";
        await con.query(sql, [req.user.id], (err, data) => {
            if (err) throw err;
            if (data.length > 0) {
                // host
                let InsertQuery = "insert into tbl_rating (host_id, visitor_id, rating, review, rating_by) values(?,?,?,?,?)";
                con.query(InsertQuery, [req.user.id, visitor_id, rating, review, 1], (err, data) => {
                    if (err) throw err;
                    res.status(200).send({
                        success: true,
                        message: "Review is successfully submitted"
                    })
                })
            }
            else {
                // visitor
                let InsertQuery = "insert into tbl_rating (host_id, visitor_id, rating, review, rating_by) values(?,?,?,?,?)";
                con.query(InsertQuery, [host_id, req.user.id, rating, review, 2], (err, data) => {
                    if (err) throw err;
                    res.status(200).send({
                        success: true,
                        message: "Review is successfully submitted"
                    })
                })
            }
        })
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message
        })
    }
}

// get host rating given by visitor and visitor rating given by host

const getRating = async (req, res) => {
    try {
        let sql = "select * from tbl_hosts where visitor_id =?";
        await con.query(sql, [req.user.id], (err, data) => {
            if (err) throw err;
            if (data.length > 0) {
                //host
                let sqlQuery = "select AVG(rating) AS overall_rating, COUNT(review) AS total_reviews from tbl_rating where host_id=? and rating_by=? and is_deleted=?";
                con.query(sqlQuery, [req.user.id, 2, 0], (err, data) => {
                    if (err) throw err;
                    if (data[0].overall_rating != null) {
                        let selectQuery = "select tbl_rating.rating, tbl_rating.review, CONCAT(tbl_visitors.first_name, ' ' , tbl_visitors.last_name) as Name, tbl_rating.created_at from tbl_rating INNER JOIN tbl_visitors on tbl_visitors.id=tbl_rating.visitor_id where host_id=? and rating_by=? and tbl_rating.is_deleted=?";
                        con.query(selectQuery, [req.user.id, 2, 0], (err, details) => {
                            if (err) throw err;
                            if (details.length > 0) {
                                original = data[0].overall_rating;
                                //let overall_rating = Math.round(original * 10) / 10;
                                let overall_rating = original.toFixed(1);
                                let result = {
                                    overall_rating: overall_rating,
                                    total_reviews: data[0].total_reviews,
                                    data: details
                                }
                                res.status(200).send({
                                    success: true,
                                    response: result
                                })
                            }
                            else {
                                res.status(400).send({
                                    success: false,
                                    message: "Rating not found !"
                                })
                            }
                        })
                    }
                    else {
                        res.status(400).send({
                            success: false,
                            message: "Rating is not available !"
                        })
                    }
                })
            }
            else {
                //visitor
                let sqlQuery = "select AVG(rating) AS overall_rating, COUNT(review) AS total_reviews from tbl_rating where visitor_id=? and rating_by=? and is_deleted=?";
                con.query(sqlQuery, [req.user.id, 1, 0], (err, data) => {
                    if (err) throw err;
                    if (data[0].overall_rating != null) {
                        let selectQuery = "select tbl_rating.rating, tbl_rating.review, CONCAT(tbl_visitors.first_name, ' ', tbl_visitors.last_name) as Name, tbl_rating.created_at from tbl_rating INNER JOIN tbl_visitors on tbl_visitors.id=tbl_rating.host_id where visitor_id=? and rating_by=? and tbl_rating.is_deleted=?"
                        con.query(selectQuery, [req.user.id, 1, 0], (err, details) => {
                            if (err) throw err;
                            if (details.length > 0) {
                                original = data[0].overall_rating;
                                // let overall_rating = Math.round(original * 10) / 10;
                                let overall_rating = original.toFixed(1);
                                let result = {
                                    overall_rating: overall_rating,
                                    total_reviews: data[0].total_reviews,
                                    data: details
                                }
                                res.status(200).send({
                                    success: true,
                                    response: result
                                })
                            }
                            else {
                                res.status(400).send({
                                    success: false,
                                    message: "Rating not found !"
                                })
                            }
                        })
                    }
                    else {
                        res.status(400).send({
                            success: false,
                            message: "Rating is not available !"
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

// my ratings (hosts & visitors) for others

const MyRatings = async (req, res) => {
    try {
        let sql = "select * from tbl_hosts where visitor_id =?";
        await con.query(sql, [req.user.id], (err, data) => {
            if (err) throw err;
            if (data.length > 0) {
                // hosts
                let sqlQuery = "select tbl_rating.rating, tbl_rating.review, CONCAT(tbl_visitors.first_name, ' ', tbl_visitors.last_name) as Name, tbl_rating.created_at from tbl_rating INNER JOIN tbl_visitors on tbl_visitors.id=tbl_rating.visitor_id where host_id=? and rating_by=? and tbl_rating.is_deleted=?"
                con.query(sqlQuery, [req.user.id, 1, 0], (err, data) => {
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
                            message: "Rating is not available !"
                        })
                    }
                })
            }
            else {
                // visitor
                let sqlQuery = "select tbl_rating.rating, tbl_rating.review, CONCAT(tbl_visitors.first_name, ' ', tbl_visitors.last_name) as Name, tbl_rating.created_at from tbl_rating INNER JOIN tbl_visitors on tbl_visitors.id=tbl_rating.host_id where visitor_id=? and rating_by=? and tbl_rating.is_deleted=?"
                con.query(sqlQuery, [req.user.id, 2, 0], (err, data) => {
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
                            message: "Rating is not available !"
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

const changeMenu = async (req, res) => {
    const { hosting_id, dish_name, allergens } = req.body;
    try {
        let sqlQuery = `select id from hosting_menu where hosting_id=? and host_id=?`;
        await con.query(sqlQuery, [hosting_id, req.user.id], (err, result) => {
            if (err) throw err;
            if (result.length > 0) {
                for (let i = 0; i < dish_name.length; i++) {
                    let dish_picture = req.files.dish_picture[i].filename;
                    let updateQuery = `update hosting_menu set dish_name=?, allergens=?, dish_picture=? where id=? and host_id=?`
                    con.query(updateQuery, [dish_name[i], allergens[i], dish_picture, result[i].id, req.user.id], (err, data) => {
                        if (err) throw err;
                    })
                }
                res.status(200).send({
                    success: true,
                    message: "Menu changed successfully!"
                })
            }
            else {
                res.status(400).send({
                    success: false,
                    message: "Data not found!"
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
    HostRegister, addHosting, GetHostings, UpBookings, PreBookings, AcceptBooking, RejectBooking,
    Ratings, getRating, MyRatings, changeMenu
}
