'use client';

import { useEffect, useState } from 'react';
import { Search, Filter, Download, Calendar, Book, FileText, Clock, Eye, SortAsc, SortDesc, X, Loader2 } from 'lucide-react';
import type { PdfDocument } from '@/types/pdf';

interface FilterState {
  type: string;
  subject: string;
  course: string;
  semester: string;
  university: string;
  search: string;
}

interface SortConfig {
  field: keyof PdfDocument;
  direction: 'asc' | 'desc';
}

const SORT_FIELDS: Array<{ field: keyof PdfDocument; label: string }> = [
  { field: 'uploadDate', label: 'Upload Date' },
  { field: 'displayName', label: 'Name' },
  { field: 'subject', label: 'Subject' },
  { field: 'fileSize', label: 'Size' },
];

export default function PdfList() {
  const [pdfs, setPdfs] = useState<PdfDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedPdf, setSelectedPdf] = useState<PdfDocument | null>(null);
  const [showViewer, setShowViewer] = useState(false);

  const [filters, setFilters] = useState<FilterState>({
    type: 'all',
    subject: '',
    course: '',
    semester: '',
    university: '',
    search: ''
  });

  const [sortConfig, setSortConfig] = useState<SortConfig>({
    field: 'uploadDate',
    direction: 'desc'
  });

  const handleSort = (field: keyof PdfDocument) => {
    setSortConfig(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleFilterReset = () => {
    setFilters({
      type: 'all',
      subject: '',
      course: '',
      semester: '',
      university: '',
      search: ''
    });
  };

  useEffect(() => {
    const fetchPdfs = async () => {
      try {
        setLoading(true);
        setError(null);

        const queryParams = new URLSearchParams();
        if (filters.type !== 'all') queryParams.append('type', filters.type);
        if (filters.subject) queryParams.append('subject', filters.subject);
        if (filters.course) queryParams.append('course', filters.course);
        if (filters.semester) queryParams.append('semester', filters.semester);
        if (filters.university) queryParams.append('university', filters.university);
        if (filters.search) queryParams.append('search', filters.search);
        queryParams.append('sortField', sortConfig.field);
        queryParams.append('sortDirection', sortConfig.direction);

        const response = await fetch(`/api/pdfs?${queryParams}`);
        if (!response.ok) throw new Error('Failed to fetch documents');

        const data = await response.json();
        setPdfs(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching PDFs:', err);
      } finally {
        setLoading(false);
      }
    };

    // Debounce the fetch when searching
    const timeoutId = setTimeout(fetchPdfs, filters.search ? 300 : 0);
    return () => clearTimeout(timeoutId);
  }, [filters, sortConfig]);

  const getTypeIcon = (type: PdfDocument['type']) => {
    switch (type) {
      case 'book':
        return <Book className="w-4 h-4" />;
      case 'notes':
        return <FileText className="w-4 h-4" />;
      case 'pyq':
        return <Clock className="w-4 h-4" />;
      default:
        return null;
    }
  };


  const handleView = (pdf: PdfDocument) => {
    setSelectedPdf(pdf);
    setShowViewer(true);
  };

  const handleDownload = async (pdf: PdfDocument) => {
    try {
      window.open(pdf.fileUrl, '_blank');
    } catch (error) {
      console.error('Download failed:', error);
    }
  };
  return (
    <>
      <div className="bg-white rounded-lg shadow-md">
        {/* Header and Search */}
        <div className="p-6 border-b">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <h3 className="text-xl font-semibold">Document Library</h3>
            <div className="flex items-center gap-2">
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search documents..."
                  value={filters.search}
                  onChange={(e) => setFilters(f => ({ ...f, search: e.target.value }))}
                  className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-gray-50"
              >
                <Filter className="w-4 h-4" />
                <span className="hidden md:inline">Filters</span>
              </button>
            </div>
          </div>

          {/* Sort Controls */}
          <div className="flex flex-wrap gap-2 mb-4">
            {SORT_FIELDS.map(({ field, label }) => (
              <button
                key={field}
                onClick={() => handleSort(field)}
                className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium 
                          ${sortConfig.field === field
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                {label}
                {sortConfig.field === field && (
                  sortConfig.direction === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />
                )}
              </button>
            ))}
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                <select
                  value={filters.type}
                  onChange={(e) => setFilters(f => ({ ...f, type: e.target.value }))}
                  className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Types</option>
                  <option value="book">Books</option>
                  <option value="notes">Notes</option>
                  <option value="pyq">PYQs</option>
                </select>

                <input
                  type="text"
                  placeholder="Filter by subject"
                  value={filters.subject}
                  onChange={(e) => setFilters(f => ({ ...f, subject: e.target.value }))}
                  className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <input
                  type="text"
                  placeholder="Filter by course"
                  value={filters.course}
                  onChange={(e) => setFilters(f => ({ ...f, course: e.target.value }))}
                  className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <select
                  value={filters.semester}
                  onChange={(e) => setFilters(f => ({ ...f, semester: e.target.value }))}
                  className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Semesters</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                    <option key={sem} value={sem.toString()}>Semester {sem}</option>
                  ))}
                </select>

                <input
                  type="text"
                  placeholder="Filter by university"
                  value={filters.university}
                  onChange={(e) => setFilters(f => ({ ...f, university: e.target.value }))}
                  className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleFilterReset}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 
                           hover:text-gray-900"
                >
                  <X className="w-4 h-4" />
                  Reset Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Active Filters Display */}
        {Object.entries(filters).some(([key, value]) => key !== 'search' && value && value !== 'all') && (
          <div className="px-6 py-2 bg-gray-50 border-b flex flex-wrap gap-2">
            {Object.entries(filters).map(([key, value]) => {
              if (!value || (key === 'type' && value === 'all') || key === 'search') return null;
              return (
                <span
                  key={key}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs
                           bg-blue-100 text-blue-800"
                >
                  {key}: {value}
                  <button
                    onClick={() => setFilters(f => ({ ...f, [key]: key === 'type' ? 'all' : '' }))}
                    className="hover:text-blue-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              );
            })}
          </div>
        )}

        {/* Content */}
        <div className="divide-y divide-gray-200">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
          ) : error ? (
            <div className="text-red-500 text-center py-8">{error}</div>
          ) : pdfs.length === 0 ? (
            <div className="text-gray-500 text-center py-12">
              <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p>No documents found</p>
            </div>
          ) : (
            pdfs.map((pdf) => (
              <div key={pdf.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {getTypeIcon(pdf.type)}
                      <h4 className="font-medium text-gray-900">{pdf.displayName}</h4>
                    </div>

                    <div className="text-sm text-gray-500 space-y-1">
                      <p>{pdf.subject} • {pdf.course}
                        {pdf.semester && ` • Semester ${pdf.semester}`}
                      </p>
                      {pdf.description && (
                        <p className="text-gray-600">{pdf.description}</p>
                      )}
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(pdf.uploadDate).toLocaleDateString()}
                        </span>
                        {pdf.fileSize && (
                          <span>
                            {(pdf.fileSize / (1024 * 1024)).toFixed(1)} MB
                          </span>
                        )}
                      </div>
                    </div>

                    {pdf.tags && pdf.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {pdf.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="bg-blue-50 text-blue-600 text-xs px-2 py-1 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleView(pdf)}
                      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-green-600 
                               bg-green-50 rounded-full hover:bg-green-100 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      <span>View</span>
                    </button>
                    <button
                      onClick={() => handleDownload(pdf)}
                      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 
                               bg-blue-50 rounded-full hover:bg-blue-100 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* PDF Viewer Modal */}
      {showViewer && selectedPdf && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white w-full h-full md:w-4/5 md:h-5/6 rounded-lg flex flex-col">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-medium">{selectedPdf.displayName}</h3>
              <button
                onClick={() => {
                  setShowViewer(false);
                  setSelectedPdf(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="flex-1 bg-gray-100 p-4">
              <iframe
                src={`${selectedPdf.fileUrl}#toolbar=0`}
                className="w-full h-full rounded border bg-white"
                title={selectedPdf.displayName}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}