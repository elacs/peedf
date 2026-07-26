const fs = require ('fs');
const path = require ('path');
const { app } = require ('electron');

function install_cli_command () {
	if (process.platform !== 'darwin' || !app.isPackaged) return;

	const target_path = '/usr/local/bin/peedf';

	const executable_path = path.join (app.getAppPath (), '..', '..', 'MacOS', 'peedf');

	try {
		if (!fs.existsSync (targetPath)) {
			fs.symlinkSync (executable_path, target_path);
		}
	} catch (err) {
		console.error ('could not install cli command');
	}
}

module.exports = {
	install_cli_command
};
