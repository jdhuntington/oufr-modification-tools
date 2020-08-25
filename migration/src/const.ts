import { SubParser } from "argparse";

export interface MigrationArgs {
  dryRun: boolean;
}

export interface Migration {
  name: string; // name needs to equal the registered command name. This is a leaky abstraction.
  cb: (args: MigrationArgs) => void;
  register: (subParser: SubParser) => void;
}
