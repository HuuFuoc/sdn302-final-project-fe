import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  type PutObjectCommandInput,
} from "@aws-sdk/client-s3";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-providers";
import { notificationMessage } from "./helper";

const REGION = import.meta.env.VITE_AWS_REGION as string;
const BUCKET_NAME = import.meta.env.VITE_S3_BUCKET_NAME as string;
const IDENTITY_POOL_ID = import.meta.env
  .VITE_COGNITO_IDENTITY_POOL_ID as string;

// Configure AWS S3 using Cognito Identity Pool (no hardcoded credentials)
const getS3Client = () => {
  return new S3Client({
    region: REGION,
    credentials: fromCognitoIdentityPool({
      clientConfig: { region: REGION },
      identityPoolId: IDENTITY_POOL_ID,
    }),
  });
};

export const createS3Key = (file: File): string => {
  const ext = file.name.split(".").pop() ?? "jpg";
  return `uploads/${Date.now()}-${crypto.randomUUID()}.${ext}`;
};

/**
 * Convert File to Uint8Array
 * @param file File to convert
 * @returns Promise with Uint8Array data
 */
const fileToUint8Array = (file: File): Promise<Uint8Array> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result instanceof ArrayBuffer) {
        resolve(new Uint8Array(reader.result));
      } else {
        reject(new Error("Failed to read file"));
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsArrayBuffer(file);
  });
};

export type UploadedS3File = {
  key: string;
  url: string;
};

export const uploadFileToS3 = async (file: File): Promise<UploadedS3File> => {
  try {
    const s3Client = getS3Client();
    const key = createS3Key(file);
    const fileData = await fileToUint8Array(file);

    const params: PutObjectCommandInput = {
      Bucket: BUCKET_NAME,
      Key: key,
      Body: fileData,
      ContentType: file.type,
    };

    await s3Client.send(new PutObjectCommand(params));

    const url = `https://${BUCKET_NAME}.s3.${REGION}.amazonaws.com/${key}`;
    return { key, url };
  } catch (error) {
    console.error("Error uploading file to S3:", error);
    notificationMessage("Failed to upload file. Please try again.", "error");
    throw error;
  }
};

export const deleteFileFromS3 = async (key: string): Promise<boolean> => {
  try {
    const s3Client = getS3Client();

    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
      }),
    );
    return true;
  } catch (error) {
    console.error("Error deleting file from S3:", error);
    notificationMessage("Failed to delete file. Please try again.", "error");
    return false;
  }
};
