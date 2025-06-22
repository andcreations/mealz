import { buildAssets } from './build-assets';
import { buildStyles } from './build-styles';
import { buildApp } from './build-app';
import { buildHTML } from './build-html';

type BuilderFunc = () => Promise<void>;

interface Builder {
  /** Builder name. */
  name: string;

  /** Function to call the builder. */
  func: BuilderFunc;

  /** Builders to call after this build. */
  post?: string[];
}

const ASSETS = 'assets';
const STYLES = 'styles';
const APP = 'app';
const HTML = 'html';
const ALL = 'all';

const BUILDERS: Builder[] = [
  {
    name: ASSETS,
    func: buildAssets,
  },
  {
    name: STYLES,
    func: buildStyles,
    post: [HTML],
  },
  {
    name: APP,
    func: buildApp,
    post: [HTML],
  },
  {
    name: HTML,
    func: buildHTML,
  },
  {
    name: ALL,
    func: buildAll,
  },
];

async function buildOne(
  name: string,
  options?: {
    skipPost?: boolean,
  },
): Promise<void> {
  const builder = BUILDERS.find(builder => builder.name === name);
  if (!builder) {
    throw new Error(`Unknown builder ${name}`);
  }
  await builder.func();
  console.log();

  // post builders
  if (!options?.skipPost) {
    for (const post of (builder.post || [])) {
      await buildOne(post);
    }
  }
}

async function buildAll(): Promise<void> {
  for (const builder of BUILDERS) {
    if (builder.name === ALL) {
      continue;
    }
    await buildOne(builder.name, { skipPost: true });
  }
}

async function build(): Promise<void> {
  const args = process.argv.slice(2);
  for (const arg of args) {
    buildOne(arg);
  }
}

build().catch((error) => console.error(error));