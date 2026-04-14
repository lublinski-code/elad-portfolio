export type SectionId =
  | "hi"
  | "work"
  | "experience"
  | "about"
  | "contact";

export type Section = {
  id: SectionId;
  label: string;
  /** Selected background color — cherry or charcoal */
  selectedBg: string;
  /** Raw hex for the selected bg (used for inline styles) */
  selectedHex: string;
};

export const sections: Section[] = [
  {
    id: "hi",
    label: "Lublinski",
    selectedBg: "var(--cherry)",
    selectedHex: "#eb323a",
  },
  {
    id: "work",
    label: "Work",
    selectedBg: "var(--charcoal)",
    selectedHex: "#2a2a2a",
  },
  {
    id: "experience",
    label: "Experience",
    selectedBg: "var(--charcoal)",
    selectedHex: "#2a2a2a",
  },
  {
    id: "about",
    label: "About",
    selectedBg: "var(--charcoal)",
    selectedHex: "#2a2a2a",
  },
  {
    id: "contact",
    label: "Contact",
    selectedBg: "var(--cherry)",
    selectedHex: "#eb323a",
  },
];

export const getSection = (id: SectionId): Section => {
  const found = sections.find((s) => s.id === id);
  if (!found) throw new Error(`Unknown section: ${id}`);
  return found;
};
