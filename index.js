import "alpinejs";

function getAppMountElement(htmlId, xData, xInit) {
  let domElement = document.getElementById(htmlId);
  if (!domElement) {
    domElement = document.createElement("div");
    domElement.id = htmlId;
    if (typeof xData !== "undefined" && xData !== null) {
      var att = document.createAttribute("x-data"); // Add x-data attribute
      att.value = JSON.stringify(xData);
      domElement.setAttributeNode(att);

      if (typeof xInit === "string" && xInit !== null) {
        var att2 = document.createAttribute("x-init"); // Add x-init attribute
        att2.value = xInit;
        domElement.setAttributeNode(att2);
      }
    }
    document.body.appendChild(domElement);
  }
  return domElement;
}

function mount(id, { template, xData, xInit }) {
  const domEl = getAppMountElement(id, xData, xInit);
  domEl.innerHTML = template();
}

function templateApp1() {
  return `
<div class="mui-panel" x-data="{ open: false }">
    <div class="mui--test-display1"> Test x-show</div>
    <button class="mui-btn mui-btn--primary" @click="open = !open">Open/Close</button>
    <div x-show="open" class="mui--text-display4">
        Hey, I'm open
    </div>
</div>
`;
}

function templateApp2() {
  return `
  <div class="mui-panel">
      <div class="mui--test-display1"> Test x-show</div>
      <button class="mui-btn mui-btn--primary" @click="open = !open">Open/Close</button>
      <div x-show="open" class="mui--text-display4">
          Hey, I'm open
      </div>
  </div>
  `;
}

function templateApp3() {
  return `
    <div class="w-full h-full text-gray-800">
        <h1 class="mt-0 mb-3 font-light text-3xl" x-text="title"><!-- title text --></h1>
        <p class="text-xl text-gray-600 font-light mb-4" x-html="intro"><!-- intro text --></p>
        <div class="flex flex-wrap -mx-2 pb-8">
        <!-- begin: user card -->
        <template x-for="user in users" :key="user.id">
            <div class="w-full md:w-1/2 lg:w-1/3 xl:w-1/4 h-auto font-light">
            <div class="flex bg-white rounded-lg shadow-md m-2 border-l-4 border-white hover:shadow-2xl hover:border-pink-500 cursor-pointer relative">
                <div class="p-4 pr-6 leading-normal">
                <div class="font-medium text-xl truncate" x-text="user.name"></div>
                <div class="truncate uppercase text-xs text-gray-500 font-semibold pb-2 tracking-widest" x-text="user.company.name"></div>
                <div class="" x-text="user.phone"></div>
                <a class="text-blue-600 hover:text-blue-700 mr-4 block" x-bind:href="'mailto:' + user.email" x-text="user.email"></a>     
                <a class="text-blue-600 hover:text-blue-700 block" x-bind:href="'https://' + user.website" x-text="user.website"></a>
                </div>
            </div>
            </div>
        </template>
        <!-- end: user card -->
        </div>
    </div>
    `;
}

// check if the app is mounted 
module.exports.isMountedApp = function isMounted(id) {
  const domEl = document.getElementById(id);
  return domEl && domEl.innerHTML.length > 0;
};

// unmount the app
module.exports.unmountApp = function unmountApp(id) {
  const domEl = document.getElementById(id);
  if (domEl) {
    domEl.remove();
  }
};

// --- APP 1 -----

module.exports.mountApp1 = function mountApp1() {
  const id = "app1";
  return mount(id, { template: templateApp1 });
};

// --- APP 2 -----

module.exports.mountApp2 = function mountApp2() {
  const id = "app2";
  return mount(id, { template: templateApp2, xData: { open: false } });
};

const App2Data = {
  title: "Alpine.js Landing Page",
  intro:
    'Implement a simple <code class="text-md text-pink-600">fetch()</code> request to render a list of items using Alpine.js :)',
  users: [],
  open: false,
  name,
};

// Needs the function to be global
window.fetchUsers = function () {
  return fetch("https://jsonplaceholder.typicode.com/users")
    .then((response) => response.json())
    .then((data) => (document.querySelector('#app3').__x.$data.users = data));
};

module.exports.mountApp3 = function mountApp2() {
  const id = "app3";
  return mount(id, {
    template: templateApp3,
    xData: App2Data,
    xInit: "fetchUsers()",
  });
};