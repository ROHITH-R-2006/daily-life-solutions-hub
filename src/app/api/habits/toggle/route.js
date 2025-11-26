import { NextResponse } from 'next/server';
import { db } from '@/db';
import { habits } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function PATCH(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Validate ID parameter
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { 
          error: 'Valid ID is required',
          code: 'INVALID_ID'
        },
        { status: 400 }
      );
    }

    const habitId = parseInt(id);

    // Fetch the current habit
    const existingHabit = await db
      .select()
      .from(habits)
      .where(eq(habits.id, habitId))
      .limit(1);

    if (existingHabit.length === 0) {
      return NextResponse.json(
        { 
          error: 'Habit not found',
          code: 'HABIT_NOT_FOUND'
        },
        { status: 404 }
      );
    }

    const habit = existingHabit[0];

    // Toggle checkedToday and update streak
    const newCheckedToday = !habit.checkedToday;
    let newStreak = habit.streak;

    if (newCheckedToday) {
      // Checking the habit: increment streak
      newStreak = habit.streak + 1;
    } else {
      // Unchecking the habit: decrement streak (minimum 0)
      newStreak = Math.max(0, habit.streak - 1);
    }

    // Update the habit
    const updated = await db
      .update(habits)
      .set({
        checkedToday: newCheckedToday,
        streak: newStreak
      })
      .where(eq(habits.id, habitId))
      .returning();

    if (updated.length === 0) {
      return NextResponse.json(
        { 
          error: 'Failed to update habit',
          code: 'UPDATE_FAILED'
        },
        { status: 500 }
      );
    }

    return NextResponse.json(updated[0], { status: 200 });

  } catch (error) {
    console.error('PATCH error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
      },
      { status: 500 }
    );
  }
}
