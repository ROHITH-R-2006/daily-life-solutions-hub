import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { bookmarks } from '@/db/schema';
import { eq, like, and, desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    // Single bookmark by ID
    if (id) {
      if (!id || isNaN(parseInt(id))) {
        return NextResponse.json(
          { error: 'Valid ID is required', code: 'INVALID_ID' },
          { status: 400 }
        );
      }

      const bookmark = await db
        .select()
        .from(bookmarks)
        .where(eq(bookmarks.id, parseInt(id)))
        .limit(1);

      if (bookmark.length === 0) {
        return NextResponse.json(
          { error: 'Bookmark not found', code: 'NOT_FOUND' },
          { status: 404 }
        );
      }

      return NextResponse.json(bookmark[0], { status: 200 });
    }

    // List bookmarks with pagination, search, and filtering
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '10'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');
    const search = searchParams.get('search');
    const category = searchParams.get('category');

    let query = db.select().from(bookmarks);

    // Build where conditions
    const conditions = [];
    
    if (search) {
      conditions.push(like(bookmarks.title, `%${search}%`));
    }
    
    if (category) {
      conditions.push(eq(bookmarks.category, category));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    const results = await query
      .orderBy(desc(bookmarks.createdAt))
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
    const { title, url, category } = body;

    // Validate required fields
    if (!title || typeof title !== 'string' || title.trim() === '') {
      return NextResponse.json(
        { error: 'Title is required and must be a non-empty string', code: 'INVALID_TITLE' },
        { status: 400 }
      );
    }

    if (!url || typeof url !== 'string' || url.trim() === '') {
      return NextResponse.json(
        { error: 'URL is required and must be a non-empty string', code: 'INVALID_URL' },
        { status: 400 }
      );
    }

    if (!category || typeof category !== 'string' || category.trim() === '') {
      return NextResponse.json(
        { error: 'Category is required and must be a non-empty string', code: 'INVALID_CATEGORY' },
        { status: 400 }
      );
    }

    // Sanitize inputs
    const sanitizedTitle = title.trim();
    const sanitizedUrl = url.trim();
    const sanitizedCategory = category.trim();

    // Create bookmark
    const newBookmark = await db
      .insert(bookmarks)
      .values({
        title: sanitizedTitle,
        url: sanitizedUrl,
        category: sanitizedCategory,
        createdAt: new Date().toISOString(),
      })
      .returning();

    return NextResponse.json(newBookmark[0], { status: 201 });
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

    // Check if bookmark exists
    const existing = await db
      .select()
      .from(bookmarks)
      .where(eq(bookmarks.id, parseInt(id)))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json(
        { error: 'Bookmark not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { title, url, category } = body;

    // Build update object with only provided fields
    const updates: {
      title?: string;
      url?: string;
      category?: string;
    } = {};

    // Validate and sanitize provided fields
    if (title !== undefined) {
      if (typeof title !== 'string' || title.trim() === '') {
        return NextResponse.json(
          { error: 'Title must be a non-empty string', code: 'INVALID_TITLE' },
          { status: 400 }
        );
      }
      updates.title = title.trim();
    }

    if (url !== undefined) {
      if (typeof url !== 'string' || url.trim() === '') {
        return NextResponse.json(
          { error: 'URL must be a non-empty string', code: 'INVALID_URL' },
          { status: 400 }
        );
      }
      updates.url = url.trim();
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

    // Check if there are any updates
    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: 'No valid fields to update', code: 'NO_UPDATES' },
        { status: 400 }
      );
    }

    // Update bookmark
    const updated = await db
      .update(bookmarks)
      .set(updates)
      .where(eq(bookmarks.id, parseInt(id)))
      .returning();

    return NextResponse.json(updated[0], { status: 200 });
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

    // Check if bookmark exists
    const existing = await db
      .select()
      .from(bookmarks)
      .where(eq(bookmarks.id, parseInt(id)))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json(
        { error: 'Bookmark not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    // Delete bookmark
    const deleted = await db
      .delete(bookmarks)
      .where(eq(bookmarks.id, parseInt(id)))
      .returning();

    return NextResponse.json(
      {
        message: 'Bookmark deleted successfully',
        bookmark: deleted[0],
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