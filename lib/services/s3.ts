// lib/services/s3.ts
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { config } from "@/lib/config";

// Initialize S3 client
const s3Client = new S3Client({
  region: config.aws.region,
  credentials: {
    accessKeyId: config.aws.accessKeyId || '',
    secretAccessKey: config.aws.secretAccessKey || '',
  },
});

/**
 * Uploads a file to S3
 * @param file The file to upload
 * @param key The key (path) to store the file at
 * @returns The URL of the uploaded file
 */
export async function uploadFile(file: Buffer | Blob, key: string, contentType: string): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: config.aws.s3BucketName,
    Key: key,
    Body: file,
    ContentType: contentType,
  });

  await s3Client.send(command);
  
  // Return the URL of the uploaded file
  return `https://${config.aws.s3BucketName}.s3.${config.aws.region}.amazonaws.com/${key}`;
}

/**
 * Generates a pre-signed URL for uploading a file directly to S3
 * @param key The key (path) to store the file at
 * @param contentType The content type of the file
 * @param expiresIn The number of seconds until the pre-signed URL expires
 * @returns The pre-signed URL
 */
export async function getUploadPresignedUrl(key: string, contentType: string, expiresIn = 3600): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: config.aws.s3BucketName,
    Key: key,
    ContentType: contentType,
  });

  return await getSignedUrl(s3Client, command, { expiresIn });
}

/**
 * Generates a pre-signed URL for downloading a file from S3
 * @param key The key (path) of the file to download
 * @param expiresIn The number of seconds until the pre-signed URL expires
 * @returns The pre-signed URL
 */
export async function getDownloadPresignedUrl(key: string, expiresIn = 3600): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: config.aws.s3BucketName,
    Key: key,
  });

  return await getSignedUrl(s3Client, command, { expiresIn });
}

/**
 * Deletes a file from S3
 * @param key The key (path) of the file to delete
 */
export async function deleteFile(key: string): Promise<void> {
  const command = new DeleteObjectCommand({
    Bucket: config.aws.s3BucketName,
    Key: key,
  });

  await s3Client.send(command);
}

/**
 * Generates a unique key for a file
 * @param folder The folder to store the file in
 * @param fileName The original file name
 * @returns A unique key for the file
 */
export function generateFileKey(folder: string, fileName: string): string {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 10);
  const extension = fileName.split('.').pop();
  
  return `${folder}/${timestamp}-${randomString}.${extension}`;
}

/**
 * Uploads a file to S3 from a File object
 * @param file The file to upload
 * @param folder The folder to store the file in
 * @returns The URL of the uploaded file
 */
export async function uploadFileObject(file: File, folder: string): Promise<string> {
  const key = generateFileKey(folder, file.name);
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  
  return await uploadFile(buffer, key, file.type);
}
