const Text_Annotation = require ('../Text_Annotation.js')

function spawn_text_input_box (current_path_setting, starting_path_point, text_annotations_div, annotations_lis, page_num, scale, cleanup_undo_redo) {
	
	const canvas_coords = starting_path_point.get_canvas_coords (text_annotations_div.clientHeight, scale);
	const font_size = current_path_setting.path_size * scale;
	const color = current_path_setting.get_rgba ();

	const input_box_border_width = 1;

	const input_box = document.createElement ('textarea');

	input_box.classList.add ('text_annotation');

	input_box.style.left = (canvas_coords.x - input_box_border_width - 2) + 'px';
	input_box.style.top = (canvas_coords.y - input_box_border_width - 2) + 'px';

	input_box.style.fontSize = font_size + 'px';
	input_box.style.color = color;
	input_box.style.background = 'transparent';
	input_box.style.border = input_box_border_width + 'px dashed #ccc';
	input_box.style.outline = 'none';
	input_box.style.minHeight = '20px';
	input_box.style.minWidth = '100px';

	text_annotations_div.appendChild (input_box);
	input_box.focus ();

	input_box.addEventListener ('blur', () => {
		commit_text_annotation (input_box.value.trim (), input_box.clientWidth, current_path_setting, starting_path_point, text_annotations_div, annotations_lis, page_num, scale);
		input_box.remove ();
		cleanup_undo_redo ();
	});

	input_box.addEventListener ('keydown', (e) => {
		if (e.key === 'Escape') {
			e.preventDefault ();
			input_box.blur ();
		}
	});
	
}

function get_hard_wrapped_text (text, input_box_width, font_size, font_family) {
	const canvas = document.createElement ('canvas');
	const ctx = canvas.getContext ('2d');
	ctx.font = font_size + 'px ' + font_family;

	const paragraphs = text.split ('\n');
	let indiv_lines = [];

	paragraphs.forEach ((paragraph) => {
		const words = paragraph.split (' ');
		let curr_line = '';
		
		while (words.length > 0) {
			// console.log (words.length);
			const word = words[0]
			const test_line = curr_line ? curr_line + ' ' + word : word;

			if (ctx.measureText (test_line).width > input_box_width) {
				if (curr_line === '') {
					let test_word = '';

					word.split ('').forEach ((c) => {
						test_word = curr_line + c;

						if (ctx.measureText (test_word).width > input_box_width) {
							indiv_lines.push (curr_line);
							curr_line = c;
						} else {
							curr_line = test_word;
						}
					});

					words.shift ();
				} else {
					indiv_lines.push (curr_line);
					curr_line = '';
				}
			} else {
				curr_line = test_line;
				words.shift ();
			}

		}	

		if (curr_line !== '') {
			indiv_lines.push (curr_line);
		} else if (paragraph === '') {
			indiv_lines.push ('');
		}
	
	});

	return indiv_lines.join ('\n');
}

function commit_text_annotation (text, input_box_width, current_path_setting, starting_path_point, text_annotations_div, annotations_lis, page_num, scale) {
	if (text === '') { return; }
	
	const hard_wrapped_text = get_hard_wrapped_text (text, input_box_width, current_path_setting.path_size * scale, 'Helvetica');

	// console.log (hard_wrapped_text);

	const text_annotation = new Text_Annotation.Text_Annotation (current_path_setting, starting_path_point, hard_wrapped_text);
	
	text_annotation.render_annotation (null, text_annotations_div, page_num, scale);

	annotations_lis.push (text_annotation);

}

module.exports = {
	spawn_text_input_box
}
