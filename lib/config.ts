export const config = {
  aws: {
    region: process.env.AWS_REGION || 'us-east-1',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    s3BucketName: process.env.AWS_S3_BUCKET_NAME || 'digigo-care-storage',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'fallback-secret-key-for-development-only',
    expiresIn: '7d', // Token expires in 7 days
  },
  app: {
    name: 'DigiGo Care',
    url: process.env.NEXTAUTH_URL || 'http://localhost:3000',
  },
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
  }
};