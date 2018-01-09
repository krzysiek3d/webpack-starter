/*global fabric*/
import { canvas, layers } from '../constants';
export function addObjectsFromSvg( param, callback ) {
	let { url, id } = param;
	// layers.push( id );
	fabric.loadSVGFromURL( url, ( array, options ) => {
		groupObjects( { id, array, options } );
		window.layers = layers;
		callback();
	} );
	let groupObjects = ( param ) => {
		let { id, array, options } = param;
		let svgLayers = [];
		// regex checks if only one of the word's from id table matches
		let pattern = new RegExp( '\\b' + id.join( '|' ) + '\\b' );
		for ( let i = 0, max = array.length; i < max; i++ ) {
			// check all objects in array if they match id and add to layers array
			if ( pattern.test( array[ i ].id ) ) {
				if ( svgLayers[ array[ i ].id ] === undefined ) { // sprawdz czy tablica o podanej nazwie nie istnieje
					svgLayers[ array[ i ].id ] = []; //stworz nowa tablice
				}
				svgLayers[ array[ i ].id ].push( array[ i ] ); // dodaj tablice o tym id do wcześniej utworzonej
			}
			// zamień zgrupowane tablice z pliku SVG o tym samym id na zgrupowane obiekty
			layers[ array[ i ].id ] = fabric.util.groupSVGElements( svgLayers[ array[ i ].id ], options );
		}

		// przypisz zgrupowane obiekty do tablicy ktora doda je do canvas
		let canvasObjs = [];
		for ( let i in layers ) {
			if ( layers.hasOwnProperty( i ) ) {
				canvasObjs.push( layers[ i ] );
			}
		}
		// dodaj zgrupowane obiekty do canvas
		let group = new fabric.Group( canvasObjs, {
			id: 'project',
			left: 100,
			top: 100,
			width: options.width,
			height: options.height,
			hasControls: true,
			hasRotatingPoint: true,
			// visible: false
		} );
		canvas.add( group );
		// przypisz skale
		// scale[ 0 ] = layers.paths[ 0 ].width;
	};
}