import { readFile } from "fs/promises";
import { join } from "path";
import CharactersClient from "./CharactersClient";
import type { CharEntry } from "./CharactersClient";

export default async function CharactersPage() {
  const raw = await readFile(
    join(process.cwd(), "public", "assets", "characters", "character_list.txt"),
    "utf8"
  );
  const chars: CharEntry[] = raw
    .trim()
    .split(/\r?\n/)
    .filter((l) => l.trim())
    .map((line) => {
      const comma = line.indexOf(",");
      return {
        file: line.slice(0, comma).trim(),
        label: line.slice(comma + 1).trim(),
      };
    });
  return <CharactersClient chars={chars} />;
}
