import React, { Component } from 'react';
import domtoimage from 'dom-to-image';
import { saveAs } from 'file-saver';
import logo from './logo.svg';
import './MainView.css';

import HeaderView from '../components/Header/HeaderView';
import ToolbarView from '../components/Toolbar/ToolbarView';
import InfoBar from '../components/InfoBar/InfoBar';
import Canvas from '../components/Canvas/Canvas';
import Tree from '../components/Tree/Tree';



export default class MainView extends Component {

  constructor(){
      super();
      this.state = {
        drawing : false,
        erasing : false,
        showPanel : true,
        isSaving : false,
        drawingColor : 'black',
        showInfo : false,
        colorIndex : 0,
        drawingColor : 'black',
        bracketText: '[ ]'
      };
      this.colors = ['black','#4286f4', '#f4aa42', '#41f483', '#ff2700', '#e64aa9'];
      this.togglePanel = this.togglePanel.bind(this);
      this.toggleDrawingMode = this.toggleDrawingMode.bind(this);
      this.toggleInfoPanel = this.toggleInfoPanel.bind(this);
      this.switchDrawingColor = this.switchDrawingColor.bind(this);
      this.clearDrawing = this.clearDrawing.bind(this);
      this.save = this.save.bind(this);
      this.updateBracketNotation = this.updateBracketNotation.bind(this);
  }

  toggleDrawingMode(){
    this.setState((prevState) => ({
      drawing: !prevState.drawing }));
  }

  toggleInfoPanel(){
    this.setState((prevState) => ({
      showInfo: !prevState.showInfo }));
  }

  switchDrawingColor(){
    let currentColorIndex = this.state.colorIndex + 1;
    if (currentColorIndex === this.colors.length) {
      currentColorIndex = 0;
    }
    let currentColor = this.colors[currentColorIndex];
    this.setState((prevState) => ({
      colorIndex: currentColorIndex,
      drawingColor: currentColor }));
    }

  clearDrawing() {
    let canvas = document.getElementById('myCanvas');
    let context = canvas.getContext("2d");
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
  }

  togglePanel() {
    this.setState((prevState) => ({
      showPanel: !prevState.showPanel }));
  }

  updateBracketNotation(newBracketText) {
    this.setState({bracketText: newBracketText});
  }

  save() {
    var self = this;
    this.setState({isSaving: true});
    var tree = document.getElementById('content-to-print');
    domtoimage.toBlob(tree , { bgcolor:'white' })
    .then(function (blob) {
        saveAs(blob, 'my-tree.png');
    });
    self.setState({isSaving: false});

  }

  updateSize() {
    this.contentWidth = document.getElementById('content').offsetWidth;
    this.contentHeight = document.getElementById('content').offsetHeight;
  }

  render() {
    return (<div className={ 'Main' }>
           <div className={ 'Container' }>

             <div className={ 'Header' }>
                <HeaderView onToggle={ this.togglePanel } panelOpen={ this.state.showPanel } bracketText={ this.state.bracketText }/>
             </div>

             <div id={ 'content' } className={ 'Content' }>
               <div className={ 'Tree' }>
                  <Tree onUpdateBracketNotation={ this.updateBracketNotation }/>
               </div>
               <Canvas width={ document.getElementById('content') ? document.getElementById('content').offsetWidth : 0 }
                       height={ document.getElementById('content') ? document.getElementById('content').offsetHeight : 0 }
                       drawing={ this.state.drawing }
                       drawingColor={ this.state.drawingColor }/>
             </div>

          </div>

          <div id='toolbar' className={ 'Toolbar' } style={ this.state.showPanel ? {height:'auto',width:'124px'} : {height:'auto',width:'0px'} }>
             <ToolbarView
               state = { this.state }
               onSave={ this.save }
               onToggleDrawing={ this.toggleDrawingMode }
               onToggleInfo={ this.toggleInfoPanel }
               switchColor={ this.switchDrawingColor }
               onClearDrawing={ this.clearDrawing } />
          </div>

          <div className={ 'Infobar' } style={ {height:this.state.showPanel && this.state.showInfo ? '124px' : '0px'} } >
              <InfoBar />
          </div>
        </div>
        );
  }
}
