// data controller form service js like register data
// use distructer as value
const {
  register,
  getAllUsers,
  getUserByEmail,
  userById,
  profile,
} = require("./user.service");
const pool = require("../../config/database");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// we can create controler module hear
// it can conrtole those data from frontend
module.exports = {
  // like Dom js it can validate the data from frontend
  // validate on backend
  createUser: (req, res) => {
    const { userName, firstName, lastName, email, password } = req.body;
     console.table(req.body);
    console.log("Recived from post man",req.body);
    if (!userName || !firstName || !lastName || !email || !password)
      return res
        .status(400)
        .json({ msg: "Not all fields have been provided!" });

    if (password.length < 8)
      return res
        .status(400)
        .json({ msg: "Password must be at least 8 charactres !" });

    pool.query(
      "SELECT * FROM registration WHERE user_email = ?",
      [email],
      (err, results) => {
        if (err) {
          return res.status(err).json({ msg: "Database connection error" });
        }
        if (results.length > 0) {
          return res
            .status(400)
            .json({ msg: "An account with this email already exists!" });
        } else {
          const salt = bcrypt.genSaltSync();
          req.body.password = bcrypt.hashSync(password, salt);

          register(req.body, (err, results) => {
            if (err) {
              console.log(err);
              return res.status(500).json({ msg: "Database connection err" });
            }
            pool.query(
              "SELECT  * FROM registration WHERE user_email = ?",
              // (err, results) => {
                [email],
                  (err, results) => {
                    if (err) {
                      return res
                        .status(err)
                        .json({ msg: "Database connection error" });
                    }
                    req.body.userId = results[0].user_id;
                    console.log(req.body);
                    profile(req.body, (err, results) => {
                      if (err) {
                        console.log(err);
                        return res
                          .status(500)
                          .json({ msg: "data connect err" });
                      }
                      return res.status(200).json({
                        msg: "New user add successfully",
                        data: results,
                      });
                    });
                  
               });
          });
        }
      }
      );
  },
  getUsers: (req, res) => {
    getAllUsers((err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ msg: "data connections error" });
      }
      return res.status(200).json({ data: results });
    });
  },
  getUserById: (req, res) => {
    // const id = req.params.id;
    // consle.log("id===>", id, "user===>", req.id);
    userById(req.id, (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ msg: "database connection error" });
      }
      if (!results) {
        return res.status(404).json({ msg: "Record not found" });
      }
      return res.status(200).json({ data: results });
    });
  },
  login: (req, res) => {
    const { email, password } = req.body;
    // validation check for email and password
    if (!email || !password)
      return res
        .status(401)
        .json({ msg: "Not all fields have been provided !" });
    getUserByEmail(email, (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).json({ msg: "database connection error" });
      }
      if (!results) {
        return res.status(404).json({
          msg: "No account with this email address has been registerd.",
        });
      }
      // if the email is already registered
      // and the password is matches with the hash stored
      const isMatch = bcrypt.compareSync(password, results.user_password);
      if (!isMatch) return res.status(404).json({ msg: "Invalid credentials" });

      const token = jwt.sign({ id: results.user_id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      return res.json({
        token: token,
        // frontend grap information about id and username
        user: { id: results.user_id, display_name: results.user_name },
      });
    });
  },
};
