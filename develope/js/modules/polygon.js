/*global fabric*/
import { canvas, points, layers } from '../constants';
import { clipShape } from './clipShape';
import { road } from './road';
import { events } from '../utils';
export const polygon = {
    points: [],
    edges: [],
    init(param) {
        let scale = layers.skala.paths[0].width;
        let { top, left, width, height } = param;
        top *= scale;
        left *= scale;
        width *= scale;
        height *= scale;

        fabric.Edge = fabric.util.createClass(fabric.Line, {
            type: 'Edge',
            initialize(points, options) {
                options || (options = {});
                this.set({ label: options.label || '', });
                this.callSuper('initialize', points, options);
                this.border = new fabric.Rect({
                    height: 47,
                    fill: 'red',
                    active: true,
                    hasControls: true,
                    lockScalingFlip: true
                });
                canvas.add(this.border).sendBackwards(this.border);
            },
            toObject() {
                return fabric.util.object.extend(this.callSuper('toObject'));
            },
            _render(ctx) {
                this.callSuper('_render', ctx);
                let { x1, y1, x2, y2 } = this,
                angle = Math.atan2((y2 - y1), (x2 - x1)),
                    distance = calcDistance({ x1, y1, x2, y2 });

                function calcDistance(param) {
                    let { x1, y1, x2, y2 } = param;
                    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
                }
                this.border.set({
                    top: y1,
                    left: x1,
                    width: distance,
                    angle: fabric.util.radiansToDegrees(angle)
                }).setCoords();
                // ctx.save();
                ctx.rotate(angle);
                ctx.fillStyle = 'lime';
                ctx.textAlign = 'center';
                ctx.font = '20px Helvetica';
                ctx.fillText(((this.border.height * this.border.scaleY) / scale).toFixed(2) + ' m', 0, 60);
                // road pattern
                // ctx.fillStyle = this.pattern;
                // ctx.fillStyle = '#333';
                // // ctx.fillRect( -distance / 2, 0, distance, this.border );
                // ctx.fillStyle = 'rgba(0,0,0,0.5)';
                // // Border circle
                // let x = distance / 2,
                // 	y = 0,
                // 	radius1 = this.border,
                // 	radius2 = this.border;
                // if ( this.angle1 || this.angle2 < Math.PI ) {
                // 	// radius = x * 2;
                // 	radius1 = ( this.border ) / Math.sin( this.angle1 / 2 );
                // 	radius2 = ( this.border ) / Math.sin( this.angle2 / 2 );
                // }
                // // Border inside
                // ctx.fillRect( -x, 0, x * 2, this.border );
                // // first point
                // ctx.beginPath();
                // ctx.fillStyle = 'red';
                // ctx.arc( -x, y, radius1, 0, this.angle1 / 2, false );
                // ctx.lineTo( -distance / 2, 0 );
                // ctx.closePath();
                // ctx.fill();
                // // seocnd point
                // ctx.beginPath();
                // ctx.fillStyle = 'red';
                // ctx.arc( x, y, radius2, Math.PI, ( Math.PI - this.angle2 / 2 ), true );
                // ctx.lineTo( distance / 2, 0 );
                // ctx.closePath();
                // ctx.fill();
                //

                // ctx.restore();
            }
        });

        window.points = points;
        window.edges = polygon.edges;
        // clipShape.init();
        polygon.line.add({ id: 0, x1: left, y1: top, x2: (left + width), y2: top });
        polygon.line.add({ id: 1, x1: (left + width), y1: top, x2: (left + width), y2: (top + height) });
        polygon.line.add({ id: 2, x1: (left + width), y1: (top + height), x2: left, y2: (top + height) });
        polygon.line.add({ id: 3, x1: left, y1: (top + height), x2: left, y2: top });

        // road.init();

        // events.on( 'pointsChanged', ( points ) => {
        // 	findAngle( points[ 0 ], points[ 3 ], points[ 1 ] );
        // } );

        polygon.events();
    },
    events() {
        canvas.on({
            'object:moving': polygon.movePoint,
            'mouse:down': polygon.addPoint
        });
        // ADDING DOUBLE CLICK mouse event
        fabric.util.addListener(canvas.upperCanvasEl, 'dblclick', (event) => {
            if (canvas.findTarget(event)) {
                let target = canvas.findTarget(event);
                polygon.deletePoint(target);
            }
        });
    },
    movePoint(event) {
        let { target } = event;
        if (target.type === 'point') {
            target.on('moving', function() {
                let { id, left, top } = target;
                // set end points of current edge
                polygon.edges[id].set({ x2: left, y2: top }).setCoords();
                // update points for mask
                points[id] = { x: left, y: top };
                let max = polygon.edges.length - 1,
                    id1 = id,
                    prevId1 = id,
                    nextId1 = id,
                    id2 = id,
                    prevId2 = id,
                    nextId2 = id;
                id == 0 ? id1 = max : id1--;
                if (id1 == 0) {
                    prevId1 = max--;
                } else {
                    prevId1 = id1;
                    prevId1--;
                }
                id2 == 0 ? prevId2 = max : prevId2--;
                id2 == max ? nextId2 = 0 : nextId2++;
                polygon.edges[id].set('angle1', findAngle(points[id1], points[prevId1], points[nextId1]));
                polygon.edges[id].set('angle2', findAngle(points[id2], points[prevId2], points[nextId2]));
                id == max ? id = 0 : id++;
                polygon.edges[id].set('angle1', findAngle(points[0], points[3], points[1]));
                polygon.edges[id].set('angle2', findAngle(points[1], points[0], points[2]));
                // set start points of current edge
                polygon.edges[id].set({ x1: left, y1: top }).setCoords();

                function findAngle(p0, p1, p2) {
                    // p0 is center
                    // p1 prev point
                    // p2 next point
                    let vector1 = { x: (p0.x - p1.x), y: (p0.y - p1.y) },
                        vector2 = { x: (p0.x - p2.x), y: (p0.y - p2.y) },
                        angle = Math.atan2(vector1.y, vector1.x) - Math.atan2(vector2.y, vector2.x);
                    angle < 0 ? angle += 2 * Math.PI : 0;
                    // angle = angle * ( 180 / Math.PI );
                    // console.log( angle );
                    return (angle);
                }
                events.emit('pointsChanged', points);
            });

        }
    },
    addPoint(event) {
        let { target, e } = event;
        if (target !== null) {
            if (target.type === 'Edge') {
                let { id, x1, y1 } = target;
                let mousePoint = canvas.getPointer(e);
                let { x, y } = mousePoint;
                target.set({ x1: x, y1: y }).setCoords();
                // add line and poin to canvas
                polygon.line.add({ id: id, x1: x1, y1: y1, x2: x, y2: y });
                // sort tables
                for (let i = id, max = polygon.points.length; i < max; i++) {
                    polygon.edges[i].id = polygon.points[i].id = i;
                }
            }
        }
    },
    deletePoint(target) {
        if (target.type === 'point') {
            let { id } = target,
            oldId = id,
                oldLine = canvas.getItem({ type: 'Edge', attr: 'id', name: id });
            let { x1, y1 } = oldLine;
            polygon.line.remove(id);
            id == polygon.edges.length ? oldId = 0 : oldId++;
            // set next line new start coords
            canvas.getItem({ type: 'Edge', attr: 'id', name: oldId }).set({ x1, y1 }).setCoords();
            // sort tables
            for (let i = id, max = polygon.points.length; i < max; i++) {
                polygon.edges[i].id = polygon.points[i].id = i;
            }
            canvas.renderAll();
        }
    },
    line: {
        add(param) {
            let { id, x1, y1, x2, y2, angle1, angle2 } = param;
            let line = new fabric.Edge([x1, y1, x2, y2], {
                id: id,
                type: 'line',
                stroke: 'cyan',
                strokeWidth: 6,
                originY: 'center',
                originX: 'center',
                // lockMovementY: true,
                // lockMovementX: true,
                objectCaching: false,
                hoverCursor: 'pointer',
                perPixelTargetFind: true
            });
            polygon.point.add({ id: id, left: x2, top: y2 });
            polygon.edges.splice(id, 0, line);
            canvas.insertAt(line, 0);
            console.log('line: ', line);
        },
        remove(id) {
            polygon.edges.splice(id, 1);
            canvas.getItem({ type: 'Edge', attr: 'id', name: id }).remove();
            polygon.point.remove(id);
        }
    },
    point: {
        add(param) {
            let { id, top, left } = param;
            let point = new fabric.Circle({
                id: id,
                type: 'point',
                top: top,
                left: left,
                strokeWidth: 5,
                radius: 12,
                fill: '#fff',
                stroke: '#666',
                originY: 'center',
                originX: 'center',
                hoverCursor: 'pointer'
            });
            polygon.points.splice(id, 0, point);
            points.splice(id, 0, { x: left, y: top });
            canvas.insertAt(point, 0).bringToFront(point);
            events.emit('pointsChanged', points);
        },
        remove(id) {
            points.splice(id, 1);
            polygon.points.splice(id, 1);
            canvas.getItem({ type: 'point', attr: 'id', name: id }).remove();
            events.emit('pointsChanged', points);
        }
    }
};