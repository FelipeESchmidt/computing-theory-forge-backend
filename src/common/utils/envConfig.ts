import dotenv from 'dotenv';
import { cleanEnv, host, num, port, str, testOnly } from 'envalid';

dotenv.config();

export const env = cleanEnv(process.env, {
  NODE_ENV: str({ devDefault: testOnly('test'), choices: ['development', 'production', 'test'] }),
  HOST: host({ devDefault: testOnly('localhost') }),
  PORT: port({ devDefault: testOnly(3000) }),
  CORS_ORIGIN: str({ devDefault: testOnly('http://localhost:3000') }),
  COMMON_RATE_LIMIT_MAX_REQUESTS: num({ devDefault: testOnly(1000) }),
  COMMON_RATE_LIMIT_WINDOW_MS: num({ devDefault: testOnly(1000) }),
  JWT_SECRET: str({ devDefault: testOnly('jwtsecret') }),
  DB_HOST: str({ devDefault: testOnly('localhost') }),
  DB_PORT: num({ devDefault: testOnly(5432) }),
  DB_USER: str({ devDefault: testOnly('user') }),
  DB_PASS: str({ devDefault: testOnly('password') }),
  DB_NAME: str({ devDefault: testOnly('app') }),
  ENCRYPTION_KEY: str({ devDefault: testOnly('encryptionkey') }),
});
