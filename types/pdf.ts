export interface PdfDocument {
    id: string;
    name: string;
    displayName: string;
    fileUrl: string;
    fileSize: number;
    type: 'book' | 'notes' | 'pyq';
    subject: string;
    course: string;
    author?: string;
    description?: string;
    semester?: number;
    year?: number;
    university?: string;
    tags: string[];
    status: 'processing' | 'ready' | 'error';
    uploadedBy: string;
    uploadDate: string;
}