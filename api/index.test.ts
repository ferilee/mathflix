import { afterEach, describe, expect, mock, test } from "bun:test";
import { app } from "./index";

const originalFetch = globalThis.fetch;

afterEach(() => {
  globalThis.fetch = originalFetch;
  delete process.env.GOOGLE_CLIENT_ID;
  delete process.env.GOOGLE_CLIENT_SECRET;
  delete process.env.GOOGLE_REDIRECT_URI;
  delete process.env.FRONTEND_URL;
});

describe("mathflix-api endpoints", () => {
  test("GET /", async () => {
    const res = await app.request("http://local/");
    expect(res.status).toBe(200);
  });

  test("GET /auth/google returns 500 when missing client id", async () => {
    const res = await app.request("http://local/auth/google");
    expect(res.status).toBe(500);
  });

  test("GET /auth/google redirects when configured", async () => {
    process.env.GOOGLE_CLIENT_ID = "cid";
    process.env.GOOGLE_REDIRECT_URI = "http://localhost:3000/auth/google/callback";
    const res = await app.request("http://local/auth/google");
    expect(res.status).toBe(302);
  });

  test("GET /auth/google/callback validates missing code", async () => {
    const res = await app.request("http://local/auth/google/callback");
    expect(res.status).toBe(400);
  });

  test("GET /auth/google/callback success with mocked Google APIs", async () => {
    process.env.GOOGLE_CLIENT_ID = "cid";
    process.env.GOOGLE_CLIENT_SECRET = "secret";
    process.env.GOOGLE_REDIRECT_URI = "http://localhost:3000/auth/google/callback";
    process.env.FRONTEND_URL = "http://localhost:9111";

    const fetchMock = mock(async (url: string) => {
      if (url.includes("oauth2.googleapis.com/token")) {
        return new Response(JSON.stringify({ access_token: "token" }), { status: 200 });
      }
      return new Response(
        JSON.stringify({ email: "user@guru.smk.belajar.id", name: "User", picture: "pic" }),
        { status: 200 },
      );
    });
    globalThis.fetch = fetchMock as any;

    const res = await app.request("http://local/auth/google/callback?code=abc");
    expect(res.status).toBe(302);
  });

  test("mock and fallback routes", async () => {
    expect((await app.request("http://local/billing/access")).status).toBe(200);
    expect((await app.request("http://local/materials")).status).toBe(200);
    expect((await app.request("http://local/quizzes")).status).toBe(200);
    expect((await app.request("http://local/anything-else")).status).toBe(200);
  });
});
