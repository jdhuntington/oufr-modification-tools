import ts from "typescript";
import { mod } from "riceburn";
// import { Modder, TypescriptMod } from "riceburn/lib/interfaces";
import { Migration, MigrationArgs } from "../const";

interface ChangeNestingLevelArgs extends MigrationArgs {
  sourceLevel: number;
  destinationLevel: number;
  match?: string;
}

const name = "change-nesting-level";

const migration: Migration = {
  cb: (args: ChangeNestingLevelArgs) => {
    const source = Array.from({ length: args.sourceLevel }, (v, i) => i)
      .map(() => "..")
      .join("/");
    const target = Array.from({ length: args.destinationLevel }, (v, i) => i)
      .map(() => "..")
      .join("/");
    console.log(args);

    const files = mod("**/*.ts?(x)", { dryRun: !!args.dryRun }).asTypescript(
      (node, modder) => {
        if (ts.isImportDeclaration(node)) {
          const ft = node.getFullText();
          if (!args.match || ft.indexOf(args.match) >= 0) {
            const sub = ft.replace(source, target).trim();
            console.log(`Replacing "${source}" with "${target}" in "${ft}"`);
            return modder.replace(node, sub);
          }
        }
      }
    ).files;
    files.forEach(f => {
      console.log(f);
    });
  },
  name,
  register: s => {
    const parser = s.addParser(name);
    parser.addArgument("sourceLevel", {
      type: (v: string) => parseInt(v, 10)
    });
    parser.addArgument("destinationLevel", {
      type: (v: string) => parseInt(v, 10)
    });
    parser.addArgument(["-m", "--match"], {
      help: "Only process results matching string"
    });
  }
};
export default migration;
