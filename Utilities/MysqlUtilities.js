const mysql = require('mysql');
const config = {
    host: 'localhost',
    user: 'root',
    password: 'root',
    port: '8889',
    database: 'siteProjet'
};

class MysqlUtilities {
    getUserByCredentials(callback, user) {
        const connection = mysql.createConnection(config);
        connection.connect();

        connection.query(`SELECT *  FROM Users WHERE mail=(?) AND password=(?)`, [user.mail, user.password], (error, results) => {
            //console.log(results)

            callback(results, error);


        })
        connection.end()
    };

    getUserByMail(callback, user) {
        const connection = mysql.createConnection(config);
        connection.connect();

        connection.query(`SELECT mail  FROM Users WHERE mail=(?) `, [user.mail], (error, results) => {


            callback(results, error);


        })
        connection.end()
    };

    createUser(callback, user) {
        const connection = mysql.createConnection(config);
        connection.connect();
        connection.query(`INSERT INTO Users (mail, firstname, lastname, password, age, gender, city) Values (?,?,?,?,?,?,?)`, [user.mail, user.firstname, user.lastname, user.password, user.age, user.gender, user.city], (error, results) => {
            console.log(results)
            callback(results, error)
        })
        connection.end()
    };


};
module.exports = new MysqlUtilities();