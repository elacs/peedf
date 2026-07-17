const Text_Annotation = require ('../Text_Annotation.js')

function spawn_text_input_box (current_path_setting, starting_path_point, text_annotations_div, annotations_lis, page_num, scale, cleanup_undo_redo) {
	
	const canvas_coords = starting_path_point.get_canvas_coords (text_annotations_div.clientHeight, scale);
	const font_size = current_path_setting.path_size * scale;
	const color = current_path_setting.get_rgba ();

	const input_box = document.createElement ('textarea');

	input_box.classList.add ('text_annotation');

	input_box.style.left = canvas_coords.x + 'px';
	input_box.style.top = canvas_coords.y + 'px';

	input_box.style.fontSize = font_size + 'px';
	input_box.style.color = color;
	input_box.style.background = 'transparent';
	input_box.style.border = '1px dashed #ccc';
	input_box.style.outline = 'none';
	input_box.style.minHeight = '20px';
	input_box.style.minWidth = '100px';

	text_annotations_div.appendChild (input_box);
	input_box.focus ();

	input_box.addEventListener ('blur', () => {
		commit_text_annotation (input_box.value.trim (), current_path_setting, starting_path_point, text_annotations_div, annotations_lis, page_num, scale);
		input_box.remove ();
		cleanup_undo_redo ();
	});

	input_box.addEventListener ('keydown', (e) => {
		if (e.key === 'Escape') {
			input_box.remove ();
		}
	})
	
}

function commit_text_annotation (text, current_path_setting, starting_path_point, text_annotations_div, annotations_lis, page_num, scale) {
	if (text === '') { return; }

	const text_annotation = new Text_Annotation.Text_Annotation (current_path_setting, starting_path_point, text);
	
	text_annotation.render_annotation (null, text_annotations_div, page_num, scale);

	annotations_lis.push (text_annotation);

}

module.exports = {
	spawn_text_input_box
}
