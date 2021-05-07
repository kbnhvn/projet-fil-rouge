class User {
    constructor(mail, firstname, lastname, password, age, gender, city) {

        this.mail = mail;
        this.firstname = firstname;
        this.lastname = lastname;
        this.password = password;
        this.age = age;
        this.gender = gender;
        this.city = city;
        this.id_user;

    }
}
module.exports = User;