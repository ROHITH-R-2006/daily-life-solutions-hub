import { NextResponse } from 'next/server';
import { db } from '@/db';
import { contactSubmissions } from '@/db/schema';
import { like, or, desc } from 'drizzle-orm';

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    // Validate required fields
    if (!name || typeof name !== 'string' || name.trim() === '') {
      return NextResponse.json({
        error: 'Name is required and must be a non-empty string',
        code: 'MISSING_NAME'
      }, { status: 400 });
    }

    if (!email || typeof email !== 'string' || email.trim() === '') {
      return NextResponse.json({
        error: 'Email is required and must be a non-empty string',
        code: 'MISSING_EMAIL'
      }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return NextResponse.json({
        error: 'Invalid email format',
        code: 'INVALID_EMAIL'
      }, { status: 400 });
    }

    if (!subject || typeof subject !== 'string' || subject.trim() === '') {
      return NextResponse.json({
        error: 'Subject is required and must be a non-empty string',
        code: 'MISSING_SUBJECT'
      }, { status: 400 });
    }

    if (!message || typeof message !== 'string' || message.trim() === '') {
      return NextResponse.json({
        error: 'Message is required and must be a non-empty string',
        code: 'MISSING_MESSAGE'
      }, { status: 400 });
    }

    // Create contact submission
    const newSubmission = await db.insert(contactSubmissions)
      .values({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        subject: subject.trim(),
        message: message.trim(),
        createdAt: new Date().toISOString()
      })
      .returning();

    return NextResponse.json(newSubmission[0], { status: 201 });

  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({
      error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
    }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const searchParams = new URL(request.url).searchParams;
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '10'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');
    const search = searchParams.get('search');

    let query = db.select().from(contactSubmissions).orderBy(desc(contactSubmissions.createdAt));

    // Apply search filter if provided
    if (search && search.trim() !== '') {
      const searchTerm = `%${search.trim()}%`;
      query = query.where(
        or(
          like(contactSubmissions.name, searchTerm),
          like(contactSubmissions.email, searchTerm),
          like(contactSubmissions.subject, searchTerm)
        )
      );
    }

    // Apply pagination
    const results = await query.limit(limit).offset(offset);

    return NextResponse.json(results, { status: 200 });

  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({
      error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
    }, { status: 500 });
  }
}
