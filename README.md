# peedf

small pdf viewer / editor cos im fed up with everything else on the market lol

## prerequisites

- latest version of [Node.js](https://nodejs.org) and npm

## setup

1. clone the repo
```bash
git clone https://github.com/elacs/peedf.git
cd peedf
```

2. install dependencies
```bash
npm install
```

3. run app in development mode with pdf filepath:
```bash
npm start /path/to/document.pdf
```

or standalone (opens file picker):
```bash
npm start
```

### building

this project uses electron-builder to package the app into standalone executables

```bash
npm run build
```

the built executable will be generated in the `dist/` directory

### running

the built executable can be run from the terminal with pdf filepath

```bash
/path/to/peedf_executable /path/to/document.pdf
```

or standalone (opens file picker):
```bash
/path/to/peedf_executable
```

## attributions
for a full list of third-party icon attributions, see [CREDITS.md](CREDITS.md)

## TODO

- ~~add pan function~~
- ~~add highlight function~~
- ~~add text function~~
	- ~~render and saved positions seem slightly off from each other~~
	- ~~add methods to change font size, color~~
- ~~add undo / redo function~~
- add erase function
- ~~add page indicator~~
- ~~add scale indicator~~
- beautify the UI
- support encrypted pdfs
	- PDFJS.getDocument ({url, password}) 
	- pdf-lib-with-encrypt (?)
- some pdfs have different coordinate systems?
- need to refactor renderer.js
- add app icon
- ~~support running standalone (without command line arg)~~
