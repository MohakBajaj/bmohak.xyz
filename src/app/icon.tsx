import { ImageResponse } from "next/og";

export const size = { height: 64, width: 64 };
export const contentType = "image/png";

/*
  Generated rather than drawn: initials need real type, and hand-built letter
  paths would be worse than the font. 64px so it downsamples cleanly to the
  16px a browser tab actually shows.
*/
const Icon = () =>
  new ImageResponse(
    <div
      style={{
        alignItems: "center",
        background: "#000",
        borderRadius: 14,
        color: "#fff",
        display: "flex",
        fontSize: 34,
        fontWeight: 700,
        height: "100%",
        justifyContent: "center",
        letterSpacing: -1.5,
        width: "100%",
      }}
    >
      MB
    </div>,
    size
  );

export default Icon;
