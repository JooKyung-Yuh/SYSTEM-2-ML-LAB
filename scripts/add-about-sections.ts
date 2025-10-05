import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function addAboutSections() {
  try {
    // Find the about page
    const aboutPage = await prisma.page.findFirst({
      where: { slug: 'about' },
      include: { sections: true }
    });

    if (!aboutPage) {
      console.log('❌ About page not found');
      return;
    }

    console.log(`Found About page (ID: ${aboutPage.id})`);
    console.log(`Current sections: ${aboutPage.sections.length}`);

    if (aboutPage.sections.length === 0) {
      console.log('Adding sections...');

      await prisma.section.createMany({
        data: [
          {
            pageId: aboutPage.id,
            title: 'Our Mission',
            content: 'We are a research group focused on advancing machine learning through innovative approaches to optimization, neural network design, and computational efficiency.',
            order: 0
          },
          {
            pageId: aboutPage.id,
            title: 'Research Focus',
            content: 'Our research spans several key areas including Bayesian optimization, neural scaling laws, meta-learning, and efficient training methods for large-scale models.',
            order: 1
          },
          {
            pageId: aboutPage.id,
            title: 'Our Team',
            content: 'Our lab consists of dedicated researchers and students working together to push the boundaries of machine learning research.',
            order: 2
          }
        ]
      });

      console.log('✅ Added 3 sections to About page');
    } else {
      console.log('✅ Sections already exist');
    }

    // Verify
    const updated = await prisma.page.findFirst({
      where: { slug: 'about' },
      include: { sections: true }
    });
    console.log(`\nFinal section count: ${updated?.sections.length}`);
    updated?.sections.forEach((s, i) => {
      console.log(`  ${i + 1}. ${s.title}`);
    });

  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

addAboutSections()
  .then(() => {
    console.log('\n✅ Complete');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Failed:', error);
    process.exit(1);
  });
