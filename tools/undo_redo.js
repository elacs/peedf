function undo (markup_paths, undone_markup_paths) {
	if (markup_paths.length > 0) {
		undone_markup_paths.push (markup_paths.pop ());
	}
}

function redo (markup_paths, undone_markup_paths) {
	if (undone_markup_paths.length > 0) {
		markup_paths.push (undone_markup_paths.pop ());
	}
}

module.exports = {
	undo,
	redo
}
