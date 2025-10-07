class Markup_Path {
	constructor (path_setting, starting_path_point) {
		this.path_setting = path_setting;
		this.path_points = [starting_path_point];
	}
	
	append_path_point (path_point) {
		this.path_points.push (path_point);
	}

	render_path (draw_ctx, page_num, canvas_height, scale) {
		if (this.path_setting.page_num == page_num) {
			draw_ctx.strokeStyle = this.path_setting.get_rgba ();
			draw_ctx.lineWidth = this.path_setting.path_size;
			
			const path_points_canvas_coords = this.path_points.map (path_point => path_point.get_canvas_coords (canvas_height, scale));
			
			// console.log (path_points_canvas_coords);

			for (let i = 0; i < path_points_canvas_coords.length - 1; i++) {
				draw_ctx.lineCap = 'round';
				draw_ctx.beginPath ();
				draw_ctx.moveTo (path_points_canvas_coords[i].x, path_points_canvas_coords[i].y);
				draw_ctx.lineTo (path_points_canvas_coords[i + 1].x, path_points_canvas_coords[i + 1].y);
				draw_ctx.stroke ();
			}
		}
	}

	get_svg_path () {
		return this.path_points.map ((path_point, i) => (i === 0 ? `M ${path_point.pdf_x} ${path_point.pdf_y}` : `L ${path_point.pdf_x} ${path_point.pdf_y}`)).join (' ');
	}
}


module.exports = {
	Markup_Path
};
