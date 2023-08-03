export default 
{
    "development": {
        "username": "root",
        "password": "testtesttest",
        "host": "localhost",
        "port": 3306,
        "database": "scrap"
    },
    "production": {
        "username": process.env.DB_USER,
        "password": process.env.DB_PASS,
        "host": process.env.DB_HOST,
        "port": process.env.DB_PORT,
        "database": "scrap"
    }

}