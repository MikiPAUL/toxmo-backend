declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PROD_DB_URL: string;
      PROD_DB_PORT: number;
      PROD_DB_NAME: string;
      NODE_ENV: 'dev' | 'prod';
      PROD_DB_USERNAME: string;
      PROD_DB_PASSWORD: string;
      TWILIO_ACCOUNT_SID: string;
      TWILIO_AUTH_TOKEN: string;
      APP_URL: number;
      TOKEN_SECRET_KEY: string;
      S3_REGION: string;
      S3_ACCESS_KEY: string;
      S3_SECRET_KEY: string;
      S3_BUCKET_NAME: string;
    }
  }
}

export { }