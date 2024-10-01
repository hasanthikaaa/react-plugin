import {JsonFile, JsonPatch, web} from 'projen';
import { GithubCredentials } from 'projen/lib/github';
import { TrailingComma } from 'projen/lib/javascript';

const devDependencies = () => [
  '@rollup/plugin-commonjs',
  '@rollup/plugin-node-resolve',
  '@rollup/plugin-terser',
  '@rollup/plugin-typescript',
  '@types/react',
  'rollup',
  'rollup-plugin-dts',
  'rollup-plugin-peer-deps-external',
  'rollup-plugin-postcss',
  'tslib',
  'typescript',
  '@testing-library/react',
  '@testing-library/jest-dom',
  '@testing-library/dom',
];

const project = new web.ReactTypeScriptProject({
  defaultReleaseBranch: 'main',
  name: '@hasanthika/react_npm',
  projenrcTs: true,
  gitignore: ['.idea', '.npmrc'],
  description: 'React Plugin Setup',
  devDeps: [...devDependencies()],
  repository: 'https://github.com/hasanthikaaa/react-plugin.git',
  disableTsconfig: true,
  release: true,
  releaseToNpm: true,
  githubOptions: {
    workflows: true,
    projenCredentials: GithubCredentials.fromPersonalAccessToken({ secret: 'PROJEN_TOKEN' }),
  },
  package: true,
});


project.bundler.addBundle('src/index.ts', {
  target: 'esnext',
  platform: 'browser',
  externals: ['react', 'react-dom'],
  sourcemap: true,
});

project.addTask('bump-version', {
  exec: 'npm version patch',
});

project.prettier?.addOverride({
  files: '*.ts',
  options: {
    singleQuote: true,
    semi: false,
    tabWidth: 2,
    trailingComma: TrailingComma.ES5,
    printWidth: 80,
  },
});

new JsonFile(project, 'tsconfig.json', {
  obj: {
    compilerOptions: {
      target: 'es5',
      lib: ['dom', 'dom.iterable', 'esnext'],
      allowJs: true,
      skipLibCheck: true,
      esModuleInterop: true,
      allowSyntheticDefaultImports: true,
      strict: true,
      forceConsistentCasingInFileNames: true,
      noFallthroughCasesInSwitch: true,
      module: 'esnext',
      moduleResolution: 'node',
      resolveJsonModule: true,
      isolatedModules: true,
      noEmit: true,
      jsx: 'react-jsx',
    },
    include: ['src'],
  },
});

// Enable private npm module install option
const NPM_AUTH_TOKEN_SECRET = '${{ secrets.NPM_TOKEN }}';

const privateNPMPackageAuthStep = {
  name: 'Authenticate with private NPM package',
  run: `echo "@hasanthikaaa:registry=https://npm.pkg.github.com/hasanthikaaa" > .npmrc
echo "@hasanthikaaa:registry=https://npm.pkg.github.com" >> .npmrc
echo "//npm.pkg.github.com/:_authToken=${NPM_AUTH_TOKEN_SECRET}" >> .npmrc
echo "registry=https://registry.npmjs.org" >> .npmrc
cat .npmrc`,
};

// const versionUpdateStep = {
//   name: 'Bump version',
//   run: 'npm version patch',
// };
//
const releaseWorkflow = project.tryFindObjectFile(
  '.github/workflows/release.yml',
);
releaseWorkflow?.patch(
  JsonPatch.add('/jobs/release/steps/1', privateNPMPackageAuthStep),
);

//
// releaseWorkflow?.patch(
//   JsonPatch.add('/jobs/release/steps/3', versionUpdateStep),
// );

project.synth();