const con = require('../config/database');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');
const mime = require('mime');
const { log } = require('console');

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
        const { hosting_id, place_id, country_id, state, city, street, building_name, flat_no, lat, lng, area_id,
            no_of_guests, activities_id, dress_code, rules,
            fees_per_person, fees_per_group, bank_country, bank_name, bank_iban,
            bank_swift_code, account_currency, form_type, cuisine_style } = req.body;

        const dishes = [
            {
                "Cuisine_id": "15",
                "no_of_courses": "3",
                "dishes": [
                    {
                        "name": "Dish_1",
                        "allegen": "1,2,3",
                        "dish_picture": "https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp1.png"
                    },
                    {
                        "name": "Dish_2",
                        "allegen": "3,4,5",
                        "dish_picture": "https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp1.png"
                    },
                    {
                        "name": "Dish_3",
                        "allegen": "4,5,6",
                        "dish_picture": "https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp1.png"
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
                        "dish_picture": "https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp1.png"
                    },
                    {
                        "name": "Dish_2",
                        "allegen": "3,4,5",
                        "dish_picture": "https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp1.png"
                    }
                ]
            }
        ]
        /*
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
 
        const activities = [
            9,
            10,
            11
        ]
 
        const ruless = [
            "rule1",
            "rule2",
            "rule3"
        ]
 
        const cuisines = [
            15,
            16
        ] */

        var dishe = req.body.menu_dishes;
        var time = req.body.time_slot;
        var discount_condi = req.body.discounts;
        // console.log(typeof(activities_id))

        let cuisine;
        if (cuisine_style !== undefined) {
            const cuisineArray = JSON.parse(cuisine_style);
            cuisine = cuisineArray.join(',');
        }

        let activitiy;
        if (activities_id !== undefined) {
            const numberArray = JSON.parse(activities_id);
            activitiy = numberArray.join(',');
        }

        let time_data;
        if (time !== undefined) {
            time_data = JSON.parse(time);
            //console.log(time_data)
        }

        let discounts_data;
        if (discount_condi !== undefined) {
            discounts_data = JSON.parse(discount_condi);
        }

        let rules_data;
        if (rules !== undefined) {
            rules_data = JSON.parse(rules);
            // console.log(rules_data);
        }

        let address_document;
        if (req.files.address_document !== undefined) {
            address_document = req.files.address_document[0].filename;
        }

        let dish_data;
        if (dishe !== undefined) {
            dish_data = JSON.parse(dishe);
        }

        if (hosting_id == undefined || hosting_id == '') {

            //let address_document = req.files.address_document[0].filename;
            // let area_video = req.files.area_video[0].filename;

            var InsertQuery = `insert into tbl_hosting ( host_id, place_id, country_id, state, city, street, building_name, flat_no, address_document, lat, 
                    lng, area_id, no_of_guests, activities_id, dress_code, fees_per_person, 
                    fees_per_group, bank_country, bank_name, bank_iban, bank_swift_code, account_currency, form_type, cuisine_style) 
                    values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
            con.query(InsertQuery, [req.user.id, place_id, country_id, state, city, street, building_name,
                flat_no, address_document, lat, lng, area_id, no_of_guests, activitiy, dress_code,
                fees_per_person, fees_per_group, bank_country, bank_name, bank_iban,
                bank_swift_code, account_currency, form_type, cuisine], (err, result) => {

                    if (err) throw err;
                    //console.log(result)

                    if (result.affectedRows > 0) {
                        // console.log(result)
                        if (req.files.area_image !== undefined) {
                            let area_images = req.files.area_image;
                            area_images.forEach(image => {
                                var Query = `insert into hosting_images (host_id, hosting_id, image) values(?,?,?)`;
                                con.query(Query, [req.user.id, result.insertId, image.filename], (err, data) => {
                                    if (err) throw err;
                                });
                            })
                        }

                        if (rules !== undefined) {
                            var Query2 = `insert into hosting_rules (host_id, hosting_id, rules) values(?,?,?)`;
                            var Rules = rules_data;
                            // console.log(typeof(Rules));
                            Rules.forEach(Rule => {
                                con.query(Query2, [req.user.id, result.insertId, Rule], (err, data1) => {
                                    if (err) throw err;
                                })
                            })
                        }
                        async function insertData(data) {
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
                                    fs.writeFile(imagePath, Buffer.from(dish_picture[0].mimetype, 'base64'), (error) => {
                                        if (error) {
                                            console.error('Error saving image:', error);
                                            return;
                                        }
                                    });

                                    //console.log(dish_picture)
                                    /* const query = `INSERT INTO hosting_menu (host_id, hosting_id, cuisine_id, no_of_courses, dish_name, allergens_id, dish_picture) VALUES (?, ?, ?, ?, ?, ?, ?)`;
                                    const values = [req.user.id, result.insertId, cuisineId, no_of_courses, name, allegen, imageFileName];
                                    await con.query(query, values, (err, data) => {
                                        if (err) throw err;
                                        // console.log(data)
                                    }); */
                                }
                            }
                        }
                        insertData(dish_data);

                        if (time_data !== undefined) {
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
                        }

                        if (discounts_data !== undefined) {
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
                        }

                        res.status(200).send({
                            success: true,
                            message: "Successfully added details !",
                            insertId: result.insertId
                        })
                    }
                    else {
                        res.status(400).send({
                            success: false,
                            message: "Failed to insert details !"
                        })
                    }
                })
        }
        else {
            var UpdateQuery = `update tbl_hosting set host_id=?, place_id=?, country_id=?, state=?, city=?, 
                street=?, building_name=?, flat_no=?, address_document=?, lat=?, 
                    lng=?, area_id=?, no_of_guests=?, activities_id=?, dress_code=?, fees_per_person=?, 
                    fees_per_group=?, bank_country=?, bank_name=?, bank_iban=?, bank_swift_code=?, account_currency=?
                    , form_type=?, cuisine_style=? where id=?`;
            con.query(UpdateQuery, [req.user.id, place_id, country_id, state, city, street, building_name,
                flat_no, address_document, lat, lng, area_id, no_of_guests, activitiy, dress_code,
                fees_per_person, fees_per_group, bank_country, bank_name, bank_iban,
                bank_swift_code, account_currency, form_type, cuisine, hosting_id], (err, result) => {
                    if (err) throw err;
                    if (result.affectedRows > 0) {
                        if (req.files.area_image !== undefined) {
                            var Query = `delete from hosting_images where hosting_id=?`;
                            con.query(Query, [hosting_id], (err, data) => {
                                if (err) throw err;
                            });

                            let area_images = req.files.area_image;
                            area_images.forEach(image => {
                                var Query = `insert into hosting_images (host_id, hosting_id, image) values(?,?,?)`;
                                con.query(Query, [req.user.id, hosting_id, image.filename], (err, data) => {
                                    if (err) throw err;
                                });
                            })
                        }
                        // console.log(rules)
                        if (rules_data !== undefined) {
                            var deleteQuery = `delete from hosting_rules where hosting_id=?`;
                            con.query(deleteQuery, [hosting_id], (err, data1) => {
                                if (err) throw err;
                            })

                            var Query2 = `insert into hosting_rules (host_id, hosting_id, rules) values(?,?,?)`;

                            var Rules = rules_data;
                            // console.log(typeof(Rules));
                            Rules.forEach(Rule => {
                                con.query(Query2, [req.user.id, hosting_id, Rule], (err, data1) => {
                                    if (err) throw err;
                                })
                            })
                        }

                        if (time_data !== undefined) {
                            async function AddData(data) {
                                var deleteQuery2 = `delete from time_slots where hosting_id=?`;
                                con.query(deleteQuery2, [hosting_id], (err, data2) => {
                                    if (err) throw err;
                                })
                                for (const time of data) {
                                    //console.log(time)
                                    const day = time.day;
                                    const cuisine_id = time.cuisine_id;
                                    //console.log(cuisine_id)
                                    const opening_time = time.opening_time;
                                    const closing_time = time.closing_time;
                                    var Query2 = `insert into time_slots (host_id, hosting_id, day, cuisine_id, opening_time, closing_time) values(?,?,?,?,?,?)`;
                                    con.query(Query2, [req.user.id, hosting_id, day, cuisine_id, opening_time, closing_time], (err, data2) => {
                                        if (err) throw err;
                                    })
                                }
                            }
                            AddData(time_data);
                        }

                        async function insertData(data) {
                            for (const cuisine of data) {
                                const cuisineId = cuisine.Cuisine_id;
                                const no_of_courses = cuisine.no_of_courses;
                                const dishes = cuisine.dishes; // Adjust based on cuisine type
                                // console.log(data);

                                const deleteQuery = `delete from hosting_menu where host_id=? and hosting_id=?`;
                                con.query(deleteQuery, [req.user.id, hosting_id], (err, result) => {
                                    if (err) throw err;
                                })
                                for (const dish of dishes) {
                                    const { name, allegen, dish_picture } = dish;
                                    //console.log(dish_picture);
                                    async function imageUrlToBase64(url) {
                                        try {
                                            const response = await fetch(url);

                                            const blob = await response.arrayBuffer();

                                            const contentType = response.headers.get('content-type');

                                            const base64String = `data:${contentType};base64,${Buffer.from(
                                                blob,
                                            ).toString('base64')}`;

                                            return base64String;
                                        } catch (err) {
                                            console.log(err);
                                        }
                                    }

                                    imageUrlToBase64(dish_picture).then(base64String => {
                                        // console.log(base64String);
                                        // let img_url = 'data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==';
                                        let img_url = base64String;
                                        var matches = img_url.match(/^data:([A-Za-z-+/]+);base64,(.+)$/),
                                            response = {};

                                        if (matches.length !== 3) {
                                            return new Error('Invalid input string');
                                        }

                                        response.type = matches[1];

                                        //console.log(typeof(Number(matchValue)))
                                        response.data = new Buffer.from(matches[2], 'base64');
                                        // console.log(response);
                                        let decodedImg = response;
                                        let imageBuffer = decodedImg.data;
                                        let type = decodedImg.type;
                                        let extension = mime.getExtension(type);
                                        let fileName = Date.now() + '-' + "image." + extension;
                                        try {
                                            fs.writeFileSync("./public/images/" + fileName, imageBuffer, 'utf8');
                                            //return res.send({ "status": "success" });
                                        } catch (e) {
                                            console.log(e);
                                        }
                                        // console.log(fileName);

                                        const query = `INSERT INTO hosting_menu (host_id, hosting_id, cuisine_id, no_of_courses, dish_name, allergens_id, dish_picture) VALUES (?, ?, ?, ?, ?, ?, ?)`;
                                        const values = [req.user.id, hosting_id, cuisineId, no_of_courses, name, allegen, fileName];
                                        con.query(query, values, (err, data) => {
                                            if (err) throw err;
                                            // console.log(data)
                                        });
                                    });
                                }
                            }
                        }
                        insertData(dish_data);

                        if (discounts_data !== undefined) {
                            async function discountData(data) {
                                var deleteQuery3 = `delete from discounts where hosting_id=?`;
                                con.query(deleteQuery3, [hosting_id], (err, data2) => {
                                    if (err) throw err;
                                })
                                for (const discounts of data) {
                                    //console.log(time)
                                    const conditions = discounts.conditions;
                                    const discount = discounts.discount;

                                    var Query2 = `insert into discounts ( host_id, hosting_id, conditions, discount ) values(?,?,?,?)`;
                                    con.query(Query2, [req.user.id, hosting_id, conditions, discount], (err, data3) => {
                                        if (err) throw err;
                                    })
                                }
                            }
                            discountData(discounts_data);
                        }

                        res.status(200).send({
                            success: true,
                            message: "Successfully update details !",
                            insertId: hosting_id,
                        })
                    }
                    else {
                        res.status(400).send({
                            success: false,
                            message: "failed to update details !"
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

const addCuisine = async (req, res) => {
    try {
        const { cuisine_style } = req.body;
        if (!cuisine_style) {
            res.status(400).send({
                success: false,
                message: "Provide cuisine_style details !"
            })
        }
        else {
            // console.log(cuisine_style);
            let cuisine;
            if (cuisine_style !== undefined) {
                //var b = JSON.parse(JSON.stringify(products));
                const cuisineArray = JSON.parse(JSON.stringify(cuisine_style));
                cuisine = cuisineArray.join(',');
            }
            let sql = `insert into cuisine_style (cuisine_type) values(?)`;
            await con.query(sql, (cuisine), (err, data) => {
                if (err) throw err;
                // console.log(data);
                if (data.affectedRows > 0) {
                    res.status(200).send({
                        success: true,
                        insertId: data.insertId
                    })
                }
                else {
                    res.status(400).send({
                        success: false,
                        insertId: "Failed to add cuisine type !"
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

const getCuisine = async (req, res) => {
    const { cuisine_id } = req.body;
    try {
        if (!cuisine_id) {
            res.status(400).send({
                success: false,
                message: "Provide cuisine_id !"
            })
        }
        else {
            let getQuery = `select cuisine_type from cuisine_style where id=?`;
            await con.query(getQuery, [cuisine_id], (err, data) => {
                if (err) throw err;
                // console.log(data[0].cuisine_type);
                if (data.length > 0) {
                    const cuisine_style = [];
                    //  console.log(data[i].cuisine_style)
                    const arr1 = data[0].cuisine_type.split(",");
                    //  console.log(arr1)
                    arr1.forEach(data => {
                        // console.log(data)
                        var sql1 = `select id, cuisine_type from cuisine_list where id='${data}'`;
                        con.query(sql1, (err, type) => {
                            if (err) throw err;
                            cuisine_style.push(type[0]);
                            // console.log(cuisine_style)
                        })
                    });
                    setTimeout(() => {
                        res.status(200).send({
                            success: true,
                            data: cuisine_style
                        })
                    }, 1000)
                }
                else {
                    res.status(400).send({
                        success: false,
                        message: "data not found !"
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

const GetHostings = async (req, res) => {
    try {
        await con.query(`select tbl_hosting.*,  place_list.place_type, country_list.name as country_name, area_list.area_type, tbl_hosts.host_name, tbl_hosts.trade_license, tbl_hosts.about_me, 
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
                    // console.log(data[i].activities_id !== null )
                    // console.log(data[i].activities_id )
                    const cuisine_style = [];
                    //  console.log(data[i].cuisine_style)
                    if (data[i].cuisine_style !== null) {
                        //console.log('hii')
                        const arr1 = data[i].cuisine_style.split(",");
                        //console.log(arr1)
                        arr1.forEach(data => {
                            // console.log(data)
                            var sql1 = `select id, cuisine_type from cuisine_list where id='${data}'`;
                            con.query(sql1, (err, type) => {
                                if (err) throw err;

                                cuisine_style.push(type[0]);
                                // console.log(cuisine_style)
                            })

                        });
                    }
                    //  console.log(cuisine_style)
                    const activities_type = [];
                    if (data[i].activities_id !== null) {
                        //console.log('hii')
                        const arr1 = data[i].activities_id.split(",");
                        //console.log(arr1)
                        arr1.forEach(data => {
                            // console.log(data)
                            var sql1 = `select * from activities_list where id='${data}'`;
                            con.query(sql1, (err, type) => {
                                if (err) throw err;
                                // console.log(type)
                                activities_type.push(type[0].activity_type);
                                //console.log(area_type)
                            })
                        });
                    }

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
                                    con.query(`select hosting_menu.*, cuisine_list.cuisine_type from hosting_menu 
                                    INNER JOIN cuisine_list on cuisine_list.id=hosting_menu.cuisine_id
                                    where hosting_id='${data[i].id}' and host_id='${data[i].host_id}'`, (err, menudata) => {
                                        if (err) throw err;
                                        //console.log(menudata);
                                        if (menudata.length > 0) {

                                            for (const row of menudata) {
                                                const allergenIds = row.allergens_id.split(',').map(Number);
                                                row.allergen_types = allergenIds;
                                            }
                                            const allergenData = {};

                                            for (const row of menudata) {

                                                for (const allergenId of row.allergen_types) {
                                                    row.allergen_types = [];
                                                    if (!allergenData[allergenId]) {
                                                        //console.log(allergenId);
                                                        // Query the allergen table to get allergen data
                                                        const query = 'select id, name from allergens_list WHERE id = ?';
                                                        con.query(query, [allergenId], (err, results) => {
                                                            if (err) {
                                                                console.error('Error querying allergen table:', err);
                                                            } else {
                                                                if (results.length > 0) {
                                                                    const allergen = results[0];

                                                                    row.allergen_types.push(allergen);
                                                                    //  allergenData[allergenId] = allergen;
                                                                } else {
                                                                    // console.warn(`Allergen with ID ${allergenId} not found`);
                                                                }
                                                            }
                                                        });
                                                    }
                                                }
                                            }
                                            var menus = [];
                                            menudata.forEach(item => {
                                                menus.push(item);
                                            })
                                        }
                                        var values = {
                                            id: data[i].id,
                                            host_id: data[i].host_id,
                                            form_type: data[i].form_type,
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
                                            // data: data[i]
                                            cuisine_list: cuisine_style,
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
        // INNER JOIN tbl_hosting ON tbl_hosting.id= tbl_booking.hosting_id

        let sql = `select tbl_booking.*, DATE_FORMAT(tbl_booking.booking_date ,'%Y-%m-%d') as booking_date, tbl_visitors.first_name, tbl_visitors.last_name from tbl_booking 
        INNER JOIN tbl_visitors ON tbl_visitors.id= tbl_booking.visitor_id 
        where tbl_booking.host_id=? and
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
        const { hosting_id, place_id, country_id, state, city, street, building_name, flat_no, lat, lng, area_id,
            no_of_guests, activities_id, dress_code, rules, cuisine_style,
            fees_per_person, fees_per_group, bank_country, bank_name, bank_iban,
            bank_swift_code, account_currency, form_type } = req.body;

        var dishe = req.body.menu_dishes;
        var time = req.body.time_slot;
        var discount_condi = req.body.discounts;
        // console.log(typeof(activities_id))

        let cuisine;
        if (cuisine_style !== undefined && cuisine_style !== '') {
            const cuisineArray = JSON.parse(cuisine_style);
            cuisine = cuisineArray.join(',');
        }

        let activitiy;
        if (activities_id !== undefined && activities_id !== '') {
            const numberArray = JSON.parse(activities_id);
            activitiy = numberArray.join(',');
        }

        let time_data;
        if (time !== undefined && time !== '') {
            time_data = JSON.parse(time);
            //console.log(time_data)
        }

        let discounts_data;
        if (discount_condi !== undefined && discount_condi !== '') {
            discounts_data = JSON.parse(discount_condi);
        }

        let rules_data;
        if (rules !== undefined && rules !== '') {
            rules_data = JSON.parse(rules);
            // console.log(rules_data);
        }

        let address_document;
        if (req.files.address_document !== undefined) {
            address_document = req.files.address_document[0].filename;
        }

        let dish_data;
        if (dishe !== undefined && dishe !== '') {
            dish_data = JSON.parse(dishe);
        }

        if (hosting_id == undefined || hosting_id == '') {

            //let address_document = req.files.address_document[0].filename;
            // let area_video = req.files.area_video[0].filename;

            var InsertQuery = `insert into tbl_hosting ( host_id, place_id, form_type) values(?,?,?)`;
            await con.query(InsertQuery, [req.user.id, place_id, form_type], (err, result) => {

                if (err) throw err;

                if (result.affectedRows > 0) {
                    // console.log(req.files.area_image)
                    let selectQuery = `select * from tbl_hosting where host_id=? and id=?`
                    con.query(selectQuery, [req.user.id, result.insertId], (err, data) => {
                        if (err) throw err;
                        res.status(200).send({
                            success: true,
                            data: data[0]
                        })
                    })
                }
                else {
                    res.status(400).send({
                        success: false,
                        message: "Failed to insert details !"
                    })
                }
            })
        }
        else {
            const menus = [];
            var UpdateQuery = `update tbl_hosting set host_id=?, place_id=?, country_id=?, state=?, city=?, 
                street=?, building_name=?, flat_no=?, address_document=?, form_type=? where id=?`;
            con.query(UpdateQuery, [req.user.id, place_id, country_id, state, city, street, building_name,
                flat_no, address_document, form_type, hosting_id], (err, result) => {
                    if (err) throw err;
                    if (result.affectedRows > 0) {

                        if (lat !== '' || lng !== '') {
                            var UpdateQuery = `update tbl_hosting set host_id=?, place_id=?, country_id=?, state=?, city=?, 
                street=?, building_name=?, flat_no=?, address_document=?, lat=?, lng=?, form_type=? where id=?`;
                            con.query(UpdateQuery, [req.user.id, place_id, country_id, state, city, street, building_name,
                                flat_no, address_document, lat, lng, form_type, hosting_id], (err, result) => {
                                    if (err) throw err;
                                })
                        }


                        if (area_id !== '') {
                            var UpdateQuery = `update tbl_hosting set host_id=?, place_id=?, country_id=?, state=?, city=?, 
                street=?, building_name=?, flat_no=?, address_document=?, lat=?, lng=?, area_id=?, form_type=? where id=?`;
                            con.query(UpdateQuery, [req.user.id, place_id, country_id, state, city, street, building_name,
                                flat_no, address_document, lat, lng, area_id, form_type, hosting_id], (err, result) => {
                                    if (err) throw err;
                                    // res.send('area')
                                })
                        }
                        if (req.files.area_image !== undefined) {
                            var Query = `delete from hosting_images where hosting_id=?`;
                            con.query(Query, [hosting_id], (err, data) => {
                                if (err) throw err;
                            });

                            let area_images = req.files.area_image;
                            area_images.forEach(image => {
                                var Query = `insert into hosting_images (host_id, hosting_id, image) values(?,?,?)`;
                                con.query(Query, [req.user.id, hosting_id, image.filename], (err, data) => {
                                    if (err) throw err;
                                    // res.send('image')
                                });
                            })
                        }

                        // console.log(rules)
                        if (rules_data !== undefined && no_of_guests !== undefined) {
                            var UpdateQuery = `update tbl_hosting set host_id=?, place_id=?, country_id=?, state=?, city=?, 
                street=?, building_name=?, flat_no=?, address_document=?, lat=?, lng=?, area_id=?, no_of_guests=? where id=?`;
                            con.query(UpdateQuery, [req.user.id, place_id, country_id, state, city, street, building_name,
                                flat_no, address_document, lat, lng, area_id, no_of_guests, hosting_id], (err, result) => {
                                    if (err) throw err;
                                })

                            var deleteQuery = `delete from hosting_rules where hosting_id=?`;
                            con.query(deleteQuery, [hosting_id], (err, data1) => {
                                if (err) throw err;
                            })

                            var Query2 = `insert into hosting_rules (host_id, hosting_id, rules) values(?,?,?)`;

                            var Rules = rules_data;
                            // console.log(typeof(Rules));
                            Rules.forEach(Rule => {
                                con.query(Query2, [req.user.id, hosting_id, Rule], (err, data1) => {
                                    if (err) throw err;
                                })
                            })
                        }

                        if (activities_id !== undefined) {
                            var UpdateQuery = `update tbl_hosting set host_id=?, place_id=?, country_id=?, state=?, city=?, 
                street=?, building_name=?, flat_no=?, address_document=?, lat=?, lng=?, area_id=?, no_of_guests=?, activities_id=? where id=?`;
                            con.query(UpdateQuery, [req.user.id, place_id, country_id, state, city, street, building_name,
                                flat_no, address_document, lat, lng, area_id, no_of_guests, activitiy, hosting_id], (err, result) => {
                                    if (err) throw err;
                                })
                        }

                        if (dress_code !== undefined) {
                            var UpdateQuery = `update tbl_hosting set host_id=?, place_id=?, country_id=?, state=?, city=?, 
                street=?, building_name=?, flat_no=?, address_document=?, lat=?, lng=?, area_id=?, no_of_guests=?, activities_id=?, dress_code=? where id=?`;
                            con.query(UpdateQuery, [req.user.id, place_id, country_id, state, city, street, building_name,
                                flat_no, address_document, lat, lng, area_id, no_of_guests, activitiy, dress_code, hosting_id], (err, result) => {
                                    if (err) throw err;
                                })
                        }

                        if (cuisine_style !== undefined) {
                            var UpdateQuery = `update tbl_hosting set host_id=?, place_id=?, country_id=?, state=?, city=?, 
                street=?, building_name=?, flat_no=?, address_document=?, lat=?, lng=?, area_id=?, no_of_guests=?, activities_id=?, dress_code=?, cuisine_style=? where id=?`;
                            con.query(UpdateQuery, [req.user.id, place_id, country_id, state, city, street, building_name,
                                flat_no, address_document, lat, lng, area_id, no_of_guests, activitiy, dress_code, cuisine, hosting_id], (err, result) => {
                                    if (err) throw err;
                                })
                        }
                        if (dish_data !== undefined) {
                            async function insertData(data) {
                                for (const cuisine of data) {
                                    const cuisineId = cuisine.Cuisine_id;
                                    const no_of_courses = cuisine.no_of_courses;
                                    const dishes = cuisine.dishes; // Adjust based on cuisine type
                                    // console.log(data);

                                    const deleteQuery = `delete from hosting_menu where host_id=? and hosting_id=?`;
                                    await con.query(deleteQuery, [req.user.id, hosting_id], (err, result) => {
                                        if (err) throw err;
                                    })
                                    for (const dish of dishes) {
                                        const { name, allegen, dish_picture } = dish;
                                        //console.log(dish_picture);
                                        async function imageUrlToBase64(url) {
                                            try {
                                                const response = await fetch(url);

                                                const blob = await response.arrayBuffer();

                                                const contentType = response.headers.get('content-type');

                                                const base64String = `data:${contentType};base64,${Buffer.from(
                                                    blob,
                                                ).toString('base64')}`;

                                                return base64String;
                                            } catch (err) {
                                                console.log(err);
                                            }
                                        }

                                        imageUrlToBase64(dish_picture).then(base64String => {
                                            // console.log(base64String);
                                            // let img_url = 'data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==';
                                            let img_url = base64String;
                                            var matches = img_url.match(/^data:([A-Za-z-+/]+);base64,(.+)$/),
                                                response = {};

                                            if (matches.length !== 3) {
                                                return new Error('Invalid input string');
                                            }

                                            response.type = matches[1];

                                            //console.log(typeof(Number(matchValue)))
                                            response.data = new Buffer.from(matches[2], 'base64');
                                            // console.log(response);
                                            let decodedImg = response;
                                            let imageBuffer = decodedImg.data;
                                            let type = decodedImg.type;
                                            let extension = mime.getExtension(type);
                                            let fileName = Date.now() + '-' + "image." + extension;
                                            try {
                                                fs.writeFileSync("./public/images/" + fileName, imageBuffer, 'utf8');
                                                //return res.send({ "status": "success" });
                                            } catch (e) { 
                                                console.log(e);
                                            }
                                            // console.log(fileName);

                                            const query = `INSERT INTO hosting_menu (host_id, hosting_id, cuisine_id, no_of_courses, dish_name, allergens_id, dish_picture) VALUES (?, ?, ?, ?, ?, ?, ?)`;
                                            const values = [req.user.id, hosting_id, cuisineId, no_of_courses, name, allegen, fileName];
                                            con.query(query, values, (err, data) => {
                                                if (err) throw err;
                                                // console.log(data.insertId)
                                                if (data.insertId > 0) {
                                                    con.query(`select hosting_menu.*, cuisine_list.cuisine_type from hosting_menu 
                                                    INNER JOIN cuisine_list on cuisine_list.id=hosting_menu.cuisine_id
                                                    where hosting_menu.id='${data.insertId}'`, (err, menudata) => {
                                                        if (err) throw err;
                                                        //console.log(menudata)
                                                        if (menudata.length > 0) {
                                                            for (const row of menudata) {
                                                                const allergenIds = row.allergens_id.split(',').map(Number);
                                                                row.allergen_types = allergenIds;
                                                            }
                                                            const allergenData = {};

                                                            for (const row of menudata) {

                                                                for (const allergenId of row.allergen_types) {
                                                                    row.allergen_types = [];
                                                                    if (!allergenData[allergenId]) {
                                                                        //console.log(allergenId);
                                                                        // Query the allergen table to get allergen data
                                                                        const query = 'select id, name from allergens_list WHERE id = ?';
                                                                        con.query(query, [allergenId], (err, results) => {
                                                                            if (err) {
                                                                                throw err;
                                                                            } else {
                                                                                if (results.length > 0) {
                                                                                    const allergen = results[0];

                                                                                    row.allergen_types.push(allergen);
                                                                                    //  allergenData[allergenId] = allergen;
                                                                                } else {
                                                                                   // console.warn(`Allergen with ID ${allergenId} not found`);
                                                                                }
                                                                            }
                                                                        });
                                                                    }
                                                                }
                                                            }
                                                            menus.push(menudata[0]);
                                                        }
                                                    })
                                                }
                                            });
                                        });
                                    }
                                }
                            }
                            insertData(dish_data);
                        }

                        if (time_data !== undefined) {
                            async function AddData(data) {
                                var deleteQuery2 = `delete from time_slots where hosting_id=?`;
                                con.query(deleteQuery2, [hosting_id], (err, data2) => {
                                    if (err) throw err;
                                })
                                for (const time of data) {
                                    //console.log(time)
                                    const day = time.day;
                                    const cuisine_id = time.cuisine_id;
                                    //console.log(cuisine_id)
                                    const opening_time = time.opening_time;
                                    const closing_time = time.closing_time;
                                    var Query2 = `insert into time_slots (host_id, hosting_id, day, cuisine_id, opening_time, closing_time) values(?,?,?,?,?,?)`;
                                    con.query(Query2, [req.user.id, hosting_id, day, cuisine_id, opening_time, closing_time], (err, data2) => {
                                        if (err) throw err;
                                    })
                                }
                            }
                            AddData(time_data);
                        }

                        if (fees_per_person !== undefined && fees_per_group !== undefined) {
                            var UpdateQuery = `update tbl_hosting set host_id=?, place_id=?, country_id=?, state=?, city=?,
                street=?, building_name=?, flat_no=?, address_document=?, lat=?, lng=?, area_id=?, no_of_guests=?, activities_id=?, dress_code=?, cuisine_style=?, fees_per_person=?, fees_per_group=? where id=?`;
                            con.query(UpdateQuery, [req.user.id, place_id, country_id, state, city, street, building_name,
                                flat_no, address_document, lat, lng, area_id, no_of_guests, activitiy, dress_code, cuisine, fees_per_person, fees_per_group, hosting_id], (err, result) => {
                                    if (err) throw err;
                                })
                        }

                        if (discounts_data !== undefined) {
                            async function discountData(data) {
                                var deleteQuery3 = `delete from discounts where hosting_id=?`;
                                con.query(deleteQuery3, [hosting_id], (err, data2) => {
                                    if (err) throw err;
                                })
                                for (const discounts of data) {
                                    //console.log(time)
                                    const conditions = discounts.conditions;
                                    const discount = discounts.discount;

                                    var Query2 = `insert into discounts ( host_id, hosting_id, conditions, discount ) values(?,?,?,?)`;
                                    con.query(Query2, [req.user.id, hosting_id, conditions, discount], (err, data3) => {
                                        if (err) throw err;
                                    })
                                }
                            }
                            discountData(discounts_data);
                        }

                        if (bank_country !== undefined && bank_name !== undefined && bank_iban !== undefined && bank_swift_code !== undefined && account_currency !== undefined) {
                            var UpdateQuery = `update tbl_hosting set host_id=?, place_id=?, country_id=?, state=?, city=?, 
                                street=?, building_name=?, flat_no=?, address_document=?, lat=?, lng=?, area_id=?, no_of_guests=?, 
                                activities_id=?, dress_code=?, cuisine_style=?, fees_per_person=?, 
                                fees_per_group=?, bank_country=?, bank_name=?, bank_iban=?, bank_swift_code=?, account_currency=?, form_type=? where id=?`;
                            con.query(UpdateQuery, [req.user.id, place_id, country_id, state, city, street, building_name,
                                flat_no, address_document, lat, lng, area_id, no_of_guests, activitiy, dress_code, cuisine, fees_per_person, fees_per_group, bank_country, bank_name, bank_iban,
                                bank_swift_code, account_currency, form_type, hosting_id], (err, result) => {
                                    if (err) throw err;
                                })
                        }

                        con.query(`select tbl_hosting.*, tbl_hosting.area_id,  place_list.place_type, country_list.name as country_name from tbl_hosting
        INNER JOIN country_list on country_list.id=tbl_hosting.country_id
        INNER JOIN place_list on place_list.id=tbl_hosting.place_id
        where tbl_hosting.host_id='${req.user.id}' and tbl_hosting.id='${hosting_id}'`, (err, data) => {
                            if (err) throw err;
                            // console.log(data)
                            if (data.length < 1) {
                                res.status(400).send({
                                    success: false,
                                    message: "No hosts Added yet !"
                                })
                            }
                            else {
                                //res.send(area[0])
                                var arr = [];
                                for (let i = 0; i < data.length; i++) {
                                    // console.log(data[i].area_id !== null && data[i].area_id !==0)
                                    var area_type;
                                    if (data[i].area_id !== 0) {
                                        //console.log(data[i].area_id !==0);
                                        con.query(`select area_type from area_list where id='${data[i].area_id}'`, (err, area) => {
                                            if (err) throw err;
                                            if (area.length > 0) {
                                                area_type = area[0].area_type;
                                            }
                                            //area_type = area[0].area_type;
                                        })
                                    }
                                    // res.send('area1');
                                    // console.log(data[i].activities_id !== null )
                                    // console.log(data[i].activities_id )
                                    const cuisine_style = [];
                                    //  console.log(data[i].cuisine_style)
                                    if (data[i].cuisine_style !== null) {
                                        //console.log('hii')
                                        const arr1 = data[i].cuisine_style.split(",");
                                        //console.log(arr1)
                                        arr1.forEach(data => {
                                            // console.log(data)
                                            var sql1 = `select id, cuisine_type from cuisine_list where id='${data}'`;
                                            con.query(sql1, (err, type) => {
                                                if (err) throw err;

                                                cuisine_style.push(type[0]);
                                                // console.log(cuisine_style)
                                            })

                                        });
                                    }
                                    //  console.log(cuisine_style)
                                    const activities_type = [];
                                    if (data[i].activities_id !== null) {
                                        //console.log('hii')
                                        const arr1 = data[i].activities_id.split(",");
                                        //console.log(arr1)
                                        arr1.forEach(data => {
                                            // console.log(data)
                                            var sql1 = `select * from activities_list where id='${data}'`;
                                            con.query(sql1, (err, type) => {
                                                if (err) throw err;
                                                // console.log(type)
                                                activities_type.push(type[0].activity_type);
                                                //console.log(area_type)
                                            })
                                        });
                                    }

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
                                                    var values = {
                                                        id: data[i].id,
                                                        host_id: data[i].host_id,
                                                        form_type: data[i].form_type,
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
                                                        area_type: area_type,
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
                                                        cuisine_list: cuisine_style,
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
                                }
                                setTimeout(function () {
                                    res.status(200).send({
                                        success: true,
                                        data: arr[0]
                                    })
                                }, 2000)
                            }
                        })
                    }
                    else {
                        res.status(400).send({
                            success: false,
                            message: "failed to update details !",
                            result: result.affectedRows
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


module.exports = {
    HostRegister, addHosting, GetHostings, UpBookings, PreBookings, AcceptBooking, RejectBooking,
    Ratings, getRating, MyRatings, changeMenu, add_Hosting, addCuisine, getCuisine
}
