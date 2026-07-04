// Reusable SVG diagrams for visual learning.

const Arrow = ({ id }) => (
  <defs>
    <marker id={id} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M0,0 L10,5 L0,10 z" fill="#a78bfa" />
    </marker>
  </defs>
);

export function RequestFlowDiagram() {
  return (
    <svg viewBox="0 0 800 180" className="w-full">
      <Arrow id="a1" />
      <g fontFamily="Inter, sans-serif" fontSize="13" fill="#1a1a1a">
        {[
          { x: 20, fill: '#dbeafe', stroke: '#312e81', title: 'Browser', sub: 'Client' },
          { x: 170, fill: '#fce7f3', stroke: '#9d174d', title: 'ISP / DNS', sub: 'Resolves URL' },
          { x: 330, fill: '#cffafe', stroke: '#155e75', title: 'CDN / Edge', sub: 'Closest server' },
          { x: 490, fill: '#d1fae5', stroke: '#065f46', title: 'Web Server', sub: 'Nginx' },
          { x: 650, fill: '#fef3c7', stroke: '#92400e', title: 'App + DB', sub: 'Response' },
        ].map((n, i) => (
          <g key={i}>
            <rect x={n.x} y="60" width="120" height="50" rx="8" fill={n.fill} stroke={n.stroke} strokeWidth="2" />
            <text x={n.x + 60} y="83" textAnchor="middle" fontWeight="bold">{n.title}</text>
            <text x={n.x + 60} y="100" textAnchor="middle" fontSize="11" fill="#6b7280">{n.sub}</text>
          </g>
        ))}
        {[130, 290, 450, 610].map((x, i) => (
          <line key={i} x1={x} y1="85" x2={x + 40} y2="85" stroke="#a78bfa" strokeWidth="2" markerEnd="url(#a1)" />
        ))}
        <text x="400" y="30" textAnchor="middle" fontSize="15" fontWeight="bold" fill="#312e81">Request Flow: Browser → DNS → CDN → Server → App → DB</text>
        <text x="400" y="150" textAnchor="middle" fontSize="12" fill="#6b7280">Each step adds latency. Total budget: aim for under 200ms.</text>
      </g>
    </svg>
  );
}

export function ThreeTierDiagram() {
  return (
    <svg viewBox="0 0 700 320" className="w-full">
      <Arrow id="a2" />
      <g fontFamily="Inter, sans-serif" fontSize="14" fill="#1a1a1a">
        {[
          { y: 20, fill: '#fce7f3', stroke: '#9d174d', title: 'Presentation Tier', sub: 'UI, React, mobile app', color: '#9d174d' },
          { y: 120, fill: '#dbeafe', stroke: '#312e81', title: 'Application / Logic Tier', sub: 'Node, Spring, Django', color: '#312e81' },
          { y: 220, fill: '#d1fae5', stroke: '#065f46', title: 'Data Tier', sub: 'PostgreSQL, Redis, S3', color: '#065f46' },
        ].map((t, i) => (
          <g key={i}>
            <rect x="100" y={t.y} width="500" height="80" rx="10" fill={t.fill} stroke={t.stroke} strokeWidth="2" />
            <text x="350" y={t.y + 30} textAnchor="middle" fontWeight="bold" fontSize="16" fill={t.color}>{t.title}</text>
            <text x="350" y={t.y + 55} textAnchor="middle" fontSize="12">{t.sub}</text>
          </g>
        ))}
        <line x1="350" y1="100" x2="350" y2="118" stroke="#a78bfa" strokeWidth="3" markerEnd="url(#a2)" />
        <line x1="350" y1="200" x2="350" y2="218" stroke="#a78bfa" strokeWidth="3" markerEnd="url(#a2)" />
      </g>
    </svg>
  );
}

export function CacheAsideDiagram() {
  return (
    <svg viewBox="0 0 700 320" className="w-full">
      <Arrow id="a3" />
      <g fontFamily="Inter, sans-serif" fontSize="11" fill="#1a1a1a">
        {[
          { x: 20, fill: '#dbeafe', stroke: '#312e81', title: 'App', sub: 'Your code' },
          { x: 290, fill: '#fef2f2', stroke: '#dc2626', title: 'Redis', sub: 'Cache' },
          { x: 560, fill: '#d1fae5', stroke: '#065f46', title: 'PostgreSQL', sub: 'Source of truth' },
        ].map((n, i) => (
          <g key={i}>
            <rect x={n.x} y="30" width="120" height="50" rx="8" fill={n.fill} stroke={n.stroke} strokeWidth="2" />
            <text x={n.x + 60} y="55" textAnchor="middle" fontWeight="bold" fill={n.stroke}>{n.title}</text>
            <text x={n.x + 60} y="72" textAnchor="middle" fontSize="10" fill="#1a1a1a">{n.sub}</text>
          </g>
        ))}
        <line x1="140" y1="120" x2="290" y2="120" stroke="#10b981" strokeWidth="2" markerEnd="url(#a3)" />
        <text x="215" y="113" textAnchor="middle" fill="#10b981">1. GET user:42</text>
        <line x1="290" y1="145" x2="140" y2="145" stroke="#10b981" strokeWidth="2" markerEnd="url(#a3)" />
        <text x="215" y="165" textAnchor="middle" fill="#10b981">2. HIT → return</text>
        <line x1="140" y1="210" x2="290" y2="210" stroke="#dc2626" strokeWidth="2" markerEnd="url(#a3)" />
        <text x="215" y="203" textAnchor="middle" fill="#dc2626">3. MISS</text>
        <line x1="140" y1="240" x2="560" y2="240" stroke="#f59e0b" strokeWidth="2" markerEnd="url(#a3)" />
        <text x="350" y="233" textAnchor="middle" fill="#f59e0b">4. Query DB</text>
        <line x1="560" y1="270" x2="140" y2="270" stroke="#f59e0b" strokeWidth="2" markerEnd="url(#a3)" />
        <text x="350" y="263" textAnchor="middle" fill="#f59e0b">5. Return + SETEX in cache</text>
      </g>
    </svg>
  );
}

export function JwtStructureDiagram() {
  return (
    <svg viewBox="0 0 800 120" className="w-full">
      <g fontFamily="Inter, sans-serif" fontSize="12" fill="#1a1a1a">
        <rect x="20" y="35" width="240" height="50" rx="8" fill="#fce7f3" stroke="#9d174d" strokeWidth="2" />
        <text x="140" y="58" textAnchor="middle" fontWeight="bold" fill="#9d174d">HEADER</text>
        <text x="140" y="75" textAnchor="middle" fontSize="10" fill="#1a1a1a">alg, typ</text>
        <text x="270" y="63" textAnchor="middle" fontWeight="bold" fill="#94a3b8">.</text>
        <rect x="290" y="35" width="240" height="50" rx="8" fill="#cffafe" stroke="#155e75" strokeWidth="2" />
        <text x="410" y="58" textAnchor="middle" fontWeight="bold" fill="#155e75">PAYLOAD</text>
        <text x="410" y="75" textAnchor="middle" fontSize="10" fill="#1a1a1a">userId, role, exp</text>
        <text x="540" y="63" textAnchor="middle" fontWeight="bold" fill="#94a3b8">.</text>
        <rect x="560" y="35" width="220" height="50" rx="8" fill="#d1fae5" stroke="#065f46" strokeWidth="2" />
        <text x="670" y="58" textAnchor="middle" fontWeight="bold" fill="#065f46">SIGNATURE</text>
        <text x="670" y="75" textAnchor="middle" fontSize="10" fill="#1a1a1a">HMACSHA256(...)</text>
        <text x="400" y="20" textAnchor="middle" fontSize="11" fill="#c4b5fd" fontWeight="bold">xxxxx.yyyyy.zzzzz — base64url encoded</text>
      </g>
    </svg>
  );
}

export function IndexVsScanDiagram() {
  return (
    <svg viewBox="0 0 800 230" className="w-full">
      <g fontFamily="Inter, sans-serif" fontSize="12" fill="#1a1a1a">
        <text x="200" y="22" textAnchor="middle" fontWeight="bold" fontSize="15" fill="#dc2626">WITHOUT INDEX — full scan O(n)</text>
        <rect x="20" y="35" width="360" height="170" rx="8" fill="#fef2f2" stroke="#dc2626" strokeWidth="2" />
        {['1 Alice ✗', '2 Bob ✗', '3 Carol ✗', '4 Dave ✗', '5 Eve ✗', '6 Frank ✓', '7 Grace ✗'].map((t, i) => (
          <text key={i} x="35" y={60 + i * 18} fill={i === 5 ? '#065f46' : '#1a1a1a'} fontWeight={i === 5 ? 'bold' : 'normal'}>{t}</text>
        ))}
        <text x="200" y="220" textAnchor="middle" fontSize="11" fill="#dc2626">Checks every row</text>
        <text x="600" y="22" textAnchor="middle" fontWeight="bold" fontSize="15" fill="#10b981">WITH INDEX — B-Tree O(log n)</text>
        <rect x="420" y="35" width="360" height="170" rx="8" fill="#d1fae5" stroke="#10b981" strokeWidth="2" />
        <text x="600" y="65" textAnchor="middle" fontWeight="bold" fill="#312e81">B-Tree on id</text>
        <text x="600" y="85" textAnchor="middle" fontSize="10" fill="#6b7280">[1,2,3] → [4,5,6] → [7,8,9]</text>
        <text x="600" y="120" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#10b981">→ jump to id=6 → Frank</text>
        <text x="600" y="160" textAnchor="middle" fontSize="10" fill="#1a1a1a">3 comparisons vs 6 scans</text>
        <text x="600" y="220" textAnchor="middle" fontSize="11" fill="#10b981">Exponential speedup</text>
      </g>
    </svg>
  );
}

export function MonolithVsMicroDiagram() {
  return (
    <svg viewBox="0 0 800 250" className="w-full">
      <g fontFamily="Inter, sans-serif" fontSize="12" fill="#1a1a1a">
        <text x="200" y="22" textAnchor="middle" fontWeight="bold" fill="#ec4899">MONOLITH</text>
        <rect x="50" y="35" width="300" height="200" rx="10" fill="#fce7f3" stroke="#ec4899" strokeWidth="2" />
        {['Users', 'Orders', 'Payments', 'Notifications'].map((m, i) => (
          <g key={i}>
            <rect x="70" y={55 + i * 42} width="260" height="30" fill="white" stroke="#ec4899" />
            <text x="200" y={75 + i * 42} textAnchor="middle">{m} Module</text>
          </g>
        ))}
        <text x="200" y="250" textAnchor="middle" fontSize="11" fill="#6b7280">Single deployable unit</text>
        <text x="600" y="22" textAnchor="middle" fontWeight="bold" fill="#10b981">MICROSERVICES</text>
        <rect x="450" y="35" width="300" height="200" rx="10" fill="#d1fae5" stroke="#10b981" strokeWidth="2" />
        {[
          { x: 470, y: 55, label: 'Users' }, { x: 610, y: 55, label: 'Orders' },
          { x: 470, y: 125, label: 'Payments' }, { x: 610, y: 125, label: 'Notify' },
        ].map((m, i) => (
          <g key={i}>
            <rect x={m.x} y={m.y} width="120" height="50" fill="white" stroke="#10b981" />
            <text x={m.x + 60} y={m.y + 30} textAnchor="middle">{m.label}</text>
          </g>
        ))}
        <text x="600" y="200" textAnchor="middle" fontSize="11" fill="#f59e0b">↕ API gateway</text>
      </g>
    </svg>
  );
}

export function LoadBalancerDiagram() {
  return (
    <svg viewBox="0 0 700 200" className="w-full">
      <Arrow id="a5" />
      <g fontFamily="Inter, sans-serif" fontSize="12" fill="#1a1a1a">
        {['User A', 'User B', 'User C'].map((u, i) => (
          <text key={i} x={80 + i * 280} y="25" textAnchor="middle" fontWeight="bold" fill="#312e81">{u}</text>
        ))}
        {[80, 360, 640].map((x, i) => (
          <line key={i} x1={x} y1="40" x2="350" y2="90" stroke="#a78bfa" strokeWidth="2" />
        ))}
        <rect x="270" y="90" width="160" height="50" rx="8" fill="#fce7f3" stroke="#ec4899" strokeWidth="2" />
        <text x="350" y="115" textAnchor="middle" fontWeight="bold" fill="#ec4899">Load Balancer</text>
        <text x="350" y="132" textAnchor="middle" fontSize="10" fill="#6b7280">Nginx / ALB / HAProxy</text>
        <line x1="290" y1="140" x2="80" y2="185" stroke="#10b981" strokeWidth="2" />
        <line x1="350" y1="140" x2="350" y2="185" stroke="#10b981" strokeWidth="2" />
        <line x1="410" y1="140" x2="620" y2="185" stroke="#10b981" strokeWidth="2" />
        {['App 1', 'App 2', 'App 3'].map((a, i) => (
          <g key={i}>
            <rect x={20 + i * 280} y="185" width="100" height="30" rx="6" fill="#d1fae5" stroke="#10b981" strokeWidth="2" />
            <text x={70 + i * 280} y="205" textAnchor="middle">{a}</text>
          </g>
        ))}
      </g>
    </svg>
  );
}

// NEW: URL Shortener flow
export function UrlShortenerDiagram() {
  return (
    <svg viewBox="0 0 800 320" className="w-full">
      <Arrow id="a6" />
      <g fontFamily="Inter, sans-serif" fontSize="12" fill="#1a1a1a">
        {/* Step 1: User creates short URL */}
        <rect x="20" y="30" width="160" height="50" rx="8" fill="#dbeafe" stroke="#312e81" strokeWidth="2" />
        <text x="100" y="55" textAnchor="middle" fontWeight="bold" fill="#312e81">User</text>
        <text x="100" y="72" textAnchor="middle" fontSize="10">POST /shorten</text>

        <line x1="180" y1="55" x2="240" y2="55" stroke="#a78bfa" strokeWidth="2" markerEnd="url(#a6)" />
        <text x="210" y="48" textAnchor="middle" fontSize="10" fill="#6b7280">long URL</text>

        <rect x="240" y="30" width="160" height="50" rx="8" fill="#fef3c7" stroke="#92400e" strokeWidth="2" />
        <text x="320" y="55" textAnchor="middle" fontWeight="bold" fill="#92400e">API Server</text>
        <text x="320" y="72" textAnchor="middle" fontSize="10">Generate short code</text>

        <line x1="400" y1="55" x2="460" y2="55" stroke="#a78bfa" strokeWidth="2" markerEnd="url(#a6)" />
        <text x="430" y="48" textAnchor="middle" fontSize="10" fill="#6b7280">INSERT</text>

        <rect x="460" y="30" width="160" height="50" rx="8" fill="#d1fae5" stroke="#065f46" strokeWidth="2" />
        <text x="540" y="55" textAnchor="middle" fontWeight="bold" fill="#065f46">PostgreSQL</text>
        <text x="540" y="72" textAnchor="middle" fontSize="10">abc123 → longurl.com</text>

        <line x1="400" y1="80" x2="240" y2="80" stroke="#a78bfa" strokeWidth="2" markerEnd="url(#a6)" />
        <line x1="240" y1="80" x2="180" y2="80" stroke="#a78bfa" strokeWidth="2" markerEnd="url(#a6)" />
        <text x="210" y="100" textAnchor="middle" fontSize="10" fill="#10b981">return abc123</text>

        <text x="400" y="115" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#312e81">CREATE: User → API → DB → User</text>

        {/* Step 2: User clicks short URL */}
        <rect x="20" y="160" width="160" height="50" rx="8" fill="#dbeafe" stroke="#312e81" strokeWidth="2" />
        <text x="100" y="185" textAnchor="middle" fontWeight="bold" fill="#312e81">User</text>
        <text x="100" y="202" textAnchor="middle" fontSize="10">GET /abc123</text>

        <line x1="180" y1="185" x2="240" y2="185" stroke="#a78bfa" strokeWidth="2" markerEnd="url(#a6)" />

        <rect x="240" y="160" width="160" height="50" rx="8" fill="#fef3c7" stroke="#92400e" strokeWidth="2" />
        <text x="320" y="185" textAnchor="middle" fontWeight="bold" fill="#92400e">API Server</text>
        <text x="320" y="202" textAnchor="middle" fontSize="10">Check cache</text>

        <line x1="400" y1="170" x2="460" y2="170" stroke="#10b981" strokeWidth="2" markerEnd="url(#a6)" />
        <text x="430" y="163" textAnchor="middle" fontSize="10" fill="#10b981">hit?</text>
        <line x1="460" y1="190" x2="400" y2="190" stroke="#dc2626" strokeWidth="2" markerEnd="url(#a6)" />
        <text x="430" y="210" textAnchor="middle" fontSize="10" fill="#dc2626">miss</text>

        <rect x="460" y="160" width="160" height="50" rx="8" fill="#fef2f2" stroke="#dc2626" strokeWidth="2" />
        <text x="540" y="185" textAnchor="middle" fontWeight="bold" fill="#dc2626">Redis</text>
        <text x="540" y="202" textAnchor="middle" fontSize="10">abc123 → longurl</text>

        <rect x="460" y="225" width="160" height="50" rx="8" fill="#d1fae5" stroke="#065f46" strokeWidth="2" />
        <text x="540" y="250" textAnchor="middle" fontWeight="bold" fill="#065f46">PostgreSQL</text>
        <text x="540" y="267" textAnchor="middle" fontSize="10">SELECT (only on miss)</text>

        <text x="400" y="300" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#312e81">REDIRECT: User → API → Cache/DB → 302 → User</text>
      </g>
    </svg>
  );
}

// NEW: JWT auth flow
export function JwtAuthFlowDiagram() {
  return (
    <svg viewBox="0 0 800 280" className="w-full">
      <Arrow id="a7" />
      <g fontFamily="Inter, sans-serif" fontSize="12" fill="#1a1a1a">
        <rect x="20" y="30" width="140" height="50" rx="8" fill="#dbeafe" stroke="#312e81" strokeWidth="2" />
        <text x="90" y="55" textAnchor="middle" fontWeight="bold" fill="#312e81">Client</text>
        <text x="90" y="72" textAnchor="middle" fontSize="10">username + password</text>

        <line x1="160" y1="55" x2="240" y2="55" stroke="#a78bfa" strokeWidth="2" markerEnd="url(#a7)" />
        <text x="200" y="48" textAnchor="middle" fontSize="10" fill="#6b7280">1. login</text>

        <rect x="240" y="30" width="180" height="50" rx="8" fill="#fef3c7" stroke="#92400e" strokeWidth="2" />
        <text x="330" y="55" textAnchor="middle" fontWeight="bold" fill="#92400e">Auth Server</text>
        <text x="330" y="72" textAnchor="middle" fontSize="10">verify credentials</text>

        <line x1="420" y1="55" x2="500" y2="55" stroke="#a78bfa" strokeWidth="2" markerEnd="url(#a7)" />
        <text x="460" y="48" textAnchor="middle" fontSize="10" fill="#6b7280">2. issue JWT</text>

        <rect x="500" y="30" width="160" height="50" rx="8" fill="#d1fae5" stroke="#065f46" strokeWidth="2" />
        <text x="580" y="55" textAnchor="middle" fontWeight="bold" fill="#065f46">JWT</text>
        <text x="580" y="72" textAnchor="middle" fontSize="10">header.payload.sig</text>

        <line x1="500" y1="80" x2="240" y2="80" stroke="#a78bfa" strokeWidth="2" markerEnd="url(#a7)" />
        <line x1="240" y1="80" x2="160" y2="80" stroke="#a78bfa" strokeWidth="2" markerEnd="url(#a7)" />
        <text x="200" y="100" textAnchor="middle" fontSize="10" fill="#10b981">3. return token</text>

        <line x1="100" y1="150" x2="320" y2="150" stroke="#a78bfa" strokeWidth="2" markerEnd="url(#a7)" />
        <text x="200" y="143" textAnchor="middle" fontSize="10" fill="#6b7280">4. Authorization: Bearer ...</text>
        <text x="200" y="172" textAnchor="middle" fontSize="10" fill="#6b7280">on every request</text>

        <rect x="320" y="130" width="180" height="50" rx="8" fill="#fef3c7" stroke="#92400e" strokeWidth="2" />
        <text x="410" y="155" textAnchor="middle" fontWeight="bold" fill="#92400e">API Server</text>
        <text x="410" y="172" textAnchor="middle" fontSize="10">verify signature</text>

        <line x1="410" y1="180" x2="410" y2="220" stroke="#a78bfa" strokeWidth="2" markerEnd="url(#a7)" />

        <rect x="280" y="220" width="260" height="40" rx="6" fill="#d1fae5" stroke="#065f46" strokeWidth="2" />
        <text x="410" y="245" textAnchor="middle" fontSize="11" fill="#065f46">✅ Token valid → process request</text>
      </g>
    </svg>
  );
}

// NEW: OAuth flow
export function OAuthFlowDiagram() {
  return (
    <svg viewBox="0 0 800 320" className="w-full">
      <Arrow id="a8" />
      <g fontFamily="Inter, sans-serif" fontSize="12" fill="#1a1a1a">
        {[
          { x: 20, y: 30, fill: '#dbeafe', stroke: '#312e81', title: 'User', sub: 'browser' },
          { x: 200, y: 30, fill: '#fef3c7', stroke: '#92400e', title: 'Your App', sub: 'wants user data' },
          { x: 380, y: 30, fill: '#fce7f3', stroke: '#9d174d', title: 'Google', sub: 'authorizes' },
        ].map((n, i) => (
          <g key={i}>
            <rect x={n.x} y={n.y} width="140" height="50" rx="8" fill={n.fill} stroke={n.stroke} strokeWidth="2" />
            <text x={n.x + 70} y={n.y + 25} textAnchor="middle" fontWeight="bold" fill={n.stroke}>{n.title}</text>
            <text x={n.x + 70} y={n.y + 42} textAnchor="middle" fontSize="10">{n.sub}</text>
          </g>
        ))}

        <line x1="90" y1="80" x2="270" y2="105" stroke="#a78bfa" strokeWidth="2" markerEnd="url(#a8)" />
        <text x="180" y="90" textAnchor="middle" fontSize="10" fill="#6b7280">1. clicks "Login with Google"</text>

        <line x1="270" y1="125" x2="450" y2="105" stroke="#a78bfa" strokeWidth="2" markerEnd="url(#a8)" />
        <text x="360" y="115" textAnchor="middle" fontSize="10" fill="#6b7280">2. redirect to Google</text>

        <line x1="450" y1="80" x2="90" y2="150" stroke="#a78bfa" strokeWidth="2" markerEnd="url(#a8)" />
        <text x="270" y="143" textAnchor="middle" fontSize="10" fill="#6b7280">3. user logs in & approves</text>

        <line x1="90" y1="170" x2="270" y2="180" stroke="#a78bfa" strokeWidth="2" markerEnd="url(#a8)" />
        <text x="180" y="170" textAnchor="middle" fontSize="10" fill="#6b7280">4. redirect with code</text>

        <line x1="270" y1="195" x2="450" y2="195" stroke="#a78bfa" strokeWidth="2" markerEnd="url(#a8)" />
        <text x="360" y="190" textAnchor="middle" fontSize="10" fill="#6b7280">5. exchange code for token</text>

        <line x1="450" y1="220" x2="270" y2="220" stroke="#a78bfa" strokeWidth="2" markerEnd="url(#a8)" />
        <line x1="270" y1="220" x2="90" y2="220" stroke="#a78bfa" strokeWidth="2" markerEnd="url(#a8)" />
        <text x="180" y="213" textAnchor="middle" fontSize="10" fill="#10b981">6. logged in (no password shared!)</text>

        <rect x="20" y="260" width="600" height="40" rx="6" fill="#ecfdf5" stroke="#10b981" strokeWidth="2" />
        <text x="320" y="285" textAnchor="middle" fontSize="12" fill="#065f46" fontWeight="bold">
          🔐 Your app NEVER sees the user's Google password
        </text>
      </g>
    </svg>
  );
}

// NEW: Saga pattern
export function SagaFlowDiagram() {
  return (
    <svg viewBox="0 0 800 280" className="w-full">
      <Arrow id="a9" />
      <g fontFamily="Inter, sans-serif" fontSize="11" fill="#1a1a1a">
        <text x="400" y="20" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#312e81">Saga: Checkout Flow with Compensations</text>

        {/* Forward path */}
        {[
          { x: 20, y: 50, label: '1. Validate Cart', fill: '#d1fae5', stroke: '#065f46' },
          { x: 180, y: 50, label: '2. Reserve Stock', fill: '#d1fae5', stroke: '#065f46' },
          { x: 340, y: 50, label: '3. Charge Card', fill: '#d1fae5', stroke: '#065f46' },
          { x: 500, y: 50, label: '4. Create Order', fill: '#d1fae5', stroke: '#065f46' },
          { x: 660, y: 50, label: '5. Send Email', fill: '#d1fae5', stroke: '#065f46' },
        ].map((n, i) => (
          <g key={i}>
            <rect x={n.x} y={n.y} width="120" height="40" rx="6" fill={n.fill} stroke={n.stroke} strokeWidth="2" />
            <text x={n.x + 60} y={n.y + 25} textAnchor="middle" fontWeight="bold">{n.label}</text>
            {i < 4 && (
              <line x1={n.x + 120} y1="70" x2={n.x + 160} y2="70" stroke="#10b981" strokeWidth="2" markerEnd="url(#a9)" />
            )}
          </g>
        ))}

        <text x="400" y="115" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#10b981">✓ Happy path</text>

        {/* Failure scenario */}
        <text x="400" y="145" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#dc2626">✗ Failure at step 4 (Create Order)</text>

        {/* Compensations */}
        {[
          { x: 20, y: 165, label: '1. (no undo needed)' },
          { x: 180, y: 165, label: '2. Release Stock', fill: '#fef2f2', stroke: '#dc2626' },
          { x: 340, y: 165, label: '3. Refund Card', fill: '#fef2f2', stroke: '#dc2626' },
          { x: 500, y: 165, label: '4. (failed)' },
          { x: 660, y: 165, label: '5. (no email sent)' },
        ].map((n, i) => (
          <g key={i}>
            <rect x={n.x} y={n.y} width="120" height="35" rx="6" fill={n.fill || '#f1f5f9'} stroke={n.stroke || '#94a3b8'} strokeWidth="2" strokeDasharray={i === 0 || i === 3 || i === 4 ? "4" : ""} />
            <text x={n.x + 60} y={n.y + 22} textAnchor="middle">{n.label}</text>
            {i < 2 && (
              <line x1={n.x + 120} y1="180" x2={n.x + 160} y2="180" stroke="#dc2626" strokeWidth="2" markerEnd="url(#a9)" />
            )}
          </g>
        ))}

        <text x="400" y="220" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#dc2626">↶ Compensations run in reverse</text>

        <rect x="20" y="240" width="760" height="30" rx="6" fill="#fef3c7" stroke="#92400e" strokeWidth="2" />
        <text x="400" y="260" textAnchor="middle" fontSize="11" fill="#92400e">
          🎯 End state: consistent — order didn't exist, stock released, money refunded
        </text>
      </g>
    </svg>
  );
}

// NEW: TCP 3-way handshake
export function TcpHandshakeDiagram() {
  return (
    <svg viewBox="0 0 800 280" className="w-full">
      <defs>
        <marker id="tcpsyn" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#3b82f6" />
        </marker>
        <marker id="tcpsynack" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#10b981" />
        </marker>
        <marker id="tcpack" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#f59e0b" />
        </marker>
      </defs>

      {/* Title */}
      <text x="400" y="20" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="14" fontWeight="bold" fill="#1a1a1a">
        TCP 3-Way Handshake
      </text>

      {/* Two endpoints (vertical lifelines) */}
      <g fontFamily="Inter, sans-serif" fontSize="12">
        {/* Client box */}
        <rect x="80" y="40" width="120" height="40" rx="6" fill="#dbeafe" stroke="#1e40af" strokeWidth="2" />
        <text x="140" y="65" textAnchor="middle" fontWeight="bold" fill="#1e3a8a">Client</text>

        {/* Server box */}
        <rect x="600" y="40" width="120" height="40" rx="6" fill="#d1fae5" stroke="#065f46" strokeWidth="2" />
        <text x="660" y="65" textAnchor="middle" fontWeight="bold" fill="#065f46">Server</text>

        {/* Lifelines */}
        <line x1="140" y1="80" x2="140" y2="260" stroke="#94a3b8" strokeWidth="1" strokeDasharray="4 2" />
        <line x1="660" y1="80" x2="660" y2="260" stroke="#94a3b8" strokeWidth="1" strokeDasharray="4 2" />

        {/* Step 1: SYN (client → server) */}
        <line x1="140" y1="110" x2="640" y2="110" stroke="#3b82f6" strokeWidth="2" markerEnd="url(#tcpsyn)" />
        <text x="390" y="103" textAnchor="middle" fontWeight="bold" fill="#1e40af">① SYN (seq=x)</text>
        <text x="390" y="125" textAnchor="middle" fontSize="10" fill="#6b7280">Client → Server: "Let's synchronize"</text>

        {/* Step 2: SYN-ACK (server → client) */}
        <line x1="660" y1="160" x2="160" y2="160" stroke="#10b981" strokeWidth="2" markerEnd="url(#tcpsynack)" />
        <text x="390" y="153" textAnchor="middle" fontWeight="bold" fill="#065f46">② SYN + ACK (seq=y, ack=x+1)</text>
        <text x="390" y="175" textAnchor="middle" fontSize="10" fill="#6b7280">Server → Client: "OK, I acknowledge & synchronize back"</text>

        {/* Step 3: ACK (client → server) */}
        <line x1="140" y1="210" x2="640" y2="210" stroke="#f59e0b" strokeWidth="2" markerEnd="url(#tcpack)" />
        <text x="390" y="203" textAnchor="middle" fontWeight="bold" fill="#92400e">③ ACK (seq=x+1, ack=y+1)</text>
        <text x="390" y="225" textAnchor="middle" fontSize="10" fill="#6b7280">Client → Server: "Got it, connection established"</text>

        {/* Result label */}
        <rect x="280" y="245" width="240" height="25" rx="4" fill="#f1f5f9" stroke="#64748b" strokeWidth="1" />
        <text x="400" y="262" textAnchor="middle" fontWeight="bold" fill="#0f172a">
          ✓ Connection Established (ESTABLISHED)
        </text>
      </g>
    </svg>
  );
}

// NEW: Rate limiting flow
export function RateLimitFlowDiagram() {
  return (
    <svg viewBox="0 0 800 220" className="w-full">
      <Arrow id="a10" />
      <g fontFamily="Inter, sans-serif" fontSize="12" fill="#1a1a1a">
        <rect x="20" y="30" width="140" height="50" rx="8" fill="#dbeafe" stroke="#312e81" strokeWidth="2" />
        <text x="90" y="55" textAnchor="middle" fontWeight="bold" fill="#312e81">User</text>
        <text x="90" y="72" textAnchor="middle" fontSize="10">request #1</text>

        <line x1="160" y1="55" x2="240" y2="55" stroke="#a78bfa" strokeWidth="2" markerEnd="url(#a10)" />

        <rect x="240" y="30" width="160" height="50" rx="8" fill="#fef3c7" stroke="#92400e" strokeWidth="2" />
        <text x="320" y="55" textAnchor="middle" fontWeight="bold" fill="#92400e">Rate Limiter</text>
        <text x="320" y="72" textAnchor="middle" fontSize="10">check token bucket</text>

        <line x1="400" y1="55" x2="490" y2="40" stroke="#10b981" strokeWidth="2" markerEnd="url(#a10)" />
        <text x="445" y="33" textAnchor="middle" fontSize="10" fill="#10b981">tokens ≥ 1</text>

        <rect x="490" y="20" width="140" height="40" rx="6" fill="#d1fae5" stroke="#065f46" strokeWidth="2" />
        <text x="560" y="45" textAnchor="middle" fontWeight="bold" fill="#065f46">API</text>
        <text x="560" y="58" textAnchor="middle" fontSize="10">process request</text>

        <line x1="630" y1="40" x2="710" y2="40" stroke="#10b981" strokeWidth="2" markerEnd="url(#a10)" />
        <text x="670" y="33" textAnchor="middle" fontSize="10" fill="#10b981">200</text>

        <line x1="400" y1="80" x2="490" y2="105" stroke="#dc2626" strokeWidth="2" markerEnd="url(#a10)" />
        <text x="445" y="98" textAnchor="middle" fontSize="10" fill="#dc2626">tokens = 0</text>

        <rect x="490" y="95" width="140" height="40" rx="6" fill="#fef2f2" stroke="#dc2626" strokeWidth="2" />
        <text x="560" y="120" textAnchor="middle" fontWeight="bold" fill="#dc2626">429</text>
        <text x="560" y="133" textAnchor="middle" fontSize="10">Too Many Requests</text>

        <rect x="660" y="95" width="120" height="40" rx="6" fill="#fef2f2" stroke="#dc2626" strokeWidth="2" />
        <text x="720" y="120" textAnchor="middle" fontSize="10" fill="#dc2626">retry in 60s</text>

        {/* Token bucket */}
        <rect x="240" y="140" width="540" height="60" rx="6" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="2" />
        <text x="260" y="160" fontSize="11" fontWeight="bold">Token Bucket (capacity: 100, refill: 1/sec):</text>
        <g>
          {Array.from({ length: 10 }, (_, i) => (
            <rect key={i} x={260 + i * 50} y="170" width="40" height="20" rx="3"
              fill={i < 7 ? '#10b981' : i < 9 ? '#fbbf24' : '#dc2626'} />
          ))}
        </g>
        <text x="800" y="190" textAnchor="end" fontSize="10" fill="#6b7280">7 left</text>
      </g>
    </svg>
  );
}

export const DIAGRAMS = {
  'p1-request-flow': RequestFlowDiagram,
  'p1-tcp-ip': TcpHandshakeDiagram,
  'p2-3tier': ThreeTierDiagram,
  'p2-jwt': JwtStructureDiagram,
  'p2-rest': JwtAuthFlowDiagram,
  'p2-oauth': OAuthFlowDiagram,
  'p3-indexes': IndexVsScanDiagram,
  'p3-replication': MonolithVsMicroDiagram,
  'p4-cache-aside': CacheAsideDiagram,
  'p6-load-balancer': LoadBalancerDiagram,
  'p8-url-shortener': UrlShortenerDiagram,
  'p8-ecommerce': SagaFlowDiagram,
  'p6-rate-limiting': RateLimitFlowDiagram,
};
