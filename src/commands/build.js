const { Command, flags } = require('@oclif/command')
const { execSync } = require('child_process');
const path = require('path');
const pkgDir = require('pkg-dir');

class BuildCommand extends Command {
  async run() {
    execSync(
      'webpack --config webpack.config.js --mode production',
      { stdio: 'inherit', cwd: path.resolve(pkgDir.sync(), 'frontend') }
    );
  }
}

BuildCommand.description = `Builds the project.`

module.exports = BuildCommand
