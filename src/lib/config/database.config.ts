const env = process.env.NODE_ENV;

interface dbConfigType {
    app: {
        port: number
    },
    db: {
        host: string,
        port: number,
        name: string
    }
}

const dev: dbConfigType = {
 app: {
   port: process.env.APP_URL
 },
 db: {
   host: process.env.PROD_DB_URL,
   port: process.env.PROD_DB_PORT,
   name: process.env.PROD_DB_NAME
 }
};

const prod: dbConfigType = {
 app: {
   port: process.env.APP_URL
 },
 db: {
   host: 'localhost',
   port: 5432,
   name: 'toxmo'
 }
};

const config: Record<string, dbConfigType> = {
 'dev': dev,
 'prod': prod
};

export default config[env]
