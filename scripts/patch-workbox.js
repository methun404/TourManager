// Patches workbox-build to escape single quotes in paths (e.g. volumes or paths with apostrophes like Methun's T7)
import fs from 'fs';
import path from 'path';

const targetFile = path.resolve('node_modules/workbox-build/build/lib/module-registry.js');

if (fs.existsSync(targetFile)) {
  let content = fs.readFileSync(targetFile, 'utf8');
  if (!content.includes(".replace(/'/g")) {
    content = content.replace(
      'const pkgRoot = upath_1.default.dirname(pkgJsonPath);',
      `const pkgRoot = upath_1.default.dirname(pkgJsonPath);
            const escapedPath = \`\${pkgRoot}/\${moduleName}.mjs\`.replace(/'/g, "\\\\'");`
    ).replace(
      "'${pkgRoot}/${moduleName}.mjs'",
      "'${escapedPath}'"
    );
    fs.writeFileSync(targetFile, content, 'utf8');
    console.log('✔ Successfully patched workbox-build for paths with apostrophes');
  }
}
