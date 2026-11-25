const isTouchDevice =
  typeof window === "undefined"
    ? false
    : window.matchMedia("(pointer: coarse)").matches;

/**
 * Trigger haptic feedback on mobile devices.
 * Uses Vibration API on Android/modern browsers, and iOS checkbox trick on iOS.
 *
 * Call it inside a click (or keydown) handler. Both paths need a user
 * activation, and a touch pointerdown is not one.
 *
 * @param pattern - Vibration duration (ms) or pattern. 10 ms reads as a tap;
 * 50 ms reads as a buzz.
 * Custom patterns only work on Android devices. iOS uses fixed feedback.
 * See [Vibration API](https://developer.mozilla.org/docs/Web/API/Vibration_API)
 *
 * @example
 * import { haptic } from "@/lib/haptic"
 *
 * <Button onClick={() => haptic()}>Haptic</Button>
 */
export function haptic(pattern: number | number[] = 10) {
  try {
    if (!isTouchDevice) {
      return;
    }

    if ("vibrate" in navigator) {
      navigator.vibrate(pattern);
      return;
    }

    // iOS haptic trick via checkbox switch element
    const label = document.createElement("label");
    label.ariaHidden = "true";
    label.style.display = "none";

    const input = document.createElement("input");
    input.type = "checkbox";
    input.setAttribute("switch", "");
    label.append(input);

    try {
      document.head.append(label);
      label.click();
    } finally {
      document.head.removeChild(label);
    }
  } catch {}
}
