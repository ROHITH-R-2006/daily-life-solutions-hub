import { NextResponse } from 'next/server';
import { db } from '@/db';
import { toolNotes } from '@/db/schema';
import { eq, like, or, desc } from 'drizzle-orm';

export async function GET(request) {
  try {
    const searchParams = new URL(request.url).searchParams;
    const id = searchParams.get('id');

    // Single record fetch
    if (id) {
      if (!id || isNaN(parseInt(id))) {
        return NextResponse.json(
          { error: 'Valid ID is required', code: 'INVALID_ID' },
          { status: 400 }
        );
      }

      const note = await db
        .select()
        .from(toolNotes)
        .where(eq(toolNotes.id, parseInt(id)))
        .limit(1);

      if (note.length === 0) {
        return NextResponse.json(
          { error: 'Note not found', code: 'NOT_FOUND' },
          { status: 404 }
        );
      }

      return NextResponse.json(note[0], { status: 200 });
    }

    // List with pagination and search
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '10'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');
    const search = searchParams.get('search');

    let query = db.select().from(toolNotes).orderBy(desc(toolNotes.createdAt));

    if (search) {
      query = query.where(
        or(
          like(toolNotes.title, `%${search}%`),
          like(toolNotes.content, `%${search}%`)
        )
      );
    }

    const results = await query.limit(limit).offset(offset);

    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { title, content, timestamp } = body;

    // Validate required fields
    if (!title || typeof title !== 'string' || title.trim() === '') {
      return NextResponse.json(
        { error: 'Title is required and cannot be empty', code: 'MISSING_TITLE' },
        { status: 400 }
      );
    }

    if (!content || typeof content !== 'string' || content.trim() === '') {
      return NextResponse.json(
        { error: 'Content is required and cannot be empty', code: 'MISSING_CONTENT' },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();

    const newNote = await db
      .insert(toolNotes)
      .values({
        title: title.trim(),
        content: content.trim(),
        timestamp: timestamp || now,
        createdAt: now,
      })
      .returning();

    return NextResponse.json(newNote[0], { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    );
  }
}

export async function PATCH(request) {
  try {
    const searchParams = new URL(request.url).searchParams;
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    // Check if note exists
    const existingNote = await db
      .select()
      .from(toolNotes)
      .where(eq(toolNotes.id, parseInt(id)))
      .limit(1);

    if (existingNote.length === 0) {
      return NextResponse.json(
        { error: 'Note not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { title, content, timestamp } = body;

    // Validate fields if provided
    if (title !== undefined && (typeof title !== 'string' || title.trim() === '')) {
      return NextResponse.json(
        { error: 'Title cannot be empty', code: 'INVALID_TITLE' },
        { status: 400 }
      );
    }

    if (content !== undefined && (typeof content !== 'string' || content.trim() === '')) {
      return NextResponse.json(
        { error: 'Content cannot be empty', code: 'INVALID_CONTENT' },
        { status: 400 }
      );
    }

    // Build update object with only provided fields
    const updates = {};
    if (title !== undefined) updates.title = title.trim();
    if (content !== undefined) updates.content = content.trim();
    if (timestamp !== undefined) updates.timestamp = timestamp;

    // If no fields to update
    if (Object.keys(updates).length === 0) {
      return NextResponse.json(existingNote[0], { status: 200 });
    }

    const updatedNote = await db
      .update(toolNotes)
      .set(updates)
      .where(eq(toolNotes.id, parseInt(id)))
      .returning();

    return NextResponse.json(updatedNote[0], { status: 200 });
  } catch (error) {
    console.error('PATCH error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const searchParams = new URL(request.url).searchParams;
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    // Check if note exists
    const existingNote = await db
      .select()
      .from(toolNotes)
      .where(eq(toolNotes.id, parseInt(id)))
      .limit(1);

    if (existingNote.length === 0) {
      return NextResponse.json(
        { error: 'Note not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    const deleted = await db
      .delete(toolNotes)
      .where(eq(toolNotes.id, parseInt(id)))
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
      { error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    );
  }
}
