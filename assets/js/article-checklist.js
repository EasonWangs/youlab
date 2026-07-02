(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  ready(function () {
    var content = document.querySelector(".research_detail .v_news_content");
    if (!content) {
      return;
    }

    var storageKey = "article-checklist:" + location.pathname;
    var saved = {};

    try {
      saved = JSON.parse(localStorage.getItem(storageKey) || "{}");
    } catch (error) {
      saved = {};
    }

    var items = [];
    var progress = document.createElement("div");
    progress.className = "article-progress";
    progress.setAttribute("aria-hidden", "true");
    progress.innerHTML = '<div class="article-progress__track"><span class="article-progress__bar"></span></div><span class="article-progress__count">0/0</span>';
    content.insertBefore(progress, content.firstChild);

    var count = progress.querySelector(".article-progress__count");

    buildSections();

    var numberedItems = Array.prototype.slice.call(content.querySelectorAll("p")).filter(function (node) {
      return node.tagName === "P" && node.firstElementChild && node.firstElementChild.tagName === "STRONG";
    });
    var questionItems = Array.prototype.slice.call(content.querySelectorAll("li"));

    numberedItems.forEach(function (item, index) {
      prepareItem(item, "check-" + index, "is-check-item");
    });

    questionItems.forEach(function (item, index) {
      prepareItem(item, "question-" + index, "is-question-item");
    });

    Array.prototype.slice.call(content.querySelectorAll(".article-section")).forEach(function (section) {
      syncSectionFocus(section, section.classList.contains("is-collapsed"));
    });

    content.classList.add("article-checklist-ready");
    updateProgress();

    function buildSections() {
      var headings = Array.prototype.slice.call(content.children).filter(function (node) {
        return node.tagName === "H4";
      });

      headings.forEach(function (heading, index) {
        var section = document.createElement("section");
        var body = document.createElement("div");
        var inner = document.createElement("div");
        var toggle = document.createElement("span");
        var id = "section-" + index;
        var bodyId = "article-section-body-" + index;
        var isCollapsed = saved[id] === true;

        section.className = "article-section";
        body.className = "article-section__body";
        inner.className = "article-section__inner";
        toggle.className = "article-section-toggle";
        toggle.setAttribute("aria-hidden", "true");
        body.id = bodyId;
        body.setAttribute("aria-hidden", isCollapsed ? "true" : "false");

        content.insertBefore(section, heading);
        section.appendChild(heading);
        section.appendChild(body);
        body.appendChild(inner);

        heading.setAttribute("role", "button");
        heading.setAttribute("tabindex", "0");
        heading.setAttribute("aria-controls", bodyId);
        heading.setAttribute("aria-expanded", isCollapsed ? "false" : "true");
        heading.appendChild(toggle);

        var next = section.nextSibling;
        while (next && !(next.nodeType === 1 && next.tagName === "H4")) {
          var current = next;
          next = next.nextSibling;
          inner.appendChild(current);
        }

        if (isCollapsed) {
          section.classList.add("is-collapsed");
        }

        heading.addEventListener("click", function () {
          toggleSection(section, heading, id);
        });

        heading.addEventListener("keydown", function (event) {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            toggleSection(section, heading, id);
          }
        });
      });
    }

    function prepareItem(item, id, className) {
      var toggle = document.createElement("span");
      toggle.className = "article-check-toggle";
      toggle.setAttribute("aria-hidden", "true");

      item.classList.add(className);
      item.setAttribute("role", "button");
      item.setAttribute("tabindex", "0");
      item.setAttribute("aria-pressed", saved[id] ? "true" : "false");
      item.dataset.checkId = id;
      item.appendChild(toggle);

      if (saved[id]) {
        item.classList.add("is-complete");
      }

      item.addEventListener("click", function (event) {
        if (event.target.tagName === "A") {
          return;
        }
        toggleItem(item);
      });

      item.addEventListener("keydown", function (event) {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          toggleItem(item);
        }
      });

      items.push(item);
    }

    function toggleItem(item) {
      var isComplete = !item.classList.contains("is-complete");
      item.classList.toggle("is-complete", isComplete);
      item.setAttribute("aria-pressed", isComplete ? "true" : "false");
      saved[item.dataset.checkId] = isComplete;

      try {
        localStorage.setItem(storageKey, JSON.stringify(saved));
      } catch (error) {
      }

      updateProgress();
    }

    function toggleSection(section, heading, id) {
      var isCollapsed = !section.classList.contains("is-collapsed");
      section.classList.toggle("is-collapsed", isCollapsed);
      heading.setAttribute("aria-expanded", isCollapsed ? "false" : "true");
      section.querySelector(".article-section__body").setAttribute("aria-hidden", isCollapsed ? "true" : "false");
      syncSectionFocus(section, isCollapsed);
      saved[id] = isCollapsed;

      try {
        localStorage.setItem(storageKey, JSON.stringify(saved));
      } catch (error) {
      }
    }

    function syncSectionFocus(section, isCollapsed) {
      Array.prototype.slice.call(section.querySelectorAll(".is-check-item, .is-question-item")).forEach(function (item) {
        item.setAttribute("tabindex", isCollapsed ? "-1" : "0");
      });
    }

    function updateProgress() {
      var complete = items.filter(function (item) {
        return item.classList.contains("is-complete");
      }).length;
      var total = items.length;
      var percent = total ? Math.round((complete / total) * 100) : 0;

      content.style.setProperty("--article-progress", percent + "%");
      count.textContent = complete + "/" + total;
    }
  });
})();
