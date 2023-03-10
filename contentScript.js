(() => {
    let jobToprightControls;
    let currentJob = "";
    let currentJobBookmarks = [];

    chrome.runtime.onMessage.addListener((obj, sender, response) => {
        const { type, jobId } = obj;
        if (type === "NEW") {
            currentJob = jobId;
            newJobLoaded();
        } else if (type === "DELETE") {
            currentJobBookmarks = currentJobBookmarks.filter((bookmark) => bookmark.id !== jobId);
            console.log(currentJobBookmarks)
            chrome.storage.sync.remove(jobId);
            chrome.storage.sync.get(null, (obj) => {
                const bookmarks = Object.keys(obj).map((key) => JSON.parse(obj[key]));
                console.log(bookmarks)
            });
            response(currentJobBookmarks);
        }
    });

    const fetchBookmarks = () => {
        return new Promise((resolve) => {
            chrome.storage.sync.get(null, (obj) => {
                const bookmarks = Object.keys(obj).map((key) => JSON.parse(obj[key]));
                resolve(bookmarks);
            });
        });
    }

    const newJobLoaded = async () => {
        console.log("new job loaded")
        const bookmarkBtnExists = document.getElementById("bookmark-btn");
        jobToprightControls = document.getElementsByClassName("jobs-unified-top-card__buttons-container")[0];
        currentJobBookmarks = await fetchBookmarks();
        console.log(jobToprightControls)
        console.log(bookmarkBtnExists)
        if (!bookmarkBtnExists && jobToprightControls) {
            const bookmarkBtn = document.createElement("img");
            bookmarkBtn.src = chrome.runtime.getURL("assets/bookmark.png");
            bookmarkBtn.id = "bookmark-btn";
            bookmarkBtn.title = "Click to bookmark current job";
            jobToprightControls.append(bookmarkBtn);
            bookmarkBtn.addEventListener("click", addNewBookmarkEventHandler);
        } else {
            console.log("bookmark button already exists");
        }
    }

    const addNewBookmarkEventHandler = async () => {
        jobTitle = document.getElementsByClassName("jobs-unified-top-card__job-title")[0]?.textContent;
        companyName = document.getElementsByClassName("jobs-unified-top-card__company-name")[0]?.textContent;

        const newBookmark = {
            time: getTime(),
            url: window.location.href,
            id: currentJob,
            title: jobTitle,
            company: companyName
        };
        console.log(newBookmark);
        chrome.storage.sync.get(newBookmark.id,(result)=>{
            console.log(result)
            if (Object.keys(result).length === 0) {
                chrome.storage.sync.set({
                    [newBookmark.id]: JSON.stringify(newBookmark)
                });
            } else {
                console.log("bookmark exists");
            }
        });
    }
})();

const getTime = t => {
    var date = new Date();
    date.setSeconds(1);
    return date.toISOString();
}
