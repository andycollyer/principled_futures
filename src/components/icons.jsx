"use client";
import React from "react";
/* Lucide-style stroke icons (1.75) — matches the Principled Futures codebase.
   Shared on window for the UI kit screens. */
function makeIcon(paths, opts = {}) {
  return function Icon({ size = 18, color = "currentColor", strokeWidth = 1.75, style = {}, ...props }) {
    return (
      <svg viewBox="0 0 24 24" width={size} height={size} fill={opts.fill || "none"} stroke={opts.fill ? "none" : color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={style} {...props}>
        {paths}
      </svg>
    );
  };
}

const IGrid = makeIcon(<><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>);
const IList = makeIcon(<><path d="M8 6h13M8 12h13M8 18h13"/><circle cx="3.5" cy="6" r="1"/><circle cx="3.5" cy="12" r="1"/><circle cx="3.5" cy="18" r="1"/></>);
const IDoc = makeIcon(<><path d="M14 3v5h5"/><path d="M19 8v11a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7z"/><path d="M9 13h6M9 17h4"/></>);
const IPulse = makeIcon(<path d="M3 12h4l2-6 4 12 2-6h6"/>);
const ICog = makeIcon(<><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></>);
const ISearch = makeIcon(<><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></>);
const IHelp = makeIcon(<><circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 0 1 4.5 1.5c0 1.5-2 2-2 3"/><path d="M12 17h.01"/></>);
const IBell = makeIcon(<><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/></>);
const IArrowRight = makeIcon(<path d="M5 12h14M13 5l7 7-7 7"/>);
const IShield = makeIcon(<><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></>);
const IScale = makeIcon(<><path d="M12 3v18M5 7h14"/><path d="m5 7-3 6h6zM19 7l-3 6h6z"/><path d="M3 21h18"/></>);
const ILeaf = makeIcon(<><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/><path d="M2 21c0-3 1.85-5.36 5.08-6"/></>);
const IUsers = makeIcon(<><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></>);
const ILock = makeIcon(<><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></>);
const IBuilding = makeIcon(<><rect x="4" y="2" width="16" height="20" rx="1"/><path d="M9 22v-4h6v4M8 6h.01M12 6h.01M16 6h.01M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M16 14h.01"/></>);
const ICheck = makeIcon(<path d="M20 6 9 17l-5-5"/>);
const IChevronRight = makeIcon(<path d="m9 6 6 6-6 6"/>);
const IDots = makeIcon(<><circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/></>, { fill: "currentColor" });
const IDownload = makeIcon(<><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M7 10l5 5 5-5M12 15V3"/></>);
const IUpload = makeIcon(<><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M17 8l-5-5-5 5M12 3v12"/></>);
const IAlert = makeIcon(<><path d="M10.3 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.7 3.86a2 2 0 0 0-3.42 0z"/><path d="M12 9v4m0 4h.01"/></>);
const ITrend = makeIcon(<><path d="M22 7l-8.5 8.5-5-5L2 17"/><path d="M16 7h6v6"/></>);
const IClock = makeIcon(<><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>);
const IFile = makeIcon(<><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></>);
const IKey = makeIcon(<><circle cx="7.5" cy="15.5" r="4.5"/><path d="m10.7 12.3 8.3-8.3M16 6l3 3M18 4l3 3"/></>);
const ISparkle = makeIcon(<><path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z"/><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z"/></>);
const IRefresh = makeIcon(<><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/><path d="M3 21v-5h5"/></>);
const IPlug = makeIcon(<><path d="M12 22v-5M9 8V2M15 8V2M6 8h12v3a6 6 0 0 1-12 0z"/></>);
const IDatabase = makeIcon(<><ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v6a8 3 0 0 0 16 0V5M4 11v6a8 3 0 0 0 16 0v-6"/></>);
const ICreditCard = makeIcon(<><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></>);
const ISliders = makeIcon(<><path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6"/></>);
const IMail = makeIcon(<><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/></>);
const ICheckCircle = makeIcon(<><circle cx="12" cy="12" r="9"/><path d="m8.5 12 2.5 2.5L16 9"/></>);




// Brand mark — the Principled Futures compass: a green disc with a white
// compass-needle diamond (matching the mobile app's MobileV2 mark). On
// dark/brand surfaces (inverse) it flips to a white disc with a green
// diamond. Used everywhere via UI.Logo.
export function Logo({ inverse = false, size = 28 }) {
  const disc = inverse ? "#fff" : "var(--green-600)";
  const needle = inverse ? "var(--green-600)" : "#fff";
  return (
    <span style={{ display: "inline-flex", alignItems: "center", flexShrink: 0 }}>
      <svg width={size} height={size} viewBox="0 0 64 64" aria-label="Principled Futures" role="img">
        <circle cx="32" cy="32" r="30" fill={disc} />
        <path d="M32 12 L44 32 L32 52 L20 32 Z" fill={needle} />
        <path d="M32 12 L44 32 L32 32 Z" fill={disc} fillOpacity="0.28" />
      </svg>
    </span>
  );
}

export { IGrid, IList, IDoc, IPulse, ICog, ISearch, IHelp, IBell, IArrowRight, IShield, IScale, ILeaf, IUsers, ILock, IBuilding, ICheck, IChevronRight, IDots, IDownload, IUpload, IAlert, ITrend, IClock, IFile, IKey, ISparkle, IRefresh, IPlug, IDatabase, ICreditCard, ISliders, IMail, ICheckCircle };
