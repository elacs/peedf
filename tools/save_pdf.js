const pdf_lib = require ('pdf-lib');
const fs = require ('fs');

async function save_pdf (pdf_filepath, markup_paths) {
	const existing_pdf_bytes = fs.readFileSync (pdf_filepath);
	const pdf_doc = await pdf_lib.PDFDocument.load (existing_pdf_bytes);

	const helvetica_font = await pdf_doc.embedFont (pdf_lib.StandardFonts.Helvetica);

	for (let i = 0; i < markup_paths.length; i++) {
		markup_paths[i].save_to_pdf_doc (pdf_doc, helvetica_font);
	}

	const pdf_bytes = await pdf_doc.save ();

	await fs.writeFileSync (pdf_filepath, pdf_bytes);
}

module.exports = {
	save_pdf
}
