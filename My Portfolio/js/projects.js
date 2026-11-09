/* =========================================================
   PROJECT DATA
   ---------------------------------------------------------
   Add, remove or reorder projects here. Each object creates
   one card in the Projects section.

   Fields:
     title       — project name (required)
     description — what the project does / what you learned
     tech        — array of technology labels
     image       — optional path, e.g. "assets/images/projects/habit.png"
     imageAlt    — alt text for the screenshot (if an image is used)
     repo        — optional GitHub URL, or "" when not published
     demo        — optional live demo URL, or "" when not published
     icon        — placeholder icon: "repeat" | "dumbbell" | "search"
     tone        — placeholder colour: "forest" | "sage" | "deep"
     sample      — true shows the "Sample entry" label

   Never add a repository or live-demo URL until it actually
   exists. Empty links render an honest "Repository not added"
   state instead of a broken link.
   ========================================================= */

window.PORTFOLIO_PROJECTS = [
  {
    title: "Chromatic — Habits in Colour",
    description:
      "A personal habit tracker I built to keep myself accountable without paying for an expensive habit-tracking subscription. It tracks daily habits, streaks, calendar progress and analytics in a single dashboard.",
    tech: ["Next.js", "React", "TypeScript", "Prisma", "Neon"],
    image: "assets/images/chromatic-habits.jpg",
    imageAlt: "Chromatic habit tracker dashboard showing daily progress, streaks and a 14-day rhythm chart",
    repo: "https://github.com/NielMSwartz/Habit-Tracker",
    demo: "https://habit-tracker-niel23.vercel.app",
    icon: "repeat",
    tone: "forest",
    sample: false,
  },
  {
    title: "Gym Logbook & Strength Progress Tracker",
    description:
      "A sample entry for a gym logbook and strength tracker. Add your implementation notes, progress-tracking approach and a screenshot when ready.",
    tech: ["Python"],
    image: "",
    imageAlt: "",
    repo: "",
    demo: "",
    icon: "dumbbell",
    tone: "sage",
    sample: true,
  },
  {
    title: "Python Excel Search Application",
    description:
      "A sample entry for a Python utility that searches Excel workbooks. Use this space to document the real scope, approach and outcome.",
    tech: ["Python", "Excel"],
    image: "",
    imageAlt: "",
    repo: "",
    demo: "",
    icon: "search",
    tone: "deep",
    sample: true,
  },
];
