// app/api/pdfs/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { PdfModel } from '@/lib/db/models/pdf';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const type = searchParams.get('type');
        const subject = searchParams.get('subject');
        const course = searchParams.get('course');
        const semester = searchParams.get('semester');
        const university = searchParams.get('university');
        const search = searchParams.get('search');
        const sortField = searchParams.get('sortField') || 'uploadDate';
        const sortDirection = searchParams.get('sortDirection') || 'desc';

        // Build query
        const query: any = {};
        if (type && type !== 'all') query.type = type;
        if (subject) query.subject = new RegExp(subject, 'i');
        if (course) query.course = new RegExp(course, 'i');
        if (semester) query.semester = parseInt(semester);
        if (university) query.university = new RegExp(university, 'i');
        if (search) {
            query.$or = [
                { displayName: new RegExp(search, 'i') },
                { description: new RegExp(search, 'i') },
                { subject: new RegExp(search, 'i') },
                { course: new RegExp(search, 'i') },
            ];
        }

        await connectToDatabase();

        const pdfs = await PdfModel
            .find(query)
            .sort({ [sortField]: sortDirection === 'desc' ? -1 : 1 })
            .limit(50); // Add pagination later

        return NextResponse.json(pdfs);
    } catch (error) {
        console.error('Error fetching PDFs:', error);
        return NextResponse.json(
            { error: 'Failed to fetch PDFs' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const data = await request.json();

        await connectToDatabase();

        const pdf = await PdfModel.create({
            ...data,
            uploadDate: new Date(),
            status: 'active'
        });

        return NextResponse.json(pdf, { status: 201 });
    } catch (error) {
        console.error('Error creating PDF:', error);
        return NextResponse.json(
            { error: 'Failed to create PDF' },
            { status: 500 }
        );
    }
}
