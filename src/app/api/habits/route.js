import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { habits } from '@/db/schema';
import { eq, like, desc } from 'drizzle-orm';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Single habit by ID
    if (id) {
      if (!id || isNaN(parseInt(id))) {
        return NextResponse.json(
          { error: 'Valid ID is required', code: 'INVALID_ID' },
          { status: 400 }
        );
      }

      const habit = await db
        .select()
        .from(habits)
        .where(eq(habits.id, parseInt(id)))
        .limit(1);

      if (habit.length === 0) {
        return NextResponse.json(
          { error: 'Habit not found', code: 'HABIT_NOT_FOUND' },
          { status: 404 }
        );
      }

      return NextResponse.json(habit[0], { status: 200 });
    }

    // List all habits with pagination and search
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '10'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');
    const search = searchParams.get('search');

    let query = db.select().from(habits).orderBy(desc(habits.createdAt));

    if (search) {
      query = query.where(like(habits.name, `%${search}%`));
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
    const { name, streak, checkedToday } = body;

    // Validate required fields
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Name is required and must be a non-empty string', code: 'MISSING_NAME' },
        { status: 400 }
      );
    }

    // Prepare insert data with defaults
    const insertData = {
      name: name.trim(),
      streak: typeof streak === 'number' ? streak : 0,
      checkedToday: typeof checkedToday === 'boolean' ? checkedToday : false,
      createdAt: new Date().toISOString(),
    };

    const newHabit = await db.insert(habits).values(insertData).returning();

    return NextResponse.json(newHabit[0], { status: 201 });
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

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    // Check if habit exists
    const existingHabit = await db
      .select()
      .from(habits)
      .where(eq(habits.id, parseInt(id)))
      .limit(1);

    if (existingHabit.length === 0) {
      return NextResponse.json(
        { error: 'Habit not found', code: 'HABIT_NOT_FOUND' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { name, streak, checkedToday } = body;

    // Build update object with only provided fields
    const updates = {};

    if (name !== undefined) {
      if (typeof name !== 'string' || name.trim().length === 0) {
        return NextResponse.json(
          { error: 'Name must be a non-empty string', code: 'INVALID_NAME' },
          { status: 400 }
        );
      }
      updates.name = name.trim();
    }

    if (streak !== undefined) {
      if (typeof streak !== 'number') {
        return NextResponse.json(
          { error: 'Streak must be a number', code: 'INVALID_STREAK' },
          { status: 400 }
        );
      }
      updates.streak = streak;
    }

    if (checkedToday !== undefined) {
      if (typeof checkedToday !== 'boolean') {
        return NextResponse.json(
          { error: 'CheckedToday must be a boolean', code: 'INVALID_CHECKED_TODAY' },
          { status: 400 }
        );
      }
      updates.checkedToday = checkedToday;
    }

    // If no valid fields to update
    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: 'No valid fields to update', code: 'NO_UPDATE_FIELDS' },
        { status: 400 }
      );
    }

    const updatedHabit = await db
      .update(habits)
      .set(updates)
      .where(eq(habits.id, parseInt(id)))
      .returning();

    return NextResponse.json(updatedHabit[0], { status: 200 });
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

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    // Check if habit exists
    const existingHabit = await db
      .select()
      .from(habits)
      .where(eq(habits.id, parseInt(id)))
      .limit(1);

    if (existingHabit.length === 0) {
      return NextResponse.json(
        { error: 'Habit not found', code: 'HABIT_NOT_FOUND' },
        { status: 404 }
      );
    }

    const deleted = await db
      .delete(habits)
      .where(eq(habits.id, parseInt(id)))
      .returning();

    return NextResponse.json(
      {
        message: 'Habit deleted successfully',
        habit: deleted[0],
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
