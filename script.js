const modal = document.getElementById("modal");
const modalShow = document.getElementById("show-modal");
const modalClose = document.getElementById("close-modal");
const bookmarkForm = document.getElementById("bookmark-form");
const websiteNameEl = document.getElementById("website-name");
const websiteUrlEl = document.getElementById("website-url");
const bookmarksContainer = document.getElementById("bookmarks-container");

let bookmarks = {};

// Show modal, Focus on the first input
const showModal = () => {
  modal.classList.add("show-modal");
  websiteNameEl.focus();
};

// Modal event listener
modalShow.addEventListener("click", showModal);
modalClose.addEventListener("click", () =>
  modal.classList.remove("show-modal")
);
window.addEventListener("click", (e) => {
  e.target === modal ? modal.classList.remove("show-modal") : false;
});

// Validate form
const validate = (nameValue, urlValue) => {
  const expression = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
  const regex = new RegExp(expression);
  if (!nameValue || !urlValue) {
    alert("Please submit values for both fields.");
    return false;
  }
  if (!urlValue.match(regex)) {
    alert("Please provide a valid web address");
    return false;
  }
  //   Valid
  return true;
};

// Build bookmarks DOM
const buildBookmarks = () => {
  // Remove all bookmarks
  bookmarksContainer.textContent = "";
  // Build elements
  Object.keys(bookmarks).forEach((id) => {
    const { name, url } = bookmarks[id];
    // Item
    const item = document.createElement("div");
    item.classList.add("item");
    // Close icon
    const closeIcon = document.createElement("i");
    closeIcon.classList.add("fas", "fa-times");
    closeIcon.setAttribute("title", "Delete Bookmark");
    closeIcon.setAttribute("onclick", `deleteBookmark('${id}')`);
    // Favicon / Link container
    const linkInfo = document.createElement("div");
    linkInfo.classList.add("name");
    // Favicon
    const favicon = document.createElement("img");
    favicon.setAttribute(
      "src",
      `https://s2.googleusercontent.com/s2/favicons?domain=${url}`
    );
    favicon.setAttribute("alt", "Favicon");
    // Link
    const link = document.createElement("a");
    link.setAttribute("href", `${url}`);
    link.setAttribute("target", "_blank");
    link.textContent = name;
    // Append to bookmarks container
    linkInfo.append(favicon, link);
    item.append(closeIcon, linkInfo);
    bookmarksContainer.appendChild(item);
  });
};

// Fetch bookmarks
const fetchBookmarks = () => {
  // Get bookmarks from local storage if avaliable
  if (localStorage.getItem("bookmarks")) {
    bookmarks = JSON.parse(localStorage.getItem("bookmarks"));
  } else {
    // Create bookmars array in localStorage
    const id = `https://jacint-udvarlaki.co.uk/`;
    bookmarks[id] = {
      name: "Jacint Udvarlaki",
      url: "https://jacint-udvarlaki.co.uk/",
    };
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  }
  buildBookmarks();
};

// Delete bookmark
const deleteBookmark = (id) => {
  if (bookmarks[id]) {
    delete bookmarks[id];
  }
  // Update bookmarks array in localStorage, re-populate DOM
  localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  fetchBookmarks();
};

const storeBookmark = (e) => {
  e.preventDefault();
  const nameValue = websiteNameEl.value;
  let urlValue = websiteUrlEl.value;
  if (!urlValue.includes("https://") && !urlValue.includes("http://")) {
    urlValue = `https://${urlValue}`;
  }
  if (!validate(nameValue, urlValue)) {
    return false;
  }
  const bookmark = {
    name: nameValue,
    url: urlValue,
  };
  bookmarks[urlValue] = bookmark;
  localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  fetchBookmarks();
  bookmarkForm.reset();
  websiteNameEl.focus();
};

// Event listener
bookmarkForm.addEventListener("submit", storeBookmark);

// On load fetch bookmarks
fetchBookmarks();
