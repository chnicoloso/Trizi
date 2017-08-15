/*
*   Data Model for a Node in the Tree.
*/
export default class Node {
    /*
    *   Component has in a text variable containing
    *   the word that this node is meant to represent.
    */
    constructor(nodeId) {
        this.nodeId = nodeId;
        this.children = [];
        this.text = '';
        this.parent = null;
    }
}
