import { db } from '@/db';
import { contactSubmissions } from '@/db/schema';

async function main() {
    const sampleSubmissions = [
        {
            name: 'Alex Thompson',
            email: 'alex.thompson@email.com',
            subject: 'Question about pricing plans',
            message: 'Hi, I\'m interested in your premium plan but have some questions about the features included. Could someone from your team reach out to discuss this further?',
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
            name: 'Jessica Lee',
            email: 'j.lee@company.com',
            subject: 'Partnership opportunity',
            message: 'I represent a company that would like to explore potential partnership opportunities. We believe our products complement each other well. Would love to schedule a call to discuss this.',
            createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        },
    ];

    await db.insert(contactSubmissions).values(sampleSubmissions);
    
    console.log('✅ Contact submissions seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});