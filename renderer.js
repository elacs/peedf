const pdfjs_dist = require ('pdfjs-dist');

const pan = require ('./tools/markup/event_listeners/pan.js');
const freehand = require ('./tools/markup/event_listeners/freehand.js');
const select_markup_mode = require ('./tools/select_markup_mode.js')
const save_pdf = require ('./tools/save_pdf.js');
const undo_redo = require ('./tools/undo_redo.js');

const Markup_Path = require ('./tools/markup/Markup_Path.js');
const Markup_Path_Point = require ('./tools/markup/Markup_Path_Point');
const Markup_Path_Setting = require ('./tools/markup/Markup_Path_Setting');

const params = new URLSearchParams (window.location.search);
const pdf_filepath = params.get ('pdf');
//console.log (pdf_filepath);

const pdf_canvas = document.getElementById ('pdf_canvas');
const draw_canvas = document.getElementById ('draw_canvas');
const pdf_ctx = pdf_canvas.getContext ('2d');
const draw_ctx = draw_canvas.getContext ('2d');
const pdf_container = document.getElementById ('pdf_container');

// toolbar elements
const previous_page_button = document.getElementById ('previous_page_button');
const next_page_button = document.getElementById ('next_page_button');
const zoom_out_button = document.getElementById ('zoom_out_button');
const zoom_in_button = document.getElementById ('zoom_in_button');
const select_freehand_button = document.getElementById ('select_freehand_button');
const select_highlight_button = document.getElementById ('select_highlight_button');
const select_text_button = document.getElementById ('select_text_button');
const undo_button = document.getElementById ('undo_button');
const redo_button = document.getElementById ('redo_button');
const save_pdf_button = document.getElementById ('save_pdf_button');

const zoom_control_box = document.getElementById ('zoom_control_box');
const page_control_box = document.getElementById ('page_control_box');
const zoom_scale_indicator = document.getElementById ('zoom_scale_indicator');
const page_number_indicator = document.getElementById ('page_number_indicator');

const toolbar_spacer_left = document.getElementById ('toolbar_spacer_left');
const toolbar_spacer_right = document.getElementById ('toolbar_spacer_right');


let pdf_doc = null;
let scale = 15;
let current_page_num = 1;
let canvas_height = pdf_canvas.height;


function resize_spacers (viewport_width) {
	// set toolbar spacer sizes
	const margin_width = 10;

	toolbar_spacer_left.style.width = (viewport_width / 2 - zoom_control_box.offsetWidth - page_control_box.offsetWidth - select_freehand_button.offsetWidth - select_highlight_button.offsetWidth / 2 - 5 * margin_width) + 'px';

	toolbar_spacer_right.style.width = (viewport_width / 2 - select_highlight_button.offsetWidth / 2 - select_text_button.offsetWidth - undo_button.offsetWidth - redo_button.offsetWidth - save_pdf_button.offsetWidth - 6 * margin_width) + 'px';
}

// Resize canvas to container
function resize_canvas () {
	pdf_canvas.width = pdf_container.clientWidth;
	pdf_canvas.height = pdf_container.clientHeight;
	draw_canvas.width = pdf_container.clientWidth;
	draw_canvas.height = pdf_container.clientHeight;

	canvas_height = pdf_canvas.height;
}

async function render_page (num) {
	const page = await pdf_doc.getPage (num);
	const viewport = page.getViewport ({ scale: scale / 10 });
	pdf_canvas.height = viewport.height;
	pdf_canvas.width = viewport.width;
	draw_canvas.height = viewport.height;
	draw_canvas.width = viewport.width;

	// position pdf_container in center of page
	const left = (Math.max (0, pdf_container.clientWidth - viewport.width) / 2).toString () + 'px';
	// console.log (left);
	pdf_canvas.style.left = left;
	draw_canvas.style.left = left;

	canvas_height = pdf_canvas.height;

	const render_context = { canvasContext: pdf_ctx, viewport: viewport };
	page.render (render_context);

	markup_paths.map ((markup_path) => markup_path.render_path (draw_ctx, num, canvas_height, scale / 10));

	resize_spacers (pdf_container.offsetWidth);
}

resize_canvas ();

pdfjs_dist.GlobalWorkerOptions.workerSrc = './node_modules/pdfjs-dist/build/pdf.worker.min.mjs';

// Render PDF page
async function load_and_render_pdf () {
	pdf_doc = await pdfjs_dist.getDocument (pdf_filepath).promise
	await render_page (current_page_num);
}

load_and_render_pdf ().then (() => {
	// set indicator values
	page_number_indicator.text = current_page_num + ' / ' + pdf_doc.numPages;
	zoom_scale_indicator.text = scale * 10 + '%';
});

// event listeners
window.addEventListener ('resize', (e) => {resize_canvas (); render_page (current_page_num)});

// toolbar button event listeners

// set mode button background colors
function set_mode_button_background_colors () {
	switch (mode) {
		case 'pan':
			select_freehand_button.classList.remove ('active');
			select_highlight_button.classList.remove ('active');
			select_text_button.classList.remove ('active');
			break;
		case 'freehand':
			select_freehand_button.classList.add ('active');
			select_highlight_button.classList.remove ('active');
			select_text_button.classList.remove ('active');
			break;
		case 'highlight':
			select_freehand_button.classList.remove ('active');
			select_highlight_button.classList.add ('active');
			select_text_button.classList.remove ('active');
			break;
		case 'text':
			select_freehand_button.classList.remove ('active');
			select_highlight_button.classList.remove ('active');
			select_text_button.classList.add ('active');
			break;
	}	
}

previous_page_button.addEventListener ('click', () => {
	current_page_num = Math.max (current_page_num - 1, 1);
	render_page (current_page_num);
	page_number_indicator.text = current_page_num + ' / ' + pdf_doc.numPages;
});

next_page_button.addEventListener ('click', () => {
	current_page_num = Math.min (current_page_num + 1, pdf_doc.numPages);
	render_page (current_page_num);
	page_number_indicator.text = current_page_num + ' / ' + pdf_doc.numPages;
});

zoom_out_button.addEventListener ('click', () => {
	scale = Math.max (scale - 1, 1);
	render_page (current_page_num);
	zoom_scale_indicator.text = scale * 10 + '%';
});

zoom_in_button.addEventListener ('click', () => {
	scale = Math.min (scale + 1 , 40);
	render_page (current_page_num);
	zoom_scale_indicator.text = scale * 10 + '%';
});

select_freehand_button.addEventListener ('click', () => {
	mode = select_markup_mode.select_markup_mode ('pan', mode, 'freehand');
	set_mode_button_background_colors ();
});

select_highlight_button.addEventListener ('click', () => {
	mode = select_markup_mode.select_markup_mode ('pan', mode, 'highlight');
	set_mode_button_background_colors ();
});

select_text_button.addEventListener ('click', () => {
	mode = select_markup_mode.select_markup_mode ('pan', mode, 'text');
	set_mode_button_background_colors ();
});

undo_button.addEventListener ('click', async () => {
	undo_redo.undo (markup_paths, undone_markup_paths);
	await render_page (current_page_num);
});

redo_button.addEventListener ('click', async () => {
	undo_redo.redo (markup_paths, undone_markup_paths);
	await render_page (current_page_num);
});

save_pdf_button.addEventListener ('click', async () => {
	await save_pdf.save_pdf (pdf_filepath, markup_paths);
	markup_paths = [];
	// undone_markup_paths = [];
	load_and_render_pdf ();
});

// markup event listeners

// modes = ['pan', 'freehand', 'highlight', 'text']
let mode = 'pan';

let click_held = false;

let last_x = 0;
let last_y = 0;

let markup_paths = [];
let undone_markup_paths = [];
let starting_path_point = null;
let current_markup_path = null;
let current_path_setting = null;

draw_canvas.addEventListener ('mousedown', (e) => {
	click_held = true;
	const rect = draw_canvas.getBoundingClientRect ();
	last_x = e.clientX - rect.left;
	last_y = e.clientY - rect.top;

	starting_path_point = new Markup_Path_Point.Markup_Path_Point (last_x, last_y, canvas_height, scale / 10);

	if (mode === 'freehand') {
		current_path_setting = new Markup_Path_Setting.Markup_Path_Setting (current_page_num, { r : 5, g : 130, b : 202 }, 1.0, 1.0);

		current_markup_path = new Markup_Path.Markup_Path (current_path_setting, starting_path_point);

		markup_paths.push (current_markup_path);
	} else if (mode === 'highlight') {
		current_path_setting = new Markup_Path_Setting.Markup_Path_Setting (current_page_num, { r : 247, g : 127, b : 17 }, 12.0, 0.2);

		current_markup_path = new Markup_Path.Markup_Path (current_path_setting, starting_path_point);

		markup_paths.push (current_markup_path);

	} else if (mode === 'text') {
		console.log (markup_paths);
	}

});

draw_canvas.addEventListener ('mousemove', (e) => {
	if (mode === 'freehand' || mode === 'highlight') {
		freehand.freehand (e, current_markup_path, current_path_setting, canvas_height, scale / 10);
	}
});

draw_canvas.addEventListener ('mouseup', () => {
	if (click_held) {
		click_held = false;
		if (mode === 'freehand' || mode === 'highlight') {
			undone_markup_paths = [];
		}
	}
});
draw_canvas.addEventListener ('mouseout', () => {
	if (click_held) {
		click_held = false;
		if (mode === 'freehand' || mode === 'highlight') {
			undone_markup_paths = [];
		}
	}
});let initial_scroll_left = null;
let initial_scroll_top = null;

pdf_container.addEventListener ('mousedown', (e) => {
	if (mode === 'pan') {
		click_held = true;
		last_x = e.clientX;
		last_y = e.clientY;
		initial_scroll_left = pdf_container.scrollLeft;
		initial_scroll_top = pdf_container.scrollTop;
	}
});

pdf_container.addEventListener ('mousemove', (e) => {
	if (mode === 'pan') {
		pan.pan (e, last_x, last_y, initial_scroll_left, initial_scroll_top);
	}
});

pdf_container.addEventListener ('mouseup', () => { click_held = false; });
pdf_container.addEventListener ('mouseout', () => { click_held = false; });
