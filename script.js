// ==================================================
// JOBIFY 2.0
// SEARCH + FILTERS + SAVED JOBS + LOCAL STORAGE
// ==================================================


// ================= ELEMENTS =================

const searchButton = document.getElementById("searchButton");

const keywordInput = document.getElementById("keywordInput");

const locationInput = document.getElementById("locationInput");

const jobCards = document.querySelectorAll(".job-card");

const filterButtons = document.querySelectorAll(".filter");

const resultsCount = document.getElementById("resultsCount");

const resetButton = document.getElementById("resetSearch");

const noResults = document.getElementById("noResults");

const savedContainer =
  document.getElementById("savedJobsContainer");

const savedTotal =
  document.getElementById("savedTotal");

const navSavedCount =
  document.getElementById("navSavedCount");


// ================= SAVED JOBS STORAGE =================

let savedJobs =
  JSON.parse(
    localStorage.getItem("jobifySavedJobs")
  ) || [];


// ================= CURRENT FILTER =================

let currentFilter = "all";


// ================= CREATE JOB ID =================

function getJobId(card) {

  const title =
    card.dataset.title;

  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

}


// ================= SAVE STORAGE =================

function saveToStorage() {

  localStorage.setItem(
    "jobifySavedJobs",
    JSON.stringify(savedJobs)
  );

}


// ================= UPDATE SAVED COUNT =================

function updateSavedCount() {

  const count = savedJobs.length;

  navSavedCount.textContent = count;

  savedTotal.textContent =
    count + (count === 1 ? " saved" : " saved");

}


// ================= UPDATE HEARTS =================

function updateHeartStates() {

  jobCards.forEach(function(card) {

    const button =
      card.querySelector(".save-btn");

    const jobId =
      getJobId(card);

    if (savedJobs.includes(jobId)) {

      button.textContent = "♥";

      button.classList.add("saved");

      button.setAttribute(
        "aria-label",
        "Remove saved job"
      );

    } else {

      button.textContent = "♡";

      button.classList.remove("saved");

      button.setAttribute(
        "aria-label",
        "Save job"
      );

    }

  });

}


// ================= SAVE / UNSAVE =================

jobCards.forEach(function(card) {

  const button =
    card.querySelector(".save-btn");

  const jobId =
    getJobId(card);


  button.addEventListener(
    "click",
    function() {

      if (savedJobs.includes(jobId)) {

        savedJobs =
          savedJobs.filter(function(id) {
            return id !== jobId;
          });

      } else {

        savedJobs.push(jobId);

      }


      saveToStorage();

      updateSavedCount();

      updateHeartStates();

      renderSavedJobs();

    }
  );

});


// ================= SEARCH =================

function performSearch() {

  const keyword =
    keywordInput.value
      .toLowerCase()
      .trim();

  const location =
    locationInput.value
      .toLowerCase()
      .trim();

  let visibleCount = 0;


  jobCards.forEach(function(card) {

    const title =
      card.dataset.title.toLowerCase();

    const company =
      card.dataset.company.toLowerCase();

    const jobLocation =
      card.dataset.location.toLowerCase();

    const type =
      card.dataset.type.toLowerCase();

    const skills =
      card.dataset.skills.toLowerCase();


    const searchableText =
      title +
      " " +
      company +
      " " +
      jobLocation +
      " " +
      type +
      " " +
      skills;


    const keywordMatch =
      keyword === "" ||
      searchableText.includes(keyword);


    const locationMatch =
      location === "" ||
      searchableText.includes(location);


    const filterMatch =
      currentFilter === "all" ||
      type === currentFilter;


    if (
      keywordMatch &&
      locationMatch &&
      filterMatch
    ) {

      card.style.display = "";

      visibleCount++;

    } else {

      card.style.display = "none";

    }

  });


  resultsCount.textContent =
    visibleCount +
    (
      visibleCount === 1
        ? " opportunity"
        : " opportunities"
    );


  if (visibleCount === 0) {

    noResults.classList.remove("hidden");

  } else {

    noResults.classList.add("hidden");

  }

}


// ================= SEARCH BUTTON =================

searchButton.addEventListener(
  "click",
  performSearch
);


// ================= ENTER KEY =================

keywordInput.addEventListener(
  "keydown",
  function(event) {

    if (event.key === "Enter") {
      performSearch();
    }

  }
);


locationInput.addEventListener(
  "keydown",
  function(event) {

    if (event.key === "Enter") {
      performSearch();
    }

  }
);


// ================= FILTERS =================

filterButtons.forEach(function(button) {

  button.addEventListener(
    "click",
    function() {

      filterButtons.forEach(function(btn) {

        btn.classList.remove("active");

      });


      button.classList.add("active");


      currentFilter =
        button.dataset.filter;


      performSearch();

    }
  );

});


// ================= RESET =================

resetButton.addEventListener(
  "click",
  function() {

    keywordInput.value = "";

    locationInput.value = "";

    currentFilter = "all";


    filterButtons.forEach(function(button) {

      button.classList.remove("active");

    });


    document
      .querySelector('.filter[data-filter="all"]')
      .classList.add("active");


    performSearch();

  }
);


// ================= POPULAR SEARCH =================

const popularTags =
  document.querySelectorAll(".popular-tag");


popularTags.forEach(function(tag) {

  tag.addEventListener(
    "click",
    function() {

      keywordInput.value =
        tag.dataset.search;

      locationInput.value = "";

      performSearch();

      document
        .getElementById("jobs")
        .scrollIntoView({
          behavior: "smooth"
        });

    }
  );

});


// ================= RENDER SAVED JOBS =================

function renderSavedJobs() {

  savedContainer.innerHTML = "";


  if (savedJobs.length === 0) {

    savedContainer.innerHTML = `

      <div class="empty-saved">

        <div class="empty-saved-icon">
          ♡
        </div>

        <h3>
          No saved jobs yet
        </h3>

        <p>
          Save opportunities you want to
          come back to later.
        </p>

      </div>

    `;

    return;

  }


  jobCards.forEach(function(card) {

    const jobId =
      getJobId(card);


    if (!savedJobs.includes(jobId)) {
      return;
    }


    const title =
      card.dataset.title;

    const company =
      card.dataset.company;

    const location =
      card.dataset.location;

    const type =
      card.querySelector(".job-type").textContent;


    const salary =
      card.querySelector(".job-bottom strong").textContent;


    const savedCard =
      document.createElement("article");


    savedCard.className =
      "saved-job";


    savedCard.innerHTML = `

      <div class="saved-job-top">

        <span>
          ${type}
        </span>

        <button
          class="remove-saved"
          type="button"
        >
          Remove
        </button>

      </div>


      <h3>
        ${title}
      </h3>


      <p class="saved-company">
        ${company}
      </p>


      <div class="saved-info">

        <strong>
          ${salary}
        </strong>

        <span>
          ${location}
        </span>

      </div>

    `;


    const removeButton =
      savedCard.querySelector(
        ".remove-saved"
      );


    removeButton.addEventListener(
      "click",
      function() {

        savedJobs =
          savedJobs.filter(
            function(id) {
              return id !== jobId;
            }
          );


        saveToStorage();

        updateSavedCount();

        updateHeartStates();

        renderSavedJobs();

      }
    );


    savedContainer.appendChild(
      savedCard
    );

  });

}


// ================= INITIALIZE =================

updateSavedCount();

updateHeartStates();

renderSavedJobs();

performSearch();
