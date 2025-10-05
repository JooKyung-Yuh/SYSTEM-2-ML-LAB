import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkLayouts() {
  try {
    const aboutPage = await prisma.page.findFirst({
      where: { slug: 'about' },
      include: {
        sections: {
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!aboutPage) {
      console.log('❌ About page not found');
      return;
    }

    console.log('📄 About Page Sections:\n');
    aboutPage.sections.forEach((section, index) => {
      console.log(`${index + 1}. ${section.title}`);
      console.log(`   Layout: ${section.layout || 'NOT SET'}`);
      console.log(`   Order: ${section.order}`);
      console.log('');
    });

    // Check if any sections don't have layout set
    const sectionsWithoutLayout = aboutPage.sections.filter(s => !s.layout || s.layout === '');
    if (sectionsWithoutLayout.length > 0) {
      console.log(`⚠️  ${sectionsWithoutLayout.length} sections don't have layout set`);
      console.log('Would you like to set default layout to "full-width"?');
    } else {
      console.log('✅ All sections have layout set');
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkLayouts();
