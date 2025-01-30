import jwt, { JwtPayload, Secret, SignOptions } from "jsonwebtoken";

const generateToken = (
  payload: any,
  secret: Secret,
  expiresIn: string
): string => {
  const options: any = {
    algorithm: "HS256",
    expiresIn: expiresIn,
  };
  const token = jwt.sign(payload, secret, options);
  return token;
};

const verifyToken = (token: string, secret: Secret) => {
  return jwt.verify(token, secret) as JwtPayload;
};

export const jwtHelpers = {
  generateToken,
  verifyToken,
};
