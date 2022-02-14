const jwt = require("jsonwebtoken");
const chatsService = require("../../services/chats.service");

exports.getChat = async (req, res, next) => {
  const { id } = req.params;
  const { lastIndex } = res.locals;
  const DEFAULT_LENGTH = 30;

  const getResult = (index, data) => {
    let rangeStart, chats;

    if (!index) {
      rangeStart =
        data.length < DEFAULT_LENGTH ? 0 : data.length - DEFAULT_LENGTH;
      chats = data.slice(rangeStart, data.length);
    } else {
      rangeStart = index < DEFAULT_LENGTH ? 0 : index - DEFAULT_LENGTH;
      chats = data.slice(rangeStart, index);
    }

    return [rangeStart, chats];
  };

  const createNewNextPageToken = rangeStart => {
    const token =
      rangeStart === 0
        ? null
        : jwt.sign(
            { lastIndex: rangeStart },
            process.env.CHAT_QUERY_SECRET_KEY,
            { expiresIn: "1d" },
          );
    return token;
  };

  try {
    const response = await chatsService.getChatsFromGoalId(id);
    const [rangeStart, chats] = getResult(lastIndex, response);
    const newNextPageToken = createNewNextPageToken(rangeStart);

    res.json({
      result: {
        messages: chats,
        nextPageToken: newNextPageToken,
      },
    });
  } catch (error) {
    res.status(400);
    res.json({
      result: "error",
      message: "messages not found",
    });
  }
};
