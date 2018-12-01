const bcrypt = require('bcryptjs');
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var userSchema = new Schema({
    "userName": {
        type: String,
        unique: true
    },
    "password": String,
    "email": String,
    "loginHistory":
        [
            {
                "dateTime": Date,
                "userAgent": String
            }
        ]
});

let User; // to be defined on new connection (see initialize)

module.exports.initialize = function () {
    return new Promise(function (resolve, reject) {
        let db = mongoose.createConnection("<YOUR MONGODB DETAILS>"); //TODO: Enter your MongoDB details
        db.on('error', (err) => {
            reject(err); // reject the promise with the provided error
        });
        db.once('open', () => {
            User = db.model("users", userSchema);
            resolve();
        });
    });
};

module.exports.registerUser = function (userData) {
    return new Promise((resolve, reject) => {

        bcrypt.genSalt(10, function (err, salt) { // Generate a "salt" using 10 rounds to has passwords
            bcrypt.hash(userData.password, salt, function (err, hash) {
                if (err) {
                    reject(`There was an error encrypting the password`);
                    return;
                }

                if (userData.password != userData.password2) {
                    reject(`Passwords do not match!`);
                    return;
                } else {
                    userData.password = hash;
                    let newUser = new User(userData);
                    newUser.save((err) => {
                        if (err) {
                            if (err.code == 11000) //Duplicate key error
                            {
                                reject("User Name already taken");
                                return;
                            } else {
                                reject(`There was an error creating the user ${err}`);
                                return;
                            }
                        } else {
                            resolve();
                        }
                    })
                }
            });
        });
    });
}

module.exports.checkUser = function (userData) {
    return new Promise((resolve, reject) => {
        User.find({ userName: userData.userName }).exec().then((data) => {
            //Checking if data 
            if (data.length == 0) {
                reject(`No user found with this username ${userData.userName}`);
                return;
            }

            //comparing passwords if user was found
            bcrypt.compare(userData.password, data[0].password).then((res) => {

                if (res === false) {
                    reject(`Incorrect Password for user: ${userData.userName}`)
                    return;
                }
                else
                {
                    data[0].loginHistory.push({ dateTime: (new Date()).toString(), userAgent: userData.userAgent });
                    console.log("<<<<<<<<<<<<< Login history" + data[0].loginHistory);
                    User.update(
                        { userName: data[0].userName },
                        { $set: { loginHistory: data[0].loginHistory } },
                        { multi: false }
                    ).exec().then(() => {
                        resolve(data[0]);
                    }).catch((err) => {
                        reject(`There was an error veryfying the user : ${err}`);
                    });        
                }});
        }).catch((err) => {
            reject(`Unable to find user: ${userData.userName}`);
        });
    })
}