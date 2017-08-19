import React, { Component } from 'react';
import "./InfoBar.css";

export default class InfoBar extends Component {

    constructor() {
        super();
    }

    takeToGithub() {
      var url = "https://github.com/chnicoloso/Trizi";
      var win = window.open(url, '_blank');
    }

    render(){
        let saveIcon = require('../../res/icons8-Download-104.png');
        let waitIcon = require('../../res/progress.gif');
        let drawingIcon = require('../../res/icons8-Edit_Filled-100.png');
        let infoIcon = require('../../res/icons8-Info-96.png');
        let settingsIcon = require('../../res/icons8-VerticalSettingsMixer-96.png');
        let clearIcon = require('../../res/icons8-EmptyTrashFilled-50.png');
        return <g>
                    <div className='InfoBar-Component'>

                        <div className='Tutorial'>
                            <a className='InfoLabel'> Watch Tutorial </a>
                        </div>

                        <div className='Fork' onClick={ this.takeToGithub }>
                            <div className='ForkImage'/>
                            {/* <a className='InfoLabel'> Fork me on Github </a> */}
                            {/* <a className='InfoLabel'> GNU General Public License v3.0 </a> */}
                        </div>

                        <div className='Image'>
                            <img height='32' width='32' src={ require('../../res/icons8-LeafFilled-100.png') } href="https://icons8.com"/>
                        </div>
                    </div>

               </g>;
    }
}
