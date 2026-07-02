// Reusable SVG diagrams that match the concepts in the curriculum.
// Light-theme SVGs that look good on a dark glass card.

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
      <g fontFamily="Inter, sans-serif" fontSize="11" fill="#e2e8f0">
        {[
          { x: 10,  fill: '#1e293b', stroke: '#06b6d4', title: 'Browser',  sub: 'Client' },
          { x: 170, fill: '#1e293b', stroke: '#ec4899', title: 'ISP / DNS', sub: 'Resolves URL' },
          { x: 330, fill: '#1e293b', stroke: '#06b6d4', title: 'CDN / Edge', sub: 'Closest server' },
          { x: 490, fill: '#1e293b', stroke: '#10b981', title: 'Web Server', sub: 'Nginx' },
          { x: 650, fill: '#1e293b', stroke: '#f59e0b', title: 'App + DB', sub: 'Response' },
        ].map((n, i) => (
          <g key={i}>
            <rect x={n.x} y="60" width="120" height="50" rx="8" fill={n.fill} stroke={n.stroke} strokeWidth="2" />
            <text x={n.x + 60} y="83" textAnchor="middle" fontWeight="bold">{n.title}</text>
            <text x={n.x + 60} y="100" textAnchor="middle" fontSize="10" fill="#94a3b8">{n.sub}</text>
          </g>
        ))}
        {[130, 290, 450, 610].map((x, i) => (
          <line key={i} x1={x} y1="85" x2={x + 40} y2="85" stroke="#a78bfa" strokeWidth="2" markerEnd="url(#a1)" />
        ))}
        <text x="400" y="30" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#c4b5fd">Request Flow: Browser → DNS → CDN → Server → App → DB</text>
        <text x="400" y="150" textAnchor="middle" fontSize="10" fill="#94a3b8">Each step adds latency. Total budget: aim for under 200ms.</text>
      </g>
    </svg>
  );
}

export function ThreeTierDiagram() {
  return (
    <svg viewBox="0 0 700 320" className="w-full">
      <Arrow id="a2" />
      <g fontFamily="Inter, sans-serif" fontSize="12" fill="#e2e8f0">
        {[
          { y: 20,  fill: '#fce7f3', stroke: '#9d174d', title: 'Presentation Tier', sub: 'UI, React, mobile app', sub2: 'User-facing', color: '#9d174d' },
          { y: 120, fill: '#dbeafe', stroke: '#312e81', title: 'Application / Logic Tier', sub: 'Node, Spring, Django — business rules', sub2: 'The "brain"', color: '#312e81' },
          { y: 220, fill: '#d1fae5', stroke: '#065f46', title: 'Data Tier', sub: 'PostgreSQL, MongoDB, Redis, S3', sub2: 'Storage', color: '#065f46' },
        ].map((t, i) => (
          <g key={i}>
            <rect x="100" y={t.y} width="500" height="80" rx="10" fill={t.fill} stroke={t.stroke} strokeWidth="2" />
            <text x="350" y={t.y + 30} textAnchor="middle" fontWeight="bold" fontSize="15" fill={t.color}>{t.title}</text>
            <text x="350" y={t.y + 55} textAnchor="middle" fill="#1a1a1a">{t.sub}</text>
            <text x="595" y={t.y + 25} textAnchor="end" fontSize="10" fill="#6b7280">{t.sub2}</text>
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
      <g fontFamily="Inter, sans-serif" fontSize="11" fill="#e2e8f0">
        {[
          { x: 20,  fill: '#dbeafe', stroke: '#312e81', title: 'App', sub: 'Your code' },
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
      <g fontFamily="Inter, sans-serif" fontSize="12" fill="#e2e8f0">
        <rect x="20"  y="35" width="240" height="50" rx="8" fill="#fce7f3" stroke="#9d174d" strokeWidth="2" />
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

export function TcpHandshakeDiagram() {
  return (
    <svg viewBox="0 0 700 220" className="w-full">
      <Arrow id="a4" />
      <g fontFamily="Inter, sans-serif" fontSize="11" fill="#e2e8f0">
        <text x="80" y="25" fontWeight="bold" fill="#06b6d4">Client</text>
        <text x="550" y="25" fontWeight="bold" fill="#ec4899">Server</text>
        <line x1="100" y1="40" x2="100" y2="200" stroke="#06b6d4" strokeWidth="2" />
        <line x1="550" y1="40" x2="550" y2="200" stroke="#ec4899" strokeWidth="2" />
        <line x1="105" y1="75" x2="545" y2="75" stroke="#a78bfa" strokeWidth="2" markerEnd="url(#a4)" />
        <text x="325" y="68" textAnchor="middle" fontWeight="bold">1. SYN (seq=x)</text>
        <text x="325" y="90" textAnchor="middle" fontSize="10" fill="#94a3b8">"I want to connect"</text>
        <line x1="545" y1="125" x2="105" y2="125" stroke="#a78bfa" strokeWidth="2" markerEnd="url(#a4)" />
        <text x="325" y="118" textAnchor="middle" fontWeight="bold">2. SYN + ACK (ack=x+1)</text>
        <text x="325" y="140" textAnchor="middle" fontSize="10" fill="#94a3b8">"OK, I agree"</text>
        <line x1="105" y1="175" x2="545" y2="175" stroke="#a78bfa" strokeWidth="2" markerEnd="url(#a4)" />
        <text x="325" y="168" textAnchor="middle" fontWeight="bold">3. ACK (ack=y+1)</text>
        <text x="325" y="190" textAnchor="middle" fontSize="10" fill="#94a3b8">"Confirmed, ready!"</text>
      </g>
    </svg>
  );
}

export function IndexVsScanDiagram() {
  return (
    <svg viewBox="0 0 800 230" className="w-full">
      <g fontFamily="Inter, sans-serif" fontSize="11" fill="#e2e8f0">
        <text x="200" y="22" textAnchor="middle" fontWeight="bold" fontSize="13" fill="#dc2626">WITHOUT INDEX — full scan O(n)</text>
        <rect x="20" y="35" width="360" height="170" rx="8" fill="#fef2f2" stroke="#dc2626" strokeWidth="2" />
        {['1 Alice ✗', '2 Bob ✗', '3 Carol ✗', '4 Dave ✗', '5 Eve ✗', '6 Frank ✓', '7 Grace ✗'].map((t, i) => (
          <text key={i} x="35" y={60 + i * 18} fill={i === 5 ? '#065f46' : '#e2e8f0'} fontWeight={i === 5 ? 'bold' : 'normal'}>{t}</text>
        ))}
        <text x="200" y="220" textAnchor="middle" fontSize="10" fill="#dc2626">Checks every row</text>
        <text x="600" y="22" textAnchor="middle" fontWeight="bold" fontSize="13" fill="#10b981">WITH INDEX — B-Tree O(log n)</text>
        <rect x="420" y="35" width="360" height="170" rx="8" fill="#d1fae5" stroke="#10b981" strokeWidth="2" />
        <text x="600" y="65" textAnchor="middle" fontWeight="bold" fill="#312e81">B-Tree on id</text>
        <text x="600" y="85" textAnchor="middle" fontSize="10" fill="#94a3b8">[1,2,3] → [4,5,6] → [7,8,9]</text>
        <text x="600" y="120" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#10b981">→ jump to id=6 → Frank</text>
        <text x="600" y="160" textAnchor="middle" fontSize="10">3 comparisons vs 6 scans</text>
        <text x="600" y="220" textAnchor="middle" fontSize="10" fill="#10b981">Exponential speedup</text>
      </g>
    </svg>
  );
}

export function MonolithVsMicroDiagram() {
  return (
    <svg viewBox="0 0 800 250" className="w-full">
      <g fontFamily="Inter, sans-serif" fontSize="11" fill="#e2e8f0">
        <text x="200" y="22" textAnchor="middle" fontWeight="bold" fill="#ec4899">MONOLITH</text>
        <rect x="50" y="35" width="300" height="200" rx="10" fill="#fce7f3" stroke="#ec4899" strokeWidth="2" />
        {['Users', 'Orders', 'Payments', 'Notifications'].map((m, i) => (
          <g key={i}>
            <rect x="70" y={55 + i * 42} width="260" height="30" fill="#1e293b" stroke="#ec4899" />
            <text x="200" y={75 + i * 42} textAnchor="middle">{m} Module</text>
          </g>
        ))}
        <text x="600" y="22" textAnchor="middle" fontWeight="bold" fill="#10b981">MICROSERVICES</text>
        <rect x="450" y="35" width="300" height="200" rx="10" fill="#d1fae5" stroke="#10b981" strokeWidth="2" />
        {[
          { x: 470, y: 55, label: 'Users' }, { x: 610, y: 55, label: 'Orders' },
          { x: 470, y: 125, label: 'Payments' }, { x: 610, y: 125, label: 'Notify' },
        ].map((m, i) => (
          <g key={i}>
            <rect x={m.x} y={m.y} width="120" height="50" fill="#1e293b" stroke="#10b981" />
            <text x={m.x + 60} y={m.y + 30} textAnchor="middle">{m.label}</text>
          </g>
        ))}
        <text x="600" y="200" textAnchor="middle" fontSize="10" fill="#f59e0b">↕ API gateway</text>
      </g>
    </svg>
  );
}

export function LoadBalancerDiagram() {
  return (
    <svg viewBox="0 0 700 200" className="w-full">
      <Arrow id="a5" />
      <g fontFamily="Inter, sans-serif" fontSize="11" fill="#e2e8f0">
        {['User A', 'User B', 'User C'].map((u, i) => (
          <text key={i} x={80 + i * 280} y="25" textAnchor="middle" fontWeight="bold" fill="#06b6d4">{u}</text>
        ))}
        {[80, 360, 640].map((x, i) => (
          <line key={i} x1={x} y1="40" x2="350" y2="90" stroke="#a78bfa" strokeWidth="2" />
        ))}
        <rect x="270" y="90" width="160" height="50" rx="8" fill="#fce7f3" stroke="#ec4899" strokeWidth="2" />
        <text x="350" y="115" textAnchor="middle" fontWeight="bold" fill="#ec4899">Load Balancer</text>
        <text x="350" y="132" textAnchor="middle" fontSize="10" fill="#94a3b8">Nginx / ALB / HAProxy</text>
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

// Map concept IDs to their diagram (or null if no specific diagram)
export const DIAGRAMS = {
  'p1-request-flow': RequestFlowDiagram,
  'p1-tcp-ip': TcpHandshakeDiagram,
  'p2-3tier': ThreeTierDiagram,
  'p2-jwt': JwtStructureDiagram,
  'p2-monolith-vs-micro': MonolithVsMicroDiagram,
  'p3-indexes': IndexVsScanDiagram,
  'p4-cache-aside': CacheAsideDiagram,
  'p6-load-balancer': LoadBalancerDiagram,
};
