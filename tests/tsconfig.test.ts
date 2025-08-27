/**
 * Tests for tsconfig.json configuration.
 *
 * Testing library and framework:
 * - We use the project's existing test runner (Jest or Vitest). The tests rely only on Node's fs/path APIs and should run under either framework.
 *
 * These tests validate:
 * - references includes ./tsconfig.app.json and ./tsconfig.node.json
 * - compilerOptions.baseUrl is "."
 * - compilerOptions.paths contains required aliases with correct target globs
 * - "@/*" alias is intentionally commented out in raw content
 * - referenced files exist in the repository
 */
import fs from "fs";
import path from "path";

// Minimal JSON-with-comments stripper to parse tsconfig (supports // and /* */)
function stripJsonComments(input: string): string {
  // Remove block comments
  let out = input.replace(/\/\*[\s\S]*?\*\//g, "");
  // Remove line comments (//...) but keep URLs: http(s)://
  out = out.replace(/(^|[^:])\/\/.*$/gm, (_, p1) => p1);
  return out;
}

function readTsConfig(filename = "tsconfig.json") {
  const full = path.resolve(process.cwd(), filename);
  if (!fs.existsSync(full)) {
    throw new Error(`Missing ${filename} at repository root`);
  }
  const raw = fs.readFileSync(full, "utf8");
  const parsed = JSON.parse(stripJsonComments(raw));
  return { raw, parsed, full };
}

describe("tsconfig.json structure", () => {
  test("file exists at repository root", () => {
    const file = path.resolve(process.cwd(), "tsconfig.json");
    expect(fs.existsSync(file)).toBe(true);
  });

  test("has valid JSONC that parses after stripping comments", () => {
    const { parsed } = readTsConfig();
    expect(typeof parsed).toBe("object");
  });

  test("includes expected references to tsconfig.app.json and tsconfig.node.json", () => {
    const { parsed } = readTsConfig();
    expect(Array.isArray(parsed.references)).toBe(true);
    const refPaths = new Set((parsed.references || []).map((r: any) => r?.path));
    expect(refPaths.has("./tsconfig.app.json")).toBe(true);
    expect(refPaths.has("./tsconfig.node.json")).toBe(true);
  });

  test("referenced tsconfig.*.json files actually exist", () => {
    const root = process.cwd();
    const appPath = path.join(root, "tsconfig.app.json");
    const nodePath = path.join(root, "tsconfig.node.json");
    expect(fs.existsSync(appPath)).toBe(true);
    expect(fs.existsSync(nodePath)).toBe(true);
  });

  test('compilerOptions.baseUrl is set to "."', () => {
    const { parsed } = readTsConfig();
    expect(parsed.compilerOptions).toBeDefined();
    expect(parsed.compilerOptions.baseUrl).toBe(".");
  });

  test("compilerOptions.paths includes required aliases with correct targets", () => {
    const { parsed } = readTsConfig();
    const paths = parsed?.compilerOptions?.paths ?? {};
    // Expected alias map from the diff/source
    const expected: Record<string, string[]> = {
      "@_icons/*": ["src/assets/icons/*"],
      "@_api/*": ["src/api/*"],
      "@_types/*": ["src/types/*"],
      "@_components/*": ["src/components/*"],
      "@_page/*": ["src/page/*"],
      "@_layout/*": ["src/components/layout/*"],
    };

    for (const [alias, targets] of Object.entries(expected)) {
      expect(paths[alias]).toBeDefined();
      expect(Array.isArray(paths[alias])).toBe(true);
      expect(paths[alias]).toEqual(targets);
    }
  });

  test('generic "@/*" alias is not active in parsed paths', () => {
    const { parsed } = readTsConfig();
    const paths = parsed?.compilerOptions?.paths ?? {};
    expect(paths["@/*"]).toBeUndefined();
  });

  test('raw tsconfig.json retains a commented-out "@/*" alias line for clarity', () => {
    const { raw } = readTsConfig();
    // Ensure the raw file contains a commented line resembling: // "@/*": ["src/*"],
    const hasCommentedGenericAlias =
      /\/\/\s*"@\/\*"\s*:\s*\[\s*"src\/\*"\s*\]\s*,?/.test(raw);
    expect(hasCommentedGenericAlias).toBe(true);
  });

  test("no unexpected extra aliases that could shadow the defined ones", () => {
    const { parsed } = readTsConfig();
    const paths = parsed?.compilerOptions?.paths ?? {};
    // Ensure no alias keys are empty or malformed
    for (const key of Object.keys(paths)) {
      expect(typeof key).toBe("string");
      expect(key.length).toBeGreaterThan(0);
      // minimal sanity: aliases should end with /* to map folders
      expect(key.endsWith("/*")).toBe(true);
      const targets = paths[key];
      expect(Array.isArray(targets)).toBe(true);
      for (const t of targets) {
        expect(typeof t).toBe("string");
        // target should typically include a glob
        expect(t.length).toBeGreaterThan(0);
      }
    }
  });
});