"use client";

import { useMemo, useCallback, useState } from "react";
import styles from "./DummyTree.module.css";

const BRANCHES = [
  { id: "main", label: "main", color: "#2E8B57", x: 140 },
  { id: "develop", label: "develop", color: "#4682B4", x: 280 },
  { id: "feature-auth", label: "feature/auth", color: "#CD853F", x: 420 },
  { id: "feature-cache", label: "feature/cache", color: "#B8860B", x: 560 },
  { id: "hotfix-urgent", label: "hotfix/urgent", color: "#8B0000", x: 700 },
];

const COMMITS = [
  { id: "c1", branch: "main", y: 110, hash: "a1b2c3d", msg: "Initial commit", author: "alice" },
  { id: "c2", branch: "main", y: 200, hash: "b2c3d4e", msg: "Add project scaffolding", author: "alice" },
  { id: "c3", branch: "develop", y: 200, hash: "f3g4h5i", msg: "Setup CI pipeline", author: "bob" },
  { id: "c4", branch: "develop", y: 290, hash: "g4h5i6j", msg: "Add test suite", author: "bob" },
  { id: "c5", branch: "feature-auth", y: 290, hash: "k5l6m7n", msg: "Add OAuth flow", author: "charlie" },
  { id: "c6", branch: "develop", y: 380, hash: "h5i6j7k", msg: "Refactor API client", author: "bob" },
  { id: "c7", branch: "feature-auth", y: 380, hash: "l6m7n8o", msg: "Implement JWT", author: "charlie" },
  { id: "c8", branch: "feature-auth", y: 470, hash: "m7n8o9p", msg: "Add session store", author: "charlie" },
  { id: "c9", branch: "main", y: 470, hash: "c3d4e5f", msg: "Merge develop into main", author: "alice", merge: true, from: "develop" },
  { id: "c10", branch: "feature-cache", y: 380, hash: "n8o9p0q", msg: "Add Redis config", author: "dave" },
  { id: "c11", branch: "feature-cache", y: 470, hash: "o9p0q1r", msg: "Cache middleware", author: "dave" },
  { id: "c12", branch: "feature-cache", y: 560, hash: "p0q1r2s", msg: "TTL invalidation", author: "dave" },
  { id: "c13", branch: "develop", y: 560, hash: "i6j7k8l", msg: "Merge feature-cache", author: "bob", merge: true, from: "feature-cache" },
  { id: "c14", branch: "main", y: 650, hash: "d4e5f6g", msg: "Add dashboard page", author: "alice" },
  { id: "c15", branch: "develop", y: 650, hash: "j7k8l9m", msg: "Integrate analytics", author: "bob" },
  { id: "c16", branch: "develop", y: 740, hash: "k8l9m0n", msg: "Fix layout shift", author: "bob" },
  { id: "c17", branch: "main", y: 740, hash: "e5f6g7h", msg: "Merge develop into main", author: "alice", merge: true, from: "develop" },
  { id: "c18", branch: "main", y: 830, hash: "f6g7h8i", msg: "v1.0.0 release", author: "alice" },
  { id: "c19", branch: "hotfix-urgent", y: 830, hash: "q1r2s3t", msg: "Fix CSRF vulnerability", author: "eve" },
  { id: "c20", branch: "main", y: 920, hash: "g7h8i9j", msg: "Merge hotfix into main", author: "alice", merge: true, from: "hotfix-urgent" },
];

function seededRandom(seed) {
  let s = seed;
  return function () {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function lastCommitOnBranch(branchId, beforeY) {
  return COMMITS.filter((c) => c.branch === branchId && c.y < beforeY).sort((a, b) => b.y - a.y)[0];
}

function vinePathD(points, seed) {
  if (points.length < 2) return "";
  const rand = seededRandom(seed);
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const midY = (prev.y + curr.y) / 2;
    const dx = curr.x - prev.x;
    const wobble = (rand() - 0.5) * 18;
    const c1x = prev.x + dx * 0.25 + wobble;
    const c1y = midY;
    const c2x = prev.x + dx * 0.75 - wobble;
    const c2y = midY;
    d += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${curr.x} ${curr.y}`;
  }
  return d;
}

function mergePathD(fromX, fromY, toX, toY) {
  const midX = (fromX + toX) / 2;
  return `M ${fromX} ${fromY} C ${midX + 40} ${fromY + (toY - fromY) * 0.25}, ${midX - 40} ${fromY + (toY - fromY) * 0.75}, ${toX} ${toY}`;
}

function leafPath(cx, cy, size) {
  const s = size;
  return `M ${cx} ${cy - s} C ${cx + s * 0.7} ${cy - s * 0.3}, ${cx + s * 0.7} ${cy + s * 0.3}, ${cx} ${cy + s} C ${cx - s * 0.7} ${cy + s * 0.3}, ${cx - s * 0.7} ${cy - s * 0.3}, ${cx} ${cy - s} Z`;
}

export default function DummyTree({ onCommitClick }) {
  const [hovered, setHovered] = useState(null);

  const backgroundStars = useMemo(() => {
    const rand = seededRandom(7777);
    return Array.from({ length: 60 }, () => ({
      x: rand() * 840,
      y: rand() * 1000,
      r: rand() * 0.7 + 0.3,
      o: 0.2 + rand() * 0.3,
    }));
  }, []);

  const rootTendrils = useMemo(() => {
    const rand = seededRandom(9999);
    return Array.from({ length: 6 }, (_, i) => {
      const baseX = 100 + i * 130;
      return `M ${baseX} 985 Q ${baseX + (rand() - 0.5) * 30} 970 ${baseX + (rand() - 0.5) * 40} 1000`;
    });
  }, []);

  const vinePaths = useMemo(() => {
    return BRANCHES.map((b) => {
      const branchCommits = COMMITS.filter((c) => c.branch === b.id).sort((a, c) => a.y - c.y);
      if (branchCommits.length < 2) return null;
      const points = branchCommits.map((c) => ({ x: b.x, y: c.y }));
      return vinePathD(points, b.x * 13);
    });
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

  const handleEnter = useCallback((id) => setHovered(id), []);
  const handleLeave = useCallback(() => setHovered(null), []);

  return (
    <div className={styles.canvas}>
      <svg
        className={styles.svg}
        viewBox="0 0 840 1000"
        preserveAspectRatio="xMidYMid meet"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {BRANCHES.map((b) => (
            <radialGradient key={b.id} id={`node-${b.id}`} cx="40%" cy="35%" r="65%">
              <stop offset="0%" stopColor={b.color} stopOpacity="0.95" />
              <stop offset="100%" stopColor={b.color} stopOpacity="0.55" />
            </radialGradient>
          ))}

          <radialGradient id="merge-gold" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#F5DC9C" />
            <stop offset="60%" stopColor="#CFAF63" />
            <stop offset="100%" stopColor="#8B7038" />
          </radialGradient>

          <pattern id="bg-vines" width="120" height="120" patternUnits="userSpaceOnUse">
            <path
              d="M 0 60 Q 30 40 60 60 T 120 60"
              fill="none"
              stroke="#23362C"
              strokeWidth="0.4"
              strokeOpacity="0.18"
            />
          </pattern>

          <filter id="soft-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="1.8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <rect width="840" height="1000" fill="url(#bg-vines)" />

        {backgroundStars.map((s, i) => (
          <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#5C7065" opacity={s.o} />
        ))}

        <line x1="0" y1="60" x2="840" y2="60" stroke="#23362C" strokeWidth="0.6" strokeOpacity="0.5" />
        <line x1="0" y1="950" x2="840" y2="950" stroke="#23362C" strokeWidth="0.6" strokeOpacity="0.5" />

        <text x="420" y="40" className={styles.subtitle}>
          ▲ Lineage Traced ▼
        </text>

        {BRANCHES.map((b) => (
          <g key={`header-${b.id}`}>
            <text x={b.x} y={82} className={styles.branchHeader} fill={b.color}>
              {b.label}
            </text>
            <line
              x1={b.x - 32}
              y1={92}
              x2={b.x + 32}
              y2={92}
              stroke={b.color}
              strokeWidth="0.6"
              strokeOpacity="0.4"
            />
          </g>
        ))}

        {BRANCHES.map((b, idx) => {
          const d = vinePaths[idx];
          if (!d) return null;
          return (
            <g key={`vine-${b.id}`}>
              <path
                d={d}
                className={styles.vine}
                stroke={b.color}
                strokeWidth="4"
                strokeOpacity="0.12"
                filter="url(#soft-glow)"
              />
              <path d={d} className={styles.vine} stroke={b.color} strokeWidth="1.5" strokeOpacity="0.75" />
            </g>
          );
        })}

        {COMMITS.filter((c) => c.merge).map((c) => {
          const target = BRANCHES.find((br) => br.id === c.branch);
          const source = lastCommitOnBranch(c.from, c.y);
          if (!target || !source) return null;
          const srcBranch = BRANCHES.find((br) => br.id === source.branch);
          if (!srcBranch) return null;
          const d = mergePathD(srcBranch.x, source.y, target.x, c.y);
          return (
            <g key={`merge-vine-${c.id}`}>
              <path
                d={d}
                className={styles.mergeVine}
                strokeWidth="3"
                strokeOpacity="0.15"
                filter="url(#soft-glow)"
              />
              <path d={d} className={styles.mergeVine} />
            </g>
          );
        })}

        {COMMITS.map((c) => {
          const b = BRANCHES.find((br) => br.id === c.branch);
          if (!b) return null;
          const cx = b.x;
          const isMerge = c.merge;
          const isHovered = hovered === c.id;

          return (
            <g
              key={c.id}
              className={isMerge ? styles.mergeNode : styles.commitNode}
              onClick={() => handleClick(c)}
              onMouseEnter={() => handleEnter(c.id)}
              onMouseLeave={handleLeave}
            >
              {isMerge ? (
                <>
                  <path
                    d={leafPath(cx, c.y, 7)}
                    fill="url(#merge-gold)"
                    stroke="#F5DC9C"
                    strokeWidth="0.6"
                  />
                  <line
                    x1={cx}
                    y1={c.y - 6}
                    x2={cx}
                    y2={c.y + 6}
                    stroke="#0D1310"
                    strokeWidth="0.5"
                    strokeOpacity="0.6"
                  />
                </>
              ) : (
                <>
                  <circle cx={cx} cy={c.y} r="5" fill="url(#node-{b.id})" />
                  <circle cx={cx} cy={c.y} r="5" fill={`url(#node-${b.id})`} stroke="#D1DCD6" strokeWidth="0.8" />
                  <circle cx={cx} cy={c.y} r="1.5" fill="#0D1310" />
                </>
              )}

              <text x={cx + 14} y={c.y + 3.5} className={styles.commitHash}>
                {c.hash}
              </text>

              {isHovered && (
                <g className={styles.commitTooltip} transform={`translate(${cx + 70}, ${c.y - 28})`}>
                  <rect
                    x="0"
                    y="0"
                    width="160"
                    height="40"
                    rx="2"
                    fill="#131D18"
                    stroke="#CFAF63"
                    strokeOpacity="0.6"
                    strokeWidth="0.5"
                  />
                  <text x="8" y="14" fontSize="9" fontFamily="'Fira Code', monospace" fill="#CFAF63">
                    {c.hash}
                  </text>
                  <text
                    x="8"
                    y="27"
                    fontSize="8"
                    fontFamily="Georgia, serif"
                    fontStyle="italic"
                    fill="#D1DCD6"
                  >
                    {c.msg.length > 28 ? c.msg.slice(0, 26) + "…" : c.msg}
                  </text>
                  <text x="8" y="37" fontSize="7" fontFamily="'Fira Code', monospace" fill="#5C7065">
                    by {c.author}
                  </text>
                </g>
              )}
            </g>
          );
        })}

        {rootTendrils.map((d, i) => (
          <path
            key={`root-${i}`}
            d={d}
            fill="none"
            stroke="#2E8B57"
            strokeWidth="1.2"
            strokeOpacity="0.18"
            strokeLinecap="round"
          />
        ))}

        <text x="420" y="978" className={styles.legend}>
          20 commits · 5 branches · 4 grafts
        </text>
      </svg>
    </div>
  );
}
