import { welcomeEmailTemplate } from "../application/email-template.js";
import transporter from "../application/nodemailer.js";
import { login, register } from "../services/user-services.js";

const registerUserHandler = async (req, res, next) => {
  try {
    const result = await register(req.body);
    const mailOption = {
      from: process.env.SENDER_EMAIL,
      to: result.email,
      subject: `Welcome ${result.name}!`,
      html: welcomeEmailTemplate(result.email, result.name),
    };
    await transporter.sendMail(mailOption);
    res.status(200).json({
      user: result,
    });
  } catch (error) {
    next(error);
  }
};

const loginUserHandler = async (req, res, next) => {
  try {
    const { user, token } = await login(req.body);
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: "User login successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    next(error);
  }
};
export default {
  register: registerUserHandler,
  login: loginUserHandler,
};
