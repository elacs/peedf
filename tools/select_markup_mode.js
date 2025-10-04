function select_markup_mode (default_mode, current_mode, selected_mode) {
	if (current_mode == selected_mode) {
		return default_mode;
	} else {
		return selected_mode;
	}
}

module.exports = {
	select_markup_mode
};
