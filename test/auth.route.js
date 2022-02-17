/* eslint-disable no-undef */
const request = require("supertest");
const { expect } = require("chai");
const app = require("../src/app");

describe("API 테스트 - Auth", () => {
  describe("#1. POST '/api/auth/login'", () => {
    it("#1-1. 등록되지 않은 유저가 로그인을 시도할 경우", done => {
      request(app)
        .post("/api/auth/login")
        .send({ email: "unregistered@hagomanda.com" })
        .expect(200, { isSuccess: false })
        .end((err, res) => {
          if (err) return done(err);
          done();
        });
    });

    it("#1-2. 등록된 유저가 로그인을 시도할 경우", done => {
      request(app)
        .post("/api/auth/login")
        .send({ email: process.env.TEST_REGISTERED_USER })
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.text).to.include("email");
          expect(res.text).to.include(process.env.TEST_REGISTERED_USER);
          expect(res.text).to.include("displayName");
          expect(res.text).to.include("profile");
          expect(res.text).to.include("newAccessToken");
          expect(res.text).to.include("isSuccess");
          expect(res.text).to.include("true");
          done();
        });
    });
  });

  describe("#2. POST '/api/auth/refresh'", () => {
    it("#2-1. 리프레시 토큰이 없는 경우", done => {
      request(app)
        .post("/api/auth/refresh")
        .expect(200, { isSuccess: false })
        .end((err, res) => {
          if (err) return done(err);
          done();
        });
    });
  });

  describe("#3. GET '/api/auth/logout", () => {
    it("#3-1. 액세스 토큰이 없는 경우", done => {
      request
        .agent(app)
        .set({ authorization: "" })
        .get("/api/auth/logout")
        .expect(200, { isSuccess: false })
        .end((err, res) => {
          if (err) return done(err);
          done();
        });
    });

    it("#3-2. 유효하지 않은 토큰인 경우", done => {
      request
        .agent(app)
        .set({ authorization: "Bearer invalidToken" })
        .get("/api/auth/logout")
        .expect(200, { isSuccess: false })
        .end((err, res) => {
          if (err) return done(err);
          done();
        });
    });
  });
});
