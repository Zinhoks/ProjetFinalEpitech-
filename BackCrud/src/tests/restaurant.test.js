const request = require("supertest");
const app = require("../index.js");

describe("GET /restaurants", () => {
  it("all restaurants", async () => {
    const response = await request(app).get("/restaurants");
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expect.any(Array));
  },60000);
});

describe("GET /restaurants/:id", () => {
    it("should return a restaurant by id", async () => {
      const response = await request(app).get("/restaurants/63d925659732ce487b57abc3");
      expect(response.statusCode).toBe(200);
      expect(response.body.name).toEqual("The Sushi Place" );
    });
  });



describe('POST /restaurants', () => {
    jest.setTimeout(30000);

    const url = 'http://localhost:3002'

    it("Should Add a new Restaurant to the DB", async () => {
      const res = await request(url)
      .post("/restaurants")
      .send({
        name: "Ramen Sushi",
        address: "1 Rue Étienne Marcel, 75001 Paris",
        category: "Sushi",
      });

      expect(res.status).toBe(201);
      expect(res.body.address).toBe("1 Rue Étienne Marcel, 75001 Paris");
    });

});

describe('DELETE /restaurants', () => {
  jest.setTimeout(30000);

  const url = 'http://localhost:3002/restaurants'

  it("Should Delete a restaurant from the DB", async () => {
    const res = await request(url)
    .delete("/63e2610b5004c56527830461")
    .send({
      name: "Ramen Sushi",
      address: "1 Rue Étienne Marcel, 75001 Paris",
      category: "Sushi",
    });

    expect(res.status).toBe(200);
  });

});


describe('PUT /dishes/:_id', () => {
  jest.setTimeout(30000);

  const url = 'http://localhost:3002'

  it("Should Update/Modify information about a dish", async () => {
    const res = await request(url)
    .put("/dishes/63e256bc660423237eadf69f")
    .send({
      Dish_Name: "Menu étudiant",
      Dish_Price: 10,
      Restaurant_ID: "63d2583212c39a43a10ecb2c",
    });

    expect(res.status).toBe(200);
    expect(res.body.Dish_Name).toBe("Menu étudiant");
  });

});
