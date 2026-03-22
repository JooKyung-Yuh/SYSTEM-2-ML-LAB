import prisma from './prisma';

export async function getShowRecruitment(): Promise<boolean> {
  try {
    const settings = await prisma.siteSettings.findFirst();
    return settings?.showRecruitmentBanner ?? true;
  } catch {
    return true;
  }
}
