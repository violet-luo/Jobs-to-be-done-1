(() => {
    let currentJob = "";
    let currentJobBookmarks = [];

    chrome.runtime.onMessage.addListener((obj, sender, response) => {
        const { type, value, jobId } = obj;

        if (type === "NEW") {
            currentJob = jobId;
            newJobLoaded();
        }
    });

    const newJobLoaded = () => {
        const bookmarkBtnExists = document.getElementsByClassName("bookmark-btn").length;

        if (bookmarkBtnExists === 0) {
            const bookmarkBtn = document.createElement("img");
            bookmarkBtn.src = chrome.runtime.getURL("assets/bookmark.png");
            bookmarkBtn.className = "bookmark-btn";
            bookmarkBtn.title = "Click to bookmark current job";
            
            jobToprightControls = document.getElementsByClassName("display-flex justify-flex-end")[0];
            jobToprightControls.append(bookmarkBtn);
            bookmarkBtn.addEventListener("click", addNewBookmarkEventHandler);

        }
    }

    const addNewBookmarkEventHandler = () => {
        jobTitle = document.getElementsByClassName("jobs-unified-top-card__job-title")[0]?.textContent;
        companyName = document.getElementsByClassName("jobs-unified-top-card__company-name")[0]?.textContent;
        location = document.getElementsByClassName("jobs-unified-top-card__bullet")[0]?.textContent;
        
        const newBookmark = {
            time: getTime(),
            url: window.location.href,
            id: currentJob,
            title: jobTitle,
            company: companyName,
            location: location,
        };
        console.log(newBookmark);

        chrome.storage.sync.set({
            [currentJob]: JSON.stringify([...currentJobBookmarks, newBookmark].sort((a, b) => a.time - b.time))
        });
    }
})();

const getTime = t => {
    var date = new Date();
    date.setSeconds(1);
    return date.toISOString();
}
