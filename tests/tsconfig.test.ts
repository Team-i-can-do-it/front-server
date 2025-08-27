/* NOTE: Using Vitest for tests (detected). */
import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";

// Helper: strip JS-style comments from JSON (supports // and /* */)
function stripJsonComments(input) {
  return input.replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|\s)\/\/.*$/gm, "");
}

function loadTsConfig() {
  const root = process.cwd();
  const candidates = [
    path.resolve(root, "tsconfig.json"),
    path.resolve(root, "./frontend/tsconfig.json"),
    path.resolve(root, "./app/tsconfig.json")
  ];
  const configPath = candidates.find((p) => fs.existsSync(p));
  if (!configPath) {
    throw new Error("tsconfig.json not found at expected locations: " + candidates.join(", "));
  }
  const raw = fs.readFileSync(configPath, "utf8");
  const json = JSON.parse(stripJsonComments(raw));
  return { json, configPath };
}

describe("tsconfig.json configuration", () => {
  it("should have compilerOptions.baseUrl set to . and files be empty", () => {
    const { json } = loadTsConfig();
    const co = (json && json.compilerOptions) || {};
    expect(co.baseUrl).toBe(".");
    const files = json.files || [];
    expect(Array.isArray(files)).toBe(true);
    expect(files.length).toBe(0);
  });

  it("should include expected project references", () => {
    const { json } = loadTsConfig();
    const refs = json.references || [];
    const refPaths = refs.map((r) => r && r.path);
    expect(refPaths).toEqual(expect.arrayContaining(["./tsconfig.app.json", "./tsconfig.node.json"]));
  });

  it("should define required path aliases and omit @/*", () => {
    const { json } = loadTsConfig();
    const paths = (json.compilerOptions && json.compilerOptions.paths) || {};
    const expected = {
      "@_icons/*": ["src/assets/icons/*"],
      "@_api/*": ["src/api/*"],
      "@_types/*": ["src/types/*"],
      "@_components/*": ["src/components/*"],
      "@_page/*": ["src/page/*"],
      "@_layout/*": ["src/components/layout/*"]
    } as const;

    for (const key of Object.keys(expected)) {
      expect(paths).toHaveProperty(key);
      expect(paths[key]).toEqual(expected[key as keyof typeof expected]);
    }
    expect(paths["@/*"]).toBeUndefined();
  });

  it("should have aliases using wildcard format on keys and targets", () => {
    const { json } = loadTsConfig();
    const paths = (json.compilerOptions && json.compilerOptions.paths) || {};
    for (const [k, v] of Object.entries(paths)) {
      expect(k.endsWith("/*")).toBe(true);
      expect(Array.isArray(v)).toBe(true);
      (v as unknown[]).forEach((t) => {
        expect(typeof t).toBe("string");
        expect((t as string).endsWith("/*")).toBe(true);
      });
    }
  });
});