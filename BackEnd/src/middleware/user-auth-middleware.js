import jwt from "jsonwebtoken";
import { ResponseError } from "../error/response-error.js";

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      throw new ResponseError(401, "Not authorized, Login again");
    }

    let tokenDecode;
    try {
      tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      throw new ResponseError(400, "Invalid token");
    }

    if (tokenDecode.id) {
      req.body.userId = tokenDecode.id;
    } else {
      throw new ResponseError(401, "Not authorized, Login again");
    }

    next();
  } catch (error) {
    next(error);
  }
};

export default userAuth;
