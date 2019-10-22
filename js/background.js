document.addEventListener("DOMContentLoaded", () => {
  chrome.tabs.query(
    {
      active: false,
      status: "complete"
    },
    tabs => {
      for (let tab in tabs) {
        if (!tabs[tab].url.match(/(chrome)/gi)) {
          chrome.tabs.executeScript(tabs[tab].id, {
            file: "js/content.js"
          });
          chrome.tabs.insertCSS(tabs[tab].id, {
            file: "css/content.css"
          });
        }
      }
    }
  );
});

chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
  chrome.tabs.sendMessage(tabs[0].id, { action: "open_dialog_box" }, function(
    response
  ) {});
});
