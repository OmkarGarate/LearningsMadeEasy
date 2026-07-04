// Additional MCQs for each concept (3 total per concept)
export const EXTRA_MCQS = {
  'p1-request-flow': [
    {
      question: 'Approximately how long does a typical TLS handshake add to the first request?',
      options: [
        { id: 'a', text: '0-5ms (negligible)' },
        { id: 'b', text: '50-200ms' },
        { id: 'c', text: '1-2 seconds' },
        { id: 'd', text: 'It does not add latency' },
      ],
      correct: 'b',
      explanation: 'The TLS handshake involves multiple round trips for key exchange, typically adding 50-200ms. Resumed sessions (TLS 1.3) are faster.',
    },
    {
      question: 'In a typical request, which is usually the SLOWEST hop?',
      options: [
        { id: 'a', text: 'DNS resolution' },
        { id: 'b', text: 'TLS handshake' },
        { id: 'a', text: 'The application server processing' },
        { id: 'b', text: 'Database query' },
      ],
      correct: 'c',
      explanation: 'For a typical request, the application server (running your code) is usually the slowest hop because it has to do actual work: parse request, talk to DB, render response.',
    },
    {
      question: 'What is the typical role of a CDN in a request flow?',
      options: [
        { id: 'a', text: 'Replaces the database' },
        { id: 'b', text: 'Caches static assets close to users' },
        { id: 'c', text: 'Handles authentication' },
        { id: 'd', text: 'Encrypts the database connection' },
      ],
      correct: 'b',
      explanation: 'A CDN caches static content (images, JS, CSS) at edge servers around the world, so users get them from a server close by instead of from the origin.',
    },
  ],
  'p1-dns': [
    {
      question: 'What does TTL stand for in DNS?',
      options: [
        { id: 'a', text: 'Total Transfer Length' },
        { id: 'b', text: 'Time To Live' },
        { id: 'c', text: 'Top-Level Lookup' },
        { id: 'd', text: 'Trusted Type List' },
      ],
      correct: 'b',
      explanation: 'TTL (Time To Live) is how long a DNS record can be cached before it must be looked up again. Lower TTL = faster propagation of changes but more DNS queries.',
    },
    {
      question: 'How many DNS servers are involved in a typical recursive lookup?',
      options: [
        { id: 'a', text: '1 (just the resolver)' },
        { id: 'b', text: '2 (root + authoritative)' },
        { id: 'c', text: '3+ (root, TLD, authoritative)' },
        { id: 'd', text: '10+ (everyone caches a copy)' },
      ],
      correct: 'c',
      explanation: 'A recursive lookup typically visits 3 servers: root (.), TLD (.com), and authoritative (google.com). Each one refers to the next.',
    },
    {
      question: 'Which DNS record type is used to point a domain to an IP address?',
      options: [
        { id: 'a', text: 'CNAME' },
        { id: 'b', text: 'MX' },
        { id: 'c', text: 'A' },
        { id: 'd', text: 'TXT' },
      ],
      correct: 'c',
      explanation: 'A records map a domain to an IPv4 address. CNAME is an alias, MX is for mail, TXT is for arbitrary text (often verification or SPF records).',
    },
  ],
  'p1-tcp-ip': [
    {
      question: 'How many steps are in the TCP 3-way handshake?',
      options: [
        { id: 'a', text: '2' },
        { id: 'b', text: '3' },
        { id: 'c', text: '4' },
        { id: 'd', text: '1' },
      ],
      correct: 'b',
      explanation: 'TCP handshake: SYN → SYN+ACK → ACK. Three steps total, hence the name. Each step adds latency to the first request on a new connection.',
    },
    {
      question: 'Why is HTTP/2 faster than HTTP/1.1 partly because of TCP?',
      options: [
        { id: 'a', text: 'It uses UDP instead of TCP' },
        { id: 'b', text: 'It can send multiple requests over a single TCP connection' },
        { id: 'c', text: 'It skips the TCP handshake' },
        { id: 'd', text: 'TCP was rewritten for HTTP/2' },
      ],
      correct: 'b',
      explanation: 'HTTP/1.1 needed 6 TCP connections per origin to work around head-of-line blocking. HTTP/2 multiplexes many requests over a single TCP connection, reducing handshake overhead.',
    },
    {
      question: 'At which layer of the TCP/IP model does HTTP operate?',
      options: [
        { id: 'a', text: 'Network Access' },
        { id: 'b', text: 'Internet' },
        { id: 'c', text: 'Transport' },
        { id: 'd', text: 'Application' },
      ],
      correct: 'd',
      explanation: 'HTTP sits at the Application layer. It uses TCP (Transport), which uses IP (Internet), which uses Ethernet (Network Access).',
    },
  ],
  'p1-http': [
    {
      question: 'Which HTTP method is idempotent?',
      options: [
        { id: 'a', text: 'POST' },
        { id: 'b', text: 'PATCH' },
        { id: 'c', text: 'PUT' },
        { id: 'd', text: 'All of the above' },
      ],
      correct: 'c',
      explanation: 'PUT is idempotent — calling it multiple times produces the same result. POST is not (each call creates a new resource). PATCH is not strictly idempotent either.',
    },
    {
      question: 'What status code should you return for a successful POST that creates a resource?',
      options: [
        { id: 'a', text: '200 OK' },
        { id: 'b', text: '201 Created' },
        { id: 'c', text: '204 No Content' },
        { id: 'd', text: '301 Moved Permanently' },
      ],
      correct: 'b',
      explanation: '201 Created is the correct response for a successful POST. It signals a new resource was created. The response should include a Location header pointing to the new resource.',
    },
    {
      question: 'What does a 304 Not Modified status code mean?',
      options: [
        { id: 'a', text: 'The resource was deleted' },
        { id: 'b', text: 'The resource is unchanged, use your cached copy' },
        { id: 'c', text: 'Authentication required' },
        { id: 'd', text: 'Rate limit exceeded' },
      ],
      correct: 'b',
      explanation: '304 tells the client their cached version is still valid, so they can use it without re-downloading. It saves bandwidth and speeds up the user experience.',
    },
  ],
  'p1-cookies-sessions': [
    {
      question: 'Why is JWT called "stateless"?',
      options: [
        { id: 'a', text: 'It does not use cookies' },
        { id: 'b', text: 'The server does not need to remember sessions — the token itself contains the user info' },
        { id: 'c', text: 'It works without a database' },
        { id: 'd', text: 'It is faster than sessions' },
      ],
      correct: 'b',
      explanation: 'In JWT auth, all user info is encoded in the token itself. The server does not need to look anything up — it just verifies the signature. This makes scaling trivial.',
    },
    {
      question: 'What is the main disadvantage of JWT compared to sessions?',
      options: [
        { id: 'a', text: 'It is slower' },
        { id: 'b', text: 'It is harder to revoke' },
        { id: 'c', text: 'It uses more memory' },
        { id: 'd', text: 'It is not encrypted' },
      ],
      correct: 'b',
      explanation: 'Once a JWT is issued, it is valid until it expires — you cannot "log out" a user by simply deleting a session. You need a blocklist or short expiry times.',
    },
    {
      question: 'Which cookie flag prevents JavaScript from reading it?',
      options: [
        { id: 'a', text: 'Secure' },
        { id: 'b', text: 'SameSite' },
        { id: 'c', text: 'HttpOnly' },
        { id: 'd', text: 'Path' },
      ],
      correct: 'c',
      explanation: 'HttpOnly blocks document.cookie access from JavaScript, preventing XSS attacks from stealing session tokens. Secure ensures the cookie is only sent over HTTPS.',
    },
  ],
  'p2-client-server': [
    {
      question: 'In the client-server model, who initiates communication?',
      options: [
        { id: 'a', text: 'The server' },
        { id: 'b', text: 'The client' },
        { id: 'c', text: 'Both simultaneously' },
        { id: 'd', text: 'A third-party proxy' },
      ],
      correct: 'b',
      explanation: 'The client always initiates. The server is passive — it waits for requests. This is why your phone (client) makes requests to Google (server), not the other way around.',
    },
    {
      question: 'What is a benefit of separating client and server?',
      options: [
        { id: 'a', text: 'They can scale independently' },
        { id: 'b', text: 'Multiple client types (web, mobile, IoT) can share one server' },
        { id: 'c', text: 'They can be developed by different teams' },
        { id: 'd', text: 'All of the above' },
      ],
      correct: 'd',
      explanation: 'Separation gives you all of these. The same Twitter API powers the website, iOS app, Android app, and third-party tools — all using one server.',
    },
    {
      question: 'What is the typical role of an API server?',
      options: [
        { id: 'a', text: 'Renders HTML for the browser' },
        { id: 'b', text: 'Processes business logic and returns data' },
        { id: 'c', text: 'Stores user files' },
        { id: 'd', text: 'Handles DNS resolution' },
      ],
      correct: 'b',
      explanation: 'An API server processes business logic (validation, database calls, calculations) and returns structured data (usually JSON). The frontend renders it for users.',
    },
  ],
  'p2-3tier': [
    {
      question: 'What are the three tiers in 3-tier architecture?',
      options: [
        { id: 'a', text: 'Database, Cache, Server' },
        { id: 'b', text: 'Presentation, Application, Data' },
        { id: 'c', text: 'Frontend, Backend, Cloud' },
        { id: 'd', text: 'Client, Server, Network' },
      ],
      correct: 'b',
      explanation: 'Presentation (UI), Application (logic), Data (storage). The classic 3-tier separation that lets you scale each layer independently.',
    },
    {
      question: 'In a 3-tier architecture, where does business validation belong?',
      options: [
        { id: 'a', text: 'Presentation tier' },
        { id: 'b', text: 'Application tier' },
        { id: 'c', text: 'Data tier' },
        { id: 'd', text: 'All three' },
      ],
      correct: 'b',
      explanation: 'Business validation (e.g., "is this order valid?") belongs in the Application tier. Presentation should only do UI validation (e.g., "is this field empty?"). Data tier should only enforce schema.',
    },
    {
      question: 'What is a key benefit of the data tier being separate?',
      options: [
        { id: 'a', text: 'The database can be optimized independently' },
        { id: 'b', text: 'You can swap databases without changing the app' },
        { id: 'c', text: 'You can scale the database separately from the app' },
        { id: 'd', text: 'All of the above' },
      ],
      correct: 'd',
      explanation: 'All three are benefits. In practice, this is why we have ORMs, separate DB servers, and tools like replication/sharding that exist only at the data tier.',
    },
  ],
  'p2-monolith-vs-micro': [
    {
      question: 'What is a "distributed monolith"?',
      options: [
        { id: 'a', text: 'A monolith that uses multiple databases' },
        { id: 'b', text: 'Microservices that are tightly coupled and must deploy together' },
        { id: 'c', text: 'A monolith that runs on multiple servers' },
        { id: 'd', text: 'Microservices that share a single database' },
      ],
      correct: 'b',
      explanation: 'A distributed monolith is the worst of both worlds: you have the operational complexity of microservices (network calls, deployment coordination) but you lose the benefit (independent deploys). Avoid this!',
    },
    {
      question: 'Which company famously transitioned from monolith to microservices?',
      options: [
        { id: 'a', text: 'Apple' },
        { id: 'b', text: 'Amazon' },
        { id: 'c', text: 'Netflix' },
        { id: 'd', text: 'Both B and C' },
      ],
      correct: 'd',
      explanation: 'Both Amazon (the "Bezos mandate" in 2002) and Netflix (2008-2015) famously broke apart their monoliths. Both are now often cited as case studies.',
    },
    {
      question: 'When should you start breaking a monolith into microservices?',
      options: [
        { id: 'a', text: 'On day 1' },
        { id: 'b', text: 'When you have a real reason (scaling pain, team boundaries)' },
        { id: 'c', text: 'When you have more than 10 engineers' },
        { id: 'd', text: 'Never' },
      ],
      correct: 'b',
      explanation: 'Start with a well-organized monolith. Extract services when you have a clear driver: a team owns a domain, a service needs to scale differently, or you need a different tech stack.',
    },
  ],
  'p2-rest': [
    {
      question: 'What does the "S" in REST stand for?',
      options: [
        { id: 'a', text: 'Secure' },
        { id: 'b', text: 'State' },
        { id: 'c', text: 'Server' },
        { id: 'd', text: 'Stateless' },
      ],
      correct: 'b',
      explanation: 'REpresentational State Transfer. REST is about transferring representations of resource state. The key constraint is statelessness — each request contains everything needed.',
    },
    {
      question: 'How should you handle pagination in a REST API for 1M+ records?',
      options: [
        { id: 'a', text: 'Offset pagination (?page=1&limit=20)' },
        { id: 'b', text: 'Cursor pagination (?cursor=xyz)' },
        { id: 'c', text: 'Return everything once' },
        { id: 'd', text: 'Random sampling' },
      ],
      correct: 'b',
      explanation: 'Cursor pagination is fast and stable for large datasets. Offset pagination slows down dramatically for deep pages (the DB has to scan past all previous rows).',
    },
    {
      question: 'Where should you put an API version?',
      options: [
        { id: 'a', text: 'In a header' },
        { id: 'b', text: 'In the URL path (/api/v1/users)' },
        { id: 'c', text: 'In a query parameter' },
        { id: 'd', text: 'Does not matter' },
      ],
      correct: 'b',
      explanation: 'URL path versioning is the most common, easiest to read, and cacheable. Header versioning is more "pure" but harder to debug. Query versioning is rare.',
    },
  ],
  'p2-jwt': [
    {
      question: 'What is the difference between JWT and a random session token?',
      options: [
        { id: 'a', text: 'JWT is encrypted' },
        { id: 'b', text: 'JWT contains the user info, session token is just an ID' },
        { id: 'c', text: 'JWT is slower' },
        { id: 'd', text: 'There is no difference' },
      ],
      correct: 'b',
      explanation: 'A session token is just an opaque ID — server must look up the user. JWT contains the user data inside, so the server can verify without a database lookup.',
    },
    {
      question: 'Why is the JWT signature important?',
      options: [
        { id: 'a', text: 'It makes the token smaller' },
        { id: 'b', text: 'It proves the token was not tampered with' },
        { id: 'c', text: 'It encrypts the user data' },
        { id: 'd', text: 'It makes the token faster to send' },
      ],
      correct: 'b',
      explanation: 'The signature is computed from the header + payload + a server secret. If anyone modifies the payload, the signature becomes invalid, so the server rejects the token.',
    },
    {
      question: 'What is a refresh token used for?',
      options: [
        { id: 'a', text: 'Speeding up the access token' },
        { id: 'b', text: 'Getting a new access token when the old one expires' },
        { id: 'c', text: 'Encrypting the access token' },
        { id: 'd', text: 'Identifying the user' },
      ],
      correct: 'b',
      explanation: 'Access tokens are short-lived (15 min) for security. Refresh tokens are long-lived (7 days) and used to get new access tokens without forcing the user to log in again.',
    },
  ],
  'p2-oauth': [
    {
      question: 'What problem does OAuth solve?',
      options: [
        { id: 'a', text: 'It encrypts the database' },
        { id: 'b', text: 'It lets users grant limited access without sharing passwords' },
        { id: 'c', text: 'It makes websites faster' },
        { id: 'd', text: 'It replaces SSL' },
      ],
      correct: 'b',
      explanation: 'OAuth lets you sign in to a third-party app using Google without ever giving that app your Google password. The app only gets limited access (e.g., read your email) via a token.',
    },
    {
      question: 'What is the "Authorization Code" in OAuth?',
      options: [
        { id: 'a', text: 'The user\'s password' },
        { id: 'b', text: 'A short-lived code the auth server returns, exchanged for an access token' },
        { id: 'c', text: 'The access token itself' },
        { id: 'd', text: 'The client secret' },
      ],
      correct: 'b',
      explanation: 'The Authorization Code is a one-time code the auth server (e.g., Google) gives back to the app after the user approves. The app then exchanges it (along with its secret) for an access token.',
    },
    {
      question: 'Why is OAuth called a delegation protocol?',
      options: [
        { id: 'a', text: 'It delegates login to a third party' },
        { id: 'b', text: 'The user delegates limited access to a client without sharing credentials' },
        { id: 'c', text: 'It uses delegates' },
        { id: 'd', text: 'It delegates responsibility to the server' },
      ],
      correct: 'b',
      explanation: 'The user (Resource Owner) delegates specific permissions to a client app, without giving up control of their credentials. The auth server acts as the trusted intermediary.',
    },
  ],
};
