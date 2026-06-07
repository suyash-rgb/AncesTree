"use client";

import { useMemo, useCallback } from "react";

const BRANCHES = [
  { id: "main", label: "main", color: "#2E8B57", x: 120 },
  { id: "develop", label: "develop", color: "#4682B4", x: 260 },
  { id: "feature-auth", label: "feature/auth", color: "#CD853F", x: 400 },
  { id: "feature-cache", label: "feature/cache", color: "#B8860B", x: 540 },
  { id: "hotfix-urgent", label: "hotfix/urgent", color: "#8B0000", x: 680 },
];

const COMMITS = [
  { id: "c1", branch: "main", y: 90, hash: "a1b2c3d", msg: "Initial commit", author: "alice" },
  { id: "c2", branch: "main", y: 180, hash: "b2c3d4e", msg: "Add project scaffolding", author: "alice" },
  { id: "c3", branch: "develop", y: 180, hash: "f3g4h5i", msg: "Setup CI pipeline", author: "bob" },
  { id: "c4", branch: "develop", y: 270, hash: "g4h5i6j", msg: "Add test suite", author: "bob" },
  { id: "c5", branch: "feature-auth", y: 270, hash: "k5l6m7n", msg: "Add OAuth flow", author: "charlie" },
  { id: "c6", branch: "develop", y: 360, hash: "h5i6j7k", msg: "Refactor API client", author: "bob" },
  { id: "c7", branch: "feature-auth", y: 360, hash: "l6m7n8o", msg: "Implement JWT", author: "charlie" },
  { id: "c8", branch: "feature-auth", y: 450, hash: "m7n8o9p", msg: "Add session store", author: "charlie" },
  { id: "c9", branch: "main", y: 450, hash: "c3d4e5f", msg: "Merge develop into main", author: "alice", merge: true, from: "develop" },
  { id: "c10", branch: "feature-cache", y: 360, hash: "n8o9p0q", msg: "Add Redis config", author: "dave" },
  { id: "c11", branch: "feature-cache", y: 450, hash: "o9p0q1r", msg: "Cache middleware", author: "dave" },
  { id: "c12", branch: "feature-cache", y: 540, hash: "p0q1r2s", msg: "TTL invalidation", author: "dave" },
  { id: "c13", branch: "develop", y: 540, hash: "i6j7k8l", msg: "Merge feature-cache", author: "bob", merge: true, from: "feature-cache" },
  { id: "c14", branch: "main", y: 630, hash: "d4e5f6g", msg: "Add dashboard page", author: "alice" },
  { id: "c15", branch: "develop", y: 630, hash: "j7k8l9m", msg: "Integrate analytics", author: "bob" },
  { id: "c16", branch: "develop", y: 720, hash: "k8l9m0n", msg: "Fix layout shift", author: "bob" },
  { id: "c17", branch: "main", y: 720, hash: "e5f6g7h", msg: "Merge develop into main", author: "alice", merge: true, from: "develop" },
  { id: "c18", branch: "main", y: 810, hash: "f6g7h8i", msg: "v1.0.0 release", author: "alice" },
  { id: "c19", branch: "hotfix-urgent", y: 810, hash: "q1r2s3t", msg: "Fix CSRF vulnerability", author: "eve" },
  { id: "c20", branch: "main", y: 900, hash: "g7h8i9j", msg: "Merge hotfix into main", author: "alice", merge: true, from: "hotfix-urgent" },
];

function lastCommitOnBranch(branchId, beforeY) {
  return COMMITS.filter((c) => c.branch === branchId && c.y < beforeY).sort((a, b) => b.y - a.y)[0];
}

export default function DummyTree({ onCommitClick }) {
  const starPositions = useMemo(() => {
    const pts = [];
    for (let i = 0; i < 100; i++) {
      pts.push({ x: Math.random() * 800, y: Math.random() * 1000, r: Math.random() * 0.8 + 0.3 });
    }
    return pts;
  }, []);

  const handleClick = useCallback(
    (commit) => {
      if (onCommitClick) {
        onCommitClick({
          hash: commit.hash,
          message: commit.msg,
          author: commit.author,
          date: "2026-06-07",
        });
      }
    },
    [onCommitClick]
  );

  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 800 1000"
      preserveAspectRatio="xMidYMid meet"
      className="min-w-[800px] min-h-[1000px]"
    >
      <defs>
        {BRANCHES.map((b) => (
          <filter key={`glow-${b.id}`}>
            <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor={b.color} floodOpacity="0.6" />
          </filter>
        ))}
        <filter id="glow-gold">
          <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#CFAF63" floodOpacity="0.7" />
        </filter>
        {BRANCHES.map((b) => {
          const id = b.id.replace("feature-", "").replace("hotfix-", "");
          return (
            <radialGradient key={id} id={`node-${id}`} cx="40%" cy="35%">
              <stop offset="0%" stopColor={lighten(b.color, 40)} />
              <stop offset="100%" stopColor={b.color} />
            </radialGradient>
          );
        })}
        <pattern id="bg-grid" width="60" height="60" patternUnits="userSpaceOnUse">
          <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#23362C" strokeWidth="0.5" strokeOpacity="0.15" />
        </pattern>
      </defs>

      <rect width="800" height="1000" fill="#0D1310" />
      <rect width="800" height="1000" fill="url(#bg-grid)" />

      {starPositions.map((s, i) => (
        <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#5C7065" opacity={0.3 + Math.random() * 0.3} />
      ))}

      <g stroke="#23362C" strokeWidth="1" strokeOpacity="0.4">
        <line x1="0" y1="55" x2="800" y2="55" strokeDasharray="3 5" />
        <line x1="0" y1="945" x2="800" y2="945" strokeDasharray="3 5" />
      </g>

      {BRANCHES.map((b) => (
        <g key={`header-${b.id}`}>
          <text x={b.x} y={32} textAnchor="middle" fill={b.color} fontSize="11" fontFamily="Georgia, serif" fontWeight="bold" letterSpacing="1.5">
            {b.label}
          </text>
          <line x1={b.x - 28} y1={42} x2={b.x + 28} y2={42} stroke={b.color} strokeWidth="0.5" strokeOpacity="0.25" />
        </g>
      ))}

      <g>
        {BRANCHES.map((b) => (
          <line key={`line-bg-${b.id}`} x1={b.x + 1} y1={70} x2={b.x + 1} y2={930} stroke={b.color} strokeWidth="1" strokeOpacity="0.1" />
        ))}
        {BRANCHES.map((b) => (
          <line key={`line-${b.id}`} x1={b.x} y1={70} x2={b.x} y2={930} stroke={b.color} strokeWidth="2" strokeOpacity="0.4" />
        ))}
      </g>

      {COMMITS.filter((c) => c.merge).map((c) => {
        const target = BRANCHES.find((br) => br.id === c.branch);
        const source = lastCommitOnBranch(c.from, c.y);
        if (!target || !source) return null;
        const srcBranch = BRANCHES.find((br) => br.id === source.branch);
        if (!srcBranch) return null;
        const mx = (target.x + srcBranch.x) / 2;
        return (
          <path
            key={`merge-line-${c.id}`}
            d={`M ${srcBranch.x} ${source.y} Q ${mx} ${(source.y + c.y) / 2} ${target.x} ${c.y}`}
            fill="none"
            stroke="#CFAF63"
            strokeWidth="1"
            strokeDasharray="4 4"
            strokeOpacity="0.5"
          />
        );
      })}

      {COMMITS.map((c) => {
        const b = BRANCHES.find((br) => br.id === c.branch);
        if (!b) return null;
        const cx = b.x;
        const isMerge = c.merge;
        const gradId = `url(#node-${b.id.replace("feature-", "").replace("hotfix-", "")})`;

        return (
          <g
            key={c.id}
            onClick={() => handleClick(c)}
            style={{ cursor: "pointer" }}
          >
            {isMerge ? (
              <>
                <rect
                  x={cx - 10}
                  y={c.y - 8}
                  width={20}
                  height={16}
                  rx={2}
                  fill="#CFAF63"
                  filter="url(#glow-gold)"
                  stroke="#CFAF63"
                  strokeWidth="1"
                />
                <text x={cx} y={c.y + 4} textAnchor="middle" fill="#0D1310" fontSize="8" fontFamily="monospace" fontWeight="bold">
                  M
                </text>
              </>
            ) : (
              <>
                <circle cx={cx} cy={c.y} r={7} fill={gradId} filter={`url(#glow-${b.id})`} />
                <circle cx={cx} cy={c.y} r={3} fill="#0D1310" opacity="0.5" />
              </>
            )}
            <text x={cx + 14} y={c.y + 3.5} fill="#D1DCD6" fontSize="9.5" fontFamily="'Fira Code', 'Courier New', monospace" fontWeight="bold">
              {c.hash}
            </text>
            <title>{`${c.msg}\n${c.author}\n${c.hash}`}</title>
          </g>
        );
      })}

      {BRANCHES.map((b) => (
        <g key={`vines-${b.id}`} opacity="0.12">
          {[70, 170, 270, 370, 470, 570, 670, 770, 870].map((y) => (
            <path
              key={`leaf-${b.id}-${y}`}
              d={`M ${b.x - 4} ${y} Q ${b.x - 12} ${y - 6} ${b.x - 8} ${y - 2} Q ${b.x - 4} ${y - 2} ${b.x} ${y}`}
              fill="none"
              stroke={b.color}
              strokeWidth="1"
            />
          ))}
        </g>
      ))}

      <g opacity="0.08">
        {[0, 1, 2, 3, 4].map((i) => (
          <path
            key={`root-${i}`}
            d={`M ${80 + i * 160} 980 Q ${100 + i * 160} 960 ${80 + i * 160 + 30} 1000`}
            fill="none"
            stroke="#2E8B57"
            strokeWidth="1.5"
          />
        ))}
      </g>

      <text x="400" y="985" textAnchor="middle" fill="#5C7065" fontSize="10" fontFamily="Georgia, serif" fontStyle="italic">
        20 commits · 5 branches · lineage traced
      </text>
    </svg>
  );
}

function lighten(hex, percent) {
  const num = parseInt(hex.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.min(255, (num >> 16) + amt);
  const G = Math.min(255, ((num >> 8) & 0x00ff) + amt);
  const B = Math.min(255, (num & 0x0000ff) + amt);
  return `#${(1 << 24 | R << 16 | G << 8 | B).toString(16).slice(1)}`;
}
