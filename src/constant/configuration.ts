export default () => {
    return {
        ENVIRONMENT: process.env.ENVIRONMENT,
        DATABASE: {
            CLIENT: process.env.DATABASE_CLIENT,
            HOST: process.env.DATABASE_HOST,
            PORT: process.env.DATABASE_PORT,
            DB_NAME: process.env.DATABASE_NAME,
            USER: process.env.DATABASE_USER,
            PASS: process.env.DATABASE_PASS,
        },
        MULTER: {
            DESTINATION: process.env.MUL_DESTINATION,
            MAX_SIZE: process.env.MUL_MAX_SIZE
        }
    }
}