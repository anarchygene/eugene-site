const repositoriesEndpoint = "https://api.github.com/users/anarchygene/repos?sort=updated&per_page=12";
const repoGrid = document.querySelector("#repo-grid");
const repoStatus = document.querySelector("#repo-status");
const currentYear = document.querySelector("#current-year");
const themeToggle = document.querySelector("#theme-toggle");

function updateThemeToggle() {
  const darkModeEnabled = document.body.classList.contains("dark");
  themeToggle.setAttribute("aria-pressed", String(darkModeEnabled));
  themeToggle.textContent = darkModeEnabled ? "Light mode" : "Dark mode";
}

if (sessionStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
}

updateThemeToggle();

themeToggle.addEventListener("click", () => {
  const darkModeEnabled = document.body.classList.toggle("dark");
  sessionStorage.setItem("theme", darkModeEnabled ? "dark" : "light");
  updateThemeToggle();
});

currentYear.textContent = new Date().getFullYear();

function createRepositoryCard(repository) {
  const article = document.createElement("article");
  article.className = "repo-card";

  const heading = document.createElement("h3");
  const link = document.createElement("a");
  link.href = repository.html_url;
  link.target = "_blank";
  link.rel = "noreferrer";
  link.textContent = repository.name;
  heading.append(link);

  const description = document.createElement("p");
  description.className = "repo-description";
  description.textContent = repository.description || "No description has been added on GitHub.";

  const metadata = document.createElement("div");
  metadata.className = "repo-meta";

  const language = document.createElement("span");
  language.className = "language";
  language.textContent = repository.language || "Language not specified";

  const stars = document.createElement("span");
  const starCount = repository.stargazers_count ?? 0;
  stars.textContent = `${starCount} ${starCount === 1 ? "star" : "stars"}`;
  stars.setAttribute("aria-label", `${starCount} ${starCount === 1 ? "star" : "stars"}`);

  metadata.append(language, stars);
  article.append(heading, description, metadata);
  return article;
}

async function loadRepositories() {
  try {
    const response = await fetch(repositoriesEndpoint, {
      headers: { Accept: "application/vnd.github+json" },
    });

    if (!response.ok) {
      throw new Error(`GitHub returned ${response.status}`);
    }

    const repositories = await response.json();

    if (!Array.isArray(repositories) || repositories.length === 0) {
      repoStatus.textContent = "No public repositories are available right now.";
      return;
    }

    const fragment = document.createDocumentFragment();
    repositories.forEach((repository) => fragment.append(createRepositoryCard(repository)));
    repoGrid.append(fragment);
    repoStatus.hidden = true;
  } catch (error) {
    console.error("Unable to load GitHub repositories:", error);
    repoStatus.textContent = "Repositories could not be loaded right now. Please visit GitHub using the link above.";
  }
}

loadRepositories();
