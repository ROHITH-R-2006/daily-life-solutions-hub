import { db } from '@/db';
import { dashboardNotes } from '@/db/schema';

async function main() {
    const sampleDashboardNotes = [
        {
            content: 'Remember to follow up with client about project proposal',
            timestamp: new Date('2024-12-20T14:30:00').toISOString(),
            createdAt: new Date('2024-12-20T14:30:00').toISOString(),
        },
        {
            content: 'Team standup moved to 10am tomorrow',
            timestamp: new Date('2024-12-22T16:45:00').toISOString(),
            createdAt: new Date('2024-12-22T16:45:00').toISOString(),
        },
        {
            content: 'Need to review Q4 budget allocations',
            timestamp: new Date('2024-12-23T09:15:00').toISOString(),
            createdAt: new Date('2024-12-23T09:15:00').toISOString(),
        }
    ];

    await db.insert(dashboardNotes).values(sampleDashboardNotes);
    
    console.log('✅ Dashboard notes seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});