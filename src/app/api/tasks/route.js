import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { tasks } from '@/db/schema';
import { eq, like, and, desc } from 'drizzle-orm';

const VALID_PRIORITIES = ['high', 'medium', 'low'];

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Single task by ID
    if (id) {
      if (!id || isNaN(parseInt(id))) {
        return NextResponse.json(
          { error: 'Valid ID is required', code: 'INVALID_ID' },
          { status: 400 }
        );
      }

      const task = await db
        .select()
        .from(tasks)
        .where(eq(tasks.id, parseInt(id)))
        .limit(1);

      if (task.length === 0) {
        return NextResponse.json(
          { error: 'Task not found', code: 'TASK_NOT_FOUND' },
          { status: 404 }
        );
      }

      return NextResponse.json(task[0], { status: 200 });
    }

    // List tasks with pagination, search, and filtering
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '10'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');
    const search = searchParams.get('search');
    const completedParam = searchParams.get('completed');
    const priority = searchParams.get('priority');

    let query = db.select().from(tasks);

    const conditions = [];

    // Search filter
    if (search) {
      conditions.push(like(tasks.text, `%${search}%`));
    }

    // Completed filter
    if (completedParam !== null) {
      const completedValue = completedParam === 'true';
      conditions.push(eq(tasks.completed, completedValue));
    }

    // Priority filter
    if (priority) {
      if (!VALID_PRIORITIES.includes(priority)) {
        return NextResponse.json(
          { 
            error: `Invalid priority. Must be one of: ${VALID_PRIORITIES.join(', ')}`,
            code: 'INVALID_PRIORITY'
          },
          { status: 400 }
        );
      }
      conditions.push(eq(tasks.priority, priority));
    }

    // Apply all conditions
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    const results = await query
      .orderBy(desc(tasks.createdAt))
      .limit(limit)
      .offset(offset);

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
    const { text, completed, priority } = body;

    // Validate required fields
    if (!text || typeof text !== 'string' || text.trim() === '') {
      return NextResponse.json(
        { error: 'Text is required and cannot be empty', code: 'MISSING_TEXT' },
        { status: 400 }
      );
    }

    // Validate priority if provided
    if (priority && !VALID_PRIORITIES.includes(priority)) {
      return NextResponse.json(
        { 
          error: `Invalid priority. Must be one of: ${VALID_PRIORITIES.join(', ')}`,
          code: 'INVALID_PRIORITY'
        },
        { status: 400 }
      );
    }

    // Prepare insert data with defaults
    const insertData = {
      text: text.trim(),
      completed: completed !== undefined ? Boolean(completed) : false,
      priority: priority || 'medium',
      createdAt: new Date().toISOString(),
    };

    const newTask = await db.insert(tasks).values(insertData).returning();

    return NextResponse.json(newTask[0], { status: 201 });
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
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Validate ID
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    // Check if task exists
    const existingTask = await db
      .select()
      .from(tasks)
      .where(eq(tasks.id, parseInt(id)))
      .limit(1);

    if (existingTask.length === 0) {
      return NextResponse.json(
        { error: 'Task not found', code: 'TASK_NOT_FOUND' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { text, completed, priority } = body;

    // Validate that at least one field is being updated
    if (text === undefined && completed === undefined && priority === undefined) {
      return NextResponse.json(
        { error: 'At least one field must be provided for update', code: 'NO_UPDATE_FIELDS' },
        { status: 400 }
      );
    }

    // Validate text if provided
    if (text !== undefined && (typeof text !== 'string' || text.trim() === '')) {
      return NextResponse.json(
        { error: 'Text cannot be empty', code: 'INVALID_TEXT' },
        { status: 400 }
      );
    }

    // Validate priority if provided
    if (priority !== undefined && !VALID_PRIORITIES.includes(priority)) {
      return NextResponse.json(
        { 
          error: `Invalid priority. Must be one of: ${VALID_PRIORITIES.join(', ')}`,
          code: 'INVALID_PRIORITY'
        },
        { status: 400 }
      );
    }

    // Build update object with only provided fields
    const updates = {};
    if (text !== undefined) updates.text = text.trim();
    if (completed !== undefined) updates.completed = Boolean(completed);
    if (priority !== undefined) updates.priority = priority;

    const updatedTask = await db
      .update(tasks)
      .set(updates)
      .where(eq(tasks.id, parseInt(id)))
      .returning();

    return NextResponse.json(updatedTask[0], { status: 200 });
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
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Validate ID
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    // Check if task exists before deleting
    const existingTask = await db
      .select()
      .from(tasks)
      .where(eq(tasks.id, parseInt(id)))
      .limit(1);

    if (existingTask.length === 0) {
      return NextResponse.json(
        { error: 'Task not found', code: 'TASK_NOT_FOUND' },
        { status: 404 }
      );
    }

    const deleted = await db
      .delete(tasks)
      .where(eq(tasks.id, parseInt(id)))
      .returning();

    return NextResponse.json(
      { 
        message: 'Task deleted successfully',
        task: deleted[0]
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
