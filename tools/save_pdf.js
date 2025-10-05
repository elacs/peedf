const pdf_lib = require ('pdf-lib');

async function save_pdf (pdf_url, markup_paths) {
	// console.log (markup_paths);

	const existing_pdf_bytes = await fetch (pdf_url).then ((res) => res.arrayBuffer ());
	const pdf_doc = await pdf_lib.PDFDocument.load (existing_pdf_bytes);

	// const svg_paths = markup_paths.map ((markup_path) => markup_path.get_svg_path ());
	
	// console.log (svg_paths);
	
	// for (let i = 0; i < markup_paths.length; i++) {
	// 	const page = pdf_doc.getPages ()[markup_paths[i].path_setting.page_num - 1];
	// 	console.log (markup_paths[i].get_svg_path ());
	// 	page.drawSvgPath (markup_paths[i].get_svg_path (), {
	// 		borderColor: pdf_lib.rgb (0,0,1),
	// 		borderWidth: markup_paths[i].path_setting.path_width
	// 	});
	// }


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

	// const page = pdf_doc.getPages ()[0];
	// page.moveTo (0, 0);
	// page.lineTo (50, 50);
	// page.stroke ({
	// 	thickness : 3,
	// 	color: pdf_lib.rgb (1, 0, 0)
	// });
	// page.drawSvgPath ('M 0,0 L 50,50', {
	// 	color : pdf_lib.rgb (0,0,1),
	// 	borderWidth : 3
	// });
	// page.drawLine ({
	// 	start : { x : 0, y : 0 },
	// 	end: { x : 50, y : 50 },
	// 	thickness : 5,
	// 	color : pdf_lib.rgb (0, 0, 1)
	// });
	
	const pdf_bytes = await pdf_doc.save ();

	const blob = new Blob ([pdf_bytes], { type : 'application/pdf' });
	const url = URL.createObjectURL (blob);
	const a = document.createElement ('a');
	a.href = url;
	a.download = 'annotated.pdf';
	a.click();
}

module.exports = {
	save_pdf
}
