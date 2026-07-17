const Markup_Path_Point = require ('../Markup_Path_Point.js');

function freehand (e, current_markup_path, current_path_setting, canvas_height, scale) {
	if (click_held != true) return;
	const rect = draw_canvas.getBoundingClientRect ();
	const x = e.clientX - rect.left;
	const y = e.clientY - rect.top;

	draw_ctx.strokeStyle = current_path_setting.get_rgba ();
	draw_ctx.lineWidth = current_path_setting.path_size * scale;
	draw_ctx.lineCap = 'round';
	draw_ctx.beginPath ();
	draw_ctx.moveTo (last_x, last_y);
	draw_ctx.lineTo (x, y);
	draw_ctx.stroke ();

	last_x = x;
	last_y = y;

	current_markup_path.append_path_point (new Markup_Path_Point.Markup_Path_Point (x, y, canvas_height, scale));
}


module.exports = {
	freehand
};
