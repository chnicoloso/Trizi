import React, { Component } from 'react';
import "./Header.css";

export default class HeaderView extends Component  {

  constructor() {
    super();
    this.handleClick = this.handleClick.bind(this);

  }

  handleClick() {
    this.props.onToggle();
  }

    render() {
        return (<div className={ 'Header-Component' }>
                  <div className={ 'Logo' }>
                    <a className={ 'Title' }> [ t&#633;izi</a>

                    <img id='icon'
                        width='24'
                        height='24'
                        src={ require('../../res/icons8-LeafFilled-100.png') } href="https://icons8.com"/>

                   <a className={ 'Title' }
                      style={ { marginLeft: '2px' } } > ] </a>
                  </div>

                  <div className={ 'BracketTextContainer' }>
                    <div className={ 'BracketTextBorder' }>
                      <a className={ 'BracketText' } > { this.props.bracketText }  </a>
                    </div>
                  </div>

                  <div onClick={ this.handleClick }
                      style={ !this.props.panelOpen ? { backgroundColor: '#E8E8E8' }  : { backgroundColor: 'lightgrey' }}
                      className={ 'HeaderButton' }>
                      <img className={ 'PanelButton' }
                           src={ require('../../res/icons8-Menu-96.png') } href="https://icons8.com"/>
                  </div>
                </div>
              );
    }

}
