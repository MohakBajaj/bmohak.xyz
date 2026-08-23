import { ImageResponse } from "next/og";

export const size = { height: 180, width: 180 };
export const contentType = "image/png";

/* No rounded corners: iOS masks the icon itself and a second radius shows. */
const AppleIcon = () =>
  new ImageResponse(
    <div
      style={{
        alignItems: "center",
        background: "#000",
        color: "#fff",
        display: "flex",
        fontSize: 96,
        fontWeight: 700,
        height: "100%",
        justifyContent: "center",
        letterSpacing: -4,
        width: "100%",
      }}
    >
      MB
    </div>,
    size
  );

export default AppleIcon;
