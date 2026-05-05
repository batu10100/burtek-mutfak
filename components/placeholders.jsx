/* Burtek catalog — main app components */
const { useState, useEffect, useRef, useMemo } = React;

const WHATSAPP_NUMBER = "905333822313";
const WHATSAPP_DISPLAY = "+90 533 382 23 13";

function waLink(message) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

/* ============ Placeholder silhouettes (SVG) ============ */
function ProductPlaceholder({ kind = "espresso-2g", className = "" }) {
  // Each kind paints a stylized silhouette in navy/cyan tones.
  const common = { strokeLinejoin: "round", strokeLinecap: "round" };
  const stroke = "#0E3550", fill = "#FFFFFF", accent = "#1FA9DC", soft = "#DCE5EC";
  const shadow = (
    <ellipse cx="100" cy="186" rx="62" ry="6" fill="#0A2638" opacity="0.10" />
  );
  switch (kind) {
    case "espresso-3g":
    case "espresso-2g":
    case "espresso-2g-tall":
    case "espresso-2g-classic": {
      const groups = kind === "espresso-3g" ? 3 : 2;
      const w = groups === 3 ? 138 : 110;
      const x0 = 100 - w / 2;
      return (
        <svg viewBox="0 0 200 200" className={className}>
          {shadow}
          <rect x={x0} y="62" width={w} height="48" rx="4" fill={fill} stroke={stroke} strokeWidth="1.5" {...common} />
          <rect x={x0 + 4} y="50" width={w - 8} height="20" rx="3" fill={soft} stroke={stroke} strokeWidth="1.5" {...common} />
          <rect x={x0} y="110" width={w} height="58" rx="3" fill={fill} stroke={stroke} strokeWidth="1.5" {...common} />
          {Array.from({ length: groups }).map((_, i) => {
            const cx = x0 + 18 + i * ((w - 36) / Math.max(groups - 1, 1));
            return (
              <g key={i}>
                <rect x={cx - 10} y="115" width="20" height="22" rx="2" fill={soft} stroke={stroke} strokeWidth="1.2" />
                <circle cx={cx} cy="142" r="4.5" fill={stroke} />
                <line x1={cx} y1="146" x2={cx} y2="158" stroke={stroke} strokeWidth="1.5" />
              </g>
            );
          })}
          <rect x={x0 + 6} y="120" width="14" height="3" rx="1.5" fill={accent} />
          <rect x="35" y="166" width="130" height="5" rx="1" fill={stroke} />
        </svg>
      );
    }
    case "grinder-touch":
    case "grinder-conic":
    case "grinder-classic": {
      return (
        <svg viewBox="0 0 200 200" className={className}>
          {shadow}
          <path d="M76 32 L124 32 L124 70 L116 78 L84 78 L76 70 Z" fill={soft} stroke={stroke} strokeWidth="1.5" {...common} />
          <rect x="78" y="78" width="44" height="62" rx="3" fill={fill} stroke={stroke} strokeWidth="1.5" {...common} />
          <rect x="84" y="92" width="32" height="18" rx="2" fill={kind === "grinder-touch" ? accent : stroke} opacity={kind === "grinder-touch" ? 0.85 : 1} />
          <path d="M82 140 L118 140 L122 168 L78 168 Z" fill={fill} stroke={stroke} strokeWidth="1.5" {...common} />
          <rect x="88" y="158" width="24" height="6" rx="1" fill={stroke} />
        </svg>
      );
    }
    case "tea-2pot": {
      return (
        <svg viewBox="0 0 200 200" className={className}>
          {shadow}
          <rect x="38" y="100" width="124" height="68" rx="4" fill={stroke} />
          <rect x="58" y="110" width="84" height="34" rx="2" fill="#7A4A2A" />
          <text x="100" y="132" fontFamily="Inter" fontSize="10" fill="#fff" textAnchor="middle" fontWeight="600">REMTA</text>
          <ellipse cx="72" cy="78" rx="14" ry="22" fill={soft} stroke={stroke} strokeWidth="1.3" />
          <path d="M72 56 Q88 48 92 60" fill="none" stroke={stroke} strokeWidth="1.3" {...common}/>
          <ellipse cx="128" cy="78" rx="14" ry="22" fill={soft} stroke={stroke} strokeWidth="1.3" />
          <path d="M128 56 Q144 48 148 60" fill="none" stroke={stroke} strokeWidth="1.3" {...common}/>
          <circle cx="100" cy="156" r="3" fill={accent} />
        </svg>
      );
    }
    case "filter-double":
    case "filter-single": {
      const single = kind === "filter-single";
      return (
        <svg viewBox="0 0 200 200" className={className}>
          {shadow}
          <rect x="62" y="36" width="76" height="132" rx="3" fill={single ? stroke : fill} stroke={stroke} strokeWidth="1.5" />
          <rect x="70" y="46" width="60" height="22" rx="2" fill={single ? "#1a1a1a" : soft} stroke={single ? "#000" : stroke} strokeWidth="1" />
          {!single && <circle cx="120" cy="57" r="3" fill={accent} />}
          <ellipse cx="100" cy="92" rx="20" ry="16" fill="#7A4A2A" stroke={stroke} strokeWidth="1.3" />
          <path d="M84 88 Q100 70 116 88" fill={single ? "#1a1a1a" : "#fff"} stroke={stroke} strokeWidth="1.3" />
          {!single && <ellipse cx="100" cy="140" rx="22" ry="14" fill="#5A3018" stroke={stroke} strokeWidth="1.3" />}
        </svg>
      );
    }
    case "oven-led":
    case "oven-mechanical":
    case "oven-speed": {
      const speed = kind === "oven-speed";
      return (
        <svg viewBox="0 0 200 200" className={className}>
          {shadow}
          <rect x="30" y={speed ? 50 : 56} width="140" height={speed ? 116 : 110} rx="3" fill={fill} stroke={stroke} strokeWidth="1.5" />
          <rect x="42" y={speed ? 62 : 68} width="116" height={speed ? 86 : 80} rx="2" fill={stroke} />
          <rect x="50" y={speed ? 70 : 76} width="100" height={speed ? 64 : 58} rx="2" fill="#1a1a1a" />
          <circle cx="76" cy={speed ? 102 : 105} r="14" fill="none" stroke="#888" strokeWidth="1" />
          <circle cx="124" cy={speed ? 102 : 105} r="14" fill="none" stroke="#888" strokeWidth="1" />
          <line x1="76" y1={speed ? 88 : 91} x2="76" y2={speed ? 116 : 119} stroke="#888" strokeWidth="1" />
          <line x1="124" y1={speed ? 88 : 91} x2="124" y2={speed ? 116 : 119} stroke="#888" strokeWidth="1" />
          <rect x="42" y={speed ? 152 : 152} width="116" height="10" rx="1" fill={kind === "oven-led" ? accent : stroke} opacity={kind === "oven-led" ? 0.9 : 1} />
        </svg>
      );
    }
    case "display-cake": {
      return (
        <svg viewBox="0 0 200 200" className={className}>
          {shadow}
          <path d="M40 70 Q40 40 70 40 L160 40 L160 168 L40 168 Z" fill="#0E3550" stroke={stroke} strokeWidth="1.5" />
          <path d="M50 76 Q50 48 78 48 L150 48 L150 158 L50 158 Z" fill="#fff" stroke={stroke} strokeWidth="1" opacity="0.85" />
          <line x1="50" y1="100" x2="150" y2="100" stroke={stroke} strokeWidth="0.8" />
          <line x1="50" y1="130" x2="150" y2="130" stroke={stroke} strokeWidth="0.8" />
          <ellipse cx="80" cy="118" rx="10" ry="4" fill="#C49A6C" />
          <ellipse cx="110" cy="118" rx="10" ry="4" fill="#7A4A2A" />
          <ellipse cx="90" cy="146" rx="10" ry="4" fill="#C49A6C" />
        </svg>
      );
    }
    case "ice-dispenser":
    case "ice-cube":
    case "ice-italian":
    case "ice-stainless": {
      const dispenser = kind === "ice-dispenser";
      return (
        <svg viewBox="0 0 200 200" className={className}>
          {shadow}
          <rect x="50" y="32" width="100" height="136" rx="4" fill={dispenser ? "#7A6855" : soft} stroke={stroke} strokeWidth="1.5" />
          {dispenser ? (
            <>
              <rect x="60" y="42" width="80" height="32" rx="2" fill="#5C4D3F" />
              <text x="100" y="60" fontFamily="Inter" fontSize="9" fill="#fff" textAnchor="middle" fontWeight="700">ICE</text>
              <rect x="74" y="92" width="52" height="22" rx="2" fill="#3D3225" />
              <rect x="68" y="120" width="64" height="40" rx="2" fill="#5C4D3F" />
            </>
          ) : (
            <>
              <rect x="60" y="48" width="80" height="20" rx="1.5" fill="#fff" stroke={stroke} strokeWidth="0.8" />
              <rect x="60" y="78" width="80" height="80" rx="2" fill="#fff" stroke={stroke} strokeWidth="0.8" />
              <rect x="68" y="86" width="64" height="6" rx="1" fill="#222" />
              {kind === "ice-italian" && <circle cx="132" cy="100" r="3" fill={accent} />}
            </>
          )}
        </svg>
      );
    }
    case "juicer-pro":
    case "juicer-classic":
    case "juicer-press": {
      return (
        <svg viewBox="0 0 200 200" className={className}>
          {shadow}
          <rect x="64" y="46" width="40" height="120" rx="2" fill={soft} stroke={stroke} strokeWidth="1.5" />
          <rect x="100" y="80" width="46" height="60" rx="2" fill={fill} stroke={stroke} strokeWidth="1.5" />
          <rect x="68" y="36" width="32" height="14" rx="1.5" fill="#1a1a1a" />
          <circle cx="84" cy="156" r="3" fill="#22B556" />
          <circle cx="84" cy="156" r="3" fill="#22B556" />
          <rect x="106" y="92" width="34" height="22" rx="1" fill={kind === "juicer-classic" ? "#7A4A2A" : "#C49A6C"} opacity="0.8" />
          <path d="M64 86 L100 86" stroke={stroke} strokeWidth="1.2" />
        </svg>
      );
    }
    case "slush": {
      return (
        <svg viewBox="0 0 200 200" className={className}>
          {shadow}
          <rect x="40" y="120" width="120" height="48" rx="3" fill="#1a1a1a" stroke={stroke} strokeWidth="1.5" />
          <rect x="50" y="40" width="44" height="80" rx="3" fill="rgba(31,169,220,0.25)" stroke={stroke} strokeWidth="1.2" />
          <rect x="106" y="40" width="44" height="80" rx="3" fill="rgba(255,140,80,0.30)" stroke={stroke} strokeWidth="1.2" />
          <line x1="72" y1="50" x2="72" y2="116" stroke={stroke} strokeWidth="0.8" strokeDasharray="2 3" />
          <line x1="128" y1="50" x2="128" y2="116" stroke={stroke} strokeWidth="0.8" strokeDasharray="2 3" />
          <circle cx="100" cy="146" r="3" fill={accent} />
        </svg>
      );
    }
    case "blender-quiet":
    case "blender-bar":
    case "blender-pro":
    case "blender-smart":
    case "mixer": {
      const isMixer = kind === "mixer";
      const cabinet = kind === "blender-quiet" || kind === "blender-smart";
      return (
        <svg viewBox="0 0 200 200" className={className}>
          {shadow}
          {cabinet && <rect x="62" y="34" width="76" height="92" rx="3" fill="rgba(220,229,236,0.45)" stroke={stroke} strokeWidth="1.2" strokeDasharray="3 2" />}
          {!isMixer && <rect x="74" y="38" width="52" height="78" rx="2" fill="rgba(220,229,236,0.5)" stroke={stroke} strokeWidth="1.3" />}
          {isMixer && <rect x="92" y="38" width="16" height="80" rx="1.5" fill={stroke} />}
          {!isMixer && (
            <>
              <line x1="80" y1="56" x2="120" y2="56" stroke={stroke} strokeWidth="0.7" />
              <line x1="80" y1="72" x2="120" y2="72" stroke={stroke} strokeWidth="0.7" />
              <line x1="80" y1="88" x2="120" y2="88" stroke={stroke} strokeWidth="0.7" />
              <line x1="80" y1="104" x2="120" y2="104" stroke={stroke} strokeWidth="0.7" />
            </>
          )}
          <rect x="68" y="124" width="64" height="44" rx="3" fill="#1a1a1a" stroke={stroke} strokeWidth="1.3" />
          {kind === "blender-smart" && <rect x="76" y="132" width="48" height="14" rx="1" fill={accent} opacity="0.85" />}
          {kind === "blender-bar" && (
            <>
              <circle cx="86" cy="148" r="2.5" fill="#fff" />
              <circle cx="100" cy="148" r="2.5" fill="#fff" />
              <circle cx="114" cy="148" r="2.5" fill="#fff" />
            </>
          )}
          {kind === "blender-pro" && <text x="100" y="154" fontFamily="Inter" fontSize="9" fill="#fff" textAnchor="middle" fontWeight="600">öztiryakiler</text>}
          {kind === "blender-quiet" && <text x="100" y="154" fontFamily="Inter" fontSize="8" fill="#fff" textAnchor="middle" fontWeight="600">Hamilton Beach</text>}
        </svg>
      );
    }
    default:
      return (
        <svg viewBox="0 0 200 200" className={className}>
          <rect x="40" y="40" width="120" height="120" rx="6" fill={soft} stroke={stroke} strokeWidth="1.5" />
        </svg>
      );
  }
}

/* ============ Image with placeholder fallback ============ */
function ProductImage({ src, alt, kind, eager = false }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) return <ProductPlaceholder kind={kind} className="bk-prodimg__svg" />;
  return (
    <img
      src={src}
      alt={alt}
      loading={eager ? "eager" : "lazy"}
      onError={() => setFailed(true)}
      className="bk-prodimg__img"
    />
  );
}

window.ProductPlaceholder = ProductPlaceholder;
window.ProductImage = ProductImage;
window.WHATSAPP_NUMBER = WHATSAPP_NUMBER;
window.WHATSAPP_DISPLAY = WHATSAPP_DISPLAY;
window.waLink = waLink;
