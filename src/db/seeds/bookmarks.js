import { db } from '@/db'
import { bookmarks } from '@/db/schema'

async function main() {
    const sampleBookmarks = [
        {
            title: 'MDN Web Docs',
            url: 'https://developer.mozilla.org',
            category: 'Development',
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
            title: 'Figma Design Resources',
            url: 'https://www.figma.com/resources',
            category: 'Design',
            createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
            title: 'Notion Templates',
            url: 'https://www.notion.so/templates',
            category: 'Productivity',
            createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
            title: 'Frontend Masters',
            url: 'https://frontendmasters.com',
            category: 'Learning',
            createdAt: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
            title: 'CSS Tricks',
            url: 'https://css-tricks.com',
            category: 'Development',
            createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        },
    ]

    await db.insert(bookmarks).values(sampleBookmarks)
    
    console.log('✅ Bookmarks seeder completed successfully')
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error)
})
