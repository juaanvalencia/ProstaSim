import "./Logo.css";

// App-icon mark ("Ajustado para la app" version of the PROSTA-SIM logo).
function LogoMark({ size }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 1000 1000"
      aria-hidden="true"
      focusable="false"
    >
      <g
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="62"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M90 290V170Q90 90 170 90H290" />
        <path d="M710 90H830Q910 90 910 170V290" />
        <path d="M910 710V830Q910 910 830 910H710" />
        <path d="M290 910H170Q90 910 90 830V710" />
      </g>
      <path
        fill="#B1D5D3"
        d="M500 238C560 205 700 205 758 300C812 392 790 560 700 680C640 758 560 786 500 786C440 786 360 758 300 680C210 560 188 392 242 300C300 205 440 205 500 238Z"
      />
      <path
        fill="#FFFFFF"
        fillOpacity="0.35"
        d="M330 330C360 280 430 262 470 280C430 300 380 360 360 430C340 400 318 360 330 330Z"
      />
      <circle cx="590" cy="440" r="128" fill="#D9633B" fillOpacity="0.22" />
      <circle cx="590" cy="440" r="86" fill="#D9633B" />
    </svg>
  );
}

/**
 * PROSTA-SIM logo.
 * - variant "icon": petroleum rounded square with the mark.
 * - variant "horizontal": icon + "PROSTA-SIM" wordmark (ink color from tokens).
 * - size: icon side in px (wordmark scales with it).
 */
export default function Logo({ variant = "horizontal", size = 40, className = "" }) {
  const icon = (
    <span
      className="logo-icon"
      style={{ width: size, height: size, borderRadius: size * 0.26 }}
    >
      <LogoMark size={Math.round(size * 0.73)} />
    </span>
  );

  if (variant === "icon") {
    return (
      <span className={`logo ${className}`.trim()} role="img" aria-label="PROSTA-SIM">
        {icon}
      </span>
    );
  }

  return (
    <span
      className={`logo logo-horizontal ${className}`.trim()}
      role="img"
      aria-label="PROSTA-SIM"
      style={{ gap: Math.round(size * 0.29) }}
    >
      {icon}
      <span className="logo-wordmark" aria-hidden="true" style={{ fontSize: size * 0.48 }}>
        PROSTA<span className="logo-hyphen">-</span>SIM
      </span>
    </span>
  );
}
