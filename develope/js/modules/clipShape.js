/*global fabric*/
import { canvas, points } from '../constants';
export const clipShape = {
	init() {
		let shape = new fabric.Polygon( [
			{ x: 0, y: 0 },
			{ x: 150, y: 150 },
			{ x: 300, y: 150 }
		], {
			id: 'clipShape',
			lockMovementY: true,
			lockMovementX: true,
			selectable: false
		} );
		shape.set( 'points', points ).setCoords();
		shape.globalCompositeOperation = 'destination-in';
		canvas.insertAt( shape, 1 );
	}
};
