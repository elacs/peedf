class Markup_Path_Point {
	constructor (canvas_x, canvas_y, canvas_height, scale) {
		const pdf_coords = this.convert_canvas_coords_to_pdf_coords (canvas_x, canvas_y, canvas_height, scale);

		this.pdf_x = pdf_coords.x;
		this.pdf_y = pdf_coords.y;
	}
	
	convert_canvas_coords_to_pdf_coords (canvas_x, canvas_y, canvas_height, scale) {
		const pdf_height = canvas_height / scale;

		const pdf_x = canvas_x / scale;
		const pdf_y = pdf_height - (canvas_y / scale);

		return { x: pdf_x, y: pdf_y };
	}

	get_pdf_coords () {
		return { x: this.pdf_x, y: this.pdf_y };
	}

	get_canvas_coords (canvas_height, scale) {
		const pdf_height = canvas_height / scale;

		const canvas_x = this.pdf_x * scale;
		const canvas_y = (pdf_height - this.pdf_y) * scale;

		return { x: canvas_x, y: canvas_y };
	}
}


module.exports = {
	Markup_Path_Point
};
