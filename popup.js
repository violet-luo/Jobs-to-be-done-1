import { getActiveTabURL } from "./utils.js";

let activeTab;
let currentJobBookmarks;
// adding a new bookmark row to the popup
const addNewBookmark = (bookmarksElement, bookmark) => {
    const bookmarkTitleElement = document.createElement("div");
    const newBookmarkElement = document.createElement("div");
    const controlsElement = document.createElement("div");
    
    bookmarkTitleElement.textContent = bookmark.company + "\n" + bookmark.title;
    bookmarkTitleElement.className = "bookmark-title";

    controlsElement.className = "bookmark-controls";

    newBookmarkElement.id = "bookmark-"+bookmark.id;
    newBookmarkElement.className = "bookmark";
    newBookmarkElement.setAttribute("timestamp", bookmark.time);
    newBookmarkElement.setAttribute("url", bookmark.url);
    newBookmarkElement.setAttribute("jobId", bookmark.id);

    setBookmarkAttributes("go", onGo, controlsElement);
    setBookmarkAttributes("delete", onDelete, controlsElement);

    newBookmarkElement.appendChild(bookmarkTitleElement);
    newBookmarkElement.appendChild(controlsElement);
    bookmarksElement.appendChild(newBookmarkElement);
};

const viewBookmarks = (currentBookmarks=[]) => {
    const bookmarksElement = document.getElementById("bookmarks");
    bookmarksElement.innerHTML = "";
    if (currentBookmarks.length > 0) {
        for (let i = 0; i < currentBookmarks.length; i++) {
            const bookmark = currentBookmarks[i];
            addNewBookmark(bookmarksElement, bookmark);
        } 
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
    const bookmarkElementToDelete = document.getElementById("bookmark-"+bookmarkId);
    bookmarkElementToDelete.parentNode.removeChild(bookmarkElementToDelete);
    console.log(bookmarkId)
    console.log(typeof bookmarkId)
    
    chrome.tabs.sendMessage(activeTab.id, { 
        type: "DELETE", 
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
    activeTab = await getActiveTabURL();
    const currentJob = activeTab.url.split("/")[5];
    console.log(currentJob);
    if (activeTab.url.includes("linkedin.com/jobs/view/") && currentJob) {
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
        const container = document.getElementById("container")[0];
        container.innerHTML = '<div class="title">This is not a LinkedIn job viewing page.</div>';
        //console.log("Not a job viewing page");
    }
});
