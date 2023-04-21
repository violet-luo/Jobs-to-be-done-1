import { getActiveTabURL } from "./utils.js";

let activeTab;
let currentJobBookmarks;

// const applicationNumElement = document.createElement("div");
// applicationNumElement.className = "app-num";
// applicationNumElement.textContent = '2 Applications';
// document.body.prepend(applicationNumElement);

// adding a new bookmark row to the popup
const addNewBookmark = (bookmarksElement, bookmark) => {
    const bookmarkTitleElement = document.createElement("div");
    const bookmarkCompanyElement = document.createElement("div");
    const newBookmarkElement = document.createElement("div");
    const controlsElement = document.createElement("div");

    const date = new Date(bookmark.time);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    
    bookmarkTitleElement.textContent = bookmark.title;
    bookmarkTitleElement.className = "bookmark-title";
    bookmarkCompanyElement.textContent = bookmark.company + "· \n" + formattedDate;
    bookmarkCompanyElement.className = "bookmark-company";

    controlsElement.className = "bookmark-controls";

    newBookmarkElement.id = "bookmark-"+bookmark.id;
    newBookmarkElement.className = "bookmark";
    newBookmarkElement.setAttribute("timestamp", bookmark.time);
    newBookmarkElement.setAttribute("url", bookmark.url);
    newBookmarkElement.setAttribute("jobId", bookmark.id);
    newBookmarkElement.setAttribute("site", bookmark.site);

    setBookmarkAttributes("go", onGo, controlsElement);
    setBookmarkAttributes("delete", onDelete, controlsElement);

    newBookmarkElement.appendChild(bookmarkTitleElement);
    newBookmarkElement.appendChild(bookmarkCompanyElement);
    newBookmarkElement.appendChild(controlsElement);
    bookmarksElement.appendChild(newBookmarkElement);
};

const viewBookmarks = (currentBookmarks=[]) => {
    const bookmarksElement = document.getElementById("bookmarks");
    const applicationNumElement = document.createElement("div");
    const inspireElement = document.createElement("div");
    bookmarksElement.innerHTML = "";
    applicationNumElement.className = "app-num";
    inspireElement.className = "inspire";
    console.log(currentBookmarks)
    if (currentBookmarks.length > 0) {
        for (let i = 0; i < currentBookmarks.length; i++) {
            const bookmark = currentBookmarks[i];
            addNewBookmark(bookmarksElement, bookmark);
        } 

        applicationNumElement.textContent = currentBookmarks.length + " Applications";
        document.body.prepend(applicationNumElement);

        inspireElement.textContent = "🙌🏻 Start your day by applying 5 jobs today - You can do it!";
        document.body.prepend(inspireElement);
    } else {
        bookmarksElement.innerHTML = '<i class="row">No bookmarks yet.</i>';
    }
};

const onGo = e => {
    const bookmarkElement = e.target.parentElement.parentElement;
    const url = bookmarkElement.getAttribute("url");
    chrome.tabs.create({ url: url });
};

const onDelete = e => {
    const bookmarkId = e.target.parentElement.parentElement.getAttribute("jobId");
    const site = e.target.parentElement.parentElement.getAttribute("site");
    const bookmarkElementToDelete = document.getElementById("bookmark-"+bookmarkId);
    bookmarkElementToDelete.parentNode.removeChild(bookmarkElementToDelete);
    console.log(bookmarkId)
    console.log(typeof bookmarkId)
    
    chrome.tabs.sendMessage(activeTab.id, { 
        type: "DELETE", 
        jobSite: site,
        jobId: bookmarkId
    }, viewBookmarks);
};

const setBookmarkAttributes =  (src, eventListener, controlParentElement) => {
    const controlElement = document.createElement("img");
    controlElement.src = "assets/" + src + ".png";
    controlElement.title = src;
    controlElement.addEventListener("click", eventListener);
    controlParentElement.appendChild(controlElement);
};

document.addEventListener("DOMContentLoaded", async () => {
    console.log("DOMContentLoaded");
    activeTab = await getActiveTabURL();
    var currentJob = null;
    if (activeTab.url.includes("linkedin.com/jobs/view/")) {
        currentJob = activeTab.url.split("/")[5];
    } else if (activeTab.url.includes("jobs.lever.co/")) {
        currentJob = activeTab.url.split("/")[4];
    }
    console.log(currentJob);
    if (currentJob) {
        chrome.storage.sync.get().then((obj) => {
            console.log(obj)
            console.log(Object.values(obj));
            currentJobBookmarks = obj? Object.values(obj).map(x=>JSON.parse(x)) : [];
            console.log(currentJobBookmarks);
            // viewBookmarks
            viewBookmarks(currentJobBookmarks);
        }, (error) => {
            console.log(`Error: ${error}`);
        });
    } else {
        const container = document.getElementsByClassName("container")[0];
        container.innerHTML = '<div class="title">This is not a job site.</div>';
        //console.log("Not a job viewing page");
    }
});
