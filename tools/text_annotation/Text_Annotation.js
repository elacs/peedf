class Text_Annotation {
	constructor (path_setting, starting_path_point, text = '') {
		this.path_setting = path_setting;
		this.text = text;

		this.anchor = starting_path_point;
	}
	
	set_text (text) {
		this.text = text;
	}

	render_annotation (_, text_annotations_div, page_num, scale) {

		if (this.path_setting.page_num != page_num) { return; }

		const canvas_coords = this.anchor.get_canvas_coords (draw_canvas.height, scale);

		const text_element = document.createElement ('div');
	
		text_element.classList.add ('text_annotation')

		text_element.innerHTML = this.text;

		text_element.style.left = canvas_coords.x + 'px';
		text_element.style.top = canvas_coords.y + 'px';
		text_element.style.fontSize = (this.path_setting.path_size * scale) + 'px';
		text_element.style.color = this.path_setting.get_rgba ();
		// text_element.style.cursor = 'text';

		text_annotations_div.appendChild (text_element);

	}

	save_to_pdf_doc (pdf_doc, font) {
		const page = pdf_doc.getPages ()[this.path_setting.page_num - 1];
		
		const pdf_coords = this.anchor.get_pdf_coords ();
		
		const font_size = this.path_setting.path_size;

		// const save_position_offset = {  }

		page.drawText (this.text, {
			x: pdf_coords.x,
			y: pdf_coords.y - this.path_setting.path_size,
			size: font_size, // font size
			lineHeight: 1.2 * font_size,
			font: font,
			color:	this.path_setting.get_pdf_lib_rgb (),
		})

	}

}


module.exports = {
	Text_Annotation
};
