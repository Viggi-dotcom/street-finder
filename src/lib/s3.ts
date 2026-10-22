import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const region = process.env.AWS_REGION || "us-east-1";

export const s3Client = new S3Client({
  region,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

export const S3_BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME || "";
export const CLOUDFRONT_DOMAIN = process.env.AWS_CLOUDFRONT_DOMAIN || "";

/**
 * Generates a presigned URL for direct secure uploads from client to S3
 */
export async function getPresignedUploadUrl(
  fileName: string,
  contentType: string,
  folder: string = "stalls"
): Promise<{ uploadUrl: string; fileKey: string; publicUrl: string }> {
  const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, "_");
  const uniqueKey = `${folder}/${Date.now()}-${sanitizedFileName}`;

  const command = new PutObjectCommand({
    Bucket: S3_BUCKET_NAME,
    Key: uniqueKey,
    ContentType: contentType,
  });

  const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 300 });

  // If CloudFront is configured, use CDN URL, otherwise S3 endpoint
  const publicUrl = CLOUDFRONT_DOMAIN
    ? `https://${CLOUDFRONT_DOMAIN}/${uniqueKey}`
    : `https://${S3_BUCKET_NAME}.s3.${region}.amazonaws.com/${uniqueKey}`;

  return {
    uploadUrl,
    fileKey: uniqueKey,
    publicUrl,
  };
}
