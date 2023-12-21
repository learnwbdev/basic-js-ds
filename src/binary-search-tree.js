const { NotImplementedError } = require('../extensions/index.js');

const { Node } = require('../extensions/list-tree.js');

/**
* Implement simple binary search tree according to task description
* using Node from extensions
*
* root — return root node of the tree
* add(data) — add node with data to the tree
* has(data) — returns true if node with the data exists in the tree and false otherwise
* find(data) — returns node with the data if node with the data exists in the tree and null otherwise
* remove(data) — removes node with the data from the tree if node with the data exists
* min — returns minimal value stored in the tree (or null if tree has no nodes)
* max — returns maximal value stored in the tree (or null if tree has no nodes)
*/
class BinarySearchTree {
  rootNode = null;

  #isEmptyTree() {
    const isTreeWithoutNodes = !this.rootNode;
    return isTreeWithoutNodes;
  }

  #getNodeForData(dataToFind, currentNode) {
    if (!currentNode) {
      return null;
    } else if (dataToFind === currentNode.data) {
      return currentNode;
    } else {
      currentNode = dataToFind < currentNode.data ? currentNode.left : currentNode.right;
      return this.#getNodeForData(dataToFind, currentNode);
    }
  }

  #getNodeStatusAndParent(dataToFind, currentNode, parentNode) {
    if (!currentNode) {
      const isNodeExists = false;
      const soughtNode = null;
      return {isNodeExists, parentNode, soughtNode};
    } else if (dataToFind === currentNode.data) {
      const isNodeExists = true;
      const soughtNode = currentNode;
      return {isNodeExists, parentNode, soughtNode};
    } else {
      parentNode = currentNode;
      currentNode = dataToFind < currentNode.data ? currentNode.left : currentNode.right;
      return this.#getNodeStatusAndParent(dataToFind, currentNode, parentNode);
    }
  }

  #getKeyNextValueForExtremeType(extremeType = 'min') {
    const keyNext = extremeType === 'min' ? 'left' : 'right';
    return keyNext;
  }

  #getExtremeNode(currentNode, previousNode, keyNext) {
    if (!currentNode) {
      return previousNode;
    }
    previousNode = currentNode;
    currentNode = currentNode[keyNext];
    return this.#getExtremeNode(currentNode, previousNode, keyNext);
  }

  #getExtremeNodeInSubtree(startNodeForSearch, extremeType = 'min') {
    const keyNext = this.#getKeyNextValueForExtremeType(extremeType);
    const currentNodeForSearch = startNodeForSearch[keyNext];
    const nodeWithExtremeValue = this.#getExtremeNode(currentNodeForSearch, startNodeForSearch, keyNext);
    return nodeWithExtremeValue;
  }

  #getMinNodeInSubtree(startNodeForSearch) {
    const extremeTypeMin = 'min';
    const nodeWithMinValue = this.#getExtremeNodeInSubtree(startNodeForSearch, extremeTypeMin);
    return nodeWithMinValue;
  }

  #getMaxNodeInSubtree(startNodeForSearch) {
    const extremeTypeMax = 'max';
    const nodeWithMaxValue = this.#getExtremeNodeInSubtree(startNodeForSearch, extremeTypeMax);
    return nodeWithMaxValue;
  }

  #isALeaf(nodeToCheck) {
    const isLeaf = !nodeToCheck.left && !nodeToCheck.right;
    return isLeaf;
  }

  #hasOneChildOrNone(nodeToCheck) {
    const hasOneChildOrLess = !nodeToCheck.left || !nodeToCheck.right;
    return hasOneChildOrLess;
  }

  #hasTwoChildren(nodeToCheck) {
    const hasTwoChildrenExactly = nodeToCheck.left && nodeToCheck.right;
    return hasTwoChildrenExactly;
  }

  #isRootNode(nodeToCheck) {
    return nodeToCheck === this.rootNode;
  }

  #isLeftChild(nodeToCheck, parentNode) {
    const isNodeALeftChild = nodeToCheck.data < parentNode.data;
    return isNodeALeftChild;
  }

  #hasRightChild(nodeToCheck) {
    const nodeHasRightChild = !!nodeToCheck.right;
    return nodeHasRightChild;
  }

  #getSideToSwap(nodeToRemove) {
    const sideToSwap = this.#hasRightChild(nodeToRemove) ? 'right' : 'left';
    return sideToSwap;
  }

  root() {
    return this.rootNode;
  }

  add(data) {
    const newNode = new Node(data);
    if (this.#isEmptyTree()) {
      this.rootNode = newNode;
    }

    const startNode = this.rootNode;
    const previousNode = null;
    const {isNodeExists, parentNode} = this.#getNodeStatusAndParent(data, startNode, previousNode);
    if (isNodeExists) {
      return;
    }

    if (data < parentNode.data) {
      parentNode.left = newNode;
    } else {
      parentNode.right = newNode;
    }
  }

  has(data) {
    if (this.#isEmptyTree()) {
      return false;
    }
    const startNodeForSearch = this.rootNode;
    const soughtNode = this.#getNodeForData(data, startNodeForSearch);
    const isDataNodeExists = !!soughtNode;
    return isDataNodeExists;
  }

  find(data) {
    if (this.#isEmptyTree()) {
      return null;
    }
    const startNodeForSearch = this.rootNode;
    const soughtNode = this.#getNodeForData(data, startNodeForSearch);
    return soughtNode;
  }

  remove(data) {
    if (this.#isEmptyTree()) {
      return;
    }

    const startNode = this.rootNode;
    const previousNode = null;
    const {isNodeExists, parentNode, soughtNode: nodeToRemove} = this.#getNodeStatusAndParent(data, startNode, previousNode);

    if (!isNodeExists) {
      return;
    }

    if (this.#hasTwoChildren(nodeToRemove)) {
      const startNodeForSearch = nodeToRemove.left;
      const nodeMaxValueInLeftSubtree = this.#getMaxNodeInSubtree(startNodeForSearch);
      const dataFromMaxNodeInLeftSubtree = nodeMaxValueInLeftSubtree.data;
      this.remove(dataFromMaxNodeInLeftSubtree);
      nodeToRemove.data = dataFromMaxNodeInLeftSubtree;
      return;
    }

    let nodeToSwap;
    if (this.#isALeaf(nodeToRemove)) {
      nodeToSwap = null;
    } else if (this.#hasOneChildOrNone(nodeToRemove)) {
      const keyToSwap = this.#getSideToSwap(nodeToRemove);
      nodeToSwap = nodeToRemove[keyToSwap];
    }

    if (this.#isRootNode(nodeToRemove)) {
      this.rootNode = nodeToSwap;
    } else if (this.#isLeftChild(nodeToRemove, parentNode)) {
      parentNode.left = nodeToSwap;
    } else {
      parentNode.right = nodeToSwap;
    }
  }

  min() {
    if (this.#isEmptyTree()) {
      return null;
    }
    const startNodeForSearch = this.rootNode;
    const nodeWithMinValue = this.#getMinNodeInSubtree(startNodeForSearch);
    const minValue = nodeWithMinValue.data;
    return minValue;
  }

  max() {
    if (this.#isEmptyTree()) {
      return null;
    }
    const startNodeForSearch = this.rootNode;
    const nodeWithMaxValue = this.#getMaxNodeInSubtree(startNodeForSearch);
    const maxValue = nodeWithMaxValue.data;
    return maxValue;
  }
}

module.exports = {
  BinarySearchTree
};