const { Command } = require('@oclif/command')
const { execSync } = require('child_process');
const path = require('path');

class BuildCommand extends Command {
  async run() {
    const pkgDir = await import('pkg-dir');

    execSync(
      'webpack --config webpack.config.js --mode production',
      { stdio: 'inherit', cwd: path.resolve(pkgDir.sync(), 'frontend') }
    );
  }
}

BuildCommand.description = `Builds the project.`

module.exports = BuildCommand
