import { db } from '@/db';
import { toolFiles } from '@/db/schema';

async function main() {
    const sampleToolFiles = [
        {
            name: 'project-requirements.pdf',
            category: 'Documents',
            size: '1.8 MB',
            timestamp: new Date('2024-12-20T10:30:00Z').toISOString(),
            createdAt: new Date('2024-12-20T10:30:00Z').toISOString(),
        },
        {
            name: 'logo-design-v2.png',
            category: 'Images',
            size: '456 KB',
            timestamp: new Date('2024-12-22T14:15:00Z').toISOString(),
            createdAt: new Date('2024-12-22T14:15:00Z').toISOString(),
        },
        {
            name: 'api-routes.ts',
            category: 'Code',
            size: '12 KB',
            timestamp: new Date('2024-12-24T09:45:00Z').toISOString(),
            createdAt: new Date('2024-12-24T09:45:00Z').toISOString(),
        },
        {
            name: 'user-analytics.csv',
            category: 'Data',
            size: '3.2 MB',
            timestamp: new Date('2024-12-26T16:20:00Z').toISOString(),
            createdAt: new Date('2024-12-26T16:20:00Z').toISOString(),
        }
    ];

    await db.insert(toolFiles).values(sampleToolFiles);
    
    console.log('✅ Tool files seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});