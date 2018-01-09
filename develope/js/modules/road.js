/*global fabric*/
import { canvas, points } from '../constants';
import { events } from '../utils';
export const road = {
	init() {
		let { x: x1, y: y1 } = points[ points.length - 1 ];
		let { x: x2, y: y2 } = points[ 0 ];
		const width = 200;

		let road = new fabric.Line( [ x1 - width, y1, x2 + width, y2 ], {
			id: 'road',
			stroke: 'red',
			fill: 'red',
			strokeWidth: 108,
			originY: 'bottom',
			originX: 'left',
			lockMovementY: true,
			lockMovementX: true,
		} );
		canvas.add( road );
		fabric.util.loadImage( '/img/road.jpg', function ( img ) {

			road.stroke = new fabric.Pattern( {
				source: img,
				repeat: 'repeat-x'
			} );
			canvas.renderAll();
		} );
		events.on( 'pointsChanged', ( points ) => {
			let { x: x1, y: y1 } = points[ points.length - 1 ];
			let { x: x2, y: y2 } = points[ 0 ];
			road.set( { x1: x1 - width, y1: y1, x2: x2 + width, y2: y2 } ).setCoords();
		} );
	}
};
