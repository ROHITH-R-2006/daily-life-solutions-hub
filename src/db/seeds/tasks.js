import { db } from '@/db'
import { tasks } from '@/db/schema'

async function main() {
    const sampleTasks = [
        {
            text: 'Complete quarterly financial report',
            completed: false,
            priority: 'high',
            createdAt: new Date('2024-01-15T09:30:00').toISOString(),
        },
        {
            text: 'Review code pull requests for new feature',
            completed: true,
            priority: 'high',
            createdAt: new Date('2024-01-16T14:20:00').toISOString(),
        },
        {
            text: 'Schedule dentist appointment',
            completed: false,
            priority: 'medium',
            createdAt: new Date('2024-01-17T11:15:00').toISOString(),
        },
        {
            text: 'Update project documentation',
            completed: true,
            priority: 'medium',
            createdAt: new Date('2024-01-18T16:45:00').toISOString(),
        },
        {
            text: 'Research new JavaScript frameworks',
            completed: false,
            priority: 'low',
            createdAt: new Date('2024-01-19T10:00:00').toISOString(),
        },
    ]

    await db.insert(tasks).values(sampleTasks)
    
    console.log('✅ Tasks seeder completed successfully')
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error)
})
