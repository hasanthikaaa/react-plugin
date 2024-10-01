import { JsonFile, web } from 'projen';
import { TrailingComma } from 'projen/lib/javascript';

const devDependencies = () => [
  'typescript',
  '@testing-library/react',
  '@testing-library/jest-dom',
  '@testing-library/dom',
];

const project = new web.ReactTypeScriptProject({
  defaultReleaseBranch: 'main',
  name: '@hasanthikaaa/react_npm',
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