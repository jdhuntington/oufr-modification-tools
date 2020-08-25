import path from "path";
import ts from "typescript";
import { mod } from "riceburn";
import { Migration, MigrationArgs } from "../const";

interface ExportRequires extends MigrationArgs {
  glob: string;
}

const name = "export";

function log(obj: any) {
  console.log(JSON.stringify(obj));
}

function getFrom(node: ts.ExportDeclaration): string {
  let stringLiteral = "";
  ts.forEachChild(node, n => {
    if (ts.isStringLiteral(n)) {
      stringLiteral = n
        .getFullText()
        .trim()
        .replace(/["']/gi, "");
    }
  });
  if (stringLiteral.startsWith("./") || stringLiteral.startsWith("../")) {
    stringLiteral = path.resolve(
      path.dirname(getFilename(node)),
      stringLiteral
    );
  }
  return stringLiteral;
}

function getFirstIdentifier(node: ts.Node): string {
  let str: string | null = null;

  const cb = (n: ts.Node) => {
    if (!str && ts.isIdentifier(n)) {
      str = n.getFullText().trim();
    } else ts.forEachChild(n, cb);
  };
  ts.forEachChild(node, cb);
  return str || "";
}

function getFilename(node: ts.Node): string {
  /*console.log({
    resolved: path.resolve(node.getSourceFile().fileName),
    filename: node.getSourceFile().fileName
  });*/
  return path.resolve(node.getSourceFile().fileName);
}

const migration: Migration = {
  cb: (args: ExportRequires) => {
    const files = mod(args.glob, { dryRun: !!args.dryRun }).asTypescript(
      (node, modder) => {
        if (ts.isExportDeclaration(node)) {
          handleExportDeclaration(node);
        } else if (ts.SyntaxKind.ExportKeyword === node.kind) {
          if (ts.isInterfaceDeclaration(node.parent)) {
            handleInterfaceDeclaration(node.parent);
          } else if (ts.isClassDeclaration(node.parent)) {
            handleClassDeclaration(node.parent);
          } else if (ts.isEnumDeclaration(node.parent)) {
            handleEnumDeclaration(node.parent);
          } else if (ts.isFunctionDeclaration(node.parent)) {
            handleFunctionDeclaration(node.parent);
          } else if (ts.isModuleDeclaration(node.parent)) {
            handleModuleDeclaration(node.parent);
          } else if (ts.isVariableStatement(node.parent)) {
            handleVariableStatement(node.parent);
          } else if (ts.isTypeAliasDeclaration(node.parent)) {
            handleTypeAliasDeclaration(node.parent);
          } else {
            console.log(
              `Have this: ${
                ts.SyntaxKind[node.parent.kind]
              }\n${node.parent.getFullText()}`
            );
          }
        }
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

function handleInterfaceDeclaration(node: ts.InterfaceDeclaration) {
  const name = node.name.getFullText().trim();
  log({ filename: getFilename(node), declaration: name });
}
function handleClassDeclaration(node: ts.ClassDeclaration) {
  const name = node.name!.getFullText().trim();
  log({ filename: getFilename(node), declaration: name });
}
function handleEnumDeclaration(node: ts.EnumDeclaration) {
  const name = node.name!.getFullText().trim();
  log({ filename: getFilename(node), declaration: name });
}
function handleModuleDeclaration(node: ts.ModuleDeclaration) {
  const name = node.name!.getFullText().trim();
  log({ filename: getFilename(node), declaration: name });
}
function handleFunctionDeclaration(node: ts.FunctionDeclaration) {
  const name = node.name!.getFullText().trim();
  log({ filename: getFilename(node), declaration: name });
}
function handleTypeAliasDeclaration(node: ts.TypeAliasDeclaration) {
  const name = node.name!.getFullText().trim();
  log({ filename: getFilename(node), declaration: name });
}
function handleVariableStatement(node: ts.VariableStatement) {
  log({
    filename: getFilename(node),
    declaration: getFirstIdentifier(node)
  });
}

function handleExportDeclaration(node: ts.ExportDeclaration) {
  if (
    node
      .getFullText()
      .trim()
      .startsWith("export * from")
  ) {
    log({
      filename: getFilename(node),
      specifier: "*",
      target: getFrom(node)
    });
  } else {
    if (node.exportClause) {
      ts.forEachChild(node.exportClause, childNode => {
        if (ts.isExportSpecifier(childNode)) {
          log({
            filename: getFilename(node),
            specifier: childNode.getFullText().trim(),
            target: getFrom(node)
          });
        }
        return undefined;
      });
    }
  }
}
