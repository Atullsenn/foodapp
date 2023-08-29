const{DB_HOST,DB_USER,DB_PASSWORD,DB_NAME}=process.env;
const mysql = require('mysql');

const con = mysql.createConnection(
    {
        host: DB_HOST,
        user: DB_USER,
        password: DB_PASSWORD,
        database: DB_NAME
        /* host: "127.0.0.1",
        user: "forge",
        password: "3RpmB1HjDiLIVNF7AaI6",
        database: "suppr" */
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