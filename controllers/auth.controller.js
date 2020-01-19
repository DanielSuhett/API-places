const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require('../database/db');
const { ErrorHandler } = require('../config/error');
const { validatePayload } = require('./services')


exports.login = async (req, res, next) => {
  try {
    const { username } = req.body;

    const verifyUser = () => {
      return new Promise((resolve, reject) => {
        db.query('SELECT * FROM user WHERE username = ?', username, (err, user) => {
          if (err)
            reject(new ErrorHandler(500, err));
          else {
            if (!user.length)
              reject(new ErrorHandler(401, "Usuário não encontrado."));
            else
              resolve(user[0])
          }
        })
      });
    }

    const user = await verifyUser();
    const { password, salt } = user;

    if (bcrypt.hashSync(req.body.password, salt) == password) {
      req.userId = user._id

      res.status(200).send({
        auth: true,
        message: "Login efetuado com sucesso!",
        userToken: signToken(user)
      });
    } else
      throw new ErrorHandler(401, "Senha Incorreta!");
    next()
  } catch (error) {
    next(error)
  }
};

exports.createUser = async (req, res, next) => {
  try {
    const { username, password, passwordConfirm } = req.body;

    await validatePayload(username, password, passwordConfirm);

    const salt = bcrypt.genSaltSync(10);
    const crypassword = bcrypt.hashSync(password, salt);

    const payload = { username: req.body.username, password: crypassword, salt: salt };

    const postCreate = () => {
      return new Promise((resolve, reject) => {
        db.query('INSERT INTO user SET ?',
          payload, (error, result) => {
            if (error)
              reject(new ErrorHandler(500, error));
            else
              resolve(result)
          });
      })
    }

    const result = await postCreate()

    if (result.affectedRows)
      res.status(201).send({
        createPlace: true,
        data: payload,
        at: new Date()
      });

  next();
  } catch (error) {
    next(error)
  }
};

const signToken = user => {
  const payloadJWT = {
    username: user.username,
    _id: user._id
  };

  const signOptions = {
    issuer: "Places",
    expiresIn: "12h",
    algorithm: "HS256"
  };

  return jwt.sign(payloadJWT, process.env.ACCESS_KEY, signOptions);
};
