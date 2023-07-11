const con = require('../config/database');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const sendMail = require('../helpers/sendMail')
const rendomString = require('randomstring');

const activityList = async (req, res) => {
    try {
        const { activity_type } = req.body;
        var selectQuery = "select * from activities_list";
        await con.query(selectQuery, (err, data) => {
            if (err) throw err;
            if (data.length < 1) {
                var sql = `insert into activities_list (activity_type) values ('${activity_type}')`;
                con.query(sql, (err, data) => {
                    if (err) throw err;
                    res.status(200).send({
                        success: true,
                        msg: "Activity added successfully !"
                    })
                })
            }
            else {
                let checking = false;
                for (let i = 0; i < data.length; i++) {
                    if (data[i].activity_type === activity_type) {
                        checking = true;
                        break;
                    }
                }
                if (checking == false) {
                    var sql = `insert into activities_list (activity_type) values ('${activity_type}')`;
                    con.query(sql, (err, data) => {
                        if (err) throw err;
                        res.status(200).send({
                            success: true,
                            msg: "Activity added successfully !"
                        })
                    })
                }
                else {
                    res.status(400).send({
                        success: false,
                        msg: "Activity is already exist !"
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

const allergensList = async (req, res) => {
    try {
        const { name } = req.body;
        var selectQuery = "select * from allergens_list";
        await con.query(selectQuery, (err, data) => {
            if (err) throw err;
            if (data.length < 1) {
                var sql = `insert into allergens_list (name) values ('${name}')`;
                con.query(sql, (err, data) => {
                    if (err) throw err;
                    res.status(200).send({
                        success: true,
                        msg: "Allergen added successfully !"
                    })
                })
            }
            else {
                let checking = false;
                for (let i = 0; i < data.length; i++) {
                    if (data[i].name === name) {
                        checking = true;
                        break;
                    }
                }
                if (checking == false) {
                    var sql = `insert into allergens_list (name) values ('${name}')`;
                    con.query(sql, (err, data) => {
                        if (err) throw err;
                        res.status(200).send({
                            success: true,
                            msg: "Allergen added successfully !"
                        })
                    })
                }
                else {
                    res.status(400).send({
                        success: false,
                        msg: "Allergen is already exist !"
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

const areaList = async (req, res) => {
    try {
        const { area_type } = req.body;
        var selectQuery = "select * from area_list";
        await con.query(selectQuery, (err, data) => {
            if (err) throw err;
            if (data.length < 1) {
                var sql = `insert into area_list(area_type) values ('${area_type}')`;
                con.query(sql, (err, data) => {
                    if (err) throw err;
                    res.status(200).send({
                        success: true,
                        msg: "Area added successfully !"
                    })
                })
            }
            else {
                let checking = false;
                for (let i = 0; i < data.length; i++) {
                    if (data[i].area_type === area_type) {
                        checking = true;
                        break;
                    }
                }
                if (checking == false) {
                    var sql = `insert into area_list (area_type) values ('${area_type}')`;
                    con.query(sql, (err, data) => {
                        if (err) throw err;
                        res.status(200).send({
                            success: true,
                            msg: "Area added successfully !"
                        })
                    })
                }
                else {
                    res.status(400).send({
                        success: false,
                        msg: "Area is already exist !"
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

const cuisineList = async (req, res) => {
    try {
        const { cuisine_type } = req.body;
        var selectQuery = "select * from cuisine_list";
        await con.query(selectQuery, (err, data) => {
            if (err) throw err;
            if (data.length < 1) {
                var sql = `insert into cuisine_list (cuisine_type) values ('${cuisine_type}')`;
                con.query(sql, (err, data) => {
                    if (err) throw err;
                    res.status(200).send({
                        success: true,
                        msg: "Cuisine added successfully !"
                    })
                })
            }
            else {
                let checking = false;
                for (let i = 0; i < data.length; i++) {
                    if (data[i].cuisine_type === cuisine_type) {
                        checking = true;
                        break;
                    }
                }
                if (checking == false) {
                    var sql = `insert into cuisine_list (cuisine_type) values ('${cuisine_type}')`;
                    con.query(sql, (err, data) => {
                        if (err) throw err;
                        res.status(200).send({
                            success: true,
                            msg: "Cuisine added successfully !"
                        })
                    })
                }
                else {
                    res.status(400).send({
                        success: false,
                        msg: "Cuisine is already exist !"
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

const placeList = async (req, res) => {
    try {
        const { place_type } = req.body;
        var selectQuery = "select * from place_list";
        await con.query(selectQuery, (err, data) => {
            if (err) throw err;
            if (data.length < 1) {
                var sql = `insert into place_list (place_type) values ('${place_type}')`;
                con.query(sql, (err, data) => {
                    if (err) throw err;
                    res.status(200).send({
                        success: true,
                        msg: "Place added successfully !"
                    })
                })
            }
            else {
                let checking = false;
                for (let i = 0; i < data.length; i++) {
                    if (data[i].place_type === place_type) {
                        checking = true;
                        break;
                    }
                }
                if (checking == false) {
                    var sql = `insert into place_list (place_type) values ('${place_type}')`;
                    con.query(sql, (err, data) => {
                        if (err) throw err;
                        res.status(200).send({
                            success: true,
                            msg: "Place added successfully !"
                        })
                    })
                }
                else {
                    res.status(400).send({
                        success: false,
                        msg: "Place is already exist !"
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

const GetActivity = async (req, res) => {
    try {
        var selectQuery = "select * from activities_list";
        await con.query(selectQuery, (err, result) => {
            if (err) throw err;
            if (result.length < 1) {
                res.status(400).send({
                    success: false,
                    mag: "Data not found !"
                })
            }
            else {
                res.status(200).send({
                    success: true,
                    data: result
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

const GetAllergens = async (req, res) => {
    try {
        var selectQuery = "select * from allergens_list";
        await con.query(selectQuery, (err, result) => {
            if (err) throw err;
            if (result.length < 1) {
                res.status(400).send({
                    success: false,
                    mag: "Data not found !"
                })
            }
            else {
                res.status(200).send({
                    success: true,
                    data: result
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

const GetArea = async (req, res) => {
    try {
        var selectQuery = "select * from area_list";
        await con.query(selectQuery, (err, result) => {
            if (err) throw err;
            if (result.length < 1) {
                res.status(400).send({
                    success: false,
                    mag: "Data not found !"
                })
            }
            else {
                res.status(200).send({
                    success: true,
                    data: result
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

const GetCuisine = async (req, res) => {
    try {
        var selectQuery = "select * from cuisine_list";
        await con.query(selectQuery, (err, result) => {
            if (err) throw err;
            if (result.length < 1) {
                res.status(400).send({
                    success: false,
                    mag: "Data not found !"
                })
            }
            else {
                res.status(200).send({
                    success: true,
                    data: result
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

const GetPlace = async (req, res) => {
    try {
        var selectQuery = "select * from place_list";
        await con.query(selectQuery, (err, result) => {
            if (err) throw err;
            if (result.length < 1) {
                res.status(400).send({
                    success: false,
                    mag: "Data not found !"
                })
            }
            else {
                res.status(200).send({
                    success: true,
                    data: result
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

const UpdateActivity = async (req, res) => {
    const { id, activity_type } = req.body;
    if (!id || !activity_type) {
        res.status(400).send({
            success: false,
            msg: "Provide id and activity_type"
        })
    }
    else {
        try {
            let sql = "Select * from activities_list where LOWER(activity_type)=LOWER(?) AND id <> ?";
            await con.query(sql, [activity_type, id], (err, result) => {
                if (err) throw err;
                if (result.length > 0) {
                    res.status(400).send({
                        success: false,
                        msg: "This Activity is already exist !"
                    })
                }
                else {
                    let updateQuery = "update activities_list set activity_type=? where id=?";
                    con.query(updateQuery, [activity_type, id], (err, data) => {
                        if (err) throw err;
                        if (data.affectedRows > 0) {
                            res.status(200).send({
                                success: true,
                                msg: "Data updated successfully !"
                            })
                        }
                        else {
                            res.status(400).send({
                                success: false,
                                msg: "Data not updated !"
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
}

const UpdateAllergens = async (req, res) => {
    const { id, name } = req.body;
    if (!id || !name) {
        res.status(400).send({
            success: false,
            msg: "Provide id and name !"
        })
    }
    else {
        try {
            let sql = "Select * from allergens_list where LOWER(name)=LOWER(?) AND id <> ?";
            await con.query(sql, [name, id], (err, result) => {
                if (err) throw err;
                if (result.length > 0) {
                    res.status(400).send({
                        success: false,
                        msg: "This Allergens is already exist !"
                    })
                }
                else {
                    let updateQuery = "update allergens_list set name=? where id=?";
                    con.query(updateQuery, [name, id], (err, data) => {
                        if (err) throw err;
                        if (data.affectedRows > 0) {
                            res.status(200).send({
                                success: true,
                                msg: "Data updated successfully !"
                            })
                        }
                        else {
                            res.status(400).send({
                                success: false,
                                msg: "Data not updated !"
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
}

const UpdateArea = async (req, res) => {
    const { id, area_type } = req.body;
    if (!id || !area_type) {
        res.status(400).send({
            success: false,
            msg: "Provide id and area_type !"
        })
    }
    else {
        try {
            let sql = "Select * from area_list where LOWER(area_type)=LOWER(?) AND id <> ?";
            await con.query(sql, [area_type, id], (err, result) => {
                if (err) throw err;
                if (result.length > 0) {
                    res.status(400).send({
                        success: false,
                        msg: "This Area type is already exist !"
                    })
                }
                else {
                    let updateQuery = "update area_list set area_type=? where id=?";
                    con.query(updateQuery, [area_type, id], (err, data) => {
                        if (err) throw err;
                        if (data.affectedRows > 0) {
                            res.status(200).send({
                                success: true,
                                msg: "Data updated successfully !"
                            })
                        }
                        else {
                            res.status(400).send({
                                success: false,
                                msg: "Data not updated !"
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
}

const UpdateCuisine = async (req, res) => {
    const { id, cuisine_type } = req.body;
    if (!id || !cuisine_type) {
        res.status(400).send({
            success: false,
            msg: "Provide id and cuisine_type !"
        })
    }
    else {
        try {
            let sql = "Select * from cuisine_list where LOWER(cuisine_type)=LOWER(?) AND id <> ?";
            await con.query(sql, [cuisine_type, id], (err, result) => {
                if (err) throw err;
                if (result.length > 0) {
                    res.status(400).send({
                        success: false,
                        msg: "This Cuisine type is already exist !"
                    })
                }
                else {
                    let updateQuery = "update cuisine_list set cuisine_type=? where id=?";
                    con.query(updateQuery, [cuisine_type, id], (err, data) => {
                        if (err) throw err;
                        if (data.affectedRows > 0) {
                            res.status(200).send({
                                success: true,
                                msg: "Data updated successfully !"
                            })
                        }
                        else {
                            res.status(400).send({
                                success: false,
                                msg: "Data not updated !"
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
}

const Updateplace = async (req, res) => {
    const { id, place_type } = req.body;
    if (!id || !place_type) {
        res.status(400).send({
            success: false,
            msg: "Provide id and place_type !"
        })
    }
    else {
        try {
            let sql = "Select * from place_list where LOWER(place_type)=LOWER(?) AND id <> ?";
            await con.query(sql, [place_type, id], (err, result) => {
                if (err) throw err;
                if (result.length > 0) {
                    res.status(400).send({
                        success: false,
                        msg: "This Place type is already exist !"
                    })
                }
                else {
                    let updateQuery = "update place_list set place_type=? where id=?";
                    con.query(updateQuery, [place_type, id], (err, data) => {
                        if (err) throw err;
                        if (data.affectedRows > 0) {
                            res.status(200).send({
                                success: true,
                                msg: "Data updated successfully !"
                            })
                        }
                        else {
                            res.status(400).send({
                                success: false,
                                msg: "Data not updated !"
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
}

const DeleteActivity = async (req, res) => {
    const { id } = req.params;
    try {
        var sql = "delete from activities_list where id=?";
        await con.query(sql, [id], (err, data) => {
            if (err) throw err;
            if (data.affectedRows > 0) {
                res.status(200).send({
                    success: true,
                    msg: "Data deleted successfully !"
                })
            }
            else {
                res.status(400).send({
                    success: false,
                    msg: "Data is not deleted !"
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

const DeleteAllergens = async (req, res) => {
    const { id } = req.params;
    try {
        var sql = "delete from activities_list where id=?";
        await con.query(sql, [id], (err, data) => {
            if (err) throw err;
            if (data.affectedRows > 0) {
                res.status(200).send({
                    success: true,
                    msg: "Data deleted successfully !"
                })
            }
            else {
                res.status(400).send({
                    success: false,
                    msg: "Data is not deleted !"
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

const DeleteArea = async (req, res) => {

}

const DeleteCuisine = async (req, res) => {

}

const Deleteplace = async (req, res) => {

}

module.exports = {
    activityList, allergensList, areaList, cuisineList, placeList, GetActivity, GetAllergens,
    GetArea, GetCuisine, GetPlace, UpdateActivity, UpdateAllergens, UpdateArea, UpdateCuisine, Updateplace,
    DeleteActivity, DeleteAllergens, DeleteArea, DeleteCuisine, Deleteplace
}
