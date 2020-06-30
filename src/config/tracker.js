const trackerRaduisMapping = {
  0: [5, 5, 5, 5, 5, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7],
  1: [5, 5, 5, 5, 5, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7],
  2: [5, 5, 5, 5, 5, 7, 7, 7, 7, 7, 9, 12.5, 14, 15, 15, 15, 15],
  3: [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
  4: [5, 5, 5, 5, 5, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7],
  5: [5, 5, 5, 5, 5, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7],
  6: [5, 5, 5, 5, 5, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7],
  7: [5, 5, 5, 5, 5, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7],
  8: [5, 5, 5, 5, 5, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7],
  9: [5, 5, 5, 5, 5, 7, 7, 7, 7, 7, 9, 12.5, 14, 15, 15, 15, 15],
};

export const types = [
  'Tram',
  'Subway / Metro / S-Bahn',
  'Train',
  'Bus',
  'Ferry',
  'Cable Car',
  'Gondola',
  'Funicular',
  'Long distance bus',
  'Rail', // New endpoint use Rail instead of Train.
];

export const bgColors = [
  '#ffb400',
  '#ff5400',
  '#ff8080',
  '#ea0000',
  '#3000ff',
  '#ffb400',
  '#41a27b',
  '#00d237',
  '#b5b5b5',
  '#ff8080',
];

export const textColors = [
  '#000000',
  '#ffffff',
  '#000000',
  '#ffffff',
  '#ffffff',
  '#000000',
  '#ffffff',
  '#000000',
  '#000000',
  '#000000',
];

export const timeSteps = [
  100000,
  50000,
  40000,
  30000,
  20000,
  15000,
  10000,
  5000,
  2000,
  1000,
  400,
  300,
  250,
  180,
  90,
  60,
  50,
  50,
  50,
  50,
  50,
];

const getTypeIndex = (type) => {
  if (typeof type === 'string') {
    const matched = types.find((t) => new RegExp(type).test(t));
    return types.indexOf(matched);
  }
  return type;
};

export const getRadius = (type = 0, zoom) => {
  try {
    const typeIdx = getTypeIndex(type);
    return trackerRaduisMapping[typeIdx][zoom];
  } catch (e) {
    return 1;
  }
};

export const getBgColor = (type = 0) => {
  try {
    const typeIdx = getTypeIndex(type);
    return bgColors[typeIdx];
  } catch (e) {
    return 1;
  }
};

export const getTextColor = (type = 0) => {
  try {
    const typeIdx = getTypeIndex(type);
    return textColors[typeIdx];
  } catch (e) {
    return 1;
  }
};

export const getTextSize = (ctx, markerSize, text, fontSize) => {
  ctx.font = `bold ${fontSize}px Arial`;
  let newText = ctx.measureText(text);

  const maxiter = 15;
  let i = 0;

  while (newText.width > markerSize - 6 && i < maxiter) {
    // eslint-disable-next-line no-param-reassign
    fontSize -= 0.5;
    ctx.font = `bold ${fontSize}px arial, sans-serif`;
    newText = ctx.measureText(text);
    i += 1;
  }
  return fontSize;
};

export const getDelayColor = (delayInMs, cancelled) => {
  if (cancelled) {
    return '#ff0000';
  }
  if (delayInMs >= 3600000) {
    return '#ed004c'; // pink { r: 237, g: 0, b: 76, s: '237,0,76' };
  }
  if (delayInMs >= 500000) {
    return '#e80000'; // red { r: 232, g: 0, b: 0, s: '232,0,0' };
  }
  if (delayInMs >= 300000) {
    return '#ff4a00'; // orange { r: 255, g: 74, b: 0, s: '255,74,0' };
  }
  if (delayInMs >= 180000) {
    return '#f7bf00'; // yellow { r: 247, g: 191, b: 0, s: '247,191,0' };
  }
  if (delayInMs === null) {
    return '#a0a0a0'; // grey { r: 160, g: 160, b: 160, s: '160,160,160' };
  }
  return '#00a00c'; // green { r: 0, g: 160, b: 12, s: '0,160,12' };
};

export const getDelayText = (delayInMs, cancelled) => {
  if (cancelled) {
    return String.fromCharCode(10006);
  }
  if (delayInMs > 3600000) {
    const rounded = Math.round(delayInMs / 3600000);
    return `+${rounded}h`;
  }

  if (delayInMs > 59000) {
    const rounded = Math.round(delayInMs / 60000);
    return `+${rounded}m`;
  }

  if (delayInMs > 0) {
    return `+${delayInMs}s`;
  }

  return '';
};
