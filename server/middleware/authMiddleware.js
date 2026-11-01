import jwt from "jsonwebtoken";

export default function authMiddleware(req, res, next) {
  const authorization = req.headers.authorization;

  if (!authorization?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authentication required" });
  }

  if (!process.env.JWT_SECRET) {
    console.error("JWT_SECRET is not configured");
    return res.status(500).json({ message: "Authentication is not configured" });
  }

  let decoded;
  try {
    const token = authorization.slice("Bearer ".length);
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    console.warn("Order API authentication failed:", error.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }

  if (typeof decoded === "string" || !decoded.id) {
    return res.status(401).json({ message: "Invalid authentication token" });
  }

  req.user = decoded;
  return next();
}
