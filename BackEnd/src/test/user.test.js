import { createTestUser, removeAllUser } from "./test.util.js";
import supertest from "supertest";
import { app } from "../application/app.js";

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
