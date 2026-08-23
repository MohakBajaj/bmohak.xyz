import type { LifelineEventSegment } from "@/components/lifeline/types";
import { defineLifeline } from "@/lib/lifeline-data";

/** Segment builders — an event is a list of these when it carries a link. */
const t = (value: string): LifelineEventSegment => ({ type: "text", value });
const a = (value: string, href: string): LifelineEventSegment => ({
  href,
  type: "link",
  value,
});

/**
 * Seeded from resume.json + projects.json in MohakBajaj/mohak.tui, the public
 * GitHub repo history (creation dates are the years used here), and talks and
 * community activity.
 *
 * `birthYear` is both the real birth year and the axis start, so every age
 * label is just `year - 2004` and no marker needs an `age` override. Nothing
 * is known before 2019, so the rail opens on a long quiet runway — add
 * milestones there, or raise birthYear, if it ever reads as dead space.
 *
 * mohak.tui links to its repo, not tui.bmohak.xyz: the tunnel was returning
 * 530 when this was written. Point it at the live host once it is back up.
 */
export const mohak = defineLifeline({
  birthYear: 2004,
  description:
    "Delhi NCR. Full stack architecture, DevOps, and a lot of side projects shipped in public.",
  milestones: {
    2004: {
      events: ["Born in Faridabad, Haryana."],
      id: "born",
    },
    2006: {
      events: ["Moved to Delhi. Still here."],
      id: "delhi",
    },
    2009: {
      events: [
        "First computer in the house, running Windows XP. 3D Pinball and whatever else shipped in the box, and the first real question: how does any of this actually work?",
      ],
      id: "first-computer",
    },
    2013: {
      events: [
        "First lines of code. HTML in a school lab, then C++ in Turbo C++, where hello world finally printed.",
      ],
      id: "first-code",
    },
    2015: {
      events: [
        "Python, and a lot of programs nobody asked for. Four years of doing the fundamentals properly rather than quickly, right through to the end of school.",
      ],
      id: "fundamentals",
    },
    2020: {
      events: ["Finished XII (CBSE) at Preet Public School, Delhi. 89%."],
      id: "school",
    },
    2021: {
      companies: [{ id: "upes", name: "UPES" }],
      events: [
        [
          t("Started B.Tech CSE with a DevOps specialisation at "),
          a("UPES", "https://www.upes.ac.in"),
          t(", Dehradun."),
        ],
        [
          t("Opened a "),
          a("GitHub account", "https://github.com/MohakBajaj"),
          t(" in January and never really stopped pushing to it."),
        ],
        [
          t("Competed in "),
          a("eYantra", "https://www.e-yantra.org"),
          t(" at IIT Bombay."),
        ],
        "First repos, all Python: a NEAT agent learning Flappy Bird, turtle graphics, a projectile-motion sim in PyGame.",
        "Counted scrap cars in video with YOLOv4 and DeepSort, because the assignment said count them.",
      ],
      id: "upes",
    },
    2022: {
      events: [
        [
          t("Worked through "),
          a("the Rust book", "https://doc.rust-lang.org/book/"),
          t(
            " in public, one repo per chapter: variables, control flow, the guessing game, all of it."
          ),
        ],
        [
          a("Text Utils", "https://github.com/MohakBajaj/Text-Utils"),
          t(
            ", WebCam-to-ASCII in p5.js, The Matrix Rain, an Electron screen recorder, a Flutter BMI calculator."
          ),
        ],
        "DevOps labs in earnest: Jenkins, GitHub Actions, Ansible, and enough Java to make them run.",
        "Rewrote the personal site twice more. Versions two and three, same year.",
      ],
      id: "learning-in-public",
    },
    2023: {
      companies: [{ id: "plutosone", name: "plutosONE" }],
      events: [
        [
          t("Full Stack Developer Intern at "),
          a("plutosONE", "https://plutos.one"),
          t(
            ": a multi-channel marketing comms platform, pm2 application monitoring, and an in-house OAuth integration."
          ),
        ],
        [
          t("Secretary of the Xe-Tech Club at UPES, established by "),
          a("Xebia", "https://xebia.com"),
          t(". Organised XeFest."),
        ],
        [
          t("Third place at INFAthon 4.0, "),
          a("Informatica", "https://www.informatica.com"),
          t("'s nationwide coding competition."),
        ],
        [
          t("Started "),
          a("CBoarding", "https://cboarding.bmohak.xyz"),
          t(
            ", a whiteboard and notes app with a GPT-powered rich text editor."
          ),
        ],
        "OpenGL, ADBMS, and build-and-release labs. The unglamorous half of the degree.",
      ],
      id: "plutos-one",
    },
    2024: {
      companies: [
        { id: "gutenberg", name: "Gutenberg Communications" },
        { id: "cambrianedge", name: "CambrianEdge.ai" },
      ],
      events: [
        "Full Stack Developer Intern at Gutenberg Communications from June: AI marketing workflows, a real-time admin dashboard, collaborative rich-text editing on the OpenAI Assistant API.",
        [
          t("Full Stack Architect at "),
          a("CambrianEdge.ai", "https://cambrianedge.ai"),
          t(" from December, building the platform out."),
        ],
        [
          t("Shipped "),
          a("Uncut", "https://uncut.bmohak.xyz"),
          t(
            ", an anonymous board for college students, with a custom anonymous auth system so the anonymity actually holds."
          ),
        ],
        [
          a("Echo", "https://github.com/MohakBajaj/echo"),
          t(", an anonymous social platform. "),
          a("Wordsmith", "https://wordsmith.bmohak.xyz"),
          t(", a text utility that ships as a container."),
        ],
      ],
      id: "gutenberg",
    },
    2025: {
      companies: [{ id: "cambrianedge", name: "CambrianEdge.ai" }],
      events: [
        "Graduated UPES with a B.Tech in CSE (DevOps). 8.31 CGPA.",
        [
          t("Full time on "),
          a("CambrianEdge", "https://cambrianedge.ai"),
          t(
            ": the architecture, the pipelines, and the parts nobody volunteers for."
          ),
        ],
      ],
      id: "graduation",
    },
    2026: {
      companies: [{ id: "cambrianedge", name: "CambrianEdge.ai" }],
      events: [
        [
          t("Built "),
          a("mohak.tui", "https://github.com/MohakBajaj/mohak.tui"),
          t(
            " in Go, on Bubble Tea and Wish, with an AI chat behind a command interface. The portfolio answers on port 22: ssh bmohak.xyz."
          ),
        ],
        [
          t("First talk ever: "),
          a(
            "Microsoft Build //localhost",
            "https://github.com/MohakBajaj/build-2026-cli-live"
          ),
          t(", Gurugram. From CLI to PR, live, no slides safety net."),
        ],
        [
          t("Cursor India Roadshow, and "),
          a("SyncUp DJ", "https://github.com/MohakBajaj/syncup-djs"),
          t(
            ", a multiplayer live-coding jam booth on shared Strudel patterns, at the Cursor buildathon."
          ),
        ],
        [
          a("Slip", "https://github.com/MohakBajaj/slip"),
          t(" and "),
          a("Copper", "https://github.com/MohakBajaj/copper"),
          t(
            ": local-first capture inboxes for AI-assisted work. Select text, press a chord, own the markdown."
          ),
        ],
        [
          t("Self-hosted "),
          a("SearXNG", "https://searxng.org"),
          t(
            ", migrated build tooling in public with the receipts attached, and wrote songs for developers who ship at 3am."
          ),
        ],
      ],
      id: "shipping",
    },
  },
  name: "Mohak Bajaj",
  slug: "mohak",
});
