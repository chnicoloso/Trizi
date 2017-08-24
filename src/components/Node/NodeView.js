import React, { Component } from 'react';
import './Node.css';

export default class NodeView extends Component {

    /*
    *   Component takes in a Node model Object.
    */
    constructor() {
        super();
        this.focusOnMe = this.focusOnMe.bind(this);
        this.focusLeft = this.focusLeft.bind(this);
        this.focusRight = this.focusRight.bind(this);
        // this.focusDown = this.focusDown.bind(this);
        // this.focusUp = this.focusUp.bind(this);
        this.onKeyUp = this.onKeyUp.bind(this);
        this.formatText = this.formatText.bind(this);
        this.getSize = this.getSize.bind(this);
        this.childrenClass = this.childrenClass.bind(this);
        this.switchNodeFormatting = this.switchNodeFormatting.bind(this);
        this.setOnHover = this.setOnHover.bind(this);
        this.listChildren = this.listChildren.bind(this);
        this.state = {
          onHover: false,
          originalText: '',
          formatText: '',
          pressedDeleteTwice: false,
          pressedLeftTwice: false,
          pressedRightTwice: false
        };
    }
    componentWillReceiveProps(nextProps) {
      if (nextProps.item.nodeId === nextProps.root.nodeId) {
        let inputBox = document.getElementById(this.props.item.nodeId + "/inputBox");
        inputBox.value = nextProps.item.text;
      }
    }

    /*
    *   Focus on Node as soon as it's attached to the DOM.
    */
    componentDidMount() {
        let inputBox = document.getElementById(this.props.item.nodeId + "/inputBox");
        let text = this.props.item.text;
        inputBox.value = text;
        this.focusOnMe();
    }

    /*
    *   Swiches focu back on previous Node as soon as this object is deleted from the DOM.
    */
    componentWillUnMount() {
        let inputBox = document.getElementById(this.props.item.nodeId + "/inputBox");
        inputBox.value = '';
        this.props.onFocusOnSibling(this.props.item.nodeId, "left");
    }

    /*
     * Focus on this node.
     */
    focusOnMe() {
        this.props.onFocusOnNode(this.props.item.nodeId);
    }

    /*
     * Focus on node on the left.
     */
    focusLeft(currentNodeIndex, parent, siblings) {
      if (currentNodeIndex - 1 >= 0) {
        let nodeToFocus = siblings[currentNodeIndex-1];
        this.props.onFocusOnNode(nodeToFocus.nodeId);
      }
      else {
        // focus on right-most left cousin.
        if (parent.parent) {
          let parentIndex = parent.parent.children.indexOf(parent);
          if (parentIndex >= 1) {
            let leftUncle = parent.parent.children[parentIndex-1];
            let leftCousins = leftUncle.children;
            let rightMostLeftCousin = leftCousins ? leftCousins[leftCousins.length-1] : null;
            if (rightMostLeftCousin) {
              this.props.onFocusOnNode(rightMostLeftCousin.nodeId);
            }

          }
        }
      }
    }

    /*
     * Focus on node on the right.
     */
    focusRight(currentNodeIndex, parent, siblings) {
      if (currentNodeIndex + 1 < siblings.length) {
        let nodeToFocus = siblings[currentNodeIndex+1];
        this.props.onFocusOnNode(nodeToFocus.nodeId);
      }
      else{
        // focus on left-most right cousin.
        if (parent.parent) {
          let parentIndex = parent.parent.children.indexOf(parent);
          if (parentIndex >= 0 && parentIndex < parent.parent.children.length-1) {
            let rightUncle = parent.parent.children[parentIndex+1];
            let rightCousins = rightUncle.children;
            let leftMostRightCousin = rightCousins ? rightCousins[0] : null;
            if (leftMostRightCousin) {
              this.props.onFocusOnNode(leftMostRightCousin.nodeId);
            }

          }
        }
      }
    }

    handlePressedLeft(currentNode, currentNodeIndex, parent, siblings) {
      if (this.state.pressedLeftTwice) {
        // focus on left sibling.
        if (parent) {
          this.focusLeft(currentNodeIndex, parent, siblings);
        }
        else { // Root. Focus on left child.
          let children = currentNode.children;
          if (children.length >= 1) {
            let nodeToFocus = children[0];
            this.props.onFocusOnNode(nodeToFocus.nodeId)
          }
        }
      } else {
        this.setState({pressedLeftTwice:true})
      }
    }

    handlePressedRight(currentNode, currentNodeIndex, parent, siblings) {
      if (this.state.pressedRightTwice) {
        // focus on right sibling.
        if (parent) {
          this.focusRight(currentNodeIndex, parent, siblings);
        }
        else { // Root. Focus on right child.
          let children = currentNode.children;
          if (children.length >= 1) {
            let nodeToFocus = children[children.length-1];
            this.props.onFocusOnNode(nodeToFocus.nodeId)
          }
        }
      } else {
        this.setState({pressedRightTwice:true})
      }
    }

    /*
     * Registers a new entered character.
     */
    onKeyUp(ev) {
        ev.nativeEvent.stopImmediatePropagation();
        ev.preventDefault();
        let code = ev.keyCode;
        let currentNode = this.props.item;
        let parent = currentNode.parent;
        let siblings = parent ? parent.children : [];
        let currentNodeIndex = siblings.indexOf(currentNode);
        let nodeToFocus;
        var inputBox = document.getElementById(currentNode.nodeId + "/inputBox");
        let text = inputBox.value;
        let position = text.slice(0, inputBox.selectionStart).length;
        // if press enter, create a new node.
        if (code === 13) {
            this.addChild();
        }
        if (code === 39) {
          if (position === text.length) {
            this.handlePressedRight(currentNode, currentNodeIndex, parent, siblings);
          }
        } else {
          this.setState({pressedRightTwice:false})
        }
        if (code === 37) {
          if (position === 0) {
            this.handlePressedLeft(currentNode, currentNodeIndex, parent, siblings);
          }
        } else {
          this.setState({pressedLeftTwice:false})
        }
        if (code === 38) {
          // focus on parent.
          if (parent) {
            this.props.onFocusOnNode(parent.nodeId);
          }
        }
        if (code === 40) {
          // focus on child.
          let children = currentNode.children;
          if (children.length >= 1) {
            nodeToFocus = children[Math.floor(children.length/2)];
            this.props.onFocusOnNode(nodeToFocus.nodeId);
          }
        }
        // if (code === 9 ) {
        //     this.addSibling();
        // }
        if (code === 8 && !this.state.originalText) {
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
        // currentNode.text += ev.char;
        currentNode.text = text;
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
        if (this.props.item.text) {
            return (this.props.item.text.length+3)*7;
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
      this.props.item.children.forEach( child => {
        nodes.push(<li key={ child.nodeId }>
          <NodeView
            root={ root }
            item={ child }
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
      } else {
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
                    className={ 'InputBar' }
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
