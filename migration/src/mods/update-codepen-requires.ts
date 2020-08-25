import ts from "typescript";
import { mod } from "riceburn";
import { Migration, MigrationArgs } from "../const";

interface UpdateExampleRequires extends MigrationArgs {}

const name = "update-codepen-requires";

const packageName = process
  .cwd()
  .split("/")
  .pop();

const migration: Migration = {
  cb: (args: UpdateExampleRequires) => {
    const files = mod("**/*.ts?(x)", { dryRun: !!args.dryRun }).asTypescript(
      (node, modder) => {
        if (
          ts.isStringLiteral(node) &&
          node.parent &&
          ts.isCallExpression(node.parent)
        ) {
          const importString = node
            .getFullText()
            .replace('"', "")
            .replace("'", "")
            .trim();
          if (
            !importString.startsWith(
              "!@uifabric/codepen-loader!office-ui-fabric-react"
            )
          ) {
            return;
          }
          // specific to original implementation. expects conventions applied by other scripts.
          const newRequire = importString.replace(
            "!office-ui-fabric-react/src",
            `!office-ui-fabric-react/src/packages/${packageName}`
          );
          return modder.replace(node, `'${newRequire}`);
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
