import { Migration, MigrationArgs } from "./const";
import { ArgumentParser, SubParser } from "argparse";
import { findMigrationPaths } from "./util/find-migrations";
const parser = new ArgumentParser({
  version: "999",
  addHelp: true,
  description: "Do the migration stuff the fun way."
});
const sub = parser.addSubparsers({ title: "Commands", dest: "subcommand" });
parser.addArgument(["-d", "--dry-run"], {
  action: "storeConst",
  constant: true,
  dest: "dryRun"
});
const dispatch: { [name: string]: Migration } = {};
function registerMigration(m: Migration, subParser: SubParser) {
  dispatch[m.name] = m;
  m.register(subParser);
}
const paths = findMigrationPaths();
paths.forEach(p => {
  registerMigration(require(p).default, sub);
});

const args = parser.parseArgs();
const runnable = dispatch[args.subcommand];
if (!runnable) {
  throw new Error(
    "Expected a migration but didn't find one. Ensure name is the same as the registered subcommand."
  );
}
runnable.cb(args as MigrationArgs);
