require('dotenv').config();
const express = require('express');
const app = express();
const bodyparser = require('body-parser');
require('./config/database');

var PORT=process.env.PORT || 6000

const visitorRoute=require('./routes/visitorRoute');
const hostRoute=require('./routes/hostRoute');
const adminRoute=require('./routes/adminRoute');
const commonRoute=require('./routes/commonRoute');

var cors = require('cors');
app.use(cors({
    origin: '*'
}));

app.use(bodyparser.json());
app.use(express.json());
app.use(bodyparser.urlencoded({extended:true}));
app.use(express.static('public'));

app.use('/api', visitorRoute);
app.use('/api', hostRoute);
app.use('/api', adminRoute);
app.use('/api', commonRoute);

app.listen(PORT,(err)=>
{
    if(err) throw err;
    else
    {
        console.log('server listing on port:', PORT);
    }
})