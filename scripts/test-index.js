const path = require('path');
const glob = require('glob');
const fs = require('fs');

const rootPath = path.join(__dirname, '..');
const srcPath = path.join(rootPath, 'src');
const testSupportPath = path.join(rootPath, 'tests/support');
const outPath = path.join(rootPath, 'tests/support/dist');

const indexContents = fs.readFileSync(path.join(testSupportPath, 'index.ts'), { flag: 'r', encoding: 'utf8' });

glob('**/*.spec.ts', { cwd: srcPath }, (_, files) => {
    const relativePath = path.relative(outPath, srcPath);
    const imports = files.map(file => `import '${relativePath}/${file}';`).join('\n');
    const newContents = `${indexContents}\n${imports}`;

    fs.mkdirSync(outPath, { recursive: true });
    fs.writeFileSync(`${outPath}/index.ts`, newContents);
});
