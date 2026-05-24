import dotenv from 'dotenv';

dotenv.config();

interface JwtConfig {
  jwtSecret: string;
  jwtExpiresIn: string;
  refreshTokenSecret: string;
  refreshTokenExpiresIn: string;
}

const config: JwtConfig = {
  jwtSecret: process.env.JWT_SECRET as string,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '10m',
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET as string,
  refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d'
};

export default config;
