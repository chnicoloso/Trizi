import React, { Component } from 'react';

export default class Canvas extends Component {

    constructor(){
        super();
        this.state = {
          points : []
        }
        this.context;
        this.isDrawing = false;
        this.onMouseUp = this.onMouseUp.bind(this);
        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
    }

    componentDidMount(){
        this.myCanvas = document.getElementById('myCanvas');
    }

    onMouseUp(e){
        if (!this.props.drawing) return;
        this.isDrawing = false;
        this.setState({points: []});
        this.myCanvas.pathBegun == null
    }

    onMouseDown(e){
        if (!this.props.drawing) return;
        this.context = this.myCanvas.getContext("2d");
        this.context.strokeStyle = this.props.drawingColor;
        this.context.imageSmoothingEnabled = true;
        this.context.lineWidth = 0.6;
        this.context.lineJoin = this.context.lineCap = 'round';
        this.setState({points: [{ x: e.nativeEvent.layerX, y: e.nativeEvent.layerY }]});
        this.myCanvas.pathBegun = true;
        this.isDrawing = true;
    }

    onMouseMove(e){
        if (!this.props.drawing) return;
        if (this.isDrawing) {
            let points = this.state.points;
            points.push({ x: e.nativeEvent.layerX, y: e.nativeEvent.layerY });
            this.setState({points: points});
            this.context.beginPath();
            this.context.moveTo(this.state.points[this.state.points.length - 2].x, this.state.points[this.state.points.length - 2].y);
            this.context.lineTo(this.state.points[this.state.points.length - 1].x, this.state.points[this.state.points.length - 1].y);
            this.context.stroke();

            for (var i = 0, len = this.state.points.length; i < len; i++) {
                let dx = this.state.points[i].x - this.state.points[this.state.points.length-1].x;
                let dy = this.state.points[i].y - this.state.points[this.state.points.length-1].y;
                let d = dx * dx + dy * dy;

                if (d < 500) {
                    this.context.beginPath();
                    this.context.strokeStyle = this.props.drawingColor;
                    this.context.moveTo( this.state.points[this.state.points.length-1].x + (dx * 0.2), this.state.points[this.state.points.length-1].y + (dy * 0.2));
                    this.context.lineTo( this.state.points[i].x - (dx * 0.2), this.state.points[i].y - (dy * 0.2));
                    this.context.stroke();
                }
            }

        }


    }

    render() {
        const style = { top: '0px',
                        left: '0px',
                        width: '100%',
                        height: '100%',
                        userSelect: 'none',
                        position: 'absolute',
                        WebkitUserDrag: 'none',
                        zIndex: this.props.drawing ? '3' : '0',
                        WebkitTapHighlightColor: 'rgba(0, 0, 0, 0'};

        return <g>
            <canvas
                onMouseMove={ (e) => this.onMouseMove(e) }
                onMouseDown={ (e) => this.onMouseDown(e) }
                onMouseUp={ (e) => this.onMouseUp(e) }
                style={ style }
                id='myCanvas'
                width={ this.props.width }
                height={ this.props.height }>
            </canvas>

        </g>;
    }

}
