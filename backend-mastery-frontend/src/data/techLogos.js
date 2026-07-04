// SVG logos + docs links for the technologies mentioned in the curriculum.
// Using inline SVG to avoid any external dependencies.

export const TECH_LOGOS = {
  postgres: {
    name: 'PostgreSQL',
    color: '#336791',
    logo: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>`,
    docs: 'https://www.postgresql.org/docs/',
  },
  redis: {
    name: 'Redis',
    color: '#DC382D',
    logo: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>`,
    docs: 'https://redis.io/docs/',
  },
  kafka: {
    name: 'Apache Kafka',
    color: '#231F20',
    logo: `<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="3"/><circle cx="12" cy="5" r="2"/><circle cx="12" cy="19" r="2"/><circle cx="5" cy="12" r="2"/><circle cx="19" cy="12" r="2"/><line x1="12" y1="8" x2="12" y2="10" stroke="currentColor" stroke-width="1"/><line x1="12" y1="14" x2="12" y2="17" stroke="currentColor" stroke-width="1"/><line x1="7.5" y1="10.5" x2="9.5" y2="11.5" stroke="currentColor" stroke-width="1"/><line x1="14.5" y1="11.5" x2="16.5" y2="10.5" stroke="currentColor" stroke-width="1"/></svg>`,
    docs: 'https://kafka.apache.org/documentation/',
  },
  rabbitmq: {
    name: 'RabbitMQ',
    color: '#FF6600',
    logo: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 4a6 6 0 110 12 6 6 0 010-12z"/></svg>`,
    docs: 'https://www.rabbitmq.com/documentation.html',
  },
  docker: {
    name: 'Docker',
    color: '#2496ED',
    logo: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M22 9h-2V7c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-2h2v-2h-2V9h2V7h-2v2h-1V7H4v10h16V9h2zm-9 3h-2v-2h2v2zm0-3h-2V7h2v2z"/></svg>`,
    docs: 'https://docs.docker.com/',
  },
  kubernetes: {
    name: 'Kubernetes',
    color: '#326CE5',
    logo: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L3 7v10l9 5 9-5V7l-9-5zm0 2.18L18.82 8 12 11.82 5.18 8 12 4.18zM5 9.45l6 3.43v6.84l-6-3.43V9.45zm14 0v6.84l-6 3.43v-6.84l6-3.43z"/></svg>`,
    docs: 'https://kubernetes.io/docs/',
  },
  nginx: {
    name: 'Nginx',
    color: '#009639',
    logo: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 19h20L12 2zm0 4l7 12H5l7-12z"/></svg>`,
    docs: 'https://nginx.org/en/docs/',
  },
  aws: {
    name: 'AWS',
    color: '#FF9900',
    logo: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM8 17.5l-2-1.5 6.5-9 2 1.5L8 17.5zm8-1.5l-6.5-9 2-1.5 6.5 9-2 1.5z"/></svg>`,
    docs: 'https://docs.aws.amazon.com/',
  },
  github: {
    name: 'GitHub Actions',
    color: '#2088FF',
    logo: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56v-2.13c-3.2.7-3.87-1.36-3.87-1.36-.52-1.32-1.27-1.67-1.27-1.67-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.75 2.68 1.24 3.34.95.1-.74.4-1.24.72-1.53-2.55-.29-5.23-1.28-5.23-5.7 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.45.11-3.02 0 0 .97-.31 3.18 1.18a11 11 0 015.78 0c2.21-1.49 3.18-1.18 3.18-1.18.62 1.57.23 2.73.11 3.02.74.81 1.18 1.84 1.18 3.1 0 4.43-2.69 5.41-5.25 5.7.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.55C20.71 21.39 24 17.08 24 12c0-6.35-5.15-11.5-11.5-11.5z"/></svg>`,
    docs: 'https://docs.github.com/en/actions',
  },
  mongodb: {
    name: 'MongoDB',
    color: '#47A248',
    logo: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H7v-2h4v2zm6 0h-4v-2h4v2zm0-4H7v-2h10v2z"/></svg>`,
    docs: 'https://www.mongodb.com/docs/',
  },
  jwt: {
    name: 'JWT',
    color: '#000000',
    logo: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L4 5v6c0 5.5 3.84 10.74 8 12 4.16-1.26 8-6.5 8-12V5l-8-3z"/></svg>`,
    docs: 'https://jwt.io/introduction',
  },
  node: {
    name: 'Node.js',
    color: '#339933',
    logo: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 7v10l10 5 10-5V7L12 2zm0 2.5L19.5 8 12 11.5 4.5 8 12 4.5zM4 9.5l7 3.5v6.5l-7-3.5V9.5zm9 10v-6.5l7-3.5v6.5l-7 3.5z"/></svg>`,
    docs: 'https://nodejs.org/en/docs',
  },
  stripe: {
    name: 'Stripe',
    color: '#635BFF',
    logo: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 7v10l10 5 10-5V7L12 2zm0 2.18L18.82 8 12 11.82 5.18 8 12 4.18z"/></svg>`,
    docs: 'https://stripe.com/docs',
  },
  graphql: {
    name: 'GraphQL',
    color: '#E10098',
    logo: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L3 7l9 5 9-5-9-5zm0 11L3 18l9 5 9-5-9-5z"/></svg>`,
    docs: 'https://graphql.org/learn/',
  },
  oauth: {
    name: 'OAuth 2.0',
    color: '#005A9C',
    logo: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L4 5v6c0 5.5 3.84 10.74 8 12 4.16-1.26 8-6.5 8-12V5l-8-3z"/></svg>`,
    docs: 'https://oauth.net/2/',
  },
  react: {
    name: 'React',
    color: '#61DAFB',
    logo: `<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="2"/><ellipse cx="12" cy="12" rx="10" ry="4" fill="none" stroke="currentColor" stroke-width="1"/><ellipse cx="12" cy="12" rx="10" ry="4" fill="none" stroke="currentColor" stroke-width="1" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="4" fill="none" stroke="currentColor" stroke-width="1" transform="rotate(120 12 12)"/></svg>`,
    docs: 'https://react.dev/',
  },
  rest: {
    name: 'REST',
    color: '#6B7280',
    logo: `<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="2"/><circle cx="12" cy="19" r="2"/><circle cx="5" cy="12" r="2"/><circle cx="19" cy="12" r="2"/><line x1="12" y1="7" x2="12" y2="10" stroke="currentColor" stroke-width="1.5"/><line x1="12" y1="14" x2="12" y2="17" stroke="currentColor" stroke-width="1.5"/></svg>`,
    docs: 'https://restfulapi.net/',
  },
};

// Map concept ID to relevant tech logos + docs
export const CONCEPT_TECHS = {
  'p3-sql-basics': ['postgres'],
  'p3-indexes': ['postgres'],
  'p3-joins': ['postgres'],
  'p3-normalization': ['postgres'],
  'p3-query-optimization': ['postgres'],
  'p3-replication': ['postgres'],
  'p4-why-cache': ['redis'],
  'p4-redis-types': ['redis'],
  'p4-cache-aside': ['redis'],
  'p4-cache-pitfalls': ['redis'],
  'p5-why-queue': ['kafka', 'rabbitmq'],
  'p5-rabbitmq': ['rabbitmq'],
  'p5-kafka': ['kafka'],
  'p5-patterns': ['kafka', 'rabbitmq'],
  'p10-docker': ['docker'],
  'p10-nginx': ['nginx'],
  'p10-cicd': ['github'],
  'p10-aws': ['aws'],
  'p10-k8s': ['kubernetes', 'docker'],
  'p2-jwt': ['jwt'],
  'p2-oauth': ['oauth'],
  'p2-rest': ['rest'],
};

// Phase-level official resources
export const PHASE_RESOURCES = {
  'phase-1': {
    title: 'Internet Fundamentals',
    resources: [
      { name: 'MDN Web Docs — HTTP', url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP' },
      { name: 'Cloudflare Learning — DNS', url: 'https://www.cloudflare.com/learning/dns/what-is-dns/' },
      { name: 'How HTTPS works', url: 'https://howhttps.works/' },
    ],
  },
  'phase-2': {
    title: 'Backend Architecture',
    resources: [
      { name: 'REST API Tutorial', url: 'https://restfulapi.net/' },
      { name: 'JWT.io Introduction', url: 'https://jwt.io/introduction' },
      { name: 'OAuth 2.0 Specification', url: 'https://oauth.net/2/' },
      { name: 'Microsoft — REST API Guidelines', url: 'https://learn.microsoft.com/en-us/azure/architecture/best-practices/api-design' },
    ],
  },
  'phase-3': {
    title: 'Database Design',
    resources: [
      { name: 'PostgreSQL Official Docs', url: 'https://www.postgresql.org/docs/' },
      { name: 'Use The Index, Luke!', url: 'https://use-the-index-luke.com/' },
      { name: 'SQL Performance Explained', url: 'https://sql-performance-explained.com/' },
    ],
  },
  'phase-4': {
    title: 'Caching with Redis',
    resources: [
      { name: 'Redis Official Docs', url: 'https://redis.io/docs/' },
      { name: 'Redis Best Practices', url: 'https://redis.io/docs/latest/develop/use/patterns/' },
    ],
  },
  'phase-5': {
    title: 'Messaging',
    resources: [
      { name: 'Apache Kafka Documentation', url: 'https://kafka.apache.org/documentation/' },
      { name: 'RabbitMQ Documentation', url: 'https://www.rabbitmq.com/documentation.html' },
      { name: 'Confluent — Kafka Tutorials', url: 'https://developer.confluent.io/courses/apache-kafka/' },
    ],
  },
  'phase-6': {
    title: 'Scalability',
    resources: [
      { name: 'System Design Primer (GitHub)', url: 'https://github.com/donnemartin/system-design-primer' },
      { name: 'High Scalability Blog', url: 'http://highscalability.com/' },
      { name: 'Cloudflare Learning Center', url: 'https://www.cloudflare.com/learning/' },
    ],
  },
  'phase-7': {
    title: 'Design Patterns',
    resources: [
      { name: 'Refactoring Guru — Design Patterns', url: 'https://refactoring.guru/design-patterns' },
      { name: 'Source Making', url: 'https://sourcemaking.com/design_patterns' },
    ],
  },
  'phase-8': {
    title: 'System Design Projects',
    resources: [
      { name: 'System Design Interview (Alex Xu)', url: 'https://www.systemdesigninterview.com/' },
      { name: 'Hello Interview', url: 'https://www.hellointerview.com/' },
    ],
  },
  'phase-9': {
    title: 'Advanced Architecture',
    resources: [
      { name: 'Microservices.io', url: 'https://microservices.io/patterns/data/saga.html' },
      { name: 'AWS — Saga Pattern', url: 'https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/saga-choreography.html' },
    ],
  },
  'phase-10': {
    title: 'DevOps',
    resources: [
      { name: 'Docker Documentation', url: 'https://docs.docker.com/' },
      { name: 'Kubernetes Documentation', url: 'https://kubernetes.io/docs/' },
      { name: 'Nginx Documentation', url: 'https://nginx.org/en/docs/' },
      { name: 'AWS Documentation', url: 'https://docs.aws.amazon.com/' },
      { name: 'GitHub Actions Docs', url: 'https://docs.github.com/en/actions' },
    ],
  },
  'phase-interview': {
    title: 'Interview Preparation',
    resources: [
      { name: 'System Design Interview Vol 1 & 2 (Alex Xu)', url: 'https://www.amazon.com/dp/206114579X' },
      { name: 'Hello Interview (free)', url: 'https://www.hellointerview.com/' },
      { name: 'System Design Primer', url: 'https://github.com/donnemartin/system-design-primer' },
    ],
  },
};
