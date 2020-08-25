import ts from "typescript";
import { mod } from "riceburn";
import { Migration, MigrationArgs } from "../const";

interface RehomeArgs extends MigrationArgs {
  rootDir: string;
  oldLocation: string;
  newLocation: string;
}

const name = "fix-specific-imports";
const re = new RegExp("\\.\\./(\\w+)/(\\w+).types");

const migration: Migration = {
  cb: (args: RehomeArgs) => {
    const files = mod("**/*.ts?(x)", { dryRun: !!args.dryRun }).asTypescript(
      (node, modder) => {
        if (
          ts.isStringLiteral(node) &&
          node.parent &&
          ts.isImportDeclaration(node.parent)
        ) {
          const importString = node
            .getFullText()
            .replace('"', "")
            .replace("'", "")
            .trim();
          const matchData = importString.match(re);
          if (
            matchData &&
            matchData[0] &&
            matchData[1] &&
            matchData[2] &&
            matchData[1] === matchData[2]
          ) {
            const parts = importString.split("/");
            parts.pop();
            return modder.replace(node, `'${parts.join("/")}'`);
          }
        }
      }
    );
    console.log({
      modified: files.files
        .filter(f => f.state === "modified")
        .map(f => f.fileName)
    });
  },
  name,
  register: s => {
    const parser = s.addParser(name);
  }
};
export default migration;
