import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkDatabase() {
  try {
    console.log('🔍 Checking database connection...\n');

    // Check About page
    const aboutPage = await prisma.page.findFirst({
      where: { slug: 'about' },
      include: { sections: { orderBy: { order: 'asc' } } }
    });

    console.log('📄 About Page:');
    if (aboutPage) {
      console.log(`  ✅ Found: ${aboutPage.title}`);
      console.log(`  📝 Sections: ${aboutPage.sections.length}`);
      aboutPage.sections.forEach((section, idx) => {
        console.log(`    ${idx + 1}. ${section.title} (order: ${section.order})`);
      });
    } else {
      console.log('  ❌ Not found');
    }

    // Check other data
    const newsCount = await prisma.newsItem.count();
    const pubCount = await prisma.publication.count();
    const peopleCount = await prisma.person.count();
    const courseCount = await prisma.course.count();
    const galleryCount = await prisma.galleryItem.count();

    console.log('\n📊 Other data:');
    console.log(`  News: ${newsCount}`);
    console.log(`  Publications: ${pubCount}`);
    console.log(`  People: ${peopleCount}`);
    console.log(`  Courses: ${courseCount}`);
    console.log(`  Gallery: ${galleryCount}`);

    console.log('\n✅ Database connection successful!');
  } catch (error) {
    console.error('❌ Database error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabase();
