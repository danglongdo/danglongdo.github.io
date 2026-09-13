export const languages = {
  en: 'English',
  vi: 'Tiếng Việt',
} as const;

export type SupportedLanguage = keyof typeof languages;

export const defaultLang: SupportedLanguage = 'en';

export const ui = {
  en: {
    // Navigation
    'nav.projects': 'Projects',
    'nav.experience': 'Experience',
    'nav.capabilities': 'Capabilities',
    'nav.contact': 'Contact',
    'nav.resume': 'Resume',

    // Hero
    'hero.role': '.NET Full-Stack & Enterprise AI Automation Engineer',
    'hero.description': 'Architecting mission-critical enterprise systems with ASP.NET Core, distributed messaging, and autonomous AI agents.',
    'hero.cta.projects': 'View Selected Work',
    'hero.cta.contact': 'Get in Touch',
    'hero.cta.resume': 'Download CV',

    // Section headers
    'section.selectedWork': 'Selected Work',
    'section.experience': 'Experience',
    'section.capabilities': 'Technical Capabilities',
    'section.contact': 'Direct Contact',

    // Accessibility aria-labels
    'a11y.skipToContent': 'Skip to content',
    'a11y.languageSwitcher': 'Switch language',
    'a11y.openMenu': 'Open menu',
    'a11y.closeMenu': 'Close menu',

    // Project / Case study actions & labels
    'project.readCaseStudy': 'Read Case Study',
    'project.backToProjects': 'Back to Projects',
    'project.featured': 'Featured Project',
    'project.role': 'Role',
    'project.techStack': 'Tech Stack',
    'project.architecture': 'Architecture & Key Decisions',
    'project.keyDecision': 'Key Decision',
    'project.problem': 'Problem',
    'project.confidential': 'Enterprise NDA',
    'project.outcomes': 'Key Outcomes & Impact',

    // Contact banner
    'contact.openToWork': 'Available for Opportunities',
    'contact.subtitle': 'Interested in collaborating or discussing technical challenges in .NET, distributed systems, or enterprise AI automation? Reach out directly.',
    'contact.sendEmail': 'Send an Email',
    'contact.email': 'Email',
    'contact.downloadCv': 'Download CV',
    'contact.github': 'GitHub',
    'contact.linkedin': 'LinkedIn',

    // 404
    '404.title': 'Page Not Found',
    '404.description': 'The page you are looking for does not exist or has been moved.',
    '404.backHome': 'Back to Homepage',

    // Footer
    'footer.rights': 'All rights reserved.',
    'footer.hostedOn': 'Deployed on Cloudflare Pages',
    'footer.builtWith': 'Built with Astro & Tailwind CSS',
  },
  vi: {
    // Navigation
    'nav.projects': 'Dự án',
    'nav.experience': 'Kinh nghiệm',
    'nav.capabilities': 'Năng lực',
    'nav.contact': 'Liên hệ',
    'nav.resume': 'Hồ sơ',

    // Hero
    'hero.role': 'Kỹ sư .NET Full-Stack & Tự động hoá AI Doanh nghiệp',
    'hero.description': 'Thiết kế hệ thống doanh nghiệp cốt lõi với ASP.NET Core, messaging phân tán và các tác tử AI tự động.',
    'hero.cta.projects': 'Xem dự án tiêu biểu',
    'hero.cta.contact': 'Liên hệ trực tiếp',
    'hero.cta.resume': 'Tải CV',

    // Section headers
    'section.selectedWork': 'Dự án Tiêu biểu',
    'section.experience': 'Kinh nghiệm Làm việc',
    'section.capabilities': 'Năng lực Chuyên môn',
    'section.contact': 'Liên hệ Trực tiếp',

    // Accessibility aria-labels
    'a11y.skipToContent': 'Chuyển đến nội dung chính',
    'a11y.languageSwitcher': 'Chuyển đổi ngôn ngữ',
    'a11y.openMenu': 'Mở menu',
    'a11y.closeMenu': 'Đóng menu',

    // Project / Case study actions & labels
    'project.readCaseStudy': 'Đọc bài phân tích',
    'project.backToProjects': 'Quay lại dự án',
    'project.featured': 'Dự án Tiêu biểu',
    'project.role': 'Vai trò',
    'project.techStack': 'Công nghệ',
    'project.architecture': 'Kiến trúc & Quyết định cốt lõi',
    'project.keyDecision': 'Quyết định cốt lõi',
    'project.problem': 'Thách thức',
    'project.confidential': 'Bảo mật NDA',
    'project.outcomes': 'Kết quả & Tác động',

    // Contact banner
    'contact.openToWork': 'Sẵn sàng cho cơ hội mới',
    'contact.subtitle': 'Bạn quan tâm đến việc hợp tác hoặc trao đổi về kiến trúc .NET, hệ thống phân tán hay tự động hoá AI doanh nghiệp? Hãy liên hệ trực tiếp.',
    'contact.sendEmail': 'Gửi Email Trực tiếp',
    'contact.email': 'Email',
    'contact.downloadCv': 'Tải CV',
    'contact.github': 'GitHub',
    'contact.linkedin': 'LinkedIn',

    // 404
    '404.title': 'Không tìm thấy trang',
    '404.description': 'Trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển.',
    '404.backHome': 'Quay về trang chủ',

    // Footer
    'footer.rights': 'Bảo lưu mọi quyền.',
    'footer.hostedOn': 'Triển khai trên Cloudflare Pages',
    'footer.builtWith': 'Xây dựng với Astro & Tailwind CSS',
  },
} as const;

export type UIKey = keyof (typeof ui)[typeof defaultLang];
