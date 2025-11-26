import { db } from '@/db'
import { communityPosts } from '@/db/schema'

async function main() {
    const samplePosts = [
        {
            author: 'Sarah Chen',
            title: 'Best practices for state management?',
            content: 'I\'m working on a large React application and wondering what state management solution works best. Currently using Context API but considering Redux or Zustand. Any recommendations from experienced developers?',
            category: 'Help',
            createdAt: new Date('2024-12-28').toISOString(),
        },
        {
            author: 'Mike Johnson',
            title: 'Just launched my portfolio site!',
            content: 'After months of work, I finally deployed my new portfolio. Built with Next.js and Tailwind CSS. Would love to get feedback from the community on design and functionality!',
            category: 'Showcase',
            createdAt: new Date('2024-12-30').toISOString(),
        },
        {
            author: 'Emma Davis',
            title: 'Database design for multi-tenant apps',
            content: 'What\'s the best approach for designing databases in multi-tenant applications? Should I use separate schemas or shared tables with tenant IDs? Looking for pros and cons of each approach.',
            category: 'Discussion',
            createdAt: new Date('2025-01-02').toISOString(),
        },
        {
            author: 'Alex Rodriguez',
            title: 'Welcome to the community!',
            content: 'Hi everyone! Just joined this amazing community and excited to connect with fellow developers. Looking forward to sharing knowledge and learning from all of you.',
            category: 'General',
            createdAt: new Date('2025-01-05').toISOString(),
        },
        {
            author: 'Lisa Thompson',
            title: 'TypeScript vs JavaScript in 2025',
            content: 'Still seeing debates about whether TypeScript is worth the learning curve. What\'s everyone\'s experience transitioning from JavaScript? Has TypeScript improved your development workflow?',
            category: 'Discussion',
            createdAt: new Date('2025-01-07').toISOString(),
        },
        {
            author: 'David Kim',
            title: 'How to optimize API response times?',
            content: 'My API endpoints are taking too long to respond under heavy load. Currently using Node.js with Express and PostgreSQL. What caching strategies or optimization techniques would you recommend?',
            category: 'Help',
            createdAt: new Date('2025-01-09').toISOString(),
        },
    ]

    await db.insert(communityPosts).values(samplePosts)
    
    console.log('✅ Community posts seeder completed successfully')
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error)
})
