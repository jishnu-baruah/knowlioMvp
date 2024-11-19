// types/index.ts
export interface PdfDocument {
    id: number;
    name: string;
    type: 'book' | 'notes' | 'pyq';
    uploadDate: string;
  }
  
  export interface UploadResponse {
    success: boolean;
    message: string;
    document?: PdfDocument;
  }
  
  export interface PdfListProps {
    filter?: string;
  }
  
  export interface PdfUploaderProps {
    onUploadSuccess?: (document: PdfDocument) => void;
  }