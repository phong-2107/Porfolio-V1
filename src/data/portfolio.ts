// ─── Portfolio Data: Nguyễn Thành Phong ───────────────────────────────────────
// Source: CV extracted from Intern .NET Dev 2.pdf

export const OWNER = {
  name: 'Nguyễn Thành Phong',
  nameEn: 'Nguyen Thanh Phong',
  alias: 'PhongDev',
  role: 'Full-Stack Developer',
  roleShort: 'DEVELOPER',
  email: 'phongg.dev@gmail.com',
  phone: '(+84) 034 565 1206',
  location: 'Thủ Đức, TP. Hồ Chí Minh',
  dob: '21/07/2003',
  github: 'github.com/phongdev',
  tagline: 'Building performant web apps with clean architecture & modern stacks.',
  summary:
    "I'm a proactive developer with practical experience in .NET & Full-Stack development, focusing on ASP.NET Core, C#, ReactJS, and Node.js. I've built RESTful APIs, integrated secure payment systems, and applied SOLID principles across multiple real-world projects.",
} as const;

export const EDUCATION = {
  university: 'Trường Đại học Công nghệ TP.HCM (HUTECH)',
  universityEn: 'Ho Chi Minh City University of Technology (HUTECH)',
  major: 'Công nghệ Thông tin',
  majorEn: 'Information Technology',
  gpa: '3.54 / 4.00',
  period: '10/2021 – 01/2025',
} as const;

export const SKILLS = {
  languages: ['C#', 'Java', 'JavaScript', 'Python', 'C'],
  databases: ['SQL Server', 'MySQL', 'MongoDB', 'SQLite'],
  frameworks: [
    'ASP.NET Core',
    'ReactJS',
    'Node.js / Express.js',
    'Spring Boot',
    'Django / Flask',
    'Bootstrap',
  ],
  tools: ['Git', 'GitHub', 'Agile / Scrum', 'AWS (EC2, S3)', 'Cypress (E2E)'],
  soft: ['Teamwork', 'Problem-Solving', 'SOLID Principles', 'Clean Architecture'],
} as const;

export const PROJECTS = [
  {
    id: 'mangasmurf',
    name: 'MangaSmurf',
    subtitle: 'Comic Reading Platform',
    period: '08/2024 – 12/2024',
    role: 'Team Leader & Main Developer (Team of 3)',
    stack: ['ASP.NET Core', 'jQuery', 'Ajax', 'Bootstrap', 'Flask (Python)'],
    description:
      'A modern manga-reading platform recognized for its creative approach, user-friendly design, and practical features.',
    highlights: [
      'Authentication with ASP.NET Identity + Google/Facebook OAuth',
      'RBAC-based authorization for secure role-permission management',
      'VNPay integration for secure online payment processing',
      'Email notifications: invoices, password recovery',
      'Recommendation engine with Python similarity-based models',
    ],
    github: 'github.com/phongdev/Mangasmurf',
    tag: 'Full-Stack · .NET',
    accent: 'orange',
  },
  {
    id: 'timtro24h',
    name: 'TimTro24h',
    subtitle: 'Room Rental Finder Web App',
    period: '01/2025 – 04/2025',
    role: 'Team Leader & Main Developer (Team of 3)',
    stack: ['Node.js', 'MongoDB', 'ReactJS', 'Google Maps API'],
    description:
      'A platform helping students and young professionals efficiently search for rental rooms with speed, accuracy, and great UX.',
    highlights: [
      'RESTful APIs with Node.js for auth, room listings, user interactions',
      'Google Maps API integration for map-based room discovery',
      'SMTP email service for feedback and password recovery',
      'E2E automated tests with Cypress for key user flows',
    ],
    github: 'github.com/phongdev/timtro24h',
    tag: 'Full-Stack · MERN',
    accent: 'cyan',
  },
] as const;

export const EXPERIENCE = [
  {
    company: 'HUTECH University (Academic Projects)',
    role: 'Full-Stack Developer & Team Lead',
    period: '10/2021 – 01/2025',
    description: 'Bắt đầu hành trình lập trình và lãnh đạo nhóm phát triển các dự án lớn như MangaSmurf (Comic platform với ASP.NET Core) và TimTro24h (MERN stack). Thực hiện thiết kế hệ thống, tích hợp cổng thanh toán VNPay, và viết kịch bản kiểm thử tự động Cypress.',
    skills: ['ASP.NET Core', 'ReactJS', 'Node.js', 'Cypress', 'MongoDB'],
    year: '2021',
  },
  {
    company: 'DEK Technologies Vietnam (AWS Project)',
    role: 'Cloud Engineer Intern',
    period: '06/2025 – 08/2025',
    description: 'Đóng vai trò kỹ sư Cloud xây dựng và tích hợp các dịch vụ backend với AWS để tăng trải nghiệm sản phẩm và khắc phục lỗi dự án. Làm việc trong môi trường Scrum/Agile chuyên nghiệp.',
    skills: ['AWS EC2', 'S3', 'Backend Integration', 'Agile / Scrum'],
    year: '2025',
  },
  {
    company: 'Freelance & Self-directed Learning',
    role: 'Freelance Full-Stack Developer',
    period: '09/2025 – NOW',
    description: 'Thiết kế & phát triển các ứng dụng web chất lượng cao, các trang portfolio cá nhân tương tác 3D mượt mà cho khách hàng. Nghiên cứu sâu về GSAP, WebGL, và các giải pháp tối ưu hóa hiệu năng render UI.',
    skills: ['React 19', 'TypeScript', 'GSAP Motion', 'Spline 3D', 'CSS Tech'],
    year: 'NOW',
  },
] as const;

export const CERTIFICATIONS = [
  {
    name: 'Agile & Scrum Training',
    issuer: 'DEK Technologies Vietnam',
    date: 'June 2022',
  },
  {
    name: 'English Certificate – CEFR Level B1',
    issuer: 'HUTECH University',
    date: 'January 2025',
  },
] as const;
