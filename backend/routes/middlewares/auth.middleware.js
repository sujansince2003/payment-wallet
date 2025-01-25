import jwt from "jsonwebtoken";

export default function authMiddlware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(400).json({ message: "token not found" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    //  When you add a new property  req.userID to the req object , it makes that information available to all subsequent route handlers or middleware that are executed after the authMiddleware

    req.userID = decoded.userID;

    next();
  } catch (error) {
    return res.status(400).json({ message: "invalid token" });
  }
}
