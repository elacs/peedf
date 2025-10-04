const { app, BrowserWindow } = require ('electron');
const path = require ('path');

function create_window () {
	const win = new BrowserWindow ({
		width: 1000,
		height: 800,
		webPreferences: {
			preload: path.join (__dirname, 'preload.js'),
			nodeIntegration: true,
			contextIsolation: false
		}
	});

	win.loadFile ('index.html');
}

app.whenReady ().then (create_window);

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
