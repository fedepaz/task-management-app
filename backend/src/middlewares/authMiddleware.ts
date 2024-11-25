import jwt from "jsonwebtoken";

const authMiddleware = (req: any, res: any, next: any) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).send("Unauthorized");

  jwt.verify(token, process.env.JWT_SECRET as string, (err: any, user: any) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

export default authMiddleware;
