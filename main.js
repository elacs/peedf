const { app, BrowserWindow } = require ('electron');
const path = require ('path');

const install_cli_command = require ('./install_cli_command.js');

let pdf_filepath = null;

function create_window (pdf_filepath) {
	const win = new BrowserWindow ({
		width: 1000,
		height: 800,
		webPreferences: {
			preload: path.join (__dirname, 'preload.js'),
			nodeIntegration: true,
			contextIsolation: false
		}
	});

	win.loadFile ('index.html', { query : { pdf : pdf_filepath } });
}

app.on ('ready', () => {
	// install_cli_command.install_cli_command ();

	const args_start_idx = app.isPackaged ? 1 : 2;
	const args = process.argv.slice (args_start_idx);
	
	if (args.length > 0) {
		pdf_filepath = args[0];
	}
	pdf_filepath = path.resolve (pdf_filepath);
	// console.log (pdf_filepath);
	
	create_window (pdf_filepath);
});

app.on ('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit ();
	}
});

app.on ('activate', () => {
	if (BrowserWindow.getAllWindows ().length === 0) {
		create_window ();
	}
});
