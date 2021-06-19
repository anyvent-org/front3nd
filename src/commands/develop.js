const { Command, flags } = require('@oclif/command')
const { execSync } = require('child_process');
const path = require('path');
const pkgDir = require('pkg-dir');

class DevelopCommand extends Command {
  async run() {
    execSync(
      'webpack serve --config webpack.config.js --mode development',
      { stdio: 'inherit', cwd: path.resolve(pkgDir.sync(), 'frontend') }
    );
  }
}

DevelopCommand.description = `Starts the development server.`

module.exports = DevelopCommand
