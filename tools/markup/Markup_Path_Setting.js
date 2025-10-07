const pdf_lib = require ('pdf-lib');

class Markup_Path_Setting {
	constructor (page_num, path_color, path_size, path_opacity) {
		this.page_num = page_num;
		this.path_color = path_color;
		this.path_size = path_size;
		this.path_opacity = path_opacity;
	}
	
	get_rgba () {
		const { r, g, b } = this.path_color;
		return 'rgba(' + r + ',' + g + ',' + b + ',' + this.path_opacity + ')';
	}

	get_pdf_lib_rgb () {
		// const rgb = this.path_color.slice (4, -1).split (',').map (x => x / 255);
		const { r, g, b } = this.path_color;

		return pdf_lib.rgb (r / 255, g / 255, b / 255);
	}
}

module.exports = {
	Markup_Path_Setting
};
