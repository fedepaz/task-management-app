import jwt from "jsonwebtoken";

const authMiddleware = (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;
  const authToken = authHeader?.split(" ")[1];
  const cookieToken = req.cookies.access_token;
  const token = authToken || cookieToken;

  if (!token) return res.status(401).send("Unauthorized");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;
    req.user = {
      name: decoded.name,
      id: decoded.userId,
      iat: decoded.iat,
      exp: decoded.exp,
    };
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid token" });
  }
};

export default authMiddleware;
