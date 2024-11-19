// components/pdf/PdfUploader.tsx
'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { PdfDocument } from '@/types/pdf';

const formSchema = z.object({
  displayName: z.string().min(3, 'Name must be at least 3 characters'),
  type: z.enum(['book', 'notes', 'pyq']),
  subject: z.string().min(2, 'Subject is required'),
  course: z.string().min(2, 'Course is required'),
  author: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  semester: z.number().min(1).max(8).optional().nullable(),
  year: z.number().min(1900).max(2100).optional().nullable(),
  university: z.string().optional().nullable(),
  tags: z.array(z.string()).default([])
});

type FormValues = z.infer<typeof formSchema>;

export default function PdfUploader() {
  const [uploading, setUploading] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors }
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: 'book',
      tags: [],
      author: '',
      description: '',
      university: '',
      semester: null,
      year: null
    }
  });

  const onSubmit = async (formData: FormValues) => {
    const fileInput = document.querySelector<HTMLInputElement>('input[type="file"]');
    const file = fileInput?.files?.[0];

    if (!file) {
      setError('Please select a PDF file');
      return;
    }

    setError(null);
    setUploading(true);

    try {
      const uploadData = new FormData();
      uploadData.append('file', file);

      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: uploadData
      });

      if (!uploadRes.ok) {
        throw new Error('Upload failed: ' + (await uploadRes.text()));
      }

      const { fileUrl, fileSize } = await uploadRes.json();

      const pdfData = {
        ...formData,
        name: file.name,
        fileUrl,
        fileSize,
        status: 'processing' as const,
        uploadedBy: 'user', // Replace with actual user ID when auth is implemented
        uploadDate: new Date().toISOString()
      };

      const createRes = await fetch('/api/pdfs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pdfData)
      });

      if (!createRes.ok) {
        throw new Error('Failed to create document: ' + (await createRes.text()));
      }

      // Reset form state
      reset();
      setTags([]);
      if (fileInput) fileInput.value = '';

      // Show success message (you can add a toast notification here)
      console.log('Document uploaded successfully');

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during upload');
      console.error('Upload failed:', err);
    } finally {
      setUploading(false);
    }
  };

  // Rest of your JSX remains the same, but add error displays:
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold mb-6">Upload Document</h3>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Display Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Display Name
            </label>
            <input
              {...register('displayName')}
              className={`w-full p-2 border rounded-md ${errors.displayName ? 'border-red-500' : ''
                }`}
              disabled={uploading}
            />
            {errors.displayName && (
              <p className="mt-1 text-sm text-red-600">
                {errors.displayName.message}
              </p>
            )}
          </div>

          {/* Document Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Document Type
            </label>
            <select
              {...register('type')}
              className={`w-full p-2 border rounded-md ${errors.type ? 'border-red-500' : ''
                }`}
              disabled={uploading}
            >
              <option value="book">Book</option>
              <option value="notes">Notes</option>
              <option value="pyq">Previous Year Questions</option>
            </select>
            {errors.type && (
              <p className="mt-1 text-sm text-red-600">
                {errors.type.message}
              </p>
            )}
          </div>

          {/* Subject */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subject
            </label>
            <input
              {...register('subject')}
              className={`w-full p-2 border rounded-md ${errors.subject ? 'border-red-500' : ''
                }`}
              disabled={uploading}
            />
            {errors.subject && (
              <p className="mt-1 text-sm text-red-600">
                {errors.subject.message}
              </p>
            )}
          </div>

          {/* Course */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Course
            </label>
            <input
              {...register('course')}
              className={`w-full p-2 border rounded-md ${errors.course ? 'border-red-500' : ''
                }`}
              disabled={uploading}
            />
            {errors.course && (
              <p className="mt-1 text-sm text-red-600">
                {errors.course.message}
              </p>
            )}
          </div>

          {/* Author */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Author
            </label>
            <input
              {...register('author')}
              className={`w-full p-2 border rounded-md ${errors.author ? 'border-red-500' : ''
                }`}
              disabled={uploading}
            />
            {errors.author && (
              <p className="mt-1 text-sm text-red-600">
                {errors.author.message}
              </p>
            )}
          </div>

          {/* University */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              University
            </label>
            <input
              {...register('university')}
              className={`w-full p-2 border rounded-md ${errors.university ? 'border-red-500' : ''
                }`}
              disabled={uploading}
            />
            {errors.university && (
              <p className="mt-1 text-sm text-red-600">
                {errors.university.message}
              </p>
            )}
          </div>

          {/* Semester */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Semester
            </label>
            <input
              type="number"
              {...register('semester', { valueAsNumber: true })}
              className={`w-full p-2 border rounded-md ${errors.semester ? 'border-red-500' : ''
                }`}
              disabled={uploading}
              min="1"
              max="8"
            />
            {errors.semester && (
              <p className="mt-1 text-sm text-red-600">
                {errors.semester.message}
              </p>
            )}
          </div>

          {/* Year */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Year
            </label>
            <input
              type="number"
              {...register('year', { valueAsNumber: true })}
              className={`w-full p-2 border rounded-md ${errors.year ? 'border-red-500' : ''
                }`}
              disabled={uploading}
            />
            {errors.year && (
              <p className="mt-1 text-sm text-red-600">
                {errors.year.message}
              </p>
            )}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            {...register('description')}
            className={`w-full p-2 border rounded-md ${errors.description ? 'border-red-500' : ''
              }`}
            disabled={uploading}
            rows={3}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">
              {errors.description.message}
            </p>
          )}
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tags (comma separated)
          </label>
          <input
            type="text"
            className={`w-full p-2 border rounded-md ${errors.tags ? 'border-red-500' : ''
              }`}
            disabled={uploading}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ',') {
                e.preventDefault();
                const value = e.currentTarget.value.trim();
                if (value && !tags.includes(value)) {
                  const newTags = [...tags, value];
                  setTags(newTags);
                  setValue('tags', newTags);
                  e.currentTarget.value = '';
                }
              }
            }}
          />
          <div className="mt-2 flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded-full flex items-center"
              >
                {tag}
                <button
                  type="button"
                  className="ml-1 text-blue-600 hover:text-blue-800"
                  onClick={() => {
                    const newTags = tags.filter((_, i) => i !== index);
                    setTags(newTags);
                    setValue('tags', newTags);
                  }}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          {errors.tags && (
            <p className="mt-1 text-sm text-red-600">
              {errors.tags.message}
            </p>
          )}
        </div>

        {/* File Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select PDF
          </label>
          <input
            type="file"
            accept=".pdf"
            disabled={uploading}
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 
                     file:rounded-full file:border-0 file:text-sm file:font-semibold
                     file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100
                     cursor-pointer disabled:opacity-50"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={uploading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700
                   disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploading ? 'Uploading...' : 'Upload Document'}
        </button>
      </form>
    </div>
  );
}