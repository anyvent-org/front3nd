const { Command } = require('@oclif/command')
const { execSync } = require('child_process');
const path = require('path');

class DevelopCommand extends Command {
  async run() {
    const pkgDir = await import('pkg-dir');

    execSync(
      'webpack serve --config webpack.config.js --mode development',
      { stdio: 'inherit', cwd: path.resolve(pkgDir.sync(), 'frontend') }
    );
  }
}

DevelopCommand.description = `Starts the development server.`

module.exports = DevelopCommand
