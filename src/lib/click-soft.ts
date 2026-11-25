import type { SoundAsset } from "@/lib/sound-types";

/**
 * Synthesised with ffmpeg rather than sampled: a 1.35 kHz body, a 3.1 kHz
 * edge and a 2 ms noise transient, all decaying inside 45 ms. The Kenney
 * sample this replaced was one 7 ms MP3 frame, which browsers trim down to
 * an inaudible pop once they strip the encoder delay.
 *
 * ffmpeg -f lavfi -i "aevalsrc='(0.62*sin(2*PI*1350*t)*exp(-t*170)
 *   +0.22*sin(2*PI*3100*t)*exp(-t*420)+0.12*(random(0)*2-1)*exp(-t*1600))
 *   *min(1,t*2000)':s=22050:d=0.045" -c:a pcm_s16le -ac 1 click.wav
 */
export const clickSoftSound: SoundAsset = {
  author: "bmohak.xyz",
  dataUri:
    "data:audio/wav;base64,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",
  duration: 0.045,
  format: "wav",
  license: "CC0",
  name: "click-soft",
};
