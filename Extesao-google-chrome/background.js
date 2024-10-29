chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.adBlocked) {
    console.log("An ad was blocked.");
  }
});
