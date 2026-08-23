import { ImageResponse } from "next/og";

import { site } from "@/lib/site";

export const alt = site.title;
export const size = { height: 630, width: 1200 };
export const contentType = "image/png";

/*
  The same initials mark as the favicon, inverted at poster scale, plus the
  name. No custom font is loaded on purpose: that would mean shipping a TTF and
  a build-time read for three lines of text that render fine in the default
  face.
*/
const Image = () =>
  new ImageResponse(
    <div
      style={{
        background: "#000",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        justifyContent: "space-between",
        padding: 80,
        width: "100%",
      }}
    >
      <div
        style={{
          alignItems: "center",
          background: "#fff",
          borderRadius: 26,
          color: "#000",
          display: "flex",
          fontSize: 64,
          fontWeight: 700,
          height: 120,
          justifyContent: "center",
          letterSpacing: -3,
          width: 120,
        }}
      >
        MB
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <div style={{ fontSize: 76, letterSpacing: -2 }}>{site.name}</div>
        <div style={{ color: "#a1a1aa", fontSize: 32, lineHeight: 1.4 }}>
          Full stack architect and DevOps engineer. A timeline, not a hero
          section.
        </div>
      </div>
    </div>,
    size
  );

export default Image;
