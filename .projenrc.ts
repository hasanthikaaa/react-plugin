import { JsonFile, web } from 'projen';
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
  releaseFailureIssue: true,
  npmRegistryUrl: 'https://npm.pkg.github.com',
  githubOptions: {
    workflows: true,
    projenCredentials: GithubCredentials.fromPersonalAccessToken({ secret: 'PROJEN_TOKEN' }),
  },
});


project.bundler.addBundle('src/index.ts', {
  target: 'esnext',
  platform: 'browser',
  externals: ['react', 'react-dom'],
  sourcemap: true,
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

project.synth();