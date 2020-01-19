const jwt = require("jsonwebtoken");
const decode = require("jwt-decode");
const { ErrorHandler } = require('./error')
const { FindUser } = require('../controllers/services')


const verifyJWT = async (req, res, next) => {
  try {
    const token = req.headers["x-access-token"];
    if (!token)
      return res
        .status(401)
        .send({ auth: false, message: "Você não tem permissão!" })
        .redirect("/");

    const UserTokenId = decode(req.headers["x-access-token"])._id;


    if (!UserTokenId) {
      throw new ErrorHandler(401, "Não foi possivel obter token")
    }



    const result = await FindUser(UserTokenId);
    if (!result.length)
      throw new ErrorHandler(401, "Não existe usuário com esse ID");
    else {
      req.token = token;
      req.userId = UserTokenId
    }

    jwt.verify(token, process.env.ACCESS_KEY, err => {
      if (err)
        throw new ErrorHandler(401, err);
    });

    next();
  } catch (error) {
    next(error)
  }
};

module.exports = verifyJWT