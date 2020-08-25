import fs from "fs";
import path from "path";

const modsBasePath = path.join(__dirname, "..", "mods");

export function findMigrationPaths(): string[] {
  if (!fs.existsSync(modsBasePath)) {
    console.log("No mods available");
    return [];
  }
  return fs
    .readdirSync(path.join(modsBasePath))
    .filter(name => name.endsWith(".js"))
    .sort()
    .map((modPath: string) => path.join(modsBasePath, modPath));
}
