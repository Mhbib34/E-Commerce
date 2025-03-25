import {
  otpEmailTemplate,
  welcomeEmailTemplate,
} from "../application/email-template.js";
import transporter from "../application/nodemailer.js";
import {
  emailVerifyOtp,
  get,
  login,
  logout,
  register,
  verifyEmail,
} from "../services/user-services.js";

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
const logoutUserHandler = async (req, res, next) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });
    return res.status(200).json(logout());
  } catch (error) {
    next(error);
  }
};

const getUserHandler = async (req, res, next) => {
  try {
    const { userId } = req.body;
    const user = await get(userId);
    return res.status(200).json({
      success: true,
      userData: {
        id: user.id,
        name: user.name,
        email: user.email,
        isAccountVerified: user.isAccountVerified,
      },
    });
  } catch (error) {
    next(error);
  }
};

const sendVerifyOtp = async (req, res, next) => {
  try {
    const { userId } = req.body;
    const { user, otp } = await emailVerifyOtp(userId);

    const mailOption = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: `Account Verify OTP!`,
      html: otpEmailTemplate(user.name, otp, "verify your email"),
    };
    await transporter.sendMail(mailOption);
    res.status(200).json({
      success: true,
      message: "Verification OTP sent on email",
    });
  } catch (error) {
    next(error);
  }
};

const verifyEmailHandler = async (req, res, next) => {
  try {
    const { userId, otp } = req.body;
    const { user } = await verifyEmail(userId, otp);
    res.status(200).json({
      success: true,
      message: "Email verified successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        isAccountVerified: user.isAccountVerified,
      },
    });
  } catch (error) {
    next(error);
  }
};
export default {
  register: registerUserHandler,
  login: loginUserHandler,
  logout: logoutUserHandler,
  get: getUserHandler,
  verifyOtp: sendVerifyOtp,
  emailVerify: verifyEmailHandler,
};
