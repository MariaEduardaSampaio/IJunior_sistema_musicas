import { User } from '@prisma/client';

declare global {
    namespace Express {
        interface Request{
            user: User;
        }
    }
    namespace NodeJS {

        // Tipos das variaveis de ambiente
        interface ProcessEnv {
            DATABASE_URL: string,
            PORT: string,
            APP_URL: string,
            JWT_EXPIRATION: string,
            SECRET_KEY: string,
            NODE_ENV: string,
        }
    }
}