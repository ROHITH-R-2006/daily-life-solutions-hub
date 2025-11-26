import { db } from '@/db'
import { habits } from '@/db/schema'

async function main() {
    const sampleHabits = [
        {
            name: 'Drink 8 glasses of water',
            streak: 0,
            checkedToday: false,
            createdAt: new Date('2024-12-15').toISOString(),
        },
        {
            name: 'Exercise for 30 minutes',
            streak: 7,
            checkedToday: true,
            createdAt: new Date('2024-12-08').toISOString(),
        },
        {
            name: 'Read for 20 minutes',
            streak: 18,
            checkedToday: false,
            createdAt: new Date('2024-11-27').toISOString(),
        },
        {
            name: 'Meditate',
            streak: 32,
            checkedToday: true,
            createdAt: new Date('2024-11-13').toISOString(),
        }
    ]

    await db.insert(habits).values(sampleHabits)
    
    console.log('✅ Habits seeder completed successfully')
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error)
})
