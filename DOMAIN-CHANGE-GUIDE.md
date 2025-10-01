# 도메인 변경 가이드

## ✅ 도메인 변경 시 SEO 유지

이제 모든 SEO 설정이 **환경변수 기반**으로 구성되어 있어, 도메인이 변경되어도 **SEO 개선사항이 그대로 유지**됩니다!

---

## 🔧 도메인 변경 방법 (3분 소요)

### 1단계: 환경변수 파일 수정

`.env` 파일에서 다음 두 줄만 수정하세요:

```bash
# 변경 전
NEXT_PUBLIC_SITE_URL="https://mllab.korea.ac.kr"
NEXT_PUBLIC_SITE_NAME="System 2 ML Lab at Korea University"

# 변경 후 (예시)
NEXT_PUBLIC_SITE_URL="https://yournewdomain.com"
NEXT_PUBLIC_SITE_NAME="System 2 ML Lab at Korea University"
```

### 2단계: Vercel 환경변수 설정

Vercel Dashboard에서도 동일하게 설정:

1. Vercel 프로젝트 → **Settings** → **Environment Variables**
2. 다음 환경변수 추가:
   ```
   NEXT_PUBLIC_SITE_URL = https://yournewdomain.com
   NEXT_PUBLIC_SITE_NAME = System 2 ML Lab at Korea University
   ```
3. **Production, Preview, Development** 모두 체크
4. **Save**

### 3단계: 빌드 및 배포

```bash
npm run build
git add .
git commit -m "Update domain configuration"
git push
```

**끝! 🎉** 이제 새 도메인으로 배포되며 모든 SEO 설정이 자동으로 새 도메인을 사용합니다.

---

## 📋 자동으로 업데이트되는 항목

도메인을 변경하면 다음이 **자동으로** 새 도메인으로 업데이트됩니다:

### ✅ SEO 메타데이터
- `<meta>` 태그의 canonical URL
- Open Graph URL (`og:url`)
- Twitter Card URL
- `metadataBase` 설정

### ✅ 구조화된 데이터 (JSON-LD)
- Organization schema의 URL
- WebSite schema의 URL
- 모든 구조화된 데이터의 URL

### ✅ Sitemap
- `sitemap.xml`의 모든 URL
- 동적 페이지 URL (뉴스, 논문, 인원 등)

### ✅ Robots.txt
- Sitemap 위치
- 크롤러 규칙

### ✅ PWA Manifest
- `start_url`
- 앱 설정

---

## 🎯 환경변수 전체 목록

### 필수 환경변수

```bash
# 도메인 설정 (필수)
NEXT_PUBLIC_SITE_URL="https://mllab.korea.ac.kr"
NEXT_PUBLIC_SITE_NAME="System 2 ML Lab at Korea University"

# 데이터베이스 (필수)
DATABASE_URL="postgresql://..."

# 인증 (필수)
JWT_SECRET="your-secret-key"
```

### 선택 환경변수

```bash
# SEO 인증 코드
NEXT_PUBLIC_GOOGLE_VERIFICATION=""
NEXT_PUBLIC_YANDEX_VERIFICATION=""

# Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=""

# Social Media
NEXT_PUBLIC_TWITTER_HANDLE="@KoreaUniv"

# 이미지 (기본값 사용 가능)
NEXT_PUBLIC_OG_IMAGE="/images/og-image.jpg"
NEXT_PUBLIC_TWITTER_IMAGE="/images/twitter-image.jpg"
NEXT_PUBLIC_LOGO_IMAGE="/images/logo.png"
```

---

## 📁 중앙 설정 파일

모든 설정은 `src/lib/config.ts`에 중앙화되어 있습니다:

```typescript
// src/lib/config.ts
export const siteConfig = {
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://mllab.korea.ac.kr',
  name: process.env.NEXT_PUBLIC_SITE_NAME || 'System 2 ML Lab',
  // ... 기타 설정
};
```

### 헬퍼 함수

```typescript
import { siteConfig, getAbsoluteUrl, getImageUrl, getCanonicalUrl } from '@/lib/config';

// 절대 URL 생성
const homeUrl = getAbsoluteUrl('/');              // https://mllab.korea.ac.kr/
const aboutUrl = getAbsoluteUrl('/about');        // https://mllab.korea.ac.kr/about

// 이미지 URL 생성
const imageUrl = getImageUrl('/images/logo.png'); // https://mllab.korea.ac.kr/images/logo.png

// Canonical URL 생성 (trailing slash 제거)
const canonicalUrl = getCanonicalUrl('/about/');  // https://mllab.korea.ac.kr/about
```

---

## 🔍 SEO 개선사항이 유지되는 이유

### 이전 방식 (하드코딩) ❌
```typescript
// layout.tsx
export const metadata = {
  openGraph: {
    url: 'https://mllab.korea.ac.kr',  // 하드코딩!
  }
}

// sitemap.ts
const baseUrl = 'https://mllab.korea.ac.kr';  // 하드코딩!
```

**문제:** 도메인 변경 시 모든 파일을 수동으로 수정해야 함

### 현재 방식 (환경변수) ✅
```typescript
// layout.tsx
export const metadata = {
  openGraph: {
    url: siteConfig.url,  // 환경변수에서 자동 로드!
  }
}

// sitemap.ts
const baseUrl = siteConfig.url;  // 환경변수에서 자동 로드!
```

**장점:** `.env` 파일 한 곳만 수정하면 모든 곳에 반영!

---

## 🌐 다중 도메인 지원

개발/스테이징/프로덕션 환경별로 다른 도메인 사용 가능:

### .env.development.local
```bash
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

### .env.production
```bash
NEXT_PUBLIC_SITE_URL="https://mllab.korea.ac.kr"
```

### Vercel 환경별 설정
- **Development**: `http://localhost:3000`
- **Preview**: `https://preview-branch.vercel.app`
- **Production**: `https://mllab.korea.ac.kr`

---

## ✅ 체크리스트

도메인 변경 시 확인사항:

### 변경 전
- [ ] `.env` 백업
- [ ] 현재 도메인 확인
- [ ] Google Search Console에서 사이트 확인

### 변경 후
- [ ] `.env` 파일의 `NEXT_PUBLIC_SITE_URL` 수정
- [ ] Vercel 환경변수 업데이트
- [ ] 로컬 빌드 테스트 (`npm run build`)
- [ ] 배포 (`git push`)
- [ ] 새 도메인에서 sitemap.xml 확인
- [ ] 새 도메인에서 robots.txt 확인
- [ ] Google Search Console에 새 도메인 등록
- [ ] 새 sitemap 제출
- [ ] Open Graph 테스트 (Facebook Sharing Debugger)
- [ ] Twitter Card 테스트 (Twitter Card Validator)

---

## 🔗 관련 파일

도메인 설정을 사용하는 파일들:

```
✅ 자동으로 새 도메인 사용:
- src/lib/config.ts (중앙 설정)
- src/app/layout.tsx (메타데이터)
- src/app/page.tsx (홈페이지)
- src/app/sitemap.ts (sitemap)
- src/app/robots.ts (robots)
- src/components/StructuredData.tsx (JSON-LD)
- public/manifest.json (PWA)
```

---

## 💡 추가 팁

### 도메인 리다이렉트 설정

이전 도메인에서 새 도메인으로 자동 리다이렉트 설정:

#### next.config.ts에 추가
```typescript
async redirects() {
  return [
    {
      source: '/:path*',
      has: [
        {
          type: 'host',
          value: 'old-domain.com',
        },
      ],
      destination: 'https://new-domain.com/:path*',
      permanent: true,
    },
  ];
}
```

### Google Search Console 설정

1. **이전 도메인**: Address Change 도구 사용
2. **새 도메인**:
   - 소유권 확인
   - Sitemap 제출
   - URL Inspection으로 주요 페이지 크롤링 요청

### 301 리다이렉트 (SEO 가치 유지)

서버 또는 Vercel 설정에서 301 영구 리다이렉트 설정:

```json
// vercel.json
{
  "redirects": [
    {
      "source": "/(.*)",
      "destination": "https://new-domain.com/$1",
      "permanent": true
    }
  ]
}
```

---

## 🎉 결론

**도메인이 변경되어도 SEO 개선사항은 완벽하게 유지됩니다!**

- ✅ 환경변수만 수정
- ✅ 모든 SEO 설정 자동 업데이트
- ✅ 빌드 한 번으로 완료
- ✅ 3분 안에 도메인 변경 가능

궁금한 점이 있으면 `.env.example` 파일을 참고하세요!
