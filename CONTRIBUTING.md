# Contributing

## Contributing to code

### Prerequisites

Install the node from their official site or using nvm.

1. [NodeJS](https://nodejs.org/en/) v14

### Local development

You will first need to clone the repository using git and place yourself in its directory:

```shell
git clone git@github.com:The-West-Scripts/TW-Calc-Script.git
cd TW-Calc-Script
```

Install dependencies.

```shell
npm install
```

Run tests to make sure everything is working fine.

```shell
npm test
```

### Building (TW_Calc.user.js)

To build the userscript run either:

-   `npm run build` - for production build (the build is slower, but the file is minified)
-   `npm run build:dev` - for dev build

The userscript will be in `dist/TW_Calc.user.js` file.

When developing, you will need to copy the contents of the script pretty often (for pasting it to tampermonkey), so
it is handy to use shortcuts to place the script contents in the clipboard.
On macOS, you can use _pbcopy_, example: `npm run build:dev && pbcopy < dist/TW_Calc.user.js`.

### Code style

We use **eslint** for code linting nad **prettier** for code formatting.
Run `npm run lint` to check if your code is formatted properly, if not, run
`npm run lint:fix` to fix the issues automatically (however, some of them must be fixed manually).

### Branching strategy

This repository follows _ trunk-based development branching strategy_. You can read more about it [here](https://trunkbaseddevelopment.com/).
The master branch is the source of the latest code.

## Releasing

Use [semantic versioning](https://semver.org/) for versions. When doing a bugfix increase just patch version,
if doing a bigger change (adding some new feature), increase minor version.
The following command changes version to `v2.0.0`.

```shell
npm version -m "Bump version to %s" 2.0.0
```

Then push your local changes (new commit and tag).

```shell
git push --tags
```

There will be a pipeline for your tag which will create a draft release if it succeeds.
Update the created draft [release](https://github.com/timzatko/Sklearn-Nature-Inspired-Algorithms/releases) with release
notes and publish it. This will trigger another pipeline that makes the update available to users (they will receive
in-game dialog).