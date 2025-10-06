const { app, BrowserWindow } = require ('electron');
const path = require ('path');

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

// app.whenReady ().then (create_window);
app.on ('ready', () => {
	const args = process.argv.slice (2);
	
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
