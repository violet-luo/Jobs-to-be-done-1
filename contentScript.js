(() => {
    let jobToprightControls;
    let currentJob = "";
    let currentJobBookmarks = [];

    chrome.runtime.onMessage.addListener((obj, sender, response) => {
        const { type, value, jobId } = obj;

        if (type === "NEW") {
            currentJob = jobId;
            console.log(currentJob);
            newJobLoaded();
        } else if (type === "DELETE") {
            currentJobBookmarks = currentJobBookmarks.filter((bookmark) => bookmark.id !== value);
            chrome.storage.sync.set({ [currentJob]: JSON.stringify(currentJobBookmarks) });

            response(currentJobBookmarks);
        }

        //newJobLoaded();
    });

    const fetchBookmarks = () => {
        return new Promise((resolve) => {
            chrome.storage.sync.get([currentJob], (obj) => {
                resolve(obj[currentJob]? JSON.parse(obj[currentJob]) : []);
            });
        });
    }

    const newJobLoaded = async () => {
        console.log("new job loaded")
        const bookmarkBtnExists = document.getElementById("bookmark-btn");
        console.log(bookmarkBtnExists);
        currentJobBookmarks = await fetchBookmarks();
        console.log(currentJobBookmarks);
        if (!bookmarkBtnExists) {
            const bookmarkBtn = document.createElement("img");
            bookmarkBtn.src = chrome.runtime.getURL("assets/bookmark.png");
            bookmarkBtn.id = "bookmark-btn";
            bookmarkBtn.title = "Click to bookmark current job";
            jobToprightControls = document.getElementsByClassName("jobs-unified-top-card__buttons-container")[0];
            console.log(jobToprightControls);
            jobToprightControls.append(bookmarkBtn);
            bookmarkBtn.addEventListener("click", addNewBookmarkEventHandler);
        }
    }

    const addNewBookmarkEventHandler = async () => {
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

        currentJobBookmarks = await fetchBookmarks();

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
