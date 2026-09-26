import jwt from "jsonwebtoken";
import { JWT_EPIRES_IN, getJwtSecret } from "../src/config/auth";
export function issueToken(userId) {
  return jwt.sign({ sub: String(userId) }, getJwtSecret(), {
    algorithm: "HS256",
    expiresIn: JWT_EPIRES_IN,
  });
}

export function verifyToken(token) {
  try {
    const claims = jwt.verify(token, getJwtSecret(), { algorithms: ["HS256"] });
    if (typeof claims?.sub !== "string" || !/^[1-9]\d*$/.test(claims.sub))
      return null;
    return claims;
  } catch {
    return null;
  }
}
