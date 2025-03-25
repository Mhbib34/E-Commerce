import { createTestUser, removeAllUser } from "./test.util.js";
import supertest from "supertest";
import { app } from "../application/app.js";
import { prismaClient } from "../application/database.js";

describe("POST /api/users/register", () => {
  afterEach(async () => {
    await removeAllUser();
  });

  it("Should can register user", async () => {
    const result = await supertest(app).post("/api/users/register").send({
      username: "test",
      name: "test",
      email: "test@gmail.com",
      password: "rahasia",
    });
    expect(result.status).toBe(200);
    expect(result.body.user.username).toBe("test");
    expect(result.body.user.name).toBe("test");
    expect(result.body.user.email).toBe("test@gmail.com");
    expect(result.body.user.password).toBeUndefined();
  });

  it("Should reject if request is not valid", async () => {
    const result = await supertest(app).post("/api/users/register").send({
      username: "",
      name: "",
      email: "",
      password: "",
    });
    expect(result.status).toBe(400);
  });
  it("should reject if user already registered", async () => {
    let result = await supertest(app).post("/api/users/register").send({
      username: "test",
      name: "test",
      email: "test@gmail.com",
      password: "rahasia",
    });

    expect(result.status).toBe(200);
    expect(result.body.user.username).toBe("test");
    expect(result.body.user.name).toBe("test");
    expect(result.body.user.email).toBe("test@gmail.com");
    expect(result.body.user.password).toBeUndefined();

    result = await supertest(app).post("/api/users/register").send({
      username: "test",
      name: "test",
      email: "test@gmail.com",
      password: "rahasia",
    });

    expect(result.status).toBe(400);
  });
});

describe("POST /api/users/login", () => {
  beforeEach(async () => {
    await createTestUser();
  });
  afterEach(async () => {
    await removeAllUser();
  });
  it("Should can login", async () => {
    const result = await supertest(app).post("/api/users/login").send({
      email: "test@gmail.com",
      password: "rahasia",
    });

    expect(result.status).toBe(200);
    expect(result.body.user.email).toBe("test@gmail.com");
    expect(result.body.token).toBeDefined();
  });
  it("Should reject login is request is not valid", async () => {
    const result = await supertest(app).post("/api/users/login").send({
      email: "",
      password: "",
    });

    expect(result.status).toBe(400);
  });
});

describe("POST /api/users/logout", () => {
  beforeEach(async () => {
    await createTestUser();
  });
  afterEach(async () => {
    await removeAllUser();
  });
  it("Should can logout user", async () => {
    const result = await supertest(app).post("/api/users/logout");
    expect(result.status).toBe(200);
    expect(result.body.token).toBeUndefined();
  });
});

describe("POST /api/users/send-verify-otp", () => {
  let validToken;

  beforeEach(async () => {
    await createTestUser();

    const loginResponse = await supertest(app)
      .post("/api/users/login")
      .send({ email: "test@gmail.com", password: "rahasia" });

    validToken = loginResponse.body.token;
  });

  afterEach(async () => {
    await removeAllUser();
  });

  it("should send OTP to user's email successfully", async () => {
    const result = await supertest(app)
      .post("/api/users/send-verify-otp")
      .set("Cookie", `token=${validToken}`);

    expect(result.status).toBe(200);
    expect(result.body.success).toBe(true);
    expect(result.body.message).toBe("Verification OTP sent on email");
  });

  it("should reject if token is not valid", async () => {
    const result = await supertest(app)
      .post("/api/users/send-verify-otp")
      .set("Cookie", `token=asdadas`);
    expect(result.status).toBe(400);
  });
});

describe("POST /api/users/verify-account", () => {
  let validToken;
  let otp;

  beforeEach(async () => {
    await createTestUser();

    const loginResponse = await supertest(app)
      .post("/api/users/login")
      .send({ email: "test@gmail.com", password: "rahasia" });

    validToken = loginResponse.body.token;

    const otpResponse = await supertest(app)
      .post("/api/users/send-verify-otp")
      .set("Cookie", `token=${validToken}`);

    const user = await prismaClient.user.findUnique({
      where: { email: "test@gmail.com" },
      select: { verifyOtp: true },
    });
    otp = user.verifyOtp;
  });

  afterEach(async () => {
    await removeAllUser();
  });

  it("Should can verify email", async () => {
    const result = await supertest(app)
      .post("/api/users/verify-account")
      .set("Cookie", `token=${validToken}`)
      .send({ otp });

    expect(result.status).toBe(200);
    expect(result.body.user.isAccountVerified).toBe(true);
  });

  it("Should reject if otp is not valid", async () => {
    const result = await supertest(app)
      .post("/api/users/verify-account")
      .set("Cookie", `token=${validToken}`)
      .send({ otp: 1234 });

    expect(result.status).toBe(400);
  });
});
