import { NextFunction, Request, Response } from "express";
import { JwtPayload, verify } from "jsonwebtoken";
import { IS_PROD } from "./isProd";

export const ACCESS_TOKEN_SECRET = IS_PROD
  ? process.env.ACCESS_TOKEN_SECRET
  : "secret";

export const SEMAPHORE_SERVER = process.env.SEMAPHORE_SERVER;

export const PARTICIPANTS_GROUP = SEMAPHORE_SERVER + "semaphore/1";
export const RESIDENTS_GROUP = SEMAPHORE_SERVER + "semaphore/2";
export const VISITORS_GROUP = SEMAPHORE_SERVER + "semaphore/3";
export const ALLOWED_GROUPS = [
  PARTICIPANTS_GROUP,
  VISITORS_GROUP,
  RESIDENTS_GROUP,
];

export function isAllowedGroup(group: string) {
  return ALLOWED_GROUPS.includes(group);
}

export interface GroupJwtPayload extends JwtPayload {
  groupUrl: string;
}

export const authenticateJWT = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];

    verify(token, ACCESS_TOKEN_SECRET!, (err, group) => {
      if (err) {
        return res.sendStatus(403);
      }

      const payload = group as GroupJwtPayload;
      if (!isAllowedGroup(payload.groupUrl)) {
        return res.sendStatus(403);
      }

      next();
    });
  } else {
    res.sendStatus(401);
  }
};
