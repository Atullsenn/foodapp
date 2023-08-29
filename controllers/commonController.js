const con = require('../config/database');

const activityList = async (req, res) => {
    try {
        const { activity_type } = req.body;
        var selectQuery = `select * from activities_list where is_deleted='${0}'`;
        await con.query(selectQuery, (err, data) => {
            if (err) throw err;
            if (data.length < 1) {
                var sql = `insert into activities_list (activity_type) values ('${activity_type}')`;
                con.query(sql, (err, data) => {
                    if (err) throw err;
                    res.status(200).send({
                        success: true,
                        message: "Activity added successfully !"
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
                            message: "Activity added successfully !"
                        })
                    })
                }
                else {
                    res.status(400).send({
                        success: false,
                        message: "Activity is already exist !"
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

const allergensList = async (req, res) => {
    try {
        const { name } = req.body;
        var selectQuery = `select * from allergens_list where is_deleted='${0}'`;
        await con.query(selectQuery, (err, data) => {
            if (err) throw err;
            if (data.length < 1) {
                var sql = `insert into allergens_list (name) values ('${name}')`;
                con.query(sql, (err, data) => {
                    if (err) throw err;
                    res.status(200).send({
                        success: true,
                        message: "Allergen added successfully !"
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
                            message: "Allergen added successfully !"
                        })
                    })
                }
                else {
                    res.status(400).send({
                        success: false,
                        message: "Allergen is already exist !"
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

const areaList = async (req, res) => {
    try {
        const { area_type } = req.body;
        var selectQuery = `select * from area_list where is_deleted='${0}'`;
        await con.query(selectQuery, (err, data) => {
            if (err) throw err;
            if (data.length < 1) {
                var sql = `insert into area_list(area_type) values ('${area_type}')`;
                con.query(sql, (err, data) => {
                    if (err) throw err;
                    res.status(200).send({
                        success: true,
                        message: "Area added successfully !"
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
                            message: "Area added successfully !"
                        })
                    })
                }
                else {
                    res.status(400).send({
                        success: false,
                        message: "Area is already exist !"
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

const cuisineList = async (req, res) => {
    try {
        const { cuisine_type } = req.body;
        var selectQuery = `select * from cuisine_list where is_deleted='${0}'`;
        await con.query(selectQuery, (err, data) => {
            if (err) throw err;
            if (data.length < 1) {
                var sql = `insert into cuisine_list (cuisine_type) values ('${cuisine_type}')`;
                con.query(sql, (err, data) => {
                    if (err) throw err;
                    res.status(200).send({
                        success: true,
                        message: "Cuisine added successfully !"
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
                            message: "Cuisine added successfully !"
                        })
                    })
                }
                else {
                    res.status(400).send({
                        success: false,
                        message: "Cuisine is already exist !"
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

const placeList = async (req, res) => {
    try {
        const { place_type } = req.body;
        var selectQuery = `select * from place_list where is_deleted='${0}'`;
        await con.query(selectQuery, (err, data) => {
            if (err) throw err;
            if (data.length < 1) {
                var sql = `insert into place_list (place_type) values ('${place_type}')`;
                con.query(sql, (err, data) => {
                    if (err) throw err;
                    res.status(200).send({
                        success: true,
                        message: "Place added successfully !"
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
                            message: "Place added successfully !"
                        })
                    })
                }
                else {
                    res.status(400).send({
                        success: false,
                        message: "Place is already exist !"
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

const GetActivity = async (req, res) => {
    try {
        var selectQuery = `select * from activities_list where is_deleted='${0}'`;
        await con.query(selectQuery, (err, result) => {
            if (err) throw err;
            if (result.length < 1) {
                res.status(400).send({
                    success: false,
                    message: "Data not found !"
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
            message: error.message
        })
    }
}

const GetAllergens = async (req, res) => {
    try {
        var selectQuery = `select * from allergens_list where is_deleted='${0}'`;
        await con.query(selectQuery, (err, result) => {
            if (err) throw err;
            if (result.length < 1) {
                res.status(400).send({
                    success: false,
                    message: "Data not found !"
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
            message: error.message
        })
    }
}

const GetArea = async (req, res) => {
    try {
        var selectQuery = `select * from area_list where is_deleted='${0}'`;
        await con.query(selectQuery, (err, result) => {
            if (err) throw err;
            if (result.length < 1) {
                res.status(400).send({
                    success: false,
                    message: "Data not found !"
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
            message: error.message
        })
    }
}

const GetCuisine = async (req, res) => {
    try {

        var selectQuery = `select * from cuisine_list where is_deleted='${0}'`;
        await con.query(selectQuery, (err, result) => {
            if (err) throw err;
            if (result.length < 1) {
                res.status(400).send({
                    success: false,
                    message: "Data not found !"
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
            message: error.message
        })
    }
}

const GetPlace = async (req, res) => {
    try {
        var selectQuery = `select * from place_list where is_deleted='${0}'`;
        await con.query(selectQuery, (err, result) => {
            if (err) throw err;
            if (result.length < 1) {
                res.status(400).send({
                    success: false,
                    message: "Data not found !"
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
            message: error.message
        })
    }
}

const UpdateActivity = async (req, res) => {
    const { id, activity_type } = req.body;
    if (!id || !activity_type) {
        res.status(400).send({
            success: false,
            message: "Provide id and activity_type"
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
                        message: "This Activity is already exist !"
                    })
                }
                else {
                    let updateQuery = "update activities_list set activity_type=? where id=?";
                    con.query(updateQuery, [activity_type, id], (err, data) => {
                        if (err) throw err;
                        if (data.affectedRows > 0) {
                            res.status(200).send({
                                success: true,
                                message: "Data updated successfully !"
                            })
                        }
                        else {
                            res.status(400).send({
                                success: false,
                                message: "Data not updated !"
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
}

const UpdateAllergens = async (req, res) => {
    const { id, name } = req.body;
    if (!id || !name) {
        res.status(400).send({
            success: false,
            message: "Provide id and name !"
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
                        message: "This Allergens is already exist !"
                    })
                }
                else {
                    let updateQuery = "update allergens_list set name=? where id=?";
                    con.query(updateQuery, [name, id], (err, data) => {
                        if (err) throw err;
                        if (data.affectedRows > 0) {
                            res.status(200).send({
                                success: true,
                                message: "Data updated successfully !"
                            })
                        }
                        else {
                            res.status(400).send({
                                success: false,
                                message: "Data not updated !"
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
}

const UpdateArea = async (req, res) => {
    const { id, area_type } = req.body;
    if (!id || !area_type) {
        res.status(400).send({
            success: false,
            message: "Provide id and area_type !"
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
                        message: "This Area type is already exist !"
                    })
                }
                else {
                    let updateQuery = "update area_list set area_type=? where id=?";
                    con.query(updateQuery, [area_type, id], (err, data) => {
                        if (err) throw err;
                        if (data.affectedRows > 0) {
                            res.status(200).send({
                                success: true,
                                message: "Data updated successfully !"
                            })
                        }
                        else {
                            res.status(400).send({
                                success: false,
                                message: "Data not updated !"
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
}

const UpdateCuisine = async (req, res) => {
    const { id, cuisine_type } = req.body;
    if (!id || !cuisine_type) {
        res.status(400).send({
            success: false,
            message: "Provide id and cuisine_type !"
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
                        message: "This Cuisine type is already exist !"
                    })
                }
                else {
                    let updateQuery = "update cuisine_list set cuisine_type=? where id=?";
                    con.query(updateQuery, [cuisine_type, id], (err, data) => {
                        if (err) throw err;
                        if (data.affectedRows > 0) {
                            res.status(200).send({
                                success: true,
                                message: "Data updated successfully !"
                            })
                        }
                        else {
                            res.status(400).send({
                                success: false,
                                message: "Data not updated !"
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
}

const Updateplace = async (req, res) => {
    const { id, place_type } = req.body;
    if (!id || !place_type) {
        res.status(400).send({
            success: false,
            message: "Provide id and place_type !"
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
                        message: "This Place type is already exist !"
                    })
                }
                else {
                    let updateQuery = "update place_list set place_type=? where id=?";
                    con.query(updateQuery, [place_type, id], (err, data) => {
                        if (err) throw err;
                        if (data.affectedRows > 0) {
                            res.status(200).send({
                                success: true,
                                message: "Data updated successfully !"
                            })
                        }
                        else {
                            res.status(400).send({
                                success: false,
                                message: "Data not updated !"
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
}

const DeleteActivity = async (req, res) => {
    try {
        const { id } = req.params;
        var sql = "select is_deleted from activities_list where id=?";
        await con.query(sql, [id], (err, data) => {
            if (err) throw err;
            if (data.length > 0) {
                if (data[0].is_deleted == 1) {
                    res.status(400).send({
                        success: false,
                        message: "This Activity is already deleted !"
                    })
                }
                else {
                    var sql = "update activities_list set is_deleted=? where id=?";
                    con.query(sql, [1, id], (err, data) => {
                        if (err) throw err;
                        res.status(200).send({
                            success: true,
                            message: "Activity deleted successfully!"
                        })
                    })
                }
            }
            else {
                res.status(400).send({
                    success: false,
                    message: "Data not exist !"
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

const DeleteAllergens = async (req, res) => {
    try {
        const { id } = req.params;
        var sql = "select is_deleted from allergens_list where id=?";
        await con.query(sql, [id], (err, data) => {
            if (err) throw err;
            if (data.length > 0) {
                if (data[0].is_deleted == 1) {
                    res.status(400).send({
                        success: false,
                        message: "This Allergens is already deleted !"
                    })
                }
                else {
                    var sql = "update allergens_list set is_deleted=? where id=?";
                    con.query(sql, [1, id], (err, data) => {
                        if (err) throw err;
                        res.status(200).send({
                            success: true,
                            message: "Allergens deleted successfully!"
                        })
                    })
                }
            }
            else {
                res.status(400).send({
                    success: false,
                    message: "Data not exist !"
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

const DeleteArea = async (req, res) => {
    try {
        const { id } = req.params;
        var sql = "select is_deleted from area_list where id=?";
        await con.query(sql, [id], (err, data) => {
            if (err) throw err;
            if (data.length > 0) {
                if (data[0].is_deleted == 1) {
                    res.status(400).send({
                        success: false,
                        message: "This Area is already deleted !"
                    })
                }
                else {
                    var sql = "update area_list set is_deleted=? where id=?";
                    con.query(sql, [1, id], (err, data) => {
                        if (err) throw err;
                        res.status(200).send({
                            success: true,
                            message: "Area deleted successfully!"
                        })
                    })
                }
            }
            else {
                res.status(400).send({
                    success: false,
                    message: "Data not exist !"
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

const DeleteCuisine = async (req, res) => {
    try {
        const { id } = req.params;
        var sql = "select is_deleted from cuisine_list where id=?";
        await con.query(sql, [id], (err, data) => {
            if (err) throw err;
            if (data.length > 0) {
                if (data[0].is_deleted == 1) {
                    res.status(400).send({
                        success: false,
                        message: "This Cuisine is already deleted !"
                    })
                }
                else {
                    var sql = "update cuisine_list set is_deleted=? where id=?";
                    con.query(sql, [1, id], (err, data) => {
                        if (err) throw err;
                        res.status(200).send({
                            success: true,
                            message: "Cuisine deleted successfully!"
                        })
                    })
                }
            }
            else {
                res.status(400).send({
                    success: false,
                    message: "Data not exist !"
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

const Deleteplace = async (req, res) => {
    try {
        const { id } = req.params;
        var sql = "select is_deleted from place_list where id=?";
        await con.query(sql, [id], (err, data) => {
            if (err) throw err;
            if (data.length > 0) {
                if (data[0].is_deleted == 1) {
                    res.status(400).send({
                        success: false,
                        message: "This Place is already deleted !"
                    })
                }
                else {
                    var sql = "update place_list set is_deleted=? where id=?";
                    con.query(sql, [1, id], (err, data) => {
                        if (err) throw err;
                        res.status(200).send({
                            success: true,
                            message: "Place deleted successfully!"
                        })
                    })
                }
            }
            else {
                res.status(400).send({
                    success: false,
                    message: "Data not exist !"
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

const termsConditions = async (req, res) => {
    try {
        const { heading, description } = req.body;
        if (!heading || !description) {
            res.status(400).send({
                success: false,
                message: "Please enter heading or description !"
            })
        }
        else {
            let sql = "select * from terms_conditions";
            await con.query(sql, (err, data) => {
                if (err) throw err;
                if (data.length > 0) {
                    let updateQuery = "update terms_conditions set heading=?, description=? where id=?";
                    con.query(updateQuery, [heading, description, data[0].id], (err, result) => {
                        if (err) throw err;
                        res.status(200).send({
                            success: true,
                            message: "Update terms and conditions successfully !"
                        })
                    })
                }
                else {
                    let InsertQuery = "insert into terms_conditions (heading, description) values (?,?)";
                    con.query(InsertQuery, [heading, description], (err, result) => {
                        if (err) throw err;
                        res.status(200).send({
                            success: true,
                            message: "Add details successfully !"
                        })
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

const GetTerms = async (req, res) => {
    try {
        let selectQuery = "select * from terms_conditions";
        await con.query(selectQuery, (err, data) => {
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

const PrivacyPolicy = async (req, res) => {
    try {
        const { heading, description } = req.body;
        if (!heading || !description) {
            res.status(400).send({
                success: false,
                message: "Enter heading or description !"
            })
        }
        else {
            let sql = "select * from privacy_policy";
            await con.query(sql, (err, data) => {
                if (err) throw err;
                if (data.length > 0) {
                    let updateQuery = "update privacy_policy set heading =?, description=? where id=?";
                    con.query(updateQuery, [heading, description, data[0].id], (err, result) => {
                        if (err) throw err;
                        res.status(200).send({
                            success: true,
                            message: "Update Data Successfully !"
                        })
                    })
                }
                else {
                    let InsertQuery = "insert into privacy_policy (heading, description) values (?,?)";
                    con.query(InsertQuery, [heading, description], (err, result) => {
                        if (err) throw err;
                        res.status(200).send({
                            success: true,
                            message: "Add Data Successfully !"
                        })
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

const GetPrivacy = async (req, res) => {
    try {
        let selectQuery = "select * from privacy_policy";
        await con.query(selectQuery, (err, data) => {
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

const CancelationPolicy = async (req, res) => {
    try {
        const { heading, description } = req.body;
        if (!heading || !description) {
            res.status(400).send({
                success: false,
                message: "All fields are required !"
            })
        }
        else {
            let sql = `select * from cancel_policy`;
            await con.query(sql, (err, data) => {
                if (err) throw err;
                if (data.length > 0) {
                    let update = `update cancel_policy set heading=?, description=? where id=?`;
                    con.query(update, [heading, description, data[0].id], (err, data) => {
                        if (err) throw err;
                        res.status(200).send({
                            success: true,
                            message: "Update cancellation policy successfully !"
                        })
                    })
                }
                else {
                    let insert = `insert into cancel_policy (heading, description) values(?,?)`;
                    con.query(insert, [heading, description], (err, data) => {
                        if (err) throw err;
                        res.status(200).send({
                            success: true,
                            message: "Add details successfully !"
                        })
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

const getCancelPolicy = async (req, res) => {
    try {
        let sqlQuery = `select * from cancel_policy`;
        await con.query(sqlQuery, (err, data) => {
            if (err) throw err;
            if (data.length > 0) {
                res.status(200).send({
                    success: true,
                    data: data[0]
                })
            }
            else {
                res.status(400).send({
                    success: false,
                    message: "Data not found !"
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

const bookingRequire = async (req, res) => {
    try {
        const { heading, description } = req.body;
        if (!heading || !description) {
            res.status(400).send({
                success: false,
                message: "All fields are required !"
            })
        }
        else {
            sql = `select * from book_requirement`;
            await con.query(sql, (err, data) => {
                if (err) throw err;
                if (data.length > 0) {
                    let updateQuery = `update book_requirement set heading=?, description=? where id=?`;
                    con.query(updateQuery, [heading, description, data[0].id], (err, data) => {
                        if (err) throw err;
                        res.status(200).send({
                            success: true,
                            message: "Update booking requirement successfully !"
                        })
                    })
                }
                else {
                    let selectQuery = `insert into book_requirement (heading, description) values(?,?)`;
                    con.query(selectQuery, [heading, description], (err, data) => {
                        if (err) throw err;
                        res.status(200).send({
                            success: true,
                            message: "Details added successfully !"
                        })
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

const GetBookRequire = async (req, res) => {
    try {
        let sqlQuery = `select * from book_requirement`;
        await con.query(sqlQuery, (err, data) => {
            if (err) throw err;
            if (data.length > 0) {
                res.status(200).send({
                    success: true,
                    data: data[0]
                })
            }
            else {
                res.status(400).send({
                    success: false,
                    message: "Details not found !"
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

const countAll = async (req, res) => {
    try {
        let sqlQuery = `SELECT COUNT(*) as no_of_visitors from tbl_visitors WHERE NOT EXISTS
        (SELECT * FROM  tbl_hosts WHERE tbl_hosts.visitor_id = tbl_visitors.id)`
        await con.query(sqlQuery, (err, visitors) => {
            if (err) throw err;
            let query = `SELECT COUNT(*) as no_of_hosts from tbl_hosts`;
            con.query(query, (err, hosts) => {
                if (err) throw err;
                let query1 = `SELECT COUNT(*) as no_of_bookings from tbl_booking`;
                con.query(query1, (err, bookings) => {
                    if (err) throw err;
                    let query2 = `SELECT COUNT(*) as cancel_orders from tbl_booking where status='${3}'`;
                    con.query(query2, (err, cancel) => {
                        if (err) throw err;
                        let details = {
                            no_of_visitors: visitors[0].no_of_visitors,
                            no_of_hosts: hosts[0].no_of_hosts,
                            no_of_bookings: bookings[0].no_of_bookings,
                            cancel_orders: cancel[0].cancel_orders
                        }
                        res.status(200).send({
                            success: true,
                            details
                        })
                    })
                })
            })

        })
    }
    catch (error) {
        res.status(500).send({
            success: false,
            message: error.message
        })
    }
}

const friendRequest = async (req, res) => {
    try {
        const { receiverId } = req.body;
        let sqlQuery = `select * from friend_requests where sender_id=? and receiver_id=? and status=?`;
        await con.query(sqlQuery, [req.user.id, receiverId, 'pending'], (err, data) => {
            if (err) throw err;
            if (data.length < 1) {
                const query = 'INSERT INTO friend_requests (sender_id, receiver_id) VALUES (?, ?)';
                con.query(query, [req.user.id, receiverId], (err, result) => {
                    if (err) throw err;
                    if (result.affectedRows > 0) {
                        res.status(200).json({
                            success: true,
                            message: 'Friend request sent'
                        });
                    }
                    else {
                        res.status(400).json({
                            success: false,
                            message: 'Error sending friend request'
                        });
                    }
                });
            }
            else {
                res.status(400).send({
                    success: false,
                    message: "you have already sent a request"
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

const acceptRequest = async (req, res) => {
    try {
        const { requestId } = req.body;
        let sqlQuery = `select * from friend_requests where status=? and id=?`;
        await con.query(sqlQuery, ['accepted', requestId], (err, data) => {
            if (err) throw err;
            if (data.length < 1) {
                const query = 'UPDATE friend_requests SET status = ? WHERE id = ?';
                con.query(query, ['accepted', requestId], (err, result) => {
                    if (err) throw err;
                    if (result.affectedRows > 0) {
                        res.status(200).json({
                            success: true,
                            message: 'Friend request accepted !'
                        });
                    }
                    else {
                        res.status(400).json({
                            success: false,
                            message: 'Error accepting friend request !'
                        });
                    }
                });
            }
            else {
                res.status(400).send({
                    success: false,
                    message: "You have already accept the friend request !"
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
};

const sendMessage = async (req, res) => {
    try {
        const { receiverId, text } = req.body;
        let sqlQuery = `select * from conversations where user1_id=? and user2_id=?`;
        await con.query(sqlQuery, [req.user.id, receiverId], (err, data) => {
            if (err) throw err;
            if (data.length > 0) {
                const query1 = 'INSERT INTO messages (conversation_id, sender_id, text) VALUES (?, ?, ?)';
                con.query(query1, [data[0].id, req.user.id, text], (err, result) => {
                    if (err) throw err;
                    if (result.affectedRows > 0) {
                        res.status(200).json({
                            success: true,
                            message: 'Message sent'
                        });
                    }
                    else {
                        res.status(400).json({
                            success: false,
                            message: 'Error sending message'
                        });
                    }
                });
            }
            else {
                const query = 'INSERT INTO conversations (user1_id, user2_id) VALUES (?, ?)';
                con.query(query, [req.user.id, receiverId], (err, result) => {
                    if (err) throw err;
                    if (result.affectedRows > 0) {
                        const query1 = 'INSERT INTO messages (conversation_id, sender_id, text) VALUES (?, ?, ?)';
                        con.query(query1, [result.insertId, req.user.id, text], (err, result1) => {
                            if (err) throw err;
                            if (result1.affectedRows > 0) {
                                res.status(200).json({
                                    success: true,
                                    message: 'Message sent'
                                });
                            }
                            else {
                                res.status(400).json({
                                    success: false,
                                    message: 'Error sending message'
                                });
                            }
                        });
                    }
                    else {
                        res.status(400).json({
                            success: false,
                            message: 'Error sending message'
                        });
                    }
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
};

const getMessages = async (req, res) => {
    try {
        const { conversationId } = req.body;
        const query = 'SELECT * FROM messages WHERE conversation_id = ? ORDER BY created_at';
        con.query(query, [conversationId], (err, results) => {
            if (err) throw err;
            if (results.length > 0) {
                res.status(200).json({
                    success: true,
                    messages: results
                });
            }
            else {
                res.status(400).json({
                    success: false,
                    message: 'Error getting messages'
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
};

const countryList = async (req, res) => {
    try {
        const { country_name } = req.body;
        var selectQuery = `select * from country_list where is_deleted='${0}'`;
        await con.query(selectQuery, (err, data) => {
            if (err) throw err;
            if (data.length < 1) {
                var sql = `insert into country_list (name) values ('${country_name}')`;
                con.query(sql, (err, data) => {
                    if (err) throw err;
                    res.status(200).send({
                        success: true,
                        message: "Country added successfully !"
                    })
                })
            }
            else {
                let checking = false;
                for (let i = 0; i < data.length; i++) {
                    if (data[i].name === country_name) {
                        checking = true;
                        break;
                    }
                }
                if (checking == false) {
                    var sql = `insert into country_list (name) values ('${country_name}')`;
                    con.query(sql, (err, data) => {
                        if (err) throw err;
                        res.status(200).send({
                            success: true,
                            message: "Country added successfully !"
                        })
                    })
                }
                else {
                    res.status(400).send({
                        success: false,
                        message: "Country is already exist !"
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

const GetCountry = async (req, res) => {
    try {
        var selectQuery = `select * from country_list where is_deleted='${0}'`;
        await con.query(selectQuery, (err, result) => {
            if (err) throw err;
            if (result.length < 1) {
                res.status(400).send({
                    success: false,
                    message: "Data not found !"
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
            message: error.message
        })
    }
}

const UpdateCountry = async (req, res) => {
    const { id, country_name } = req.body;
    if (!id || !country_name) {
        res.status(400).send({
            success: false,
            message: "Provide id and country_name !"
        })
    }
    else {
        try {
            let sql = "Select * from country_list where LOWER(name)=LOWER(?) AND id <> ?";
            await con.query(sql, [country_name, id], (err, result) => {
                if (err) throw err;
                if (result.length > 0) {
                    res.status(400).send({
                        success: false,
                        message: "This Country is already exist !"
                    })
                }
                else {
                    let updateQuery = "update country_list set name=? where id=?";
                    con.query(updateQuery, [country_name, id], (err, data) => {
                        if (err) throw err;
                        if (data.affectedRows > 0) {
                            res.status(200).send({
                                success: true,
                                message: "Data updated successfully !"
                            })
                        }
                        else {
                            res.status(400).send({
                                success: false,
                                message: "Data not updated !"
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
}

const DeleteCountry = async (req, res) => {
    try {
        const { id } = req.params;
        var sql = "select is_deleted from country_list where id=?";
        await con.query(sql, [id], (err, data) => {
            if (err) throw err;
            if (data.length > 0) {
                if (data[0].is_deleted == 1) {
                    res.status(400).send({
                        success: false,
                        message: "This Country is already deleted !"
                    })
                }
                else {
                    var sql = "update country_list set is_deleted=? where id=?";
                    con.query(sql, [1, id], (err, data) => {
                        if (err) throw err;
                        res.status(200).send({
                            success: true,
                            message: "Country deleted successfully!"
                        })
                    })
                }
            }
            else {
                res.status(400).send({
                    success: false,
                    message: "Data not exist !"
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
    activityList, allergensList, areaList, cuisineList, placeList, GetActivity, GetAllergens,
    GetArea, GetCuisine, GetPlace, UpdateActivity, UpdateAllergens, UpdateArea, UpdateCuisine, Updateplace,
    DeleteActivity, DeleteAllergens, DeleteArea, DeleteCuisine, Deleteplace, termsConditions, GetTerms,
    PrivacyPolicy, GetPrivacy, CancelationPolicy, getCancelPolicy, bookingRequire, GetBookRequire, countAll,
    friendRequest, acceptRequest, sendMessage, getMessages, countryList, GetCountry, UpdateCountry, DeleteCountry
}
