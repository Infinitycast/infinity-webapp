// Profanity filter with different severity levels
const MILD_PROFANITY = ["damn", "hell", "crap", "ass"];
const SEVERE_PROFANITY = ["fuck", "shit", "bitch", "bastard"];
const RACIAL_SLURS = [
  "n*gger",
  "n*gga",
  "ch*nk",
  "sp*c",
  "k*ke",
  "f*ggot",
  "tr*nny",
];

export interface ProfanityCheckResult {
  hasProfanity: boolean;
  hasRacialSlur: boolean;
  filteredText: string;
  severity: "none" | "mild" | "severe" | "slur";
}

export const checkProfanity = (text: string): ProfanityCheckResult => {
  const lowerText = text.toLowerCase();

  // Check for racial slurs (auto-flag)
  const hasRacialSlur = RACIAL_SLURS.some((slur) =>
    lowerText.includes(slur.replace("*", ""))
  );

  if (hasRacialSlur) {
    return {
      hasProfanity: true,
      hasRacialSlur: true,
      filteredText: censorText(text, [
        ...RACIAL_SLURS,
        ...SEVERE_PROFANITY,
        ...MILD_PROFANITY,
      ]),
      severity: "slur",
    };
  }

  // Check for severe profanity
  const hasSevereProfanity = SEVERE_PROFANITY.some((word) =>
    new RegExp(`\\b${word}\\b`, "i").test(text)
  );

  if (hasSevereProfanity) {
    return {
      hasProfanity: true,
      hasRacialSlur: false,
      filteredText: censorText(text, [...SEVERE_PROFANITY, ...MILD_PROFANITY]),
      severity: "severe",
    };
  }

  // Check for mild profanity
  const hasMildProfanity = MILD_PROFANITY.some((word) =>
    new RegExp(`\\b${word}\\b`, "i").test(text)
  );

  if (hasMildProfanity) {
    return {
      hasProfanity: true,
      hasRacialSlur: false,
      filteredText: censorText(text, MILD_PROFANITY),
      severity: "mild",
    };
  }

  return {
    hasProfanity: false,
    hasRacialSlur: false,
    filteredText: text,
    severity: "none",
  };
};

const censorText = (text: string, words: string[]): string => {
  let censored = text;
  words.forEach((word) => {
    const cleanWord = word.replace("*", "");
    const regex = new RegExp(`\\b${cleanWord}\\b`, "gi");
    censored = censored.replace(
      regex,
      (match) => match[0] + "*".repeat(match.length - 1)
    );
  });
  return censored;
};
