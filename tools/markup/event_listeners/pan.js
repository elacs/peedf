function pan (e, last_x, last_y, initial_scroll_left, initial_scroll_top) {
	if (click_held != true) return;

	const dx = e.clientX - last_x;
	const dy = e.clientY - last_y;

	pdf_container.scrollLeft = initial_scroll_left - dx;
	pdf_container.scrollTop = initial_scroll_top - dy;
}


module.exports = {
	pan
};
