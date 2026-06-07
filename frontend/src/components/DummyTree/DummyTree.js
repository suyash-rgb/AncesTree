"use client";

import { useMemo, useCallback, useState } from "react";
import styles from "./DummyTree.module.css";

const BRANCHES = [
  { id: "main", label: "main", color: "#2E8B57", x: 0.18, vx: 280 },
  { id: "develop", label: "develop", color: "#4682B4", x: 0.36, vx: 560 },
  { id: "feature-auth", label: "feature/auth", color: "#CD853F", x: 0.54, vx: 840 },
  { id: "feature-cache", label: "feature/cache", color: "#B8860B", x: 0.72, vx: 1120 },
  { id: "hotfix-urgent", label: "hotfix/urgent", color: "#8B0000", x: 0.88, vx: 1370 },
];

const COMMITS = [
  { id: "c1", branch: "main", y: 140, hash: "a1b2c3d", msg: "Initial commit", author: "alice" },
  { id: "c2", branch: "main", y: 230, hash: "b2c3d4e", msg: "Add project scaffolding", author: "alice" },
  { id: "c3", branch: "develop", y: 230, hash: "f3g4h5i", msg: "Setup CI pipeline", author: "bob" },
  { id: "c4", branch: "develop", y: 320, hash: "g4h5i6j", msg: "Add test suite", author: "bob" },
  { id: "c5", branch: "feature-auth", y: 320, hash: "k5l6m7n", msg: "Add OAuth flow", author: "charlie" },
  { id: "c6", branch: "develop", y: 410, hash: "h5i6j7k", msg: "Refactor API client", author: "bob" },
  { id: "c7", branch: "feature-auth", y: 410, hash: "l6m7n8o", msg: "Implement JWT", author: "charlie" },
  { id: "c8", branch: "feature-auth", y: 500, hash: "m7n8o9p", msg: "Add session store", author: "charlie" },
  { id: "c9", branch: "main", y: 500, hash: "c3d4e5f", msg: "Merge develop into main", author: "alice", merge: true, from: "develop" },
  { id: "c10", branch: "feature-cache", y: 410, hash: "n8o9p0q", msg: "Add Redis config", author: "dave" },
  { id: "c11", branch: "feature-cache", y: 500, hash: "o9p0q1r", msg: "Cache middleware", author: "dave" },
  { id: "c12", branch: "feature-cache", y: 590, hash: "p0q1r2s", msg: "TTL invalidation", author: "dave" },
  { id: "c13", branch: "develop", y: 590, hash: "i6j7k8l", msg: "Merge feature-cache", author: "bob", merge: true, from: "feature-cache" },
  { id: "c14", branch: "main", y: 680, hash: "d4e5f6g", msg: "Add dashboard page", author: "alice" },
  { id: "c15", branch: "develop", y: 680, hash: "j7k8l9m", msg: "Integrate analytics", author: "bob" },
  { id: "c16", branch: "develop", y: 770, hash: "k8l9m0n", msg: "Fix layout shift", author: "bob" },
  { id: "c17", branch: "main", y: 770, hash: "e5f6g7h", msg: "Merge develop into main", author: "alice", merge: true, from: "develop" },
  { id: "c18", branch: "main", y: 860, hash: "f6g7h8i", msg: "v1.0.0 release", author: "alice" },
  { id: "c19", branch: "hotfix-urgent", y: 860, hash: "q1r2s3t", msg: "Fix CSRF vulnerability", author: "eve" },
  { id: "c20", branch: "main", y: 950, hash: "g7h8i9j", msg: "Merge hotfix into main", author: "alice", merge: true, from: "hotfix-urgent" },
];

const SVG_WIDTH = 1560;
const SVG_HEIGHT = 1050;

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
    const wobble = (rand() - 0.5) * 22;
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
  return `M ${fromX} ${fromY} C ${midX + 60} ${fromY + (toY - fromY) * 0.25}, ${midX - 60} ${fromY + (toY - fromY) * 0.75}, ${toX} ${toY}`;
}

function leafPath(cx, cy, size) {
  const s = size;
  return `M ${cx} ${cy - s} C ${cx + s * 0.7} ${cy - s * 0.3}, ${cx + s * 0.7} ${cy + s * 0.3}, ${cx} ${cy + s} C ${cx - s * 0.7} ${cy + s * 0.3}, ${cx - s * 0.7} ${cy - s * 0.3}, ${cx} ${cy - s} Z`;
}

function mountainPath(rand, baseY, peaks) {
  let d = `M -20 ${baseY}`;
  let x = 0;
  for (let i = 0; i < peaks; i++) {
    const w = 80 + rand() * 180;
    const h = 40 + rand() * 80;
    d += ` L ${x + w * 0.3} ${baseY - h * 0.6} L ${x + w * 0.5} ${baseY - h} L ${x + w * 0.7} ${baseY - h * 0.7} L ${x + w} ${baseY}`;
    x += w;
  }
  d += ` L ${SVG_WIDTH + 20} ${baseY} L ${SVG_WIDTH + 20} ${SVG_HEIGHT} L -20 ${SVG_HEIGHT} Z`;
  return d;
}

function treeCanopyPath() {
  let d = `M -20 0`;
  for (let x = 0; x < SVG_WIDTH + 20; x += 35) {
    const bump = 20 + Math.abs(Math.sin(x * 0.013)) * 25;
    d += ` Q ${x + 17} ${bump} ${x + 35} 0`;
  }
  d += ` L ${SVG_WIDTH + 20} 0 L ${SVG_WIDTH + 20} -10 L -20 -10 Z`;
  return d;
}

export default function DummyTree({ onCommitClick }) {
  const [hovered, setHovered] = useState(null);

  const branches = useMemo(
    () => BRANCHES.map((b) => ({ ...b, vx: b.x * SVG_WIDTH })),
    []
  );

  const backgroundStars = useMemo(() => {
    const rand = seededRandom(7777);
    return Array.from({ length: 70 }, () => ({
      x: rand() * SVG_WIDTH,
      y: rand() * 200,
      r: rand() * 0.8 + 0.3,
      o: 0.4 + rand() * 0.5,
    }));
  }, []);

  const dustMotes = useMemo(() => {
    const rand = seededRandom(5555);
    return Array.from({ length: 80 }, () => ({
      x: rand() * SVG_WIDTH,
      y: rand() * SVG_HEIGHT,
      r: rand() * 1.2 + 0.3,
      delay: rand() * 6,
    }));
  }, []);

  const godRays = useMemo(() => {
    return [
      { x: 200, w: 140, delay: 0, o: 0.32 },
      { x: 480, w: 110, delay: 1.5, o: 0.28 },
      { x: 760, w: 180, delay: 0.8, o: 0.35 },
      { x: 1080, w: 130, delay: 2.2, o: 0.3 },
      { x: 1340, w: 160, delay: 1.0, o: 0.28 },
    ];
  }, []);

  const waterfallDroplets = useMemo(() => {
    const rand = seededRandom(3333);
    const cx = 1340;
    return Array.from({ length: 60 }, () => ({
      x: cx + (rand() - 0.5) * 70,
      y: rand() * (SVG_HEIGHT - 100),
      r: rand() * 1.5 + 0.4,
      delay: rand() * 4,
      o: 0.6 + rand() * 0.4,
    }));
  }, []);

  const leaves = useMemo(() => {
    const rand = seededRandom(2222);
    return Array.from({ length: 50 }, () => ({
      x: rand() * SVG_WIDTH,
      y: rand() * SVG_HEIGHT,
      r: rand() * 2 + 1.2,
      rot: rand() * 360,
      delay: rand() * 8,
      hue: rand() > 0.5 ? "#2E8B57" : "#4682B4",
    }));
  }, []);

  const mountainsBack = useMemo(() => {
    const rand = seededRandom(1111);
    return mountainPath(rand, 380, 14);
  }, []);

  const mountainsFront = useMemo(() => {
    const rand = seededRandom(2223);
    return mountainPath(rand, 460, 18);
  }, []);

  const treeCanopy = useMemo(() => treeCanopyPath(), []);

  const rootTendrils = useMemo(() => {
    const rand = seededRandom(9999);
    return Array.from({ length: 14 }, (_, i) => {
      const baseX = (i / 14) * SVG_WIDTH + 40;
      return `M ${baseX} ${SVG_HEIGHT - 30} Q ${baseX + (rand() - 0.5) * 40} ${SVG_HEIGHT - 15} ${baseX + (rand() - 0.5) * 60} ${SVG_HEIGHT + 10}`;
    });
  }, []);

  const vinePaths = useMemo(() => {
    return branches.map((b) => {
      const branchCommits = COMMITS.filter((c) => c.branch === b.id).sort((a, c) => a.y - c.y);
      if (branchCommits.length < 2) return null;
      const points = branchCommits.map((c) => ({ x: b.vx, y: c.y }));
      return vinePathD(points, b.vx * 13);
    });
  }, [branches]);

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
        viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="sky-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2a4d3a" stopOpacity="0.95" />
            <stop offset="25%" stopColor="#1f3d2e" stopOpacity="0.95" />
            <stop offset="55%" stopColor="#142a1f" stopOpacity="0.98" />
            <stop offset="100%" stopColor="#0a1410" stopOpacity="1" />
          </linearGradient>

          <radialGradient id="moonlight" cx="50%" cy="0%" r="80%">
            <stop offset="0%" stopColor="#FFF1B8" stopOpacity="0.7" />
            <stop offset="20%" stopColor="#E8DDA8" stopOpacity="0.35" />
            <stop offset="50%" stopColor="#CFAF63" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#0D1310" stopOpacity="0" />
          </radialGradient>

          <radialGradient id="mist-bottom" cx="50%" cy="100%" r="70%">
            <stop offset="0%" stopColor="#B8C4C8" stopOpacity="0.28" />
            <stop offset="50%" stopColor="#2C3D44" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#0D1310" stopOpacity="0" />
          </radialGradient>

          <linearGradient id="ray-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFF1B8" stopOpacity="0.75" />
            <stop offset="40%" stopColor="#E8DDA8" stopOpacity="0.32" />
            <stop offset="100%" stopColor="#0D1310" stopOpacity="0" />
          </linearGradient>

          <linearGradient id="aurora-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#4682B4" stopOpacity="0" />
            <stop offset="25%" stopColor="#7FD3C3" stopOpacity="0.5" />
            <stop offset="50%" stopColor="#CFAF63" stopOpacity="0.4" />
            <stop offset="75%" stopColor="#7FD3C3" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#4682B4" stopOpacity="0" />
          </linearGradient>

          <linearGradient id="waterfall-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#E8F4F8" stopOpacity="0.1" />
            <stop offset="50%" stopColor="#B8E0E8" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#5A8A95" stopOpacity="0.55" />
          </linearGradient>

          <linearGradient id="mountain-back" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1a3528" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#0f1f18" stopOpacity="1" />
          </linearGradient>

          <linearGradient id="mountain-front" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0f2418" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#08120c" stopOpacity="1" />
          </linearGradient>

          <linearGradient id="canopy-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0a1410" stopOpacity="1" />
            <stop offset="100%" stopColor="#0a1410" stopOpacity="0" />
          </linearGradient>

          {branches.map((b) => (
            <radialGradient key={b.id} id={`node-${b.id}`} cx="40%" cy="35%" r="65%">
              <stop offset="0%" stopColor={b.color} stopOpacity="1" />
              <stop offset="60%" stopColor={b.color} stopOpacity="0.95" />
              <stop offset="100%" stopColor={b.color} stopOpacity="0.75" />
            </radialGradient>
          ))}

          {branches.map((b) => (
            <radialGradient key={`halo-${b.id}`} id={`halo-${b.id}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={b.color} stopOpacity="0.9" />
              <stop offset="40%" stopColor={b.color} stopOpacity="0.4" />
              <stop offset="100%" stopColor={b.color} stopOpacity="0" />
            </radialGradient>
          ))}

          <radialGradient id="merge-gold" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFF1B8" />
            <stop offset="50%" stopColor="#F5DC9C" />
            <stop offset="100%" stopColor="#8B7038" />
          </radialGradient>

          <radialGradient id="merge-gold-halo" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFF1B8" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#CFAF63" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#CFAF63" stopOpacity="0" />
          </radialGradient>

          <filter id="vine-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="leaf-shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="0.6" />
          </filter>
        </defs>

        <rect width={SVG_WIDTH} height={SVG_HEIGHT} fill="url(#sky-gradient)" />
        <rect width={SVG_WIDTH} height={SVG_HEIGHT} fill="url(#moonlight)" />
        <rect width={SVG_WIDTH} height={SVG_HEIGHT} fill="url(#mist-bottom)" />

        {backgroundStars.map((s, i) => (
          <circle
            key={i}
            cx={s.x}
            cy={s.y}
            r={s.r}
            fill="#FFF1B8"
            opacity={s.o}
          />
        ))}

        <ellipse
          cx={SVG_WIDTH / 2}
          cy={-30}
          rx="900"
          ry="120"
          fill="url(#aurora-grad)"
          opacity="0.5"
          className={styles.auroraWave}
        />

        {godRays.map((ray, i) => (
          <g key={`ray-${i}`} className={styles.godRay} style={{ animationDelay: `${ray.delay}s` }}>
            <polygon
              points={`${ray.x},0 ${ray.x + ray.w},0 ${ray.x + ray.w + 50},${SVG_HEIGHT} ${ray.x - 50},${SVG_HEIGHT}`}
              fill="url(#ray-gradient)"
              opacity={ray.o}
            />
          </g>
        ))}

        <path d={mountainsBack} fill="url(#mountain-back)" />
        <path d={mountainsFront} fill="url(#mountain-front)" />

        <g>
          <rect
            x="1290"
            y="0"
            width="100"
            height={SVG_HEIGHT}
            fill="url(#waterfall-grad)"
          />
          {waterfallDroplets.map((d, i) => (
            <circle
              key={`drop-${i}`}
              cx={d.x}
              cy={d.y}
              r={d.r}
              fill="#E8F4F8"
              opacity={d.o}
              className={styles.waterfallMote}
              style={{ animationDelay: `${d.delay}s` }}
            />
          ))}
          <ellipse
            cx="1340"
            cy={SVG_HEIGHT - 20}
            rx="180"
            ry="40"
            fill="#E8F4F8"
            opacity="0.35"
          />
        </g>

        <path d={treeCanopy} fill="url(#canopy-grad)" />

        {dustMotes.map((m, i) => (
          <circle
            key={`mote-${i}`}
            cx={m.x}
            cy={m.y}
            r={m.r}
            fill="#E8DDA8"
            opacity="0.55"
            className={styles.waterfallMote}
            style={{ animationDelay: `${m.delay}s` }}
          />
        ))}

        {leaves.map((l, i) => (
          <g
            key={`leaf-${i}`}
            transform={`translate(${l.x} ${l.y}) rotate(${l.rot})`}
            opacity="0.5"
            className={styles.waterfallMote}
            style={{ animationDelay: `${l.delay}s` }}
          >
            <path
              d={`M 0 -${l.r} C ${l.r * 0.6} -${l.r * 0.2}, ${l.r * 0.6} ${l.r * 0.2}, 0 ${l.r} C -${l.r * 0.6} ${l.r * 0.2}, -${l.r * 0.6} -${l.r * 0.2}, 0 -${l.r} Z`}
              fill={l.hue}
              filter="url(#leaf-shadow)"
            />
          </g>
        ))}

        <line x1="0" y1="100" x2={SVG_WIDTH} y2="100" stroke="#CFAF63" strokeWidth="0.6" strokeOpacity="0.4" />
        <line x1="0" y1={SVG_HEIGHT - 60} x2={SVG_WIDTH} y2={SVG_HEIGHT - 60} stroke="#CFAF63" strokeWidth="0.6" strokeOpacity="0.4" />

        <text x={SVG_WIDTH / 2} y="70" className={styles.subtitle}>
          ☼  Lineage of Imladris  ☼
        </text>

        {branches.map((b) => (
          <g key={`header-${b.id}`}>
            <text x={b.vx} y="125" className={styles.branchHeader} fill={b.color}>
              {b.label}
            </text>
            <line
              x1={b.vx - 40}
              y1="138"
              x2={b.vx + 40}
              y2="138"
              stroke={b.color}
              strokeWidth="0.8"
              strokeOpacity="0.7"
            />
          </g>
        ))}

        {branches.map((b, idx) => {
          const d = vinePaths[idx];
          if (!d) return null;
          return (
            <g key={`vine-${b.id}`}>
              <path
                d={d}
                className={styles.vine}
                stroke={b.color}
                strokeWidth="6"
                strokeOpacity="0.22"
                filter="url(#vine-glow)"
              />
              <path d={d} className={styles.vine} stroke={b.color} strokeWidth="1.8" strokeOpacity="0.92" />
            </g>
          );
        })}

        {COMMITS.filter((c) => c.merge).map((c) => {
          const target = branches.find((br) => br.id === c.branch);
          const source = lastCommitOnBranch(c.from, c.y);
          if (!target || !source) return null;
          const srcBranch = branches.find((br) => br.id === source.branch);
          if (!srcBranch) return null;
          const d = mergePathD(srcBranch.vx, source.y, target.vx, c.y);
          return (
            <g key={`merge-vine-${c.id}`}>
              <path
                d={d}
                className={styles.mergeVine}
                strokeWidth="4.5"
                strokeOpacity="0.2"
                filter="url(#vine-glow)"
              />
              <path d={d} className={styles.mergeVine} />
            </g>
          );
        })}

        {COMMITS.map((c) => {
          const b = branches.find((br) => br.id === c.branch);
          if (!b) return null;
          const cx = b.vx;
          const isMerge = c.merge;
          const isHovered = hovered === c.id;

          if (isMerge) {
            return (
              <g key={c.id}>
                <circle
                  cx={cx}
                  cy={c.y}
                  r="22"
                  fill={`url(#merge-gold-halo)`}
                  className={styles.mergeGlow}
                  opacity="0.55"
                />
                <path
                  d={leafPath(cx, c.y, 9)}
                  fill="url(#merge-gold)"
                  stroke="#FFF1B8"
                  strokeWidth="1.2"
                  className={styles.mergeNode}
                />
                <line
                  x1={cx}
                  y1={c.y - 7}
                  x2={cx}
                  y2={c.y + 7}
                  stroke="#0D1310"
                  strokeWidth="0.7"
                  strokeOpacity="0.7"
                  pointerEvents="none"
                />
                <text
                  x={cx + 18}
                  y={c.y + 4}
                  className={styles.commitHash}
                  style={{ fill: "#CFAF63" }}
                >
                  {c.hash}
                </text>
                <circle
                  cx={cx}
                  cy={c.y}
                  r="22"
                  fill="transparent"
                  className={styles.mergeHit}
                  onClick={() => handleClick(c)}
                  onMouseEnter={() => handleEnter(c.id)}
                  onMouseLeave={handleLeave}
                />
                {isHovered && (
                  <g
                    className={styles.commitTooltip}
                    transform={`translate(${cx + 90}, ${c.y - 32})`}
                  >
                    <rect
                      x="0"
                      y="0"
                      width="200"
                      height="48"
                      rx="3"
                      fill="#131D18"
                      stroke="#CFAF63"
                      strokeOpacity="0.8"
                      strokeWidth="0.7"
                    />
                    <text
                      x="10"
                      y="16"
                      fontSize="10"
                      fontFamily="'Fira Code', monospace"
                      fill="#CFAF63"
                    >
                      ⚜ {c.hash}
                    </text>
                    <text
                      x="10"
                      y="30"
                      fontSize="9"
                      fontFamily="Georgia, serif"
                      fontStyle="italic"
                      fill="#D1DCD6"
                    >
                      {c.msg.length > 32 ? c.msg.slice(0, 30) + "…" : c.msg}
                    </text>
                    <text
                      x="10"
                      y="42"
                      fontSize="7.5"
                      fontFamily="'Fira Code', monospace"
                      fill="#5C7065"
                    >
                      graft · by {c.author}
                    </text>
                  </g>
                )}
              </g>
            );
          }

          return (
            <g key={c.id}>
              <circle
                cx={cx}
                cy={c.y}
                r="18"
                fill={`url(#halo-${b.id})`}
                className={styles.commitHalo}
                opacity="0"
              />
              <circle
                cx={cx}
                cy={c.y}
                r="6"
                fill={`url(#node-${b.id})`}
                stroke="#D1DCD6"
                strokeWidth="1"
                className={styles.commitCore}
                style={{ color: b.color }}
              />
              <circle cx={cx} cy={c.y} r="1.8" fill="#0D1310" pointerEvents="none" />
              <text x={cx + 18} y={c.y + 4} className={styles.commitHash}>
                {c.hash}
              </text>
              <circle
                cx={cx}
                cy={c.y}
                r="18"
                fill="transparent"
                className={styles.commitHit}
                onClick={() => handleClick(c)}
                onMouseEnter={() => handleEnter(c.id)}
                onMouseLeave={handleLeave}
              />
              {isHovered && (
                <g
                  className={styles.commitTooltip}
                  transform={`translate(${cx + 90}, ${c.y - 32})`}
                >
                  <rect
                    x="0"
                    y="0"
                    width="180"
                    height="44"
                    rx="3"
                    fill="#131D18"
                    stroke={b.color}
                    strokeOpacity="0.8"
                    strokeWidth="0.7"
                  />
                  <text
                    x="10"
                    y="16"
                    fontSize="10"
                    fontFamily="'Fira Code', monospace"
                    fill={b.color}
                  >
                    {c.hash}
                  </text>
                  <text
                    x="10"
                    y="30"
                    fontSize="9"
                    fontFamily="Georgia, serif"
                    fontStyle="italic"
                    fill="#D1DCD6"
                  >
                    {c.msg.length > 30 ? c.msg.slice(0, 28) + "…" : c.msg}
                  </text>
                  <text
                    x="10"
                    y="41"
                    fontSize="7.5"
                    fontFamily="'Fira Code', monospace"
                    fill="#5C7065"
                  >
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
            strokeWidth="1.4"
            strokeOpacity="0.3"
            strokeLinecap="round"
          />
        ))}

        <text x={SVG_WIDTH / 2} y={SVG_HEIGHT - 20} className={styles.legend}>
          20 commits · 5 branches · 4 grafts · 1 chronicle
        </text>
      </svg>
    </div>
  );
}
