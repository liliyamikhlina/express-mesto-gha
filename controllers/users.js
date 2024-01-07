const bcrypt = require("bcryptjs");
const User = require("../models/user");

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.getUserById = (req, res) => {
  const { userId } = req.params;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        return res
          .status(404)
          .send({ message: "Пользователь с указанным _id не найден" });
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res
          .status(400)
          .send({ message: "Передан некорректный _id пользователя" });
      }
      return res.status(500).send({ message: err.message });
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar, email, password } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) =>
      User.create({
        name,
        about,
        avatar,
        email,
        password: hash,
      })
    )
    .then((user) => res.status(201).json({ data: user }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(400).send({
          message: "Переданы некорректные данные при создании пользователя",
        });
      }
      return res.status(500).send({ message: err.message });
    });
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true }
  )
    .then((user) => {
      if (!user) {
        return res
          .status(404)
          .send({ message: "Пользователь с указанным _id не найден" });
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(400).send({
          message: "Переданы некорректные данные при обновлении профиля",
        });
      }
      return res.status(500).send({ message: err.message });
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true }
  )
    .then((user) => {
      if (!user) {
        return res
          .status(404)
          .send({ message: "Пользователь с указанным _id не найден" });
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res
          .status(400)
          .send({ message: "Переданы некорректные данные при обновлении " });
      }
      return res.status(500).send({ message: err.message });
    });
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        return res.status(401).send({ message: "Incorrect email or password" });
      }
      bcrypt
        .compare(password, user.password)
        .then((passwordMatch) => {
          if (!passwordMatch) {
            return res
              .status(401)
              .send({ message: "Incorrect email or password" });
          }

          const token = jwt.sign({ _id: user._id }, "your-secret-key", {
            expiresIn: "1w",
          });

          res.cookie("jwt", token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
          });


          res.status(200).send({ message: "Login successful" });
        })
        .catch((err) => {
          console.error(err);
          res.status(500).send({ message: "Internal Server Error" });
        });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send({ message: "Internal Server Error" });
    });
};
