const { sign, verify } = require("jsonwebtoken");

const createTokens = (user) => {
  const accessToken = sign(
    { userName: user.userName, id: user._id },
    "secretCode"
  );
  return accessToken;
};

const validateToken = (req, res, next) => {
  const accessToken = req.cookies["accessToken"];

  if (!accessToken)
    return res.status(400).json({ error: "User Not authenticated" });

  try {
    const validToken = verify(accessToken, "secretCode");
    if (validToken) {
      req.authenticated = true;
      return next();
    }
  } catch (error) {
    res.status(400).json({ error: error });
  }
};

module.exports = { createTokens, validateToken };
