// lib/db/models/pdf.ts
import mongoose from 'mongoose';

// Declare the interface
interface IPdf {
    name: string;
    displayName: string;
    type: 'book' | 'notes' | 'pyq';
    subject: string;
    course: string;
    author?: string;
    description?: string;
    semester?: number;
    year?: number;
    university?: string;
    uploadDate: Date;
    uploadedBy: string;
    fileUrl: string;
    fileSize: number;
    status: 'processing' | 'active' | 'error';
    tags: string[];
}

// Create the schema
const pdfSchema = new mongoose.Schema<IPdf>({
    name: { type: String, required: true },
    displayName: { type: String, required: true },
    type: {
        type: String,
        required: true,
        enum: ['book', 'notes', 'pyq']
    },
    subject: { type: String, required: true },
    course: { type: String, required: true },
    author: String,
    description: String,
    semester: {
        type: Number,
        min: 1,
        max: 8
    },
    year: Number,
    university: String,
    uploadDate: {
        type: Date,
        default: Date.now
    },
    uploadedBy: {
        type: String,
        required: true
    },
    fileUrl: {
        type: String,
        required: true
    },
    fileSize: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['processing', 'active', 'error'],
        default: 'processing'
    },
    tags: [String]
}, {
    timestamps: true
});

// Add indexes for better query performance
pdfSchema.index({ subject: 1 });
pdfSchema.index({ course: 1 });
pdfSchema.index({ type: 1 });
pdfSchema.index({ uploadDate: -1 });
pdfSchema.index({
    displayName: 'text',
    description: 'text',
    subject: 'text',
    course: 'text'
});

// Export the model
export const PdfModel = mongoose.models.Pdf || mongoose.model<IPdf>('Pdf', pdfSchema);