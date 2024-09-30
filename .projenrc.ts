import {JsonFile, TextFile, web} from 'projen';

const devDependencies = () => [
    "@rollup/plugin-commonjs",
    "@rollup/plugin-node-resolve",
    "@rollup/plugin-terser",
    "@rollup/plugin-typescript",
    "@types/react",
    "react",
    "rollup",
    "rollup-plugin-dts",
    "rollup-plugin-peer-deps-external",
    "rollup-plugin-postcss",
    "tslib",
    "typescript"
];

const project = new web.ReactTypeScriptProject({
    defaultReleaseBranch: 'main',
    name: '@hasanthika/react_npm',
    projenrcTs: true,
    prettier: true,
    description: "React Plugin Setup",
    disableTsconfig: true,
    devDeps: [...devDependencies()],
    repository: "https://github.com/hasanthikaaa/react-plugin.git",
    gitignore: [".npmrc"]
});

project.package.addField("main", "dist/index.js");
project.package.addField("module", "dist/index.mjs");
project.package.addField("types", "dist/index.d.ts");

project.addTask("rollup", {
    exec: "rollup -c --bundleConfigAsCjs"
})

new TextFile(project, "rollup.config.js", {
    lines: [
        `import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import dts from "rollup-plugin-dts";
import terser from "@rollup/plugin-terser";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import postcss from "rollup-plugin-postcss";

const packageJson = require("./package.json");
export default [
  {
    input: "src/index.ts",
    output: [
      {
        file: packageJson.main,
        format: "cjs",
        sourcemap: true,
      },
      {
        file: packageJson.module,
        format: "es",
        sourcemap: true,
      },
    ],
    plugins: [
      peerDepsExternal(),
      resolve(),
      commonjs(),
      typescript({ tsconfig: "./tsconfig.json" }),
      terser(),
      postcss(),
    ],
    external: ["react", "react-dom"],
  },
  {
    input: "src/index.ts",
    output: [{ file: packageJson.types }],
    plugins: [dts.default()],
    external: [/\\.css$/],
  },
];

        `
    ]
})

new JsonFile(project, "tsconfig.json", {
    obj: {
        compilerOptions: {
            "target": "es5",
            "lib": ["dom", "dom.iterable", "esnext"],
            "allowJs": true,
            "skipLibCheck": true,
            "esModuleInterop": true,
            "allowSyntheticDefaultImports": true,
            "strict": true,
            "forceConsistentCasingInFileNames": true,
            "noFallthroughCasesInSwitch": true,
            "module": "esnext",
            "moduleResolution": "node",
            "resolveJsonModule": true,
            "isolatedModules": true,
            "noEmit": true,
            "jsx": "react-jsx"
        },
        "include": ["src"]
    },
});
project.synth();