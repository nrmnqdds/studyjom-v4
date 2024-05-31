import { S3Client } from "@aws-sdk/client-s3";

export const r2Client = new S3Client({
	region: "auto",
	endpoint: process.env.NEXT_PUBLIC_R2_URL,
	credentials: {
		accessKeyId: process.env.NEXT_PUBLIC_R2_ACCESS_KEY_ID,
		secretAccessKey: process.env.NEXT_PUBLIC_R2_SECRET_ACCESS_KEY,
	},
});
