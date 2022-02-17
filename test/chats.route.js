/* eslint-disable no-undef */
const request = require("supertest");
const { expect } = require("chai");
const app = require("../src/app");
const util = require("../src/utils");
const jwt = require("jsonwebtoken");

describe("API 테스트 - Chats", () => {
  describe("#1. GET '/api/chats/:id' - 유효하지 않은 유저", () => {
    it("#1-1. 유효하지 않은 토큰", done => {
      const agent = request.agent(app);

      agent
        .set({ authorization: "Bearer invalidToken" })
        .get("/api/chats/someId")
        .expect(200, { isSuccess: false })
        .end((err, res) => {
          if (err) return done(err);
          done();
        });
    });

    it("#1-2. 미등록, 회원탈퇴 등 유저 정보가 없는 경우", done => {
      const { newAccessToken } = util.createToken(
        "unregisteredUser@hagomanda.com",
      );

      const agent = request.agent(app);
      agent
        .set({ authorization: `Bearer ${newAccessToken}` })
        .get("/api/chats/someId")
        .expect(404, {
          result: "error",
          message: "Not Found",
        })
        .end((err, res) => {
          if (err) return done(err);
          done();
        });
    });
  });

  describe("#2. GET '/api/chats/:id' - 유효한 유저", () => {
    const { newAccessToken } = util.createToken(
      process.env.TEST_REGISTERED_USER,
    );
    const agent = request.agent(app);

    it("#2-1. url 형식이 옳지 않은 경우", done => {
      agent
        .set({ authorization: `Bearer ${newAccessToken}` })
        .get("/api/chats/invalidId")
        .expect(400, {
          result: "error",
          message: "Invalid Id",
        })
        .end((err, res) => {
          if (err) return done(err);
          done();
        });
    });

    it("#2-2. 채팅 쿼리 토큰이 유효하지 않은 경우", done => {
      const invalidChatToken = jwt.sign(
        { lastIndex: 30 },
        "someInvalidSecretKey",
        { expiresIn: "1d" },
      );
      agent
        .set({ authorization: `Bearer ${newAccessToken}` })
        .get(
          `/api/chats/${process.env.TEST_VALID_GOAL_ID}?nextPageToken=${invalidChatToken}`,
        )
        .expect(500)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.text).to.include("Invalid Token");
          done();
        });
    });

    it("#2-3. 삭제된 url 등 유효하지 않은 url인 경우", done => {
      agent
        .set({ authorization: `Bearer ${newAccessToken}` })
        .get("/api/chats/aaaaaaaaaaaaaaaaaaaaaaaa")
        .expect(400, {
          result: "error",
          message: "messages not found",
        })
        .end((err, res) => {
          if (err) return done(err);
          done();
        });
    });

    it("#2-4. 유저 및 url이 유효한 경우", done => {
      agent
        .set({ authorization: `Bearer ${newAccessToken}` })
        .get(`/api/chats/${process.env.TEST_VALID_GOAL_ID}`)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.text).to.include("result");
          expect(res.text).to.include("messages");
          expect(res.text).to.include("nextPageToken");
          done();
        });
    });
  });

  describe("#3. POST '/api/chats/:id", () => {
    const { newAccessToken } = util.createToken(
      process.env.TEST_REGISTERED_USER,
    );
    const agent = request.agent(app);

    it("#3-1. 정상적으로 등록되었을 경우", done => {
      agent
        .set({ authorization: `Bearer ${newAccessToken}` })
        .post(`/api/chats/${process.env.TEST_VALID_GOAL_ID}`)
        .send({
          id: process.env.TEST_REGISTERED_USER,
          messages: "test",
          createdAt: "2022.02.18 01:29",
        })
        .expect(200, {
          result: "ok",
        })
        .end((err, res) => {
          if (err) return done(err);
          done();
        });
    });
  });
});
