chrome.tabs.onUpdated.addListener((tabId, tab) => {
    if (tab.url && tab.url.includes("linkedin.com/jobs/view/")) {
      const queryParameters = tab.url.split("/")[5];
      console.log(queryParameters);
      chrome.tabs.sendMessage(tabId, {
        type: "NEW",
        jobId: queryParameters,
      });
    }
    //tab.url.includes("collections")?tab.url.split("=")[1]
  });
  