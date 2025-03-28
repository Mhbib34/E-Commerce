import supertest from "supertest";
import { createTestCategory, removeAllCategory } from "./test.util.js";
import { app } from "../application/app.js";
import { prismaClient } from "../application/database.js";

describe("POST /api/categories/create", () => {
  afterEach(async () => {
    await removeAllCategory();
  });
  it("should can create category", async () => {
    const result = await supertest(app).post("/api/categories/create").send({
      name: "category test",
    });

    expect(result.status).toBe(201);
    expect(result.body.data.name).toBe("category test");
    expect(result.body.data.id).toBeDefined();
  });
  it("should reject if request category is not valid", async () => {
    const result = await supertest(app).post("/api/categories/create").send({
      name: "",
    });

    expect(result.status).toBe(400);
  });
});

describe("GET /api/categories/list", () => {
  beforeEach(async () => {
    await createTestCategory();
  });
  afterEach(async () => {
    await removeAllCategory();
  });
  it("should can get all category", async () => {
    const result = await supertest(app).get("/api/categories/list");

    expect(result.status).toBe(200);
  });
});

describe("GET /api/categories/:name", () => {
  let category;
  beforeEach(async () => {
    category = await prismaClient.category.create({
      data: {
        name: "category test",
      },
    });
  });
  afterEach(async () => {
    await removeAllCategory();
  });
  it("should can get category by name", async () => {
    const result = await supertest(app).get(`/api/categories/${category.name}`);

    expect(result.status).toBe(200);
    expect(result.body.category.name).toBe("category test");
  });

  it("should reject if category name is not found", async () => {
    const result = await supertest(app).get(`/api/categories/asdas`);

    expect(result.status).toBe(404);
  });
});
