import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Convert plain text to HTML with proper formatting
function textToHtml(text: string): string {
  // Split by double newlines to get paragraphs
  const paragraphs = text.split('\n\n');
  
  let html = '';
  
  for (const para of paragraphs) {
    const trimmed = para.trim();
    if (!trimmed) continue;
    
    // Check if it's a bullet list (lines starting with •)
    if (trimmed.includes('\n•')) {
      const items = trimmed.split('\n').filter(line => line.trim().startsWith('•'));
      if (items.length > 0) {
        html += '<ul>';
        items.forEach(item => {
          const content = item.replace(/^•\s*/, '').trim();
          // Check for bold text (text after colon)
          if (content.includes(':')) {
            const parts = content.split(':');
            html += `<li><strong>${parts[0]}:</strong>${parts.slice(1).join(':')}</li>`;
          } else {
            html += `<li>${content}</li>`;
          }
        });
        html += '</ul>';
      }
    } else {
      // Regular paragraph
      const lines = trimmed.split('\n');
      
      for (const line of lines) {
        const trimmedLine = line.trim();
        if (!trimmedLine) continue;
        
        // Convert URLs to links
        let processedLine = trimmedLine;
        
        // URL regex
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        processedLine = processedLine.replace(urlRegex, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>');
        
        // Email regex
        const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;
        processedLine = processedLine.replace(emailRegex, '<a href="mailto:$1">$1</a>');
        
        html += `<p>${processedLine}</p>`;
      }
    }
  }
  
  return html;
}

async function convertSectionsToHtml() {
  try {
    console.log('🔄 Converting sections to HTML format...\n');
    
    const sections = await prisma.section.findMany({
      include: { page: true }
    });
    
    console.log(`Found ${sections.length} sections to convert\n`);
    
    for (const section of sections) {
      // Skip if already HTML (contains <p> or <a> tags)
      if (section.content.includes('<p>') || section.content.includes('<a>')) {
        console.log(`⏭️  Skipping "${section.title}" - already HTML`);
        continue;
      }
      
      const htmlContent = textToHtml(section.content);
      
      await prisma.section.update({
        where: { id: section.id },
        data: { content: htmlContent }
      });
      
      console.log(`✅ Converted "${section.title}"`);
      console.log(`   Page: ${section.page.slug}`);
      console.log(`   Preview: ${htmlContent.substring(0, 100)}...\n`);
    }
    
    console.log('\n✅ Conversion completed!');
  } catch (error) {
    console.error('❌ Error converting sections:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

convertSectionsToHtml();
