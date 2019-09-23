window.addEventListener("load", init);

let preferences = {
  color: null,
  random: false,
  custom: false,
  dark: false,
  ghost: false,
  density: false
};

function init() {
  const userPreferences = loadUserPrefs();
  if (userPreferences) {
    preferences = userPreferences;
    updateBtns(userPreferences);
    updateMainControllers(userPreferences);
    if (userPreferences.color) loadSelectedColor(userPreferences);
  }
  const options = document.querySelectorAll(".option");
  Array.from(options).forEach(element =>
    element.addEventListener("click", toggleMode, true)
  );
  const clr_options = document.querySelectorAll(".clr");
  Array.from(clr_options).forEach(element =>
    element.addEventListener("click", toggleColors, true)
  );
}

function toggleMode() {
  let checkboxes = document.getElementsByName("check");
  const buttonClicked = this.getAttribute("data-name");
  if (buttonClicked === "custom") togglePicker(true);
  else togglePicker(false);
  checkboxes.forEach(item => {
    if (item !== this) {
      item.checked = false;
    }
  });
  for (let k in preferences) {
    if (preferences.hasOwnProperty(k)) {
      if (k !== buttonClicked) {
        if (k === "color" || k === "active" || k === "wire") continue;
        preferences[k] = false;
      }
    }
  }
  preferences[buttonClicked] = !preferences[buttonClicked];
  save_options(preferences);
}

function loadSelectedColor(userPreferences) {
  document.querySelectorAll(".clr").forEach(element => {
    element.classList.remove("selected");
  });
  const { color } = userPreferences;
  document.querySelector(`.${color}`).classList.add("selected");
}

function toggleColors() {
  const clickedColor = this.getAttribute("data-color");
  document.querySelectorAll(".clr").forEach(element => {
    element.classList.remove("selected");
  });
  this.classList.add("selected");
  preferences.color = clickedColor;
  save_options(preferences);
}

function updateMainControllers(prefs) {
  let checkboxes = document.querySelectorAll(".main-control");
  Array.from(checkboxes).forEach(optionButton => {
    optionButton.checked = prefs[optionButton.getAttribute("data-name")];
  });
}

function updateBtns(prefs) {
  const optionButtons = document.querySelectorAll(".option");
  Array.from(optionButtons).forEach(optionButton => {
    optionButton.checked = prefs[optionButton.getAttribute("data-name")];
    if (prefs.custom) {
      if (optionButton.getAttribute("data-name") === "custom") {
        togglePicker(true);
      }
    }
  });
}

function save_options(userPrefs) {
  const prefs = JSON.stringify(userPrefs);
  localStorage.setItem("userPrefs", prefs);

  chrome.storage.local.set(userPrefs, () => {
    if (chrome.runtime.error) {
      console.warn("Runtime error.");
    }
  });
}

function loadUserPrefs() {
  return JSON.parse(localStorage.getItem("userPrefs"));
}

function togglePicker(state) {
    const colorPicker = document.querySelector(".flex-color");
  if (state) {
    colorPicker.classList.toggle("color_picker_hidden");
    colorPicker.classList.toggle("color_picker_show");
  } else {
    colorPicker.classList.add("color_picker_hidden");
    colorPicker.classList.remove("color_picker_show");
  }
}


