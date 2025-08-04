export function xpathSelector(path: string, contextNode: Node = document) {
  return document.evaluate(path, contextNode, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}

// TODO: xpathSelectorAll