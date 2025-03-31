const {Pool}=require("pg");
require("dotenv").config({path: "../.env"});

console.log("DB Config :");
console.log("User:",process.env.DB_USER);
console.log("Host:",process.env.DB_HOST);
console.log("Database:",process.env.DB_NAME);
console.log("Password:",typeof process.env.DB_PASS, `"${process.env.DB_PASS}"`);
console.log("Port:",process.env.DB_PORT);


const pool= new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT,
});

pool.connect()
    .then(() => console.log("Connected to PostgreSQL"))
    .catch(err => console.log("Database connection error:",err));

module.exports=pool;