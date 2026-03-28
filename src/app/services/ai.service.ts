import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface ResumeContent {
  responsibilities: string[];
  achievements: string[];
  skills: string[];
}

// ---------------------------------------------------------------------------
// Local fallback data — used when Edge Function is unreachable
// ---------------------------------------------------------------------------
const FALLBACK: Record<string, ResumeContent> = {
  'frontend developer': {
    responsibilities: [
      'Developed and maintained responsive web applications using React, TypeScript, and modern CSS frameworks',
      'Collaborated with UX/UI designers to translate wireframes into pixel-perfect, accessible interfaces',
      'Implemented state management solutions using Redux and Context API for complex application workflows',
      'Conducted code reviews and enforced best practices, reducing technical debt by 30%',
      'Optimised application performance achieving 95+ Lighthouse scores across all key metrics',
    ],
    achievements: [
      'Reduced page load time by 45% through lazy loading, code splitting, and asset optimisation',
      'Led migration from legacy jQuery codebase to React, improving developer productivity by 60%',
      'Delivered 15+ feature releases on schedule with zero critical production bugs',
      'Increased test coverage from 40% to 92% by implementing Jest and React Testing Library',
      'Mentored 3 junior developers, accelerating their onboarding by 2 weeks',
    ],
    skills: [
      'React, Angular, Vue.js, TypeScript, JavaScript (ES6+)',
      'HTML5, CSS3, SASS/SCSS, Tailwind CSS, Bootstrap',
      'RESTful APIs, GraphQL, Axios, Fetch API',
      'Webpack, Vite, npm, Git, CI/CD pipelines',
      'Jest, Cypress, React Testing Library, Storybook',
    ],
  },
  'backend developer': {
    responsibilities: [
      'Designed and implemented RESTful and GraphQL APIs serving 500K+ daily active users',
      'Architected microservices infrastructure using Node.js, Python, and Docker on AWS',
      'Managed relational and NoSQL databases including PostgreSQL, MongoDB, and Redis',
      'Implemented authentication and authorisation systems using OAuth 2.0 and JWT',
      'Monitored system health and resolved incidents maintaining 99.9% uptime SLA',
    ],
    achievements: [
      'Reduced API response time by 60% through query optimisation and Redis caching strategies',
      'Scaled platform to handle 10x traffic surge during peak events with zero downtime',
      'Decreased infrastructure costs by 25% by migrating to serverless architecture on AWS Lambda',
      'Implemented automated testing pipeline reducing regression bugs by 70%',
      'Led database migration from monolith to microservices with no data loss',
    ],
    skills: [
      'Node.js, Python, Java, Go, Express.js, FastAPI',
      'PostgreSQL, MongoDB, Redis, MySQL, DynamoDB',
      'AWS (EC2, Lambda, RDS, S3), Docker, Kubernetes',
      'REST APIs, GraphQL, gRPC, message queues (Kafka, RabbitMQ)',
      'CI/CD, Terraform, Git, unit/integration testing',
    ],
  },
  'data analyst': {
    responsibilities: [
      'Analysed large datasets using Python, SQL, and R to extract actionable business insights',
      'Built and maintained interactive dashboards in Tableau and Power BI for executive stakeholders',
      'Designed and executed A/B tests to validate product hypotheses and drive data-driven decisions',
      'Collaborated with engineering teams to define data pipelines and ensure data quality standards',
      'Presented findings and recommendations to cross-functional teams and C-suite leadership',
    ],
    achievements: [
      'Identified revenue leakage worth $2.4M annually through cohort analysis and churn modelling',
      'Automated 12 recurring reports saving 20+ hours of manual work per week',
      'Improved forecast accuracy by 35% by implementing machine learning models in production',
      'Reduced customer acquisition cost by 18% through targeted campaign analysis',
      'Built a real-time KPI dashboard adopted by 50+ stakeholders across 4 departments',
    ],
    skills: [
      'Python (Pandas, NumPy, Scikit-learn), R, SQL',
      'Tableau, Power BI, Looker, Google Data Studio',
      'Statistical analysis, regression modelling, hypothesis testing',
      'ETL pipelines, data warehousing, BigQuery, Snowflake',
      'Excel, Google Sheets, Jupyter Notebooks, dbt',
    ],
  },
  'software engineer': {
    responsibilities: [
      'Designed, developed, and deployed scalable software solutions across the full stack',
      'Participated in agile ceremonies including sprint planning, standups, and retrospectives',
      'Wrote clean, maintainable code following SOLID principles and design patterns',
      'Collaborated with product managers to translate requirements into technical specifications',
      'Performed root cause analysis and resolved production incidents within defined SLA windows',
    ],
    achievements: [
      'Delivered a core platform feature used by 200K+ users, increasing engagement by 28%',
      'Reduced build time by 50% by refactoring CI/CD pipeline and parallelising test suites',
      'Resolved 40+ critical bugs in legacy system improving stability and customer satisfaction',
      'Contributed to open-source libraries with 500+ GitHub stars',
      'Promoted to senior engineer within 18 months based on technical impact and leadership',
    ],
    skills: [
      'Java, Python, JavaScript, TypeScript, C++',
      'System design, algorithms, data structures',
      'Agile/Scrum, JIRA, Git, code review',
      'Cloud platforms (AWS, GCP, Azure), Docker, Kubernetes',
      'Unit testing, TDD, debugging, performance profiling',
    ],
  },
  'product manager': {
    responsibilities: [
      'Defined product vision, strategy, and roadmap aligned with business objectives and user needs',
      'Gathered and prioritised requirements through user interviews, surveys, and data analysis',
      'Collaborated with engineering, design, and marketing teams to deliver product increments',
      'Tracked KPIs and OKRs, reporting progress to executive stakeholders on a weekly basis',
      'Managed product backlog and facilitated agile ceremonies across 3 cross-functional teams',
    ],
    achievements: [
      'Launched 3 major product features that increased monthly active users by 40%',
      'Reduced time-to-market by 30% by streamlining the discovery-to-delivery process',
      'Grew NPS score from 32 to 61 within 12 months through targeted UX improvements',
      'Secured $1.2M in additional budget by presenting data-driven business cases',
      'Led successful go-to-market strategy resulting in 150% of first-quarter revenue target',
    ],
    skills: [
      'Product strategy, roadmapping, OKRs, KPI tracking',
      'Agile/Scrum, JIRA, Confluence, Notion',
      'User research, A/B testing, funnel analysis',
      'SQL, Mixpanel, Amplitude, Google Analytics',
      'Stakeholder management, cross-functional leadership, prioritisation frameworks',
    ],
  },
};

function buildGenericFallback(role: string): ResumeContent {
  return {
    responsibilities: [
      `Led end-to-end delivery of ${role} projects from requirements gathering to production deployment`,
      `Collaborated with cross-functional teams to define technical specifications and project milestones`,
      `Maintained comprehensive documentation and ensured adherence to industry best practices`,
      `Mentored junior team members and conducted knowledge-sharing sessions to upskill the team`,
      `Monitored performance metrics and implemented continuous improvements to optimise outcomes`,
    ],
    achievements: [
      `Delivered 10+ ${role} projects on time and within budget, achieving 98% client satisfaction`,
      `Reduced operational inefficiencies by 35% through process automation and workflow optimisation`,
      `Recognised as top performer for 2 consecutive quarters based on output quality and impact`,
      `Increased team productivity by 25% by introducing agile methodologies and tooling improvements`,
      `Spearheaded initiative that generated $500K in cost savings within the first year`,
    ],
    skills: [
      `Core ${role} technical competencies and domain expertise`,
      `Project management, Agile/Scrum, stakeholder communication`,
      `Data analysis, reporting, and performance measurement`,
      `Problem-solving, critical thinking, and decision-making under pressure`,
      `Collaboration tools: JIRA, Confluence, Slack, Microsoft Teams`,
    ],
  };
}

function getLocalFallback(role: string): ResumeContent {
  const key = role.toLowerCase().trim();
  for (const [k, v] of Object.entries(FALLBACK)) {
    if (key.includes(k) || k.includes(key)) {
      return { ...v, __fallback: true } as any;
    }
  }
  return { ...buildGenericFallback(role), __fallback: true } as any;
}

// ---------------------------------------------------------------------------

@Injectable({ providedIn: 'root' })
export class AiService {
  private readonly functionUrl = `${environment.supabaseUrl}/functions/v1/generate-resume`;

  constructor(private http: HttpClient) {}

  generateResumeBullets(role: string): Observable<ResumeContent> {
    return this.http
      .post<ResumeContent>(
        this.functionUrl,
        { role },
        {
          headers: {
            'Content-Type': 'application/json',
            apikey: environment.supabaseKey,
            Authorization: `Bearer ${environment.supabaseKey}`,
          },
        }
      )
      .pipe(
        timeout(12000),                          // 12 s hard timeout
        catchError((err: any) => {
          // status 0  → network error / function not deployed / CORS blocked
          // status 404 → function not found
          // TimeoutError → function too slow
          if (err.status === 0 || err.status === 404 || err.name === 'TimeoutError') {
            return of(getLocalFallback(role));   // silent fallback — no error shown
          }
          // Real server errors (4xx / 5xx) — surface the message
          const message =
            err.error?.error ?? err.error?.message ?? err.message ?? 'AI service error';
          return throwError(() => new Error(message));
        })
      );
  }
}
