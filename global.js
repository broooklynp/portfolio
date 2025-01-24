console.log('IT’S ALIVE!');

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

const ARE_WE_HOME = document.documentElement.classList.contains('home');
let pages = [
    { url: '', title: 'Home' },
    { url: 'projects/', title: 'Projects' },
    { url: 'contact/', title: 'Contact' },
    { url: 'resume/', title: 'Resume' },
    { url: 'https://github.com/broooklynp', title: 'Profile'}
];
let nav = document.createElement('nav');
document.body.prepend(nav);
for (let p of pages) {
    let url = p.url;
    if (!ARE_WE_HOME && !url.startsWith('http')) {
        url = '../' + url;
      }
    let title = p.title;
    let a = document.createElement('a');
    a.href = url;
    a.textContent = title;
    if (a.host === location.host && a.pathname === location.pathname) {
        a.classList.add('current');
    }
    if (!(a.host === location.host)) {
        a.target = "_blank";
    }
    nav.append(a);
}

document.body.insertAdjacentHTML(
    'afterbegin',
    `
      <label class="color-scheme">
          Theme:
          <select>
              <option value="light dark">Automatic (${matchMedia("(prefers-color-scheme: dark)").matches ? "Dark" : "Light"})</option>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
          </select>
      </label>`
  );

let select = document.querySelector("select");
select.addEventListener('input', function (event) {
    console.log('color scheme changed to', event.target.value);
    setColorScheme(event.target.value);
    localStorage.colorScheme = event.target.value;
});

if ("colorScheme" in localStorage) {
    setColorScheme(localStorage.colorScheme);
    select.value = localStorage.colorScheme;
}

function setColorScheme(colorScheme) {
    document.documentElement.style.setProperty('color-scheme', colorScheme);
}

let form = document.querySelector("form");
form?.addEventListener('submit', function (event) {
    event.preventDefault();
    let data = new FormData(form);
    let email_url = form.action + "?";
    for (let [name, value] of data) {
        email_url = email_url + "&" + encodeURIComponent(name) + "=" + encodeURIComponent(value);
        console.log(name, encodeURIComponent(value));
    }
    location.href = email_url;
});