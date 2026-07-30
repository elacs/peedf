const { app, BrowserWindow, dialog } = require ('electron');
const path = require ('path');

// const install_cli_command = require ('./install_cli_command.js');

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

app.on ('ready', async () => {
	// install_cli_command.install_cli_command ();

	const args_start_idx = app.isPackaged ? 1 : 2;
	const args = process.argv.slice (args_start_idx);
	
	if (args.length > 0) {
		pdf_filepath = path.resolve (args[0]);
	} else {
		// no cli args passed
		const result = await dialog.showOpenDialog ({
			title: 'select PDF file',
			properties: ['openFile'],
			filters: [
				{ name: 'PDF Documents', extensions: ['pdf'] }
			]
		});
		
		if (result.cancelled || result.filePaths.length === 0) {
			app.quit ();
			return;
		}

		pdf_filepath = result.filePaths[0];
	}

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
