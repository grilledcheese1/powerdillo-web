"use client";

import SmartCityNetwork from "@/app/components/SmartCityNetwork";

export default function TestPage() {
  return (
    <div>
      <SmartCityNetwork />
      <div style={{ height: "200vh", background: "#060a0f", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "#00d4ff", fontFamily: "monospace", opacity: 100 }}>scroll test zone</p>
      </div>
    </div>
  );
}
