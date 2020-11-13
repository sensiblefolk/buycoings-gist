const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];


document.addEventListener('DOMContentLoaded', async function () {
  await initialize();
})

let avatarUrl = document.getElementById('avatarurl');
let userDetail = document.getElementById('userdetail');
let searchSummary = document.querySelector('.search-summary');
let container = document.querySelector('.container');
let loader = document.querySelector('.loader');
let repository = document.querySelector('.tab-content');
let repoCount = document.getElementById('repo-count');

let user = userDetail.children[0].children;

async function initialize() {
  const userData = await getGithubUser();
  const totalCount = userData?.repositories?.totalCount;

  // add .hide class to loader and remove .hide class from 
  // container
  loader.classList.add('hide');
  loader.children[0].classList.add('hide');
  container.classList.remove("hide");
 
  avatarUrl.setAttribute('src', userData.avatarUrl);
  user[0].innerHTML = userData.name;
  user[1].innerHTML = userData.login;
  userDetail.children[1].innerHTML = userData.bio;
  repoCount.innerHTML = totalCount

  // search summary data
  addSearchSummary(totalCount, 'public');

  // iterate through userData and add repository information
  userData.repositories.nodes.forEach((repos) => {
    addRepository(repos);
  })
}

async function getGithubUser() {
  const query = `
    query {
      viewer {
        name
        avatarUrl
        email
        login
        bio
        repositories(last: 20, privacy: PUBLIC) {
          nodes {
            name
            projectsUrl
            stargazerCount
            forkCount
            updatedAt
            description
            languages (first: 2) {
              nodes {
                name
                color
              }
            }
          }
          totalCount
        }
      }
    }
  `;

  try {
    const user = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'bearer 27d0726e4e904e3227e26ff1c42cfd48349651b4'
      },
      body: JSON.stringify({
        query
      })
    });

    const userData = await user.json();
    return userData?.data?.viewer;
  } catch (error) {
    console.error('failed fetching user github data', error)
  }
}


function addRepository(repos) {
  const language = repos.languages.nodes.length > 0 ? repos.languages.nodes[0] : { name: 'Java', color: '#b07219'}
  const currentDate = new Date(repos.updatedAt);
  
  const updatedDate = `${months[currentDate.getMonth()]} ${currentDate.getDate()}`
  const child = `
    <div class="row space-between align-start repository">
          <div class="col">
            <a class="bold-text" href=${repos.projectsUrl}>${repos.name}</a>
            <div style="max-width: 600px;">
              <p class="light-text">${repos.description}</p>
            </div>
            <ul>
              <li>
                <span class="repo-language-color" style="background-color: ${language?.color}"></span>
                ${language?.name}
              </li>
              <li class="repository-icon">
                <svg aria-label="star" class="octicon octicon-star" viewBox="0 0 16 16" version="1.1" width="16" height="16"
                  role="img">
                  <path fill-rule="evenodd"
                    d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25zm0 2.445L6.615 5.5a.75.75 0 01-.564.41l-3.097.45 2.24 2.184a.75.75 0 01.216.664l-.528 3.084 2.769-1.456a.75.75 0 01.698 0l2.77 1.456-.53-3.084a.75.75 0 01.216-.664l2.24-2.183-3.096-.45a.75.75 0 01-.564-.41L8 2.694v.001z">
                  </path>
                  <span>${repos.stargazerCount}</span>
                </svg>
              </li>
              <li class="repository-icon">
                <svg aria-label="fork" class="octicon octicon-repo-forked" viewBox="0 0 16 16" version="1.1" width="16" height="16"
                  role="img">
                  <path fill-rule="evenodd"
                    d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878zm3.75 7.378a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm3-8.75a.75.75 0 100-1.5.75.75 0 000 1.5z">
                  </path>
                </svg>
                <span>${repos.forkCount}</span>
              </li>
              <li>Updated on ${updatedDate}</li>
            </ul>
          </div>
          <button class="repository-icon" type="button">
            <svg aria-label="star" viewBox="0 0 16 16" version="1.1" width="16" height="16"
              role="img">
              <path fill-rule="evenodd"
                d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25zm0 2.445L6.615 5.5a.75.75 0 01-.564.41l-3.097.45 2.24 2.184a.75.75 0 01.216.664l-.528 3.084 2.769-1.456a.75.75 0 01.698 0l2.77 1.456-.53-3.084a.75.75 0 01.216-.664l2.24-2.183-3.096-.45a.75.75 0 01-.564-.41L8 2.694v.001z">
              </path>
              <span>Star</span>
          </button>
        </div>
        <div><hr ></div>
  `;
  repository.children[2].insertAdjacentHTML('afterend', child)
}

function addSearchSummary(count, privacy) {
  searchSummary.innerHTML = `
    <strong>${count}</strong>&nbsp;results for&nbsp;<strong>${privacy}</strong>&nbsp; repositories
    <div>
      <hr>
    </div>    
  `
}

function printRepository(repository) {
  
}