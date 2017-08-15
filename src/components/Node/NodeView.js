import React, { Component } from 'react';
import './Node.css';

export default class NodeView extends Component {

    /*
    *   Component takes in a Node model Object.
    */
    constructor() {
        super();
        this.originalText = '';
        this.formattedText = '';
        this.focusOnMe = this.focusOnMe.bind(this);
        this.onKeyUp = this.onKeyUp.bind(this);
        this.formatText = this.formatText.bind(this);
        this.getSize = this.getSize.bind(this);
        this.childrenClass = this.childrenClass.bind(this);
        this.inputClass = this.inputClass.bind(this);
        this.edit = this.edit.bind(this);
        this.switchNodeFormatting = this.switchNodeFormatting.bind(this);
        this.setOnHover = this.setOnHover.bind(this);
        this.listChildren = this.listChildren.bind(this);
        this.state = {
          onHover: false,
          originalText: '',
          formatText: '',
          pressedDeleteTwice: false
        };
    }
    /*
    *   Focus on Node as soon as it's attached to the DOM.
    */
    componentDidMount() {
        this.focusOnMe();
        document.getElementById(this.props.item.nodeId + "/inputBox").value = this.props.item.text;
    }

    /*
    *   Swiches focu back on previous Node as soon as this object is deleted from the DOM.
    */
    componentWillUnMount() {
        this.props.onFocusOnSibling(this.props.item.nodeId, "left");
    }

    /*
     * Focus on this node.
     */
    focusOnMe() {
        this.props.onFocusOnNode(this.props.item.nodeId);
    }

    /*
     * Registers a new entered character.
     */
    onKeyUp(ev) {
        // ev.stopImmediatePropagation();
        ev.preventDefault();
        var code = ev.keyCode;
        // if press space, create a new noce.
        if (code == 13) {
            this.addChild();
        }
        // TODO if press tab, add a new sibling.
        if (code == 9 ) {
            this.addSibling();
        }
        if (code == 8 && !this.state.originalText) {
            if(this.state.pressedDeleteTwice) {
                this.removeSelfAndDescendants();
            }
            else{
                this.setState({pressedDeleteTwice:true})
            }
        }
        else{
            this.setState({pressedDeleteTwice:false})
        }
        // this.props.item.text += ev.char;
        let text = document.getElementById(this.props.item.nodeId + "/inputBox").value;
        this.props.item.text = text;
        this.setState({
          originalText: text,
          formatText: this.formatText(text)
        })
        this.props.onUpdateBracketNotation();
    }

    /*
     * Substitute any number sequence within _{} for the equivalent subscript. Also substitute it if it's a single digit like _6.
     */
    formatText(word) {
        if(word) {
            let matches = word.match(/_+{(.*?)}/);
            if(!matches) { // There are no _{...}
                let match = word.match(/_+\d/); // but there might be a _#
                if(!match) {
                    return; // nah, there's nothing.
                }
                else{ // some _# exists. Replace it.
                    match = match[0][1];
                    let subChar = String.fromCharCode(8320+Number(match));
                    word = word.replace(/_+\d/, subChar);
                }
            }else{
                // Some _{...} exists.
                matches = matches[1];
                let subscript = '';
                for(var i = 0; i < matches.length; i++) {
                    let char = matches.charAt(i);
                    let subChar = String.fromCharCode(8320+Number(char));
                    subscript += subChar;
                }
                word = word.replace(/_+{(.*?)}/, subscript);
            }
        }
        return word;
    }

    /*
    *   Return the size of the input box.
    */
    getSize() {
        if (this.state.originalText) {
            return (this.state.originalText.length+3)*7;
        }
        return 14;
    }

    /*
    *   Remove only this node, attaching its children to its parent.
    */
    removeSelf() {
        this.props.onFocusOnNode(this.props.item.parent.nodeId);
        this.props.onRemoveNode(this.props.item);
    }

    /*
    *   Remove this node and it's children recursively.
    */
    removeSelfAndDescendants() {
        let parent = this.props.item.parent;
        if (parent) this.props.onFocusOnNode(this.props.item.parent.nodeId);
        this.props.onRemoveNodeAndDescendants(this.props.item);
    }

    /*
    *   Add node below this one.
    */
    addChild() {
        this.props.onAddChild(this.props.item);
    }

    /*
    *   Add node above this one.
    */
    addParent() {
        this.props.onAddParent(this.props.item);
    }

    addSibling() {
        this.props.onAddChild(this.props.item.parent);
    }

    /*
    *   Return wether this should take the styles of a single child or a child with siblings.
    */
    childrenClass(childrenAmount) {
        if (childrenAmount == 1) return 'Child';
        return 'Children';
    }

    /*
    *   Return wether this should take the styles of one className or the other.
    */
    inputClass() {
        if (!this.props.item.text) return 'EmptyInputBar';
        return 'InputBar';
    }

    edit() {
        this.props.onFocusOnNode(this.props.item.nodeId);
    }

    /*
    *   Display either the originalText of the subscript formatted version.xs
    */
    switchNodeFormatting(value) {
        if(value) {
            if(this.originalText) {
                this.props.item.text = this.originalText;
            }
        }
        else{
            if(this.formattedText) {
                this.originalText = this.props.item.text;
                this.props.item.text = this.formattedText;
            }
        }
    }
    /*
    *   Sets the value of whether the mouse is over this node.
    */
    setOnHover(value) {
        if (value) {
            this.focusOnMe();
        }
        this.setState({onHover:value});
        this.switchNodeFormatting(value);
    }

    listChildren() {
      let nodes = [];
      let root = this.props.root;
      this.props.item.children.forEach((child, key) => {
        nodes.push(<li key={ child.nodeId }>
          <NodeView
            item={ child }
            root={ root }
            onUpdateBracketNotation={ this.props.onUpdateBracketNotation }
            onFocusOnNode={ this.props.onFocusOnNode }
            onRemoveNode={ this.props.onRemoveNode }
            onRemoveNodeAndDescendants={ this.props.onRemoveNodeAndDescendants }
            onFocusOnSibling={ this.props.onFocusOnSibling }
            onAddParent={ this.props.onAddParent }
            onAddChild={ this.props.onAddChild }/>
        </li>)
      });
      return nodes;
    }

    render() {
      let className;
      if (this.props.item === this.props.root) {
        className = 'Root';
        // console.log(className);
      } else{
        className = 'Component';
      }
      return (<g>
        <ul className={ className }>
          <div id={ className === 'Root' ? 'content-to-print' : ''}>
            <div id={ this.props.item.nodeId } className={ 'Node' }>
                <div className={ 'Connector' }
                     style={ {
                       opacity: this.state.onHover || ( this.props.root.children.length === 0 ) ? '1' : '0'} }
                     onMouseEnter={ () => this.setOnHover(true) }
                     onMouseLeave={ () => this.setOnHover(false) }>

                    <div className={ 'Button' } onClick={ () => this.removeSelfAndDescendants() }>
                        {/* <img className={ 'buttonIcon } src="https://png.icons8.com/cancel/color/96"/> */}
                        <img className={ 'DeleteButtonIcon' } src={ require("../../res/icons8-Cancel-96.png") } href="https://icons8.com"/>
                    </div>

                    <div className={ 'Button' } onClick={ () => this.addChild() }>
                        <img className={ 'ButtonIcon' } src={ require("../../res/icons8-LongArrowDown-104.png") } href="https://icons8.com"/>
                    </div>

                    <div className={ 'Button' } onClick={ () => this.addParent() }>
                        <img className={ 'ButtonIcon' } src={ require("../../res/icons8-LongArrowUp-104.png") } href="https://icons8.com"/>
                    </div>

                </div>
                <input id={ this.props.item.nodeId + "/inputBox" }
                    className={ this.inputClass() }
                    type="text"
                    style={ { width: this.getSize(), marginTop: this.state.onHover || (this.props.root.children.length === 0 ) ? '5px' : '-30px'}}
                    onKeyUp={ (ev) => this.onKeyUp(ev) }
                    onMouseEnter={ () => this.setOnHover(true) }
                    onMouseLeave={ () => this.setOnHover(false) }
                    placeholder= "..."
                />
            </div>
            { this.props.item.children.length > 0 ? (
                <div className={ this.childrenClass(this.props.item.children.length) }>
                    { this.listChildren() }
                </div>
            ) : (<g></g>)
            }
          </div>
        </ul>
      </g>);
      }
}
