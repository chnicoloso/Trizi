import React, { Component } from 'react';
import Node from '../Node/Node';
import NodeView from "../Node/NodeView";
import "./Tree.css";

export default class Tree extends Component {

    constructor() {
        super();
        this.addChild = this.addChild.bind(this);
        this.addNode = this.addNode.bind(this);
        this.addRoot = this.addRoot.bind(this);
        this.getBracketNotation = this.getBracketNotation.bind(this);
        this.addParent = this.addParent.bind(this);
        this.switchParenthood = this.switchParenthood.bind(this);
        this.addParenthood = this.addParenthood.bind(this);
        this.removeParenthood = this.removeParenthood.bind(this);
        this.removeNode = this.removeNode.bind(this);
        this.removeNodeAndDescendants = this.removeNodeAndDescendants.bind(this);
        this.focusOnSibling = this.focusOnSibling.bind(this);
        this.focusOnNode = this.focusOnNode.bind(this);
        this.moveItems = this.moveItems.bind(this);
        this.updateBracketNotation = this.updateBracketNotation.bind(this);
        this.currentId = 1;
        this.state = {
          root : null
        }
    }

    componentDidMount() {
      this.addRoot();
    }

    /*
    *   Creates a new root for this tree.
    */
    addRoot() {
        let node = this.addNode();
        this.updateRoot(node);
        this.updateBracketNotation();
    }

    getBracketNotation(node) {
        if (node.text || node.children.length > 0) {
            let text = '[ ' + node.text;
            node.children.forEach( child => {
                text += ' ' + this.getBracketNotation(child);
            });
            text += ' ]';
            return text;
        }
        return '[ ]';
    }

    updateBracketNotation() {
        if (this.state.root) {
          let bracketText = this.getBracketNotation(this.state.root);
          this.props.onUpdateBracketNotation(bracketText);
        }
    }

    /*
    *   Updates the new root for this tree.
    */
    updateRoot(newRoot) {
      if (newRoot) { // Change Root.
        this.setState({root: newRoot});
      } else { // Just refresh.
          this.setState((prevState) => ({
            root: prevState.root
          }));
      }
      this.updateBracketNotation();

    }

    /*
    *   Add new empty node to the Tree.
    */
    addNode() {
        let node = new Node(this.currentId);
        this.currentId += 1;
        return node;
    }

    /*
    *   Creates a new inner node and the relationship between it and the creating node.
    */
    addChild(parent) {
        let node = this.addNode();
        this.addParenthood(parent, node);
    }

    /*
    *   Creates a new parent node for this branch.
    */
    addParent(child) {
        let newNode = this.addNode();
        let childParent = child.parent;
        if (childParent) {
            this.switchParenthood(child, childParent, newNode);
        }
        else{ //this used to be the root, switch them.
            this.addParenthood(newNode, this.state.root);
            this.updateRoot(newNode);
        }
    }

    /*
    *   Set's child's parent to be newParent and origianl parent becomes newParent's parent. Inserts newParent in between child and originalParent.
    */
    switchParenthood(child, originalParent, newParent) {
        let originalIndex = originalParent.children.indexOf(child);
        originalParent.children[originalIndex] = newParent;
        newParent.parent = originalParent;
        this.addParenthood(newParent, child);
    }

    /*
    *   Creates an edge going from childNode to parentNode.
    */
    addParenthood(parentNode, childNode) {
        parentNode.children.push(childNode);
        childNode.parent = parentNode;
        this.updateRoot();
    }

    /*
    *   Removes an edge going from childNode to parentNode.
    */
    removeParenthood(parentNode, childNode) {
        let index = parentNode.children.indexOf(childNode);
        parentNode.children.splice(index);
        this.updateRoot();
    }

    removeNode(node) {
        let parent = node.parent;
        // delete node and re-atach children.
        if (parent) {
            let child = node.children.get(0);
            this.switchParenthood(child, node, parent);
            this.removeParenthood(parent, node);
        }
        else {
            // delete all but the root.
            let newRoot = { nodeId: this.state.root.nodeId,
                            children: [],
                            text: this.state.root.text,
                            parent: this.state.root.parent
                          };
            this.updateRoot(newRoot);
       }
    }

    /*
    *   Remove given node from the Tree.
    */
    removeNodeAndDescendants(node) {
        let parent = node.parent;
        // delete node and whole branch
        if (parent) {
            this.removeParenthood(parent, node);
        }
        else{
            // delete all but the root.
            let newRoot = { nodeId: this.state.root.nodeId,
                            children: [],
                            text: this.state.root.text,
                            parent: this.state.root.parent
                          };
            this.updateRoot(newRoot);
        }
    }
    /*
    *   Puts focus on the given node's sibling at the given direction.
    */
    focusOnSibling(nodeId, direction) {
        let leaves = this.tree.get('leaves');
        let nodeIndex = leaves.indexOf(nodeId);
        let nodeToFocus;
        if (direction === "left") {
            nodeToFocus = this.tree.get('leaves').get(nodeIndex-1);
        }
        if (direction === "right") {
            nodeToFocus = this.tree.get('leaves').get(nodeIndex+1);
        }
        if (nodeToFocus) this.focusOnNode(nodeToFocus);
    }

    /*
    *   Puts focus on the given node.
    */
    focusOnNode(id) {
        let node = document.getElementById(id+"/inputBox");
        if(node) {
          node.focus();
        }
    }

    moveItems(items, itemBefore, itemAfter) {
        let beforeId = itemBefore ? itemBefore.data._id : null;
        let afterId = itemAfter ? itemAfter.data._id : null;
        let itemIds = new Set(items.map((item) => item.id));

        this.groups.forEach((group) => {
            let groupItems = group.items;
            let insertAtBeginning = groupItems.get(0).id === afterId;
            for (var i = groupItems.length - 1; i >= 0; i--) {
                let item = groupItems.get(i);
                if (itemBefore && item.id === beforeId) {
                    groupItems.splice(i + 1, 0, ...items);
                }
                if (itemIds.has(item.id)) {
                    groupItems.splice(i, 1);
                }
            }
            if (insertAtBeginning) {
                groupItems.unshift(...items);
            }
        });
    }

    render() {
      if (this.state.root) {
        return <g>
            <div className='Tree-Component'>
              <NodeView
                root={ this.state.root }
                item={ this.state.root }
                onFocusOnNode={ this.focusOnNode }
                onRemoveNode={ this.removeNode }
                onRemoveNodeAndDescendants={ this.removeNodeAndDescendants }
                onFocusOnSibling={ this.focusOnSibling }
                onAddParent={ this.addParent }
                onAddChild={ this.addChild }
                onUpdateBracketNotation={ this.updateBracketNotation }
              />
            </div>
          </g>
      } else {
        return <g></g>;
      }
    }
}
