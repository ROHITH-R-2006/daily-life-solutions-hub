import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { toolFiles } from '@/db/schema';
import { eq, like, and, desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Single file fetch
    if (id) {
      if (!id || isNaN(parseInt(id))) {
        return NextResponse.json(
          { error: 'Valid ID is required', code: 'INVALID_ID' },
          { status: 400 }
        );
      }

      const file = await db
        .select()
        .from(toolFiles)
        .where(eq(toolFiles.id, parseInt(id)))
        .limit(1);

      if (file.length === 0) {
        return NextResponse.json(
          { error: 'File not found', code: 'FILE_NOT_FOUND' },
          { status: 404 }
        );
      }

      return NextResponse.json(file[0], { status: 200 });
    }

    // List with pagination, search, and filtering
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '10'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');
    const search = searchParams.get('search');
    const category = searchParams.get('category');

    let query = db.select().from(toolFiles);

    // Build where conditions
    const conditions = [];

    if (search) {
      conditions.push(like(toolFiles.name, `%${search}%`));
    }

    if (category) {
      conditions.push(eq(toolFiles.category, category));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    const results = await query
      .orderBy(desc(toolFiles.createdAt))
      .limit(limit)
      .offset(offset);

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
    const { name, category, size, timestamp } = body;

    // Validate required fields
    if (!name || typeof name !== 'string' || name.trim() === '') {
      return NextResponse.json(
        { error: 'Name is required and must be a non-empty string', code: 'MISSING_NAME' },
        { status: 400 }
      );
    }

    if (!category || typeof category !== 'string' || category.trim() === '') {
      return NextResponse.json(
        { error: 'Category is required and must be a non-empty string', code: 'MISSING_CATEGORY' },
        { status: 400 }
      );
    }

    if (!size || typeof size !== 'string' || size.trim() === '') {
      return NextResponse.json(
        { error: 'Size is required and must be a non-empty string', code: 'MISSING_SIZE' },
        { status: 400 }
      );
    }

    // Prepare insert data
    const currentTimestamp = new Date().toISOString();
    const insertData = {
      name: name.trim(),
      category: category.trim(),
      size: size.trim(),
      timestamp: timestamp || currentTimestamp,
      createdAt: currentTimestamp,
    };

    const newFile = await db.insert(toolFiles).values(insertData).returning();

    return NextResponse.json(newFile[0], { status: 201 });
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
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    // Check if file exists
    const existingFile = await db
      .select()
      .from(toolFiles)
      .where(eq(toolFiles.id, parseInt(id)))
      .limit(1);

    if (existingFile.length === 0) {
      return NextResponse.json(
        { error: 'File not found', code: 'FILE_NOT_FOUND' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { name, category, size, timestamp } = body;

    // Build update object with only provided fields
    const updates: Record<string, string> = {};

    if (name !== undefined) {
      if (typeof name !== 'string' || name.trim() === '') {
        return NextResponse.json(
          { error: 'Name must be a non-empty string', code: 'INVALID_NAME' },
          { status: 400 }
        );
      }
      updates.name = name.trim();
    }

    if (category !== undefined) {
      if (typeof category !== 'string' || category.trim() === '') {
        return NextResponse.json(
          { error: 'Category must be a non-empty string', code: 'INVALID_CATEGORY' },
          { status: 400 }
        );
      }
      updates.category = category.trim();
    }

    if (size !== undefined) {
      if (typeof size !== 'string' || size.trim() === '') {
        return NextResponse.json(
          { error: 'Size must be a non-empty string', code: 'INVALID_SIZE' },
          { status: 400 }
        );
      }
      updates.size = size.trim();
    }

    if (timestamp !== undefined) {
      if (typeof timestamp !== 'string' || timestamp.trim() === '') {
        return NextResponse.json(
          { error: 'Timestamp must be a non-empty string', code: 'INVALID_TIMESTAMP' },
          { status: 400 }
        );
      }
      updates.timestamp = timestamp.trim();
    }

    // Check if there are any updates to perform
    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: 'No valid fields to update', code: 'NO_UPDATES' },
        { status: 400 }
      );
    }

    const updatedFile = await db
      .update(toolFiles)
      .set(updates)
      .where(eq(toolFiles.id, parseInt(id)))
      .returning();

    return NextResponse.json(updatedFile[0], { status: 200 });
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
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    // Check if file exists
    const existingFile = await db
      .select()
      .from(toolFiles)
      .where(eq(toolFiles.id, parseInt(id)))
      .limit(1);

    if (existingFile.length === 0) {
      return NextResponse.json(
        { error: 'File not found', code: 'FILE_NOT_FOUND' },
        { status: 404 }
      );
    }

    const deleted = await db
      .delete(toolFiles)
      .where(eq(toolFiles.id, parseInt(id)))
      .returning();

    return NextResponse.json(
      {
        message: 'File deleted successfully',
        file: deleted[0],
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