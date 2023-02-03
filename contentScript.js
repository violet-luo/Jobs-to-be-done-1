(() => {
    let currentJob = "";
    let currentJobBookmarks = [];

    chrome.runtime.onMessage.addListener((obj, sender, response) => {
        const { type, value, jobId } = obj;

        if (type === "NEW") {
            currentJob = jobId;
            newJobLoaded();
        } else if (type === "DELETE") {
            currentJobBookmarks = currentJobBookmarks.filter((bookmark) => bookmark.id !== value);
            chrome.storage.sync.set({ [currentJob]: JSON.stringify(currentJobBookmarks) });

            response(currentJobBookmarks);
        }
    });

    const fetchBookmarks = () => {
        return new Promise((resolve) => {
            chrome.storage.sync.get([currentJob], (obj) => {
                resolve(obj[currentJob]? JSON.parse(obj[currentJob]) : []);
            });
        });
    }

    const newJobLoaded = async () => {
        const bookmarkBtnExists = document.getElementById("bookmark-btn");
        console.log(bookmarkBtnExists);
        currentJobBookmarks = await fetchBookmarks();
        //console.log(bookmarkBtnExists);
        if (!bookmarkBtnExists) {
            const bookmarkBtn = document.createElement("img");
            bookmarkBtn.src = chrome.runtime.getURL("assets/bookmark.png");
            bookmarkBtn.id = "bookmark-btn";
            bookmarkBtn.title = "Click to bookmark current job";
            console.log(document);
            console.log(bookmarkBtn);
            console.log(document.getElementById("ember29"));
            console.log(document.querySelector('.jobs-unified-top-card'));
            console.log(document.body.getElementsByClassName("jobs-unified-top-card__buttons-container")[0]);
            console.log(document.body.getElementsByClassName("jobs-unified-top-card__job-title")[0]);
            console.log(document.body.getElementsByClassName("display-flex justify-flex-end")[0]);
            
            bookmarkBtn.addEventListener("click", addNewBookmarkEventHandler);
        }
    }

    newJobLoaded();

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
