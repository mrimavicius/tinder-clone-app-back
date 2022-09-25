const DatingUser = require("../models/datingUsers")
const bcrypt = require("bcrypt")

module.exports = {
  create_user: async (req, res) => {
    const { email, password, name, city, dob, gender, photo1, photo2 } =
      req.body;

    const userPass = password;
    const hash = await bcrypt.hash(userPass, 10);

    const newUser = new DatingUser({
      email,
      password: hash,
      name,
      city,
      dob,
      gender,
      photos: [photo1, photo2],
    });

    await newUser.save();

    res.send({ error: false, message: "user created", data: null });
  },

  log_user: async (req, res) => {
    const { email, password } = req.body;
    const user = await DatingUser.findOne({ email });

    if (user) {

      req.session.user = user

      const compare = await bcrypt.compare(password, user.password);

      if (compare) {
        const newUser = {
          email: user.email,
          name: user.name,
          city: user.city,
          dob: user.dob,
          gender: user.gender,
          photos: user.photos,
          myLikes: user.myLikes,
          gotLikes: user.gotLikes,
          filter: user.filter
        };
        return res.send({
          error: false,
          message: "logging you in",
          data: newUser,
        });
      }

      return res.send({ error: true, message: "wrong password" });
    }

    return res.send({ error: true, message: "user not found" });
  },
  add_photo: async (req, res) => {
    const { email, photos } = req.body

    const user = await DatingUser.findOneAndUpdate({ email }, { $set: {photos}}, { new: true})

    return res.send({ error: false, message: "user photos updated", data: user });
  },
  get_user: async (req, res) => {
    const { email } = req.body

    const user = await DatingUser.findOne({ email });

    let users = await DatingUser.find();
    users = users.filter(x => x.email !== email)
    
    if (user.filter.city !== "All") {
      if(users){
        users = users.filter(x => x.city === user.filter.city)
      }
      if(users){
        users = users.filter(x => x.gender === user.filter.gender)
      }

      if(users){
        users = users.filter(
          (x) =>
            x.dob.slice(0, 4) < new Date().getFullYear() - user.filter.age_min &&
            x.dob.slice(0, 4) > new Date().getFullYear() - user.filter.age_max
        );
      }
      console.log(users)
    }

    if (user.filter.city === "All") {
      if(users){
        users = users.filter((x) => x.gender === user.filter.gender);
      }
      if(users){
        users = users.filter(
          (x) =>
            x.dob.slice(0, 4) <
              new Date().getFullYear() - user.filter.age_min &&
            x.dob.slice(0, 4) >
              new Date().getFullYear() - user.filter.age_max
        );
      }
    }

    if (users.length === 0) {
      return res.send({
        error: false,
        message: "no users by this filter",
        data: null,
      });
    } else {
      const random = Math.floor(Math.random() * users.length)
      const randomUser = users[random]

      const userToSend = {
        email: randomUser.email,
        name: randomUser.name,
        city: randomUser.city,
        dob: randomUser.dob,
        gender: randomUser.gender,
        photos: randomUser.photos,
      };
  
      return res.send({
        error: false,
        message: "user to swipe",
        data: userToSend,
      });
    }

  },
  add_like: async (req, res) => {
    const { email, myLikes, otherEmail } = req.body

    const user = await DatingUser.findOneAndUpdate(
      { email },
      { $set: { myLikes } },
      { new: true }
    );

    const userToLike = {
      email: user.email,
      name: user.name,
      city: user.city,
      dob: user.dob,
      gender: user.gender,
      photos: user.photos,
    };

    const otherUser = await DatingUser.findOne({ email: otherEmail})
    const otherUserLikes = [...otherUser.gotLikes, userToLike]

    const updateOtherUser = await DatingUser.findOneAndUpdate(
      { email: otherEmail },
      { $set: { gotLikes: otherUserLikes } },
      { new: true }
    );

    return res.send({
        error: false,
        message: "user likes updated",
        data: user,
    });
  },
  autologin: async (req, res) => {
    if (req.session.user) {
      const { email } = req.session.user
      const user = await DatingUser.findOne({ email })

      return res.send({
        error: false,
        message: "logging you in",
        data: user
      })
    }

    res.send({
      error: true,
      message: "no user in session",
      data: null
    })
  },
  logout: (req, res) => {
    delete req.session.user
    res.send({
      error: false,
      message: "user session ended",
      data: null
    })
  },
  filter: async (req, res) => {
    const { email, filter } = req.body;

    console.log(filter)

    const user = await DatingUser.findOneAndUpdate(
      { email },
      { $set: { filter } },
      { new: true }
    );

    return res.send({
      error: false,
      message: "user preferences updated",
      data: user,
    });
  }
};