export const getSize = (element: HTMLElement) => {
  // https://stackoverflow.com/a/38929456
  const cs = getComputedStyle(element);

  const paddingX = parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight);
  const paddingY = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom);

  const borderX =
    parseFloat(cs.borderLeftWidth) + parseFloat(cs.borderRightWidth);
  const borderY =
    parseFloat(cs.borderTopWidth) + parseFloat(cs.borderBottomWidth);

  // Element width and height minus padding and border
  const width = element.offsetWidth - paddingX - borderX;
  const height = element.offsetHeight - paddingY - borderY;

  return { width, height };
};
