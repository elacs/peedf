const pdfjs_dist = require ('pdfjs-dist');

const freehand = require ('./tools/markup/event_listeners/freehand.js');
const select_markup_mode = require ('./tools/select_markup_mode.js')
const save_pdf = require ('./tools/save_pdf.js');

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

let pdf_doc = null;
let scale = 1.5;
let current_page_num = 1;
let canvas_height = pdf_canvas.height;

// Resize canvas to container
function resize_canvas () {
	const pdf_container = document.getElementById ('pdf_container');
	pdf_canvas.width = pdf_container.clientWidth;
	pdf_canvas.height = pdf_container.clientHeight;
	draw_canvas.width = pdf_container.clientWidth;
	draw_canvas.height = pdf_container.clientHeight;

	canvas_height = pdf_canvas.height;
}

function render_page (num) {
	pdf_doc.getPage (num).then ((page) => {
		const viewport = page.getViewport ({ scale: scale });
		pdf_canvas.height = viewport.height;
		pdf_canvas.width = viewport.width;
		draw_canvas.height = viewport.height;
		draw_canvas.width = viewport.width;
		
		canvas_height = pdf_canvas.height;

		const render_context = { canvasContext: pdf_ctx, viewport: viewport };
		page.render (render_context);

		markup_paths.map ((markup_path) => markup_path.render_path (draw_ctx, num, canvas_height, scale));
	});
}

resize_canvas ();

pdfjs_dist.GlobalWorkerOptions.workerSrc = './node_modules/pdfjs-dist/build/pdf.worker.min.mjs';

// Render PDF page
pdfjs_dist.getDocument (pdf_filepath).promise.then ((doc) => {
	pdf_doc = doc;
	render_page (current_page_num);
});


// event listeners
window.addEventListener ('resize', (e) => {resize_canvas (); render_page (current_page_num)});

// toolbar button event listeners
document.getElementById ('previous_page_button').addEventListener ('click', () => {
	current_page_num = Math.max (current_page_num - 1, 1);
	render_page (current_page_num);
});

document.getElementById ('next_page_button').addEventListener ('click', () => {
	current_page_num = Math.min (current_page_num + 1, pdf_doc.numPages);
	render_page (current_page_num);
});

document.getElementById ('zoom_out_button').addEventListener ('click', () => {
	scale = Math.max (scale - 0.1, 0.1);
	render_page (current_page_num);
});

document.getElementById ('zoom_in_button').addEventListener ('click', () => {
	scale = Math.min (scale + 0.1, 3.0);
	render_page (current_page_num);
});

document.getElementById ('select_freehand_button').addEventListener ('click', () => {
	mode = select_markup_mode.select_markup_mode ('pan', mode, 'freehand');
});

document.getElementById ('select_highlight_button').addEventListener ('click', () => {
	mode = select_markup_mode.select_markup_mode ('pan', mode, 'highlight');
});

document.getElementById ('select_text_button').addEventListener ('click', () => {
	mode = select_markup_mode.select_markup_mode ('pan', mode, 'text');
});

document.getElementById ('save_pdf_button').addEventListener ('click', () => {
	save_pdf.save_pdf (pdf_filepath, markup_paths);
	markup_paths = [];
});


// markup event listeners

// modes = ['pan', 'freehand', 'highlight', 'text']
let mode = 'pan';

let click_held = false;

let last_x = 0;
let last_y = 0;

let markup_paths = [];
let starting_path_point = null;
let current_markup_path = null;
let current_path_setting = null;

draw_canvas.addEventListener ('mousedown', (e) => {
	click_held = true;
	const rect = draw_canvas.getBoundingClientRect ();
	last_x = e.clientX - rect.left;
	last_y = e.clientY - rect.top;

	starting_path_point = new Markup_Path_Point.Markup_Path_Point (last_x, last_y, canvas_height, scale);

	if (mode == 'freehand') {
		current_path_setting = new Markup_Path_Setting.Markup_Path_Setting (current_page_num, 'rgb(0, 0, 255)', 1.0, 1.0);

		current_markup_path = new Markup_Path.Markup_Path (current_path_setting, starting_path_point);

		markup_paths.push (current_markup_path);
	} else if (mode == 'text') {
		console.log (markup_paths);
	}

});

draw_canvas.addEventListener ('mousemove', (e) => {
	if (mode == 'freehand') {
		freehand.freehand (e, current_markup_path, current_path_setting, canvas_height, scale);
	}
});

draw_canvas.addEventListener ('mouseup', () => { click_held = false; });
draw_canvas.addEventListener ('mouseout', () => { click_held = false; });
