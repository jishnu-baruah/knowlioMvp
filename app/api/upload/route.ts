// app/api/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';

// Remove the old config export and use the new route segment config
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs'; // Use Node.js runtime for AWS SDK
export const maxDuration = 60; // Maximum execution time in seconds

// Initialize S3 client outside the handler for better performance
const s3Client = new S3Client({
    region: process.env.AWS_REGION!,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
});

// Validation constants
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes
const ALLOWED_FILE_TYPE = 'application/pdf';

export async function POST(request: NextRequest) {
    try {
        // Validate environment variables
        if (!process.env.AWS_S3_BUCKET || !process.env.AWS_REGION) {
            console.error('Missing required environment variables');
            return NextResponse.json(
                { error: 'Server configuration error' },
                { status: 500 }
            );
        }

        console.log('Upload request received');

        // Parse form data with error handling
        let formData: FormData;
        try {
            formData = await request.formData();
        } catch (error) {
            console.error('Error parsing form data:', error);
            return NextResponse.json(
                { error: 'Invalid form data' },
                { status: 400 }
            );
        }

        const file = formData.get('file') as File;

        // Validate file presence
        if (!file) {
            return NextResponse.json(
                { error: 'No file provided' },
                { status: 400 }
            );
        }

        // Validate file type
        if (!file.type || file.type !== ALLOWED_FILE_TYPE) {
            return NextResponse.json(
                { error: 'Invalid file type. Only PDFs are allowed.' },
                { status: 400 }
            );
        }

        // Validate file size
        if (file.size > MAX_FILE_SIZE) {
            return NextResponse.json(
                { error: `File size exceeds ${MAX_FILE_SIZE / (1024 * 1024)}MB limit.` },
                { status: 400 }
            );
        }

        // Generate unique filename with error handling
        const fileExtension = file.name.split('.').pop()?.toLowerCase();
        if (!fileExtension || fileExtension !== 'pdf') {
            return NextResponse.json(
                { error: 'Invalid file extension' },
                { status: 400 }
            );
        }

        const fileName = `${uuidv4()}.${fileExtension}`;

        // Convert File to Buffer with error handling
        let buffer: Buffer;
        try {
            buffer = Buffer.from(await file.arrayBuffer());
        } catch (error) {
            console.error('Error converting file to buffer:', error);
            return NextResponse.json(
                { error: 'Failed to process file' },
                { status: 500 }
            );
        }

        // Upload to S3
        try {
            const command = new PutObjectCommand({
                Bucket: process.env.AWS_S3_BUCKET,
                Key: `pdfs/${fileName}`,
                Body: buffer,
                ContentType: file.type,
            });

            await s3Client.send(command);
        } catch (error) {
            console.error('S3 upload error:', error);
            return NextResponse.json(
                { error: 'Failed to upload to storage' },
                { status: 500 }
            );
        }

        // Generate public URL
        const fileUrl = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/pdfs/${fileName}`;

        // Return success response with metadata
        return NextResponse.json({
            success: true,
            fileUrl,
            fileName,
            fileSize: file.size,
            contentType: file.type,
            uploadDate: new Date().toISOString(),
        });
    } catch (error) {
        console.error('Error uploading file:', error);
        return NextResponse.json(
            {
                error: 'Failed to upload file',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}