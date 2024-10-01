import { JsonFile, JsonPatch, web } from 'projen';
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
  gitignore: ['.npmrc', '.idea'],
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
});

const packageJson = project.tryFindObjectFile('package.json');
packageJson?.addOverride('version', '0.0.1');

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

const versionUpdateStep = {
  name: 'Bump version',
  run: 'npm version patch -m "ci: bump version to %s"',
};

const addPackageJsonFile = {
  name: 'Add package.json',
  run: 'git add package.json',
};

const commitPackageJsonFile = {
  name: 'Commit package.json',
  run: 'git diff --quiet package.json || git commit -m "ci: bump version"',
};

const pushPackageJsonfile = {
  name: 'Push package.json',
  run: 'git diff --quiet package.json || git push origin main',
};

const releaseWorkflow = project.tryFindObjectFile(
  '.github/workflows/release.yml',
);

releaseWorkflow?.patch(
  JsonPatch.add('/jobs/release/steps/3', versionUpdateStep),
  JsonPatch.add('/jobs/release/steps/4', addPackageJsonFile),
  JsonPatch.add('/jobs/release/steps/5', commitPackageJsonFile),
  JsonPatch.add('/jobs/release/steps/6', pushPackageJsonfile),
);

project.synth();