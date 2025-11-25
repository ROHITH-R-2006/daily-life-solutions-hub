import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { dashboardNotes } from '@/db/schema';
import { eq, like, desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    // Single note by ID
    if (id) {
      if (!id || isNaN(parseInt(id))) {
        return NextResponse.json(
          { error: 'Valid ID is required', code: 'INVALID_ID' },
          { status: 400 }
        );
      }

      const note = await db
        .select()
        .from(dashboardNotes)
        .where(eq(dashboardNotes.id, parseInt(id)))
        .limit(1);

      if (note.length === 0) {
        return NextResponse.json(
          { error: 'Note not found', code: 'NOTE_NOT_FOUND' },
          { status: 404 }
        );
      }

      return NextResponse.json(note[0], { status: 200 });
    }

    // List with pagination and search
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '10'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');
    const search = searchParams.get('search');

    let query = db.select().from(dashboardNotes).orderBy(desc(dashboardNotes.createdAt));

    if (search) {
      query = query.where(like(dashboardNotes.content, `%${search}%`));
    }

    const results = await query.limit(limit).offset(offset);

    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content, timestamp } = body;

    // Validate required fields
    if (!content || typeof content !== 'string' || content.trim() === '') {
      return NextResponse.json(
        { error: 'Content is required and cannot be empty', code: 'MISSING_CONTENT' },
        { status: 400 }
      );
    }

    // Prepare data with auto-generated fields
    const now = new Date().toISOString();
    const noteData = {
      content: content.trim(),
      timestamp: timestamp || now,
      createdAt: now,
    };

    const newNote = await db
      .insert(dashboardNotes)
      .values(noteData)
      .returning();

    return NextResponse.json(newNote[0], { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    // Validate ID
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    // Check if note exists
    const existingNote = await db
      .select()
      .from(dashboardNotes)
      .where(eq(dashboardNotes.id, parseInt(id)))
      .limit(1);

    if (existingNote.length === 0) {
      return NextResponse.json(
        { error: 'Note not found', code: 'NOTE_NOT_FOUND' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { content, timestamp } = body;

    // Validate if content is provided, it's not empty
    if (content !== undefined && (typeof content !== 'string' || content.trim() === '')) {
      return NextResponse.json(
        { error: 'Content cannot be empty', code: 'INVALID_CONTENT' },
        { status: 400 }
      );
    }

    // Prepare update data
    const updateData: any = {};
    
    if (content !== undefined) {
      updateData.content = content.trim();
    }
    
    if (timestamp !== undefined) {
      updateData.timestamp = timestamp;
    }

    // If no fields to update
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(existingNote[0], { status: 200 });
    }

    const updatedNote = await db
      .update(dashboardNotes)
      .set(updateData)
      .where(eq(dashboardNotes.id, parseInt(id)))
      .returning();

    return NextResponse.json(updatedNote[0], { status: 200 });
  } catch (error) {
    console.error('PATCH error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    // Validate ID
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    // Check if note exists
    const existingNote = await db
      .select()
      .from(dashboardNotes)
      .where(eq(dashboardNotes.id, parseInt(id)))
      .limit(1);

    if (existingNote.length === 0) {
      return NextResponse.json(
        { error: 'Note not found', code: 'NOTE_NOT_FOUND' },
        { status: 404 }
      );
    }

    const deleted = await db
      .delete(dashboardNotes)
      .where(eq(dashboardNotes.id, parseInt(id)))
      .returning();

    return NextResponse.json(
      {
        message: 'Note deleted successfully',
        note: deleted[0],
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}