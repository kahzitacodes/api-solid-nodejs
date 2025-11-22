import request from "supertest";
import { app } from "@/app";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

describe("Refresh token (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be able to refresh token", async () => {
    await request(app.server).post("/users").send({
      name: "John Doe",
      email: "john.doe@example.com",
      password: "123456",
    });

    const authResponse = await request(app.server).post("/auth").send({
      email: "john.doe@example.com",
      password: "123456",
    });

    const cookies = authResponse.get("Set-Cookie");

    if (!cookies) {
      throw new Error("No cookies found in authentication response");
    }

    const response = await request(app.server)
      .patch("/auth/refresh-token")
      .set("Cookie", cookies)
      .send();

    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual({
      token: expect.any(String),
    });
    expect(response.get("Set-Cookie")).toEqual(expect.arrayContaining([
      expect.stringContaining("refreshToken="),
    ]));
  });
});
