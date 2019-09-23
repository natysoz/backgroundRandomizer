console.log('BACKGROUND SCRIPT?')

document.addEventListener("DOMContentLoaded", () => {
console.log('DOMContentLoaded SCRIPT')
  chrome.tabs.query(
      {
        active: false,
        status: "complete"
      },
      function(tabs) {
        for (let tab in tabs) {
          console.log(tabs[tab].id)
          if (!tabs[tab].url.match(/(chrome)/gi)) {
            chrome.tabs.executeScript(tabs[tab].id, {
              file: "js/content.js"
            });
            console.log('content injected',tabs[tab].url)
            chrome.tabs.insertCSS(tabs[tab].id, {
              file: "css/content.css"
            });
            console.log('contentcss injected',tabs[tab].url)
          }
        }
      }
  );
});
