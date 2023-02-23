(() => {
    let jobToprightControls;
    let currentJob = "";
    let currentJobBookmarks = [];

    chrome.runtime.onMessage.addListener((obj, sender, response) => {
        const { type, value, jobId } = obj;

        if (type === "NEW") {
            currentJob = jobId;
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
        console.log(currentJob)
        const bookmarkBtnExists = document.getElementById("bookmark-btn");
        jobToprightControls = document.getElementsByClassName("jobs-unified-top-card__buttons-container")[0];
        currentJobBookmarks = await fetchBookmarks();
        console.log(jobToprightControls)
        console.log(bookmarkBtnExists)
        if (jobToprightControls && !bookmarkBtnExists) {
            const bookmarkBtn = document.createElement("img");
            bookmarkBtn.src = chrome.runtime.getURL("assets/bookmark.png");
            bookmarkBtn.id = "bookmark-btn";
            bookmarkBtn.title = "Click to bookmark current job";
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
        chrome.storage.sync.get([currentJob],(result)=>{
            console.log(result)
            if (result[currentJob] === undefined) {
                chrome.storage.sync.set({
                    currentJob: JSON.stringify(newBookmark)
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
