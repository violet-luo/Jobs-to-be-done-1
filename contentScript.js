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
            chrome.storage.sync.remove(currentJob);

            response(currentJob);
        }

        //newJobLoaded();
    });

    const fetchBookmarks = () => {
        return new Promise((resolve) => {
            chrome.storage.sync.get().then((obj) => {
                resolve(obj? Object.values(obj).forEach((x)=>JSON.parse(x)) : []);
            },(error) => {
                console.log(`Error: ${error}`);
            });
        });
    }

    const newJobLoaded = async () => {
        console.log("new job loaded")
        const bookmarkExists = chrome.storage.sync.get(currentJob);
        console.log(bookmarkExists);
        // currentJobBookmarks = await fetchBookmarks();
        // console.log(currentJobBookmarks);
        if (bookmarkExists === undefined) {
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

        chrome.storage.sync.set({
            currentJob: JSON.stringify(newBookmark)
        });

        currentJobBookmarks = await fetchBookmarks();
    }
})();

const getTime = t => {
    var date = new Date();
    date.setSeconds(1);
    return date.toISOString();
}
