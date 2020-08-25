import ts from "typescript";
import { mod } from "riceburn";
import path from "path";
import { Migration, MigrationArgs } from "../const";

interface RehomeArgs extends MigrationArgs {
  rootDir: string;
  oldLocation: string;
  newLocation: string;
}

const name = "rehome";

const migration: Migration = {
  cb: (args: RehomeArgs) => {
    const rootDir = path.resolve(args.rootDir);
    const oldLocation = path.resolve(args.oldLocation);
    const newLocation = path.resolve(args.newLocation);

    const rootDirDepth = rootDir.split("/").length;
    const oldLocationDepth = oldLocation.split("/").length;
    const newLocationDepth = newLocation.split("/").length;
    const oldToRootDelta = oldLocationDepth - rootDirDepth;
    const delta = newLocationDepth - oldLocationDepth;
    console.log({ rootDir, oldLocation, newLocation, delta });

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
          const filename = path
            .resolve(node.getSourceFile().fileName)
            .replace(`${newLocation}/`, "");
          const originalFilename = path.resolve(oldLocation, filename);
          const originalResolution = path.resolve(
            path.dirname(originalFilename),
            importString
          );
          const depth = path.resolve(filename).split("/").length;

          const ascendHeight = importString.split("/").filter(x => x === "..")
            .length;
          console.log({
            depth,
            importString,
            ascendHeight,
            filename,
            originalFilename,
            "originalFilename.indexOf(oldLocation)": originalFilename.indexOf(
              oldLocation
            ),
            oldLocation,
            "originalResolution.indexOf(oldLocation)": originalResolution.indexOf(
              oldLocation
            ),
            originalResolution,
            originalResolutionMakeup: `path.resolve(${path.dirname(
              originalFilename
            )},${importString})`
          });
          /*if (
            oldLocationDepth - ascendHeight <= rootDirDepth + 1 &&
            ascendHeight > 0
          ) */
          if (
            originalResolution.indexOf(oldLocation) === -1 &&
            ascendHeight > 0
          ) {
            // accessed something on root, prepend some bits
            let newImport = importString;
            for (let i = 0; i < delta; i++) {
              newImport = `../${newImport}`;
            }
            return modder.replace(node, `'${newImport}`);
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
    parser.addArgument("rootDir");
    parser.addArgument("oldLocation");
    parser.addArgument("newLocation");
  }
};
export default migration;
