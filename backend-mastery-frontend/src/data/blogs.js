// Long-form blog articles for each concept.
// These are deep-dive explanations that go beyond the MCQ/notes format.
// Rendered as a separate /blog page with rich formatting.

export const BLOGS = {
  'p1-request-flow': {
    title: 'What Really Happens When You Type a URL',
    subtitle: 'A complete journey of one HTTP request, from your keyboard to a database',
    readTime: '8 min',
    sections: [
      {
        heading: 'The 50-millisecond journey',
        body: `When you type "https://amazon.com" and press Enter, your browser kicks off a sequence of operations that would have seemed like science fiction 30 years ago. In less than 500ms, your request travels through 7+ different systems and comes back with a fully rendered page.

Let's trace every single step.`,
      },
      {
        heading: 'Step 1: Browser parses the URL',
        body: `Your browser splits the URL into parts:
- Protocol: https://
- Domain: amazon.com
- Path: / (homepage)
- Query: (none)

Then it checks: is this domain in my HSTS preload list? If yes, force HTTPS. Then it asks: do I have an IP address cached for amazon.com?`,
      },
      {
        heading: 'Step 2: DNS lookup (5-50ms)',
        body: `If not cached, your browser asks the OS, which asks the ISP's resolver, which (if needed) walks up the DNS hierarchy:

Local cache → OS cache → ISP resolver → Root (.) → TLD (.com) → Authoritative (amazon.com)

Each step is a network round-trip. On a cold cache, DNS alone can take 50-100ms. With a warm cache, it's <1ms.`,
      },
      {
        heading: 'Step 3: TCP handshake (1 round trip)',
        body: `SYN → SYN+ACK → ACK. Three packets, one round trip (~50ms to a nearby server, ~200ms to one across the world). This establishes the connection.`,
      },
      {
        heading: 'Step 4: TLS handshake (2 round trips)',
        body: `For HTTPS, after TCP comes TLS:
1. ClientHello (supported ciphers, TLS version)
2. ServerHello + Certificate (with public key)
3. Key exchange (pre-master secret)
4. Finished

This adds another 100-200ms. With TLS 1.3, it's down to 1 round trip.`,
      },
      {
        heading: 'Step 5: HTTP request',
        body: `The browser finally sends:
\`\`\`
GET / HTTP/2
Host: amazon.com
User-Agent: Chrome/120
Accept: text/html
Cookie: session-id=...
\`\`\``,
      },
      {
        heading: 'Step 6: The request hits the CDN',
        body: `Amazon uses CloudFront. The CDN edge server closest to you checks: do I have a cached version of this page? If yes (and it's not stale), return it immediately. If no, forward the request to the origin.`,
      },
      {
        heading: 'Step 7: ALB + Nginx + Node.js app',
        body: `The origin request goes through:
- Application Load Balancer (L7, routes by path)
- Nginx (SSL termination, static file serving, reverse proxy)
- The Node.js application (your actual code)

The app makes 5-20 database calls to DynamoDB, fetches personalized recommendations from a recommendation service, checks your cart, etc.`,
      },
      {
        heading: 'Step 8: Response travels back',
        body: `The response (HTML, ~500KB) travels back through the same path: app → Nginx → ALB → CDN (caches it) → your browser.`,
      },
      {
        heading: 'Step 9: Browser renders',
        body: `The browser parses HTML, finds CSS and JS, makes additional requests for those, builds the DOM tree, paints pixels. This is where most of the time goes — 1-3 seconds for a full page.`,
      },
      {
        heading: 'Total: 7 systems, ~2 seconds',
        body: `Browser → DNS → TCP → TLS → HTTP → CDN → ALB → Nginx → App → DB → (back through everything) → render

Every step adds latency. Every step is an opportunity for failure. Every step is a place to optimize.`,
      },
    ],
  },

  'p3-indexes': {
    title: 'How a Database Index Actually Works',
    subtitle: 'From 30-second queries to 50ms — what an index does under the hood',
    readTime: '10 min',
    sections: [
      {
        heading: 'The problem: full table scans',
        body: `Imagine you have a table with 50 million users. You want to find user with email = "omkar@test.com".

Without an index, the database does a **full table scan**: reads every row, checks the email, returns if found. With 50M rows, this takes ~30 seconds. Your app times out. Users rage.`,
      },
      {
        heading: 'The fix: B-Tree',
        body: `An index is a separate data structure (usually a B-Tree) that the database maintains alongside the table. It contains the indexed column values + a pointer to the actual row.

For email index:
- B-Tree root → "users with email starting A-C" → leaf nodes → specific email → row pointer

To find "omkar@test.com", the database:
1. Starts at root
2. Decides which child to visit (one comparison)
3. Repeats ~5 times (height of tree)
4. Reaches a leaf with the exact value + row pointer
5. Fetches the row

Total: ~5 comparisons + 1 row fetch. O(log n) instead of O(n). For 50M rows, that's 26 operations vs 50,000,000.`,
      },
      {
        heading: 'When indexes hurt',
        body: `Indexes are not free:
- Every INSERT/UPDATE/DELETE must update the indexes too
- A table with 10 indexes takes 10x longer to write
- Indexes take RAM (often loaded entirely in memory)
- Disk space

Index selectively. The right index can make a query 1000x faster; the wrong index is just overhead.`,
      },
      {
        heading: 'Composite index column order',
        body: `For a composite index on (a, b, c):
- WHERE a = ? → uses index ✓
- WHERE a = ? AND b = ? → uses index ✓
- WHERE b = ? → does NOT use index (leftmost prefix rule)
- WHERE a = ? AND c = ? → uses index for a, but filters c in memory

Put the most selective column first. Equality before range. (status = 'active' AND created_at > '2024-01-01') should be indexed as (status, created_at), not (created_at, status).`,
      },
      {
        heading: 'EXPLAIN ANALYZE: your best friend',
        body: `Always check the query plan. In PostgreSQL:

\`\`\`sql
EXPLAIN ANALYZE SELECT * FROM users WHERE email = 'omkar@test.com';
\`\`\`

Look for:
- **Seq Scan** on a large table → add an index
- **Index Scan** → index is being used ✓
- **Bitmap Heap Scan** → index used to filter, then rows fetched
- **Hash Join** vs **Nested Loop** → different join strategies

If the actual time is much higher than expected, the planner is choosing a bad plan. Check statistics, or add a hint.`,
      },
    ],
  },

  'p2-jwt': {
    title: 'JWT: The Complete Guide',
    subtitle: 'Why tokens replaced sessions, how they work, and where they break',
    readTime: '12 min',
    sections: [
      {
        heading: 'The problem with sessions',
        body: `In the old days, when you logged in, the server created a session record and gave you a session ID. Every request, you sent that ID. The server looked up "who is this user?" in its session store.

This works, but:
- Every request needs a database/cache lookup
- Servers need shared session storage (Redis)
- Hard to scale horizontally without sticky sessions
- CORS is annoying (cookies don't cross origins easily)`,
      },
      {
        heading: 'The JWT idea: put the user info in the token',
        body: `A JWT (JSON Web Token) is a self-contained string that includes:
- Who you are (user ID, role)
- When the token expires
- A signature proving the server issued it

The server doesn't need to look anything up. It just verifies the signature. Done.`,
      },
      {
        heading: 'Anatomy of a JWT',
        body: `A JWT has 3 parts, separated by dots:

\`\`\`
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQyLCJyb2xlIjoiYWRtaW4iLCJleHAiOjE3MjAwMDAwMDB9.abc123signature
\`\`\`

Decoded:
- **Header**: \`{"alg":"HS256","typ":"JWT"}\`
- **Payload**: \`{"userId":42,"role":"admin","exp":1720000000}\`
- **Signature**: HMAC-SHA256(header + "." + payload, secret)`,
      },
      {
        heading: 'Why signed, not encrypted',
        body: `A JWT is **signed**, not encrypted. Anyone can read the payload (it's just base64). The signature just proves it wasn't tampered with.

If you need to hide the data (e.g., a social security number), use JWE (JSON Web Encryption) — but it's rare. Usually, you just need to prove the token came from your server, not a hacker.`,
      },
      {
        heading: 'The "stateless" property',
        body: `Because the token contains everything the server needs, the server can be completely stateless. Any server in your fleet can handle any request. This is huge for scaling — you can add 100 servers and load-balance freely.

Compare to sessions: if a request lands on a server that doesn't have the session in its local cache, you have to fetch it from Redis. With JWT, every server can verify independently.`,
      },
      {
        heading: 'The revocation problem',
        body: `Here's the catch: once a JWT is issued, it's valid until it expires. You can't "log out" a user by simply deleting it from a database.

Solutions:
1. **Short expiry** (15 minutes) + refresh token
2. **Token blocklist**: store revoked token IDs in Redis
3. **Versioned tokens**: store a "token version" in the user record; bump it on logout

Most apps use option 1: access tokens are short, refresh tokens are stored server-side and can be revoked.`,
      },
      {
        heading: 'JWT vs Session: when to use which',
        body: `**Use JWT when:**
- You have many servers and want stateless auth
- You have multiple clients (web, mobile, API) that need to share auth
- You need to verify tokens across services (microservices)
- You're building a public API

**Use sessions when:**
- You have one server or a small cluster
- You need instant revocation
- You don't have multiple services to coordinate
- The simplicity matters more than scalability

Both are valid. JWT is not "better" — it's a tradeoff.`,
      },
    ],
  },

  'p8-instagram': {
    title: 'How Instagram Shows You Posts in 100ms',
    subtitle: 'The fan-out problem and how 2 billion users get fresh feeds',
    readTime: '15 min',
    sections: [
      {
        heading: 'The naive approach: query on read',
        body: `When you open Instagram, you want to see posts from people you follow. The naive approach:

1. Get list of users you follow: 500 people
2. Get their recent posts: 500 queries
3. Sort by time, paginate
4. Return to user

This is O(N) queries per request. For a user following 1000 people, that's 1000 database hits. At 500M daily active users, the database melts.`,
      },
      {
        heading: 'Fan-out on write: precompute the feed',
        body: `Instead: when someone posts, immediately push that post to all their followers' feeds.

When User A (with 1M followers) posts:
- Insert post into posts table
- For each follower: insert (userId, postId, timestamp) into their feed
- 1M writes for 1 post

When User X opens their feed:
- Just read their pre-computed feed table
- 1 query, super fast

This is the "fan-out on write" approach. It makes reads blazing fast.`,
      },
      {
        heading: 'The celebrity problem',
        body: `When Cristiano Ronaldo (600M followers) posts a photo:
- 600M writes to 600M feed caches
- Each write goes to a different shard
- The whole operation takes minutes
- And that's just for 1 post

If Ronaldo posts 10 times a day, that's 6 BILLION writes. The database is overwhelmed.`,
      },
      {
        heading: 'The hybrid solution',
        body: `Instagram's actual approach:
- For normal users (< 10K followers): fan-out on write (push)
- For celebrities (> 10K followers): fan-out on read (pull)

When you open your feed:
1. Read your push-cached feed (fast)
2. Merge in any recent celebrity posts (fetched on the fly)
3. Sort, dedupe, paginate

The threshold is tunable. Some apps use 1K, some use 100K. The idea is: the 99% of users who have <1K followers get fast reads with cheap writes. The 1% of celebrities absorb the cost of slower reads.`,
      },
      {
        heading: 'Storage and TTL',
        body: `Storing a full feed per user is expensive. Instagram's solution:
- Only store the latest ~1000 posts per user
- Older posts are fetched on demand (older = less likely to be re-viewed)
- Use Redis sorted sets: ZADD postId, score=timestamp; ZREVRANGE 0 99

This bounds storage to ~1000 entries per user, even for heavy users.`,
      },
      {
        heading: 'Real-time updates',
        body: `When a new post arrives, you want to show it instantly. Two options:
1. Polling: client asks every 30s "any new posts?"
2. Push: WebSocket or Server-Sent Events

Instagram uses a mix. The main feed uses push for new content from the people you interact with most. Stories and live use real-time push.`,
      },
      {
        heading: 'Takeaways',
        body: `- For 99% of users, push works great
- For celebrities, pull is unavoidable
- Storage: cap feed size, use sorted sets
- Caching: at multiple layers (Redis, CDN)
- Real-time: separate channel from main feed`,
      },
    ],
  },

  'p4-cache-aside': {
    title: 'Caching at Scale: Patterns, Pitfalls, and Production Tips',
    subtitle: 'Why your cache works 95% of the time and falls apart the other 5%',
    readTime: '11 min',
    sections: [
      {
        heading: 'The cache-aside pattern',
        body: `The most common cache pattern. Your app code looks like:

1. Check cache: is key X there?
2. If yes, return it (cache hit, fast)
3. If no, query database
4. Store result in cache with TTL
5. Return to caller

This is simple, but has gotchas. Let's go through them.`,
      },
      {
        heading: 'Gotcha 1: stale data',
        body: `The cache has data from 5 minutes ago. The database was updated 30 seconds ago. The user sees stale data.

Solutions:
- Short TTLs (1-5 minutes for most data)
- Active invalidation: on write, delete the cache key
- Write-through: write to DB and cache in the same operation
- Event-based invalidation: publish an event when data changes, cache subscribes`,
      },
      {
        heading: 'Gotcha 2: cache stampede',
        body: `A hot key expires. Suddenly 1000 requests hit the DB at once. The DB buckles. The cache stays empty. Everything is slow.

Solutions:
- **Locking**: only one request queries the DB, others wait for the result
- **Request coalescing**: collapse 1000 requests into 1 DB call
- **Pre-warming**: a background job refreshes the key before it expires
- **Probabilistic early expiration**: a random request refreshes the key slightly before TTL`,
      },
      {
        heading: 'Gotcha 3: hot keys',
        body: `A viral tweet. A celebrity\'s profile. One cache key getting 100x more traffic than others. The single Redis node holding it becomes a bottleneck.

Solutions:
- **Cache sharding**: split the value across multiple keys ("key:1", "key:2"), read from all
- **Local in-process cache**: each app server caches in its own memory
- **CDN**: for static content, let a CDN handle it`,
      },
      {
        heading: 'What to cache and what not to',
        body: `**Good candidates:**
- User profiles (read often, change rarely)
- API responses (especially list endpoints)
- Computed results (recommendations, search results)
- Static data (countries, categories, config)

**Bad candidates:**
- Frequently changing data (real-time stock prices, live scores)
- Large objects (>1MB)
- Sensitive data (passwords, PII)
- Data you need 100% consistency for (financial transactions)`,
      },
      {
        heading: 'Cache invalidation strategies',
        body: `When the underlying data changes, you need to update the cache.

1. **TTL only**: simplest, but data can be stale
2. **Active invalidation**: \`cache.delete(key)\` after every write
3. **Write-through**: write to DB and cache together
4. **Cache-aside with pub/sub**: publish change events, cache layer subscribes and invalidates
5. **Versioned keys**: include version in key (\`user:42:v3\`), bump version on update

For most apps, option 2 (active invalidation) is the sweet spot.`,
      },
      {
        heading: 'Production tips',
        body: `- **Always set a TTL**. No exceptions. Even 1 hour is better than forever.
- **Cache small, focused values**, not entire pages
- **Use namespacing**: \`user:42\`, \`product:100\`, \`session:abc\`
- **Monitor cache hit rate**: < 80%? You have a problem
- **Be careful with cache stampede**: lock or pre-warm
- **Test cache failures**: what happens when Redis is down? Your app should still work (just slow)`,
      },
    ],
  },
};

export const BLOG_IDS = Object.keys(BLOGS);
