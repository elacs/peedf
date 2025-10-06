const pdf_lib = require ('pdf-lib');
const fs = require ('fs');

async function save_pdf (pdf_filepath, markup_paths) {
	// console.log (markup_paths);

	// const existing_pdf_bytes = await fetch (pdf_url).then ((res) => res.arrayBuffer ());
	const existing_pdf_bytes = fs.readFileSync (pdf_filepath);
	const pdf_doc = await pdf_lib.PDFDocument.load (existing_pdf_bytes);

	for (let i = 0; i < markup_paths.length; i++) {
		const page = pdf_doc.getPages ()[markup_paths[i].path_setting.page_num - 1];

		for (let j = 0; j < markup_paths[i].path_points.length - 1; j++) {
			page.drawLine ({
				start : markup_paths[i].path_points[j].get_pdf_coords (),
				end : markup_paths[i].path_points[j + 1].get_pdf_coords (),
				thickness : markup_paths[i].path_setting.path_width,
				color : markup_paths[i].path_setting.get_pdf_lib_rgb ()
			})
		}
	}

	const pdf_bytes = await pdf_doc.save ();

	// const blob = new Blob ([pdf_bytes], { type : 'application/pdf' });
	// const url = URL.createObjectURL (blob);
	// const a = document.createElement ('a');
	// a.href = url;
	// a.download = 'annotated.pdf';
	// a.click();
	
	fs.writeFileSync (pdf_filepath, pdf_bytes);
}

module.exports = {
	save_pdf
}
