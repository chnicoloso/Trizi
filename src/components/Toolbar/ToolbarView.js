import React, { Component } from 'react';
import "./Toolbar.css";

/*
*   Component for the global toolbar in the site were options can be configured.
*/
export default class ToolbarView extends Component {

    constructor() {
      super();
      this.state = {
        hoveringOver : false,
        buttonText : ''
      }
      this.save = this.save.bind(this);
      this.toggleInfoPanel = this.toggleInfoPanel.bind(this);
      this.toggleDrawingMode = this.toggleDrawingMode.bind(this);
      this.switchDrawingColor =  this.switchDrawingColor.bind(this);
      this.onHover = this.onHover.bind(this);
      this.switchDrawingColor = this.switchDrawingColor.bind(this);
      this.clearDrawing = this.clearDrawing.bind(this);
      this.hoveringOver = false;
      this.buttonText = '';
    }

    componentDidMount() {
      this.buttonName = document.getElementsByClassName("buttonName")[0];
    }

    save() {
      this.setState({hoveringOver: true});
      this.props.onSave();
      this.setState({hoveringOver: false});
    }

    toggleDrawingMode() {
      this.props.onToggleDrawing();
    }

    switchDrawingColor() {
      this.props.switchColor();
    }

    toggleEraser() {
    }

    clearDrawing() {
      this.props.onClearDrawing();
    }

    onHover(hovering, string) {
      let buttonName = document.getElementById("buttonName");
      if (hovering) {
        buttonName.textContent = string;
      }
      buttonName.style.opacity = hovering || this.props.state.isSaving ? '1' : '0';
    }

    toggleInfoPanel() {
      this.props.onToggleInfo();
    }

    render() {
      let saveIcon = require('../../res/icons8-Download-104.png');
      let waitIcon = require('../../res/progress.gif');
      let drawingIcon = require('../../res/icons8-Edit_Filled-100.png');
      let infoIcon = require('../../res/icons8-Info-96.png');
      let settingsIcon = require('../../res/icons8-VerticalSettingsMixer-96.png');
      let clearIcon = require('../../res/icons8-EmptyTrashFilled-50.png');
      const downloadStyle = { background:  this.props.state.isSaving ? '#16a085' : 'none', backgroundColor:'#16a085'};
      const drawStyle = { backgroundColor: '#FFC466', opacity: !this.props.state.drawing ? '1' : '.5' };
      const clearStyle = {marginTop:this.props.state.drawing ? '15px' : '0px', height:this.props.state.drawing ? '26px' : '0px' , backgroundColor:'#DB5461' };
      const colorStyle = { marginTop:this.props.state.drawing ? '15px' : '0px', height:this.props.state.drawing ? '26px' : '0px', borderRadius:'26px', backgroundColor:this.props.state.drawingColor};
      const settingsStyle = { top: '41%', backgroundColor: '#DB5461'};
      const infoStyle = { top:'54%', opacity: this.props.state.showInfo ? '1' : '.8', backgroundColor: '#2A617F' };

      return (<g>
                  <div className={ "Toolbar-Component" }>

                    <div onClick={ this.save } className={ "button" }
                         onMouseEnter={ () => this.onHover(true, 'Download') }
                         onMouseLeave={ () => this.onHover(false, '') }
                         style={ downloadStyle }>
                         { !this.props.state.isSaving ? (
                           <img className={ "buttonIcon" } href="https://icons8.com" src={ saveIcon }/>
                         ) :
                           <img className={ "progress" } href="https://icons8.com" src={ waitIcon } style={ {left:'1px'} }/>
                         }
                    </div>

                    <div className={ "drawingTools" }
                         style={{
                         marginBottom: this.props.state.drawing ? '8px' : '0px',
                         height: this.props.state.drawing ? '114px' : '32px'} }>
                        <div className={ "drawingOption" }
                             style={ drawStyle }
                             onClick={ this.toggleDrawingMode }
                             onMouseEnter={ () => this.onHover(true, 'Draw') }
                             onMouseLeave={ () => this.onHover(false, '') }>

                            <img className={ "buttonIcon" } href="https://icons8.com" src={ drawingIcon }/>

                        </div>

                        <div className={ "subButton" }
                            style={ clearStyle }
                            onMouseEnter={ () => this.onHover(true, 'Clear') }
                            onMouseLeave={ () => this.onHover(false, '') }
                            onClick={ this.clearDrawing }>

                            <img style={ {height: this.props.state.drawing? '20px' : '0px' } }
                                className={ "subButtonIcon" }
                                href="https://icons8.com" src={ clearIcon }/>
                        </div>

                        <div className={ "subButton" }
                            style={ colorStyle }
                            onMouseEnter={ () => this.onHover(true, 'Color') }
                            onMouseLeave={ () => this.onHover(false, '') }
                            onClick={ this.switchDrawingColor }>
                        </div>

                    </div>

                    <div className={ "button" }
                         style={ settingsStyle }
                         onMouseEnter={ () => this.onHover(true, 'Settings') }
                         onMouseLeave={ () => this.onHover(false, '') }>

                        <img className={ "buttonIcon" } href="https://icons8.com" src={ settingsIcon }/>

                    </div>

                    <div className={ "button" }
                        style={ infoStyle }
                        onMouseEnter={ () => this.onHover(true, 'Info') }
                        onMouseLeave={ () => this.onHover(false, '') }
                        onClick={ this.toggleInfoPanel }>

                        <img className={ "buttonIcon" } href="https://icons8.com" src={ infoIcon }/>

                    </div>

                    <a style={ { width : this.props.state.showPanel ? '100%'  : 'auto' } }
                      id="buttonName" className={ "buttonName" }> { !this.props.state.isSaving ? this.buttonText : 'Saving...' } </a>

                  </div>

             </g>);
    }
}
