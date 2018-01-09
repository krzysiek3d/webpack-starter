/*global fabric*/
export const canvas = new fabric.Canvas( 'c', {
		width: 800,
		height: 600,
		selection: false,
		objectCaching: false,
		targetFindTolerance: 100,
		stopContextMenu: true,
		skipOffscreen: true,
		renderOnAddRemove: true, //PERFORMANCE HACK
		stateful: false, // Boolean, Indicates whether objects' state should be saved
		enableRetinaScaling: true,
		preserveObjectStacking: true,
		moveCursor: 'pointer',
		hoverCursor: 'default',
		defaultCursor: 'default'
	} ),
	layers = {}, // Canvas objects loaded from svg
	points = [];
