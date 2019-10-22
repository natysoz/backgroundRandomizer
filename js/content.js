//Initial States
let htmlElements = [];
let insertedNodes = [];
let mods = [];
let settings = {};

setupModes();
setupDOMListener();
setupOnChangedListener();
storageDidUpdate();

chrome.runtime.onMessage.addListener((request, sender, sendResponse)=> {
  sendResponse("bar");
});

function storageDidUpdate() {
  chrome.storage.local.get(
    ["color", "custom", "random", "dark", "ghost", "density", "inspect"],
    data => {
      settings = data;
      dispatchActive(settings);
    }
  );
}

function dispatchActive(prefs = settings) {
  let active = checkActiveOptions(prefs);
  if (!active) {
    activeKey("");
    dispatch("_Disable_Plugin");
    return;
  }
  activeKey(active);
  dispatch(active);
}

function setupOnChangedListener() {
  chrome.storage.onChanged.addListener(storageDidUpdate);
}

function setupDOMListener() {
  document.addEventListener(
    "DOMNodeInserted",
    e => {
      insertedNodes.push(e.target);
      if (insertedNodes.length - 1 === htmlElements.length) {
        setTimeout(() => {
          if (insertedNodes.length > htmlElements.length) {
            NodesToArray(insertedNodes);
            dispatchActive();
          }
        }, 2800);
      }
    },
    false
  );
}

function dispatch(method) {
  let selectors = document.querySelectorAll("*");
  let body = document.querySelector("body");
  switch (method) {
    case "_Disable_Plugin":
      return disableAllModes(selectors);
    case "dark":
      return setDarkMode(selectors);
    case "random":
      return setRandomMode(selectors);
    case "custom":
      return setCustomMode(selectors);
    case "ghost":
      return setGhostMode(selectors);
    case "density":
      return setDensityMode(body, selectors);
    case "inspect":
      return setInspectMode(selectors);
  }
}

function disableAllModes(selectors) {
  selectors.forEach(element => removeModes(element));
}

function setDarkMode(selectors) {
  disableAllModes(selectors);
  selectors.forEach(element => element.classList.add("_Dark_Mode"));
}

function setRandomMode(selectors) {
  disableAllModes(selectors);
  selectors.forEach(element =>
    element.classList.add(`_Random_Mode_R${getRandomColorClass()}`)
  );
}

function setCustomMode(selectors) {
  disableAllModes(selectors);
  if (settings.color) {
    selectors.forEach(element =>
      element.classList.add(
        `_Custom_Mode_${settings.color}_R${getRandomColorClass(1, 3)}`
      )
    );
  }
}

function setGhostMode(selectors) {
  disableAllModes(selectors);
  selectors.forEach(element => element.classList.add("_Ghost_Mode"));
}

function setDensityMode(body, selectors) {
  disableAllModes(selectors);
  setDepthDensity(body);
}

function setDepthDensity(element, children, depth = 1) {
  if (depth >= 20) depth = 20;

  let nextGen = [];
  children = element.hasChildNodes();

  for (let i = 0; i < element.childNodes.length; i++) {
    element.classList.add(`_Density_Mode_R${depth}`);
    nextGen.push(element.childNodes[i]);
  }

  if (children) {
    element.childNodes.forEach(child => {
      setDepthDensity(child, nextGen, depth + 1);
    });
  }
}

function setInspectMode(selectors) {
  disableAllModes(selectors);
  selectors.forEach(element => element.classList.add("_Inspect_Mode"));
}

function removeModes(element) {
  for (let j = 0, k = mods.length; j < k; j++) {
    element.classList.remove(mods[j]);
  }
}

function checkActiveOptions(settings = {}) {
  for (const k in settings) {
    if (settings[k] === true) return k;
  }
}

function activeKey(key) {
  for (const k in settings) {
    if (k !== "color") {
      settings[k] = k === key;
    }
  }
}

function NodesToArray(nodes) {
  htmlElements = Array.from(nodes);
}

function getRandomColorClass(min = 1, max = 13) {
  return getRandomNum(min, max);
}

function getRandomNum(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function setupModes() {
  mods.push("_Dark_Mode", "_Ghost_Mode", "_Density_Mode", "_Inspect_Mode");
  pushRandomModes();
  pushVariantColors();
  pushDensityLevels();
}

function pushVariantColors(limitRandoms = 4) {
  const colors = ["red", "black", "blue", "green", "pink"];
  for (let i = 0; i <= colors.length - 1; i++) {
    for (let j = 1; j < limitRandoms; j++) {
      mods.push(`_Custom_Mode_${colors[i]}_R${j}`);
    }
  }
}

function pushRandomModes(limitRandoms = 13) {
  for (let i = 1; i <= limitRandoms; i++) {
    mods.push(`_Random_Mode_R${i}`);
  }
}

function pushDensityLevels(limitRandoms = 20) {
  for (let i = 1; i <= limitRandoms; i++) {
    mods.push(`_Density_Mode_R${i}`);
  }
}
