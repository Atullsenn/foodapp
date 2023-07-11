const{DB_HOST,DB_USER,DB_PASSWORD,DB_NAME}=process.env;
const mysql = require('mysql');

const con = mysql.createConnection(
    {
        host: DB_HOST,
        user: DB_USER,
        password: DB_PASSWORD,
        database: DB_NAME
        /* host: "localhost",
        user: "root",
        password: "",
        database: "foodapp" */
    }
)

con.connect((err)=>
{
    if(err) throw err;
    else{
        console.log("database connected successfully");
    }
})

module.exports=con; 