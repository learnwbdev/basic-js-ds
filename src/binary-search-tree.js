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
      return {isNodeExists, parentNode};
    } else if (dataToFind === currentNode.data) {
      const isNodeExists = true;
      return {isNodeExists, parentNode};
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

  #getExtremeValue(currentNode, previousNode, keyNext) {
    if (!currentNode) {
      return previousNode.data;
    }
    previousNode = currentNode;
    currentNode = currentNode[keyNext];
    return this.#getExtremeValue(currentNode, previousNode, keyNext);
  }

  #isNodeALeaf(nodeToCheck) {
    const isLeaf = !nodeToCheck.left && !nodeToCheck.right;
    return isLeaf;
  }

  root() {
    return this.rootNode;
  }

  add(data) {
    const newNode = new Node(data);
    if (!this.rootNode) {
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
    const startNode = this.rootNode;
    const dataNode = this.#getNodeForData(data, startNode);
    const isDataNodeExists = !!dataNode;
    return isDataNodeExists;
  }

  find(data) {
    const startNode = this.rootNode;
    const dataNode = this.#getNodeForData(data, startNode);
    return dataNode;
  }

  remove(data) {
    if (!this.rootNode) {
      return;
    }

    const startNode = this.rootNode;
    const previousNode = null;
    const {isNodeExists, parentNode} = this.#getNodeStatusAndParent(data, startNode, previousNode);

    if (!isNodeExists) {
      return;
    }
    // remove root Node
    if (!parentNode) {
      const nodeToRemove = this.rootNode;
      if (this.#isNodeALeaf(nodeToRemove)) {
        this.rootNode = null;
        return;
      }
      const nodeChildLeft = nodeToRemove.left;
      const nodeChildRight = nodeToRemove.right;
      if (!nodeChildLeft && !nodeChildRight) {
        this.rootNode = null;
      } else if (!nodeChildLeft) {
        this.rootNode = nodeChildRight;
      } else if (!nodeChildRight) {
        this.rootNode = nodeChildLeft;
      } else {
        this.rootNode = nodeChildLeft;
        const {_, parentNode: newParentForRightChild} = this.#getNodeStatusAndParent(nodeChildRight.data, nodeChildLeft.right, nodeChildLeft);
        if (nodeChildRight.data < newParentForRightChild.data) {
          newParentForRightChild.left = nodeChildRight;
        } else {
          newParentForRightChild.right = nodeChildRight;
        }
      }
      return;
    }
    const keyChildToRemove = data < parentNode.data ? 'left' : 'right';
    const nodeToRemove = parentNode[keyChildToRemove];
    if (this.#isNodeALeaf(nodeToRemove)) {
      parentNode[keyChildToRemove] = null;
      return;
    }
    const nodeChildLeft = nodeToRemove.left;
    const nodeChildRight = nodeToRemove.right;

    if (nodeToRemove.data < parentNode.data) {
      parentNode.left = nodeChildLeft;
      if (nodeChildRight) {
        const {_, parentNode: newParentForRightChild} = this.#getNodeStatusAndParent(nodeChildRight.data, nodeChildLeft, parentNode);
        if (nodeChildRight.data < newParentForRightChild.data) {
          newParentForRightChild.left = nodeChildRight;
        } else {
          newParentForRightChild.right = nodeChildRight;
        }
      }
    } else {
      parentNode.right = nodeChildRight;
      if (nodeChildLeft) {
        const {_, parentNode: newParentForLeftChild} = this.#getNodeStatusAndParent(nodeChildLeft.data, nodeChildRight, parentNode);
        if (nodeChildLeft.data < newParentForLeftChild.data) {
          newParentForLeftChild.left = nodeChildLeft;
        } else {
          newParentForLeftChild.right = nodeChildLeft;
        }
      }
    }
  }

  min() {
    if (!this.rootNode) {
      return null;
    }
    const previousNode = this.rootNode;
    const currentNode = this.rootNode.left;
    const extremeTypeMin = 'min';
    const keyNext = this.#getKeyNextValueForExtremeType(extremeTypeMin);
    const minValue = this.#getExtremeValue(currentNode, previousNode, keyNext);
    return minValue;
  }

  max() {
    if (!this.rootNode) {
      return null;
    }
    const previousNode = this.rootNode;
    const currentNode = this.rootNode.right;
    const extremeTypeMax = 'max';
    const keyNext = this.#getKeyNextValueForExtremeType(extremeTypeMax);
    const maxValue = this.#getExtremeValue(currentNode, previousNode, keyNext);
    return maxValue;
  }
}

module.exports = {
  BinarySearchTree
};