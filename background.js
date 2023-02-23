chrome.runtime.onMessageExternal.addListener( (request, sender, sendResponse) => {
  console.log("Received message from " + sender + ": ", request);
  sendResponse({ received: true }); //respond however you like
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  //console.log(tabId, tab, tab.url);
  if (tab.status === 'complete' && tab.url && tab.url.includes("linkedin.com/jobs/view/")) {
    const queryParameters = tab.url.split("/")[5];
    console.log(queryParameters);
    chrome.tabs.sendMessage(tabId, {
      type: "NEW",
      jobId: queryParameters,
    });
  }
    //tab.url.includes("collections")?tab.url.split("=")[1]
  });
  