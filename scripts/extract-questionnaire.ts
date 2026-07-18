import { writeFileSync, mkdirSync } from "fs";
import { QUESTIONS } from "../lib/mockRiskEngine";

const sections = new Map<string, true>();
const questions: Record<
  string,
  { title: string; help: string; section: string; options: Record<string, string> }
> = {};

for (const q of QUESTIONS) {
  sections.set(q.section, true);
  questions[q.id] = {
    title: q.title,
    help: q.help,
    section: q.section,
    options: Object.fromEntries(q.options.map((o) => [o.value, o.label])),
  };
}

mkdirSync("messages", { recursive: true });
writeFileSync(
  "messages/_questionnaire-en.json",
  JSON.stringify({ sections: [...sections.keys()], questions }, null, 2)
);
console.log("ok", Object.keys(questions).length);
