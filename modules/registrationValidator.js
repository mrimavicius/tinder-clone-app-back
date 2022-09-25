const validator = require("email-validator");
const DatingUser = require("../models/datingUsers")

module.exports = {
  validateRegistration: async (req, res, next) => {
    const { email, password, password2, name, city, dob } = req.body;

    // email validation
    if (!validator.validate(email))
      return res.send({ error: true, message: "invalid email" });

    if (await DatingUser.findOne({ email }))
        return res.send({
            error: true,
            message: "this email already exists",
        });

    // password validation
    if (password !== password2)
      return res.send({ error: true, message: "passwords do not match" });

    // name validation
    if (name.length < 3)
      return res.send({
        error: true,
        message: "name should contain at least 3 characters",
      });

    if (name.length > 20)
      return res.send({
        error: true,
        message: "name should not be longer than 20 characters",
      });

    // city validation
      if (city.length < 3)
        return res.send({
            error: true,
            message: "city name should contain at least 3 characters"
        })

    if (city.length > 20)
        return res.send({
        error: true,
        message: "city name should not be longer than 20 characters",
        });

    // dob validation
    const date = new Date();
    const this_year = date.getFullYear();
    const this_month = date.getMonth() + 1;
    const this_day = date.getDate();

    const dob_year = Number(dob.slice(0, 4));
    const dob_month = Number(dob.slice(5, 7));
    const dob_day = Number(dob.slice(8, 10));

    if (this_year - dob_year < 18)
      return res.send({
        error: true,
        message: "you have to be at least 18 years old",
      });

    if (this_year - dob_year === 18 && this_month < dob_month)
      return res.send({
        error: true,
        message: "you have to be at least 18 years old",
      });

    if (
      this_year - dob_year === 18 &&
      this_month === dob_month &&
      this_day < dob_day
    )
      return res.send({
        error: true,
        message: "you have to be at least 18 years old",
      });

    next()
  },
};
