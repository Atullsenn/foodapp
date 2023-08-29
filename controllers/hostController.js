const con = require('../config/database');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');

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
        const { place_id, country_id, state, city, street, building_name, flat_no, lat, lng, area_id,
            no_of_guests, activities_id, dress_code, rules,
            fees_per_person, fees_per_group, bank_country, bank_name, bank_iban,
            bank_swift_code, account_currency, conditions, discount, } = req.body;

        const dishes = [
            {
                "Cuisine_id": "15",
                "no_of_courses": "3",
                "dishes": [
                    {
                        "name": "Dish_1",
                        "allegen": "1,2,3",
                        "dish_picture": [{
                            fieldname: 'area_image',
                            originalname: 'area1.jpg',
                            encoding: '7bit',
                            mimetype: 'image/jpeg',
                            destination: 'D:\\pallavi\\projects\\foodapp\\new_backend\\foodapp\\public\\images',
                            filename: '1692791512946-area1.jpg',
                            path: 'D:\\pallavi\\projects\\foodapp\\new_backend\\foodapp\\public\\images\\1692791512946-area1.jpg',
                            size: 7006
                        }]
                    },
                    {
                        "name": "Dish_2",
                        "allegen": "3,4,5",
                        "dish_picture": [{
                            fieldname: 'area_image',
                            originalname: 'area1.jpg',
                            encoding: '7bit',
                            mimetype: 'image/jpeg',
                            destination: 'D:\\pallavi\\projects\\foodapp\\new_backend\\foodapp\\public\\images',
                            filename: '1692791512946-area1.jpg',
                            path: 'D:\\pallavi\\projects\\foodapp\\new_backend\\foodapp\\public\\images\\1692791512946-area1.jpg',
                            size: 7006
                        }]
                    },
                    {
                        "name": "Dish_3",
                        "allegen": "4,5,6",
                        "dish_picture": [{
                            fieldname: 'area_image',
                            originalname: 'area1.jpg',
                            encoding: '7bit',
                            mimetype: 'image/jpeg',
                            destination: 'D:\\pallavi\\projects\\foodapp\\new_backend\\foodapp\\public\\images',
                            filename: '1692791512946-area1.jpg',
                            path: 'D:\\pallavi\\projects\\foodapp\\new_backend\\foodapp\\public\\images\\1692791512946-area1.jpg',
                            size: 7006
                        }]
                    }
                ]
            },
            {
                "Cuisine_id": "16",
                "no_of_courses": "2",
                "dishes": [
                    {
                        "name": "Dish_1",
                        "allegen": "2,4,5",
                        "dish_picture": [{
                            fieldname: 'area_image',
                            originalname: 'area1.jpg',
                            encoding: '7bit',
                            mimetype: 'image/jpeg',
                            destination: 'D:\\pallavi\\projects\\foodapp\\new_backend\\foodapp\\public\\images',
                            filename: '1692791512946-area1.jpg',
                            path: 'D:\\pallavi\\projects\\foodapp\\new_backend\\foodapp\\public\\images\\1692791512946-area1.jpg',
                            size: 7006
                        }]
                    },
                    {
                        "name": "Dish_2",
                        "allegen": "3,4,5",
                        "dish_picture": [{
                            fieldname: 'area_image',
                            originalname: 'area1.jpg',
                            encoding: '7bit',
                            mimetype: 'image/jpeg',
                            destination: 'D:\\pallavi\\projects\\foodapp\\new_backend\\foodapp\\public\\images',
                            filename: '1692791512946-area1.jpg',
                            path: 'D:\\pallavi\\projects\\foodapp\\new_backend\\foodapp\\public\\images\\1692791512946-area1.jpg',
                            size: 7006
                        }]
                    }
                ]
            }
        ]

        const time_slot = [
            {
                "day": "monday",
                "cuisine_id": "15",
                "opening_time": "05:00:00",
                "closing_time": "10:00:00",
            },
            {
                "day": "Tuesday",
                "cuisine_id": "16",
                "opening_time": "05:00:00",
                "closing_time": "10:00:00",
            },
            {
                "day": "wednesday",
                "cuisine_id": "15",
                "opening_time": "05:00:00",
                "closing_time": "10:00:00",
            },
        ]

        const discounts = [
            {
                "conditions": "monday",
                "discount": "15"
            },
            {
                "conditions": "monday",
                "discount": "15"
            },
            {
                "conditions": "monday",
                "discount": "15"
            },
        ]

       /*  const rulesList = [ rule1, rule2,rule3
             {
                "rule": "rule1"
            },
            {
                "rule": "rule1"
            },
            {
                "rule": "rule1"
            } 
        ] */
        // console.log(typeof(dishes[0].indian[2].dish_picture))
        // insert data into databse on behalf of cuisonId and store images in public static folder in node js and mysql
        var dishe = req.body.menu_dishes;
        var time = req.body.time_slot;
        var discount_condi = req.body.discounts;

        // var dish_data = JSON.parse(dishe);
        var time_data = JSON.parse(time);
        var discounts_data = JSON.parse(discount_condi);
        var rules_data = JSON.parse(req.body.rules);

        var sql = "select * from tbl_hosts where visitor_id = ?";
        await con.query(sql, req.user.id, (err, result) => {
            if (err) throw err;
            if (result.length > 0) {
                let address_document;
                if (req.files.address_document !== undefined) {
                    address_document = req.files.address_document[0].filename;
                }
                //let address_document = req.files.address_document[0].filename;
                // let area_video = req.files.area_video[0].filename;
               // console.log(no_of_guests);
                var InsertQuery = `insert into tbl_hosting ( host_id, place_id, country_id, state, city, street, building_name, flat_no, address_document, lat, 
                    lng, area_id, no_of_guests, activities_id, dress_code, fees_per_person, 
                    fees_per_group, bank_country, bank_name, bank_iban, bank_swift_code, account_currency) 
                    values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
                con.query(InsertQuery, [req.user.id, place_id, country_id, state, city, street, building_name,
                    flat_no, address_document, lat, lng, area_id, no_of_guests, activities_id, dress_code,
                    fees_per_person, fees_per_group, bank_country, bank_name, bank_iban,
                    bank_swift_code, account_currency], (err, result) => {

                        if (err) throw err;

                        if (result.affectedRows > 0) {
                            // console.log(req.files.area_image)
                            if (req.files.area_image !== undefined) {
                                let area_images = req.files.area_image;
                                area_images.forEach(image => {
                                    var Query = `insert into hosting_images (host_id, hosting_id, image) values(?,?,?)`;
                                    con.query(Query, [req.user.id, result.insertId, image.filename], (err, data) => {
                                        if (err) throw err;
                                    });
                                })
                            }

                            var Query2 = `insert into hosting_rules (host_id, hosting_id, rules) values(?,?,?)`;
                            var Rules = rules_data;
                           // console.log(typeof(Rules));
                            Rules.forEach(Rule => {
                                con.query(Query2, [req.user.id, result.insertId, Rule], (err, data1) => {
                                    if (err) throw err;
                                })
                            })

                            /*  async function insertData(data) {
                                 for (const cuisine of data) {
                                     const cuisineId = cuisine.Cuisine_id;
                                     const no_of_courses = cuisine.no_of_courses;
                                     const dishes = cuisine.dishes; // Adjust based on cuisine type
 
                                     for (const dish of dishes) {
                                         const { name, allegen, dish_picture } = dish;
 
                                         const imageExtension = dish_picture[0].originalname.split('.').pop();
                                         const imageFileName = `${Date.now()}-${dish_picture[0].filename.replace(/\s+/g, '-')}.${imageExtension}`;
                                         const imagePath = `public/images/${imageFileName}`;
 
                                         // console.log(imageFileName);
                                         //console.log(imagePath)
                                         // fs.writeFileSync(imagePath, Buffer.from(picture.buffer, 'base64'));
                                         /* fs.writeFile(imagePath, Buffer.from(dish_picture[0].mimetype, 'base64'), (error) => {
                                             if (error) {
                                                 console.error('Error saving image:', error);
                                                 return;
                                             }
                                         }); */

                            //console.log(dish_picture)
                            /* const query = `INSERT INTO hosting_menu (host_id, hosting_id, cuisine_id, no_of_courses, dish_name, allergens_id, dish_picture) VALUES (?, ?, ?, ?, ?, ?, ?)`;
                             const values = [req.user.id, result.insertId, cuisineId, no_of_courses, name, allegen, imageFileName];
                             await con.query(query, values, (err, data) => {
                                 if (err) throw err;
                                 // console.log(data)
                             });
                         }
                     }
                 }
                 insertData(dish_data); */

                            async function AddData(data) {
                                for (const time of data) {
                                    //console.log(time)
                                    const day = time.day;
                                    const cuisine_id = time.cuisine_id;
                                    //console.log(cuisine_id)
                                    const opening_time = time.opening_time;
                                    const closing_time = time.closing_time;
                                    var Query2 = `insert into time_slots (host_id, hosting_id, day, cuisine_id, opening_time, closing_time) values(?,?,?,?,?,?)`;
                                    con.query(Query2, [req.user.id, result.insertId, day, cuisine_id, opening_time, closing_time], (err, data2) => {
                                        if (err) throw err;
                                    })
                                }
                            }
                            AddData(time_data);

                            async function discountData(data) {
                                for (const discounts of data) {
                                    //console.log(time)
                                    const conditions = discounts.conditions;
                                    const discount = discounts.discount;

                                    var Query2 = `insert into discounts ( host_id, hosting_id, conditions, discount ) values(?,?,?,?)`;
                                    con.query(Query2, [req.user.id, result.insertId, conditions, discount], (err, data3) => {
                                        if (err) throw err;
                                    })
                                }
                            }
                            discountData(discounts_data);

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
        await con.query(`select tbl_hosting.*, place_list.place_type, country_list.name as country_name, area_list.area_type, tbl_hosts.host_name, tbl_hosts.trade_license, tbl_hosts.about_me, 
        tbl_visitors.first_name, tbl_visitors.last_name from tbl_hosting 
        INNER JOIN tbl_visitors ON tbl_visitors.id= tbl_hosting.host_id 
        INNER JOIN tbl_hosts on tbl_hosts.visitor_id=tbl_hosting.host_id 
        INNER JOIN area_list on area_list.id=tbl_hosting.area_id
        INNER JOIN country_list on country_list.id=tbl_hosting.country_id
        INNER JOIN place_list on place_list.id=tbl_hosting.place_id
        where tbl_hosting.host_id='${req.user.id}'`, (err, data) => {
            if (err) throw err;
            //console.log(data)
            if (data.length < 1) {
                res.status(400).send({
                    success: false,
                    message: "No hosts Added yet !"
                })
            }
            else {
                //  console.log(data)
                var arr = [];
                for (let i = 0; i < data.length; i++) {
                    const arr1 = data[i].activities_id.split(",");
                    const activities_type = [];
                    arr1.forEach(data => {
                        var sql1 = `select * from activities_list where id='${data}'`;
                        con.query(sql1, (err, type) => {
                            if (err) throw err;
                            activities_type.push(type[0].activity_type);
                            //console.log(area_type)
                        })
                    });
                    con.query(`select * from hosting_images where hosting_id='${data[i].id}' and host_id='${data[i].host_id}'`, (err, result) => {
                        if (err) throw err;
                        //console.log(result)
                        var images = [];
                        result.forEach(item => {
                            images.push(item.image);

                        })
                        // console.log(images)
                        con.query(`select * from hosting_rules where hosting_id='${data[i].id}'and host_id='${data[i].host_id}'`, (err, response) => {
                            if (err) throw err;
                            //  console.log(response);
                            var rules = [];
                            response.forEach(item => {
                                rules.push(item.rules);
                            })
                            //console.log(rules)
                            con.query(`select time_slots.*, cuisine_list.cuisine_type from time_slots INNER JOIN cuisine_list on cuisine_list.id=time_slots.cuisine_id where hosting_id='${data[i].id}' and host_id='${data[i].host_id}'`, (err, timeDay) => {
                                if (err) throw err;
                                var time = [];
                                timeDay.forEach(item => {
                                    time.push(item);
                                })
                                //console.log(time)
                                con.query(`select * from discounts where hosting_id='${data[i].id}' and host_id='${data[i].host_id}'`, (err, discountData) => {
                                    if (err) throw err;
                                    var discount = [];
                                    discountData.forEach(item => {
                                        discount.push(item);
                                    })
                                    //console.log(discount)
                                    con.query(`select * from hosting_menu where hosting_id='${data[i].id}' and host_id='${data[i].host_id}'`, (err, menudata) => {
                                        if (err) throw err;
                                        var menus = [];
                                        menudata.forEach(item => {
                                            menus.push(item);
                                        })
                                        // console.log(menus)
                                        var values = {
                                            id: data[i].id,
                                            host_id: data[i].host_id,
                                            place_type: data[i].place_type,
                                            country: data[i].country_name,
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
                                            dress_code: data[i].dress_code,
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
                                            activities_type: activities_type,
                                            area_images: images,
                                            rules: rules,
                                            menus: menus,
                                            discount: discount,
                                            time_slots: time,
                                        }
                                        arr.push(values)
                                    })
                                })
                            })

                        })

                    })
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

const add_Hosting = async (req, res) => {
    try {
        const { place_id, country_id, state, city, street, building_name, flat_no, lat, lng, area_id,
            no_of_guests, activities_id, dress_code, rules,
            fees_per_person, fees_per_group, bank_country, bank_name, bank_iban,
            bank_swift_code, account_currency, conditions, discount, } = req.body;

        // console.log(typeof(dishes[0].indian[2].dish_picture))
        // insert data into databse on behalf of cuisonId and store images in public static folder in node js and mysql
        var dishe = req.body.menu_dishes;
        //  console.log(dishe)
        var time = req.body.time_slot;
        var discount_condi = req.body.discounts;

        var dish_data = JSON.parse(dishe);
        var time_data = JSON.parse(time);
        var discounts_data = JSON.parse(discount_condi);
        var rules_data = JSON.parse(req.body.rules);

        //  console.log(dish_data)

        var sql = "select * from tbl_hosts where visitor_id = ?";
        await con.query(sql, req.user.id, (err, result) => {
            if (err) throw err;
            if (result.length > 0) {
                let address_document;
                if (req.files.address_document !== undefined) {
                    address_document = req.files.address_document[0].filename;
                }
                //let address_document = req.files.address_document[0].filename;
                // let area_video = req.files.area_video[0].filename;

                var InsertQuery = `insert into tbl_hosting ( host_id, place_id, country_id, state, city, street, building_name, flat_no, address_document, lat, 
                        lng, area_id, no_of_guests, activities_id, dress_code, fees_per_person, 
                        fees_per_group, bank_country, bank_name, bank_iban, bank_swift_code, account_currency) 
                        values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
                con.query(InsertQuery, [req.user.id, place_id, country_id, state, city, street, building_name,
                    flat_no, address_document, lat, lng, area_id, no_of_guests, activities_id, dress_code,
                    fees_per_person, fees_per_group, bank_country, bank_name, bank_iban,
                    bank_swift_code, account_currency], (err, result) => {

                        if (err) throw err;

                        if (result.affectedRows > 0) {
                            // console.log(req.files.area_image)
                            if (req.files.area_image !== undefined) {
                                let area_images = req.files.area_image;
                                area_images.forEach(image => {
                                    var Query = `insert into hosting_images (host_id, hosting_id, image) values(?,?,?)`;
                                    con.query(Query, [req.user.id, result.insertId, image.filename], (err, data) => {
                                        if (err) throw err;
                                    });
                                })
                            }

                            var Query2 = `insert into hosting_rules (host_id, hosting_id, rules) values(?,?,?)`;
                            var Rules = rules_data;
                            console.log(typeof(Rules));
                            Rules.forEach(Rule => {
                                con.query(Query2, [req.user.id, result.insertId, Rule], (err, data1) => {
                                    if (err) throw err;
                                })
                            })

                            async function insertData(data) {
                                for (const cuisine of data) {
                                    const cuisineId = cuisine.Cuisine_id;
                                    const no_of_courses = cuisine.no_of_courses;
                                    const dishes = cuisine.dishes; // Adjust based on cuisine type
                                    // console.log(dishes)
                                    for (const dish of dishes) {
                                        const { name, allegen, dish_picture } = dish
                                        const base64Image = dish_picture; // Assuming you're sending a single image as 'image' field

                                        const imageName = Date.now() + '-' + `menu_image.jpg`;
                                        //console.log(imageName) // Set the desired image name
                                        const imagePath = path.join(__dirname, '../public/images', imageName);
                                        const imageBuffer = Buffer.from(base64Image, 'base64');

                                        fs.writeFile(imagePath, imageBuffer, (err) => {
                                            if (err) {
                                                console.error(err);
                                                // res.status(500).json({ message: 'Image upload failed.' });
                                            } else {
                                                console.log(`Image ${imageName} saved.`);
                                                // res.status(200).json({ message: 'Image uploaded successfully.' });
                                            }
                                        });
                                        const query = `INSERT INTO hosting_menu (host_id, hosting_id, cuisine_id, no_of_courses, dish_name, allergens_id, dish_picture) VALUES (?, ?, ?, ?, ?, ?, ?)`;
                                        const values = [req.user.id, result.insertId, cuisineId, no_of_courses, name, allegen, imageName];
                                        await con.query(query, values, (err, data) => {
                                            if (err) throw err;
                                            // console.log(data)
                                        });
                                    }
                                }
                            }
                            insertData(dish_data);

                            async function AddData(data) {
                                for (const time of data) {
                                    //console.log(time)
                                    const day = time.day;
                                    const cuisine_id = time.cuisine_id;
                                    //console.log(cuisine_id)
                                    const opening_time = time.opening_time;
                                    const closing_time = time.closing_time;
                                    var Query2 = `insert into time_slots (host_id, hosting_id, day, cuisine_id, opening_time, closing_time) values(?,?,?,?,?,?)`;
                                    con.query(Query2, [req.user.id, result.insertId, day, cuisine_id, opening_time, closing_time], (err, data2) => {
                                        if (err) throw err;
                                    })
                                }
                            }
                            AddData(time_data);

                            async function discountData(data) {
                                for (const discounts of data) {
                                    //console.log(time)
                                    const conditions = discounts.conditions;
                                    const discount = discounts.discount;

                                    var Query2 = `insert into discounts ( host_id, hosting_id, conditions, discount ) values(?,?,?,?)`;
                                    con.query(Query2, [req.user.id, result.insertId, conditions, discount], (err, data3) => {
                                        if (err) throw err;
                                    })
                                }
                            }

                            discountData(discounts_data);

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

module.exports = {
    HostRegister, addHosting, GetHostings, UpBookings, PreBookings, AcceptBooking, RejectBooking,
    Ratings, getRating, MyRatings, changeMenu, add_Hosting
}

