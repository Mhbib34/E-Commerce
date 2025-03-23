import { register } from "../services/user-services.js";

const registerUserHandler = async (req, res, next) => {
  try {
    const result = await register(req.body);
    res.status(200).json({
      user: result,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  register: registerUserHandler,
};
