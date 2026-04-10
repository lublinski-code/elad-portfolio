export type SectionId =
  | "hi"
  | "work"
  | "philosophy"
  | "experience"
  | "about"
  | "contact";

export type Section = {
  id: SectionId;
  label: string;
  /** CSS color value for the section background and the nav block */
  bg: string;
  /** Raw hex for the accent (used for hover border/text) */
  accent: string;
  /** Body text color, accessibility-safe on the bg */
  body: string;
  /** Display headline color (large type, ≥ 24px bold / 30px regular) */
  display: string;
  /** Subtle dividers / mute color tuned per section */
  mute: string;
};

export const sections: Section[] = [
  {
    id: "hi",
    label: "Hi",
    bg: "var(--tomato)",
    accent: "#eb4915",
    body: "var(--black)",
    display: "var(--cream)",
    mute: "rgba(0, 0, 0, 0.7)",
  },
  {
    id: "work",
    label: "Work",
    bg: "var(--coal)",
    accent: "#191919",
    body: "var(--white)",
    display: "var(--cream)",
    mute: "rgba(255, 255, 255, 0.7)",
  },
  {
    id: "philosophy",
    label: "Philosophy",
    bg: "var(--plum)",
    accent: "#6b2ed6",
    body: "var(--white)",
    display: "var(--cream)",
    mute: "rgba(255, 255, 255, 0.75)",
  },
  {
    id: "experience",
    label: "Experience",
    bg: "var(--sky)",
    accent: "#507dff",
    body: "var(--black)",
    display: "var(--cream)",
    mute: "rgba(0, 0, 0, 0.7)",
  },
  {
    id: "about",
    label: "About",
    bg: "var(--pine)",
    accent: "#399946",
    body: "var(--black)",
    display: "var(--cream)",
    mute: "rgba(0, 0, 0, 0.7)",
  },
  {
    id: "contact",
    label: "Contact",
    bg: "var(--sunflower)",
    accent: "#f5c015",
    body: "var(--black)",
    display: "var(--black)",
    mute: "rgba(0, 0, 0, 0.7)",
  },
];

export const getSection = (id: SectionId): Section => {
  const found = sections.find((s) => s.id === id);
  if (!found) throw new Error(`Unknown section: ${id}`);
  return found;
};
