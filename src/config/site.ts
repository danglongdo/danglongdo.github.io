export interface SiteConfig {
  name: string;
  title: string;
  description: {
    en: string;
    vi: string;
  };
  url: string;
  author: string;
  defaultLocale: 'en';
  locales: readonly ['en', 'vi'];
  links: {
    github: string;
    linkedin: string;
    email: string;
    resume: string;
  };
  contact: {
    email: string;
    subject: string;
  };
}

export const siteConfig: SiteConfig = {
  name: 'Đỗ Đăng Long',
  title: '.NET Full-Stack & Enterprise AI Automation Engineer',
  description: {
    en: 'Portfolio of Đỗ Đăng Long, specializing in .NET Full-Stack architecture, distributed systems, and Enterprise AI Automation.',
    vi: 'Portfolio của Đỗ Đăng Long, chuyên về kiến trúc .NET Full-Stack, hệ thống phân tán và Tự động hoá AI Doanh nghiệp.',
  },
  url: 'https://longdd.dev',
  author: 'Đỗ Đăng Long',
  defaultLocale: 'en',
  locales: ['en', 'vi'] as const,
  links: {
    github: 'https://github.com/lombeo',
    linkedin: 'https://linkedin.com/in/longdd',
    email: 'longdd.contact@gmail.com',
    resume: '/resume.pdf',
  },
  contact: {
    email: 'longdd.contact@gmail.com',
    subject: 'Inquiry for Đỗ Đăng Long - Software Engineer',
  },
} as const;

export default siteConfig;
