import supertest from "supertest";
import { removeAllCategory, removeAllProducts } from "./test.util.js";
import { app } from "../application/app.js";

describe("POST /api/products/create", () => {
  afterEach(async () => {
    await removeAllProducts();
    await removeAllCategory();
  });
  it("should can create product", async () => {
    const result = await supertest(app).post("/api/products/create").send({
      name: "product test",
      description: "product desc",
      price: 111,
      stock: 123,
      categoryName: "category test",
    });
    console.log(result.body);
    expect(result.status).toBe(201);
    expect(result.body.product.name).toBe("product test");
    expect(result.body.product.description).toBe("product desc");
    expect(result.body.product.price).toBe(111);
    expect(result.body.product.stock).toBe(123);
    expect(result.body.product.category.name).toBe("category test");
  });
});
