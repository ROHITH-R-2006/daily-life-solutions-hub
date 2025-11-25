import { db } from '@/db';
import { toolNotes } from '@/db/schema';

async function main() {
    const sampleToolNotes = [
        {
            title: 'Next.js Performance Tips',
            content: 'Enable static generation for pages that don\'t need real-time data. Use Image component for automatic optimization. Consider implementing incremental static regeneration for frequently updated content.',
            timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
            title: 'Database Migration Notes',
            content: 'Remember to backup database before running migrations. Test migrations in development environment first. Always create rollback scripts in case something goes wrong.',
            timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
            title: 'API Design Guidelines',
            content: 'Always validate input data using proper schemas. Return consistent error formats across all endpoints. Implement rate limiting to prevent abuse and ensure API stability.',
            timestamp: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
            createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
        }
    ];

    await db.insert(toolNotes).values(sampleToolNotes);
    
    console.log('✅ Tool notes seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});