chrome.runtime.onMessageExternal.addListener( (request, sender, sendResponse) => {
  console.log("Received message from " + sender + ": ", request);
  sendResponse({ received: true }); //respond however you like
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  //console.log(tabId, tab, tab.url);
  if (tab.status === 'complete' && tab.url){
    if (tab.url.includes("linkedin.com/jobs/view/")) {
      const queryParameters = tab.url.split("/")[5];
      const jobSite = "linkedin";
      console.log(jobSite, queryParameters);
      chrome.tabs.sendMessage(tabId, {
        type: "NEW",
        jobSite: jobSite,
        jobId: queryParameters,
      });
    } else if (tab.url.includes("jobs.lever.co/")) {
      const queryParameters = tab.url.split("/")[4];
      const jobSite = "lever";
      console.log(jobSite, queryParameters);
      chrome.tabs.sendMessage(tabId, {
        type: "NEW",
        jobSite: jobSite,
        jobId: queryParameters,
      });
    }
  }
    //tab.url.includes("collections")?tab.url.split("=")[1]
  });
  