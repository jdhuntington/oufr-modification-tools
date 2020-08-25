import ts from "typescript";
import { mod } from "riceburn";
import { Migration, MigrationArgs } from "../const";

interface WalkRequires extends MigrationArgs {
  glob: string;
}

const name = "walk";

const migration: Migration = {
  cb: (args: WalkRequires) => {
    const files = mod(args.glob, { dryRun: !!args.dryRun }).asTypescript(
      (node, modder) => {
        console.log(`    type: ${ts.SyntaxKind[node.kind]}`);
        console.log(`fulltext: '${node.getFullText().trim()}'`);
      }
    );
  },
  name,
  register: s => {
    const parser = s.addParser(name);
    parser.addArgument("glob");
  }
};

export default migration;
