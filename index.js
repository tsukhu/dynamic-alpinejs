import "alpinejs";

function getAppMountElement(htmlId, xData, xInit, props) {
  let domElement = document.getElementById(htmlId);
  if (!domElement) {
    domElement = document.createElement("div");
    domElement.id = htmlId;
    const typeofXData = typeof xData;
    console.log(typeofXData);
    if (typeof xData !== "undefined" && xData !== null) {
      var att = document.createAttribute("x-data"); // Add x-data attribute
      if (typeofXData === "function") {
        att.value = JSON.stringify(xData({...props}));
      } else att.value = JSON.stringify(xData);
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

function mount({ template, xData, xInit },props) {
  let domEl;
  const { name } = props;
  console.log(name);
  if (xInit) {
    if (window.hasOwnProperty("xInitFn")) {
      window.xInitFn = { ...window.xInitFn, [name]: xInit };
    } else {
      window.xInitFn = { [name]: xInit };
    }
    domEl = getAppMountElement(name, xData, `xInitFn.${name}('${name}')`, {...props});
  } else domEl = getAppMountElement(name, xData, xInit, {...props});

  domEl.innerHTML = template();
}

// check if the app is mounted
module.exports.isMountedApp = function isMounted(id) {
  const domEl = document.getElementById(id);
  return domEl && domEl.innerHTML.length > 0;
};

// unmount the app
module.exports.unmountApp = function unmountApp(id) {
  if (window.hasOwnProperty("xInitFn")) {
    delete window.xInitFn[`${id}`];
  }
  const domEl = document.getElementById(id);
  if (domEl) {
    domEl.remove();
  }
};

// --- APP 1 -----

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

module.exports.mountApp1 = function mountApp1() {
  const opts = {
    template: templateApp1,
  };
  const props = { name: "app1" };
  return mount(opts, props);
};

// --- APP 2 -----

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

module.exports.mountApp2 = function mountApp2() {
  const opts = {
    template: templateApp2,
    xData: { open: false },
    xInit: () => console.log("xInit"),
  };
  const props = { name: "app2" };
  return mount(opts, props);
};

// --- APP3 ---

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

const App3Data = ({ title }) => ({
  title,
  intro:
    'Implement a simple <code class="text-md text-pink-600">fetch()</code> request to render a list of items using Alpine.js :)',
  users: [],
  open: false,
  name,
});

const myFunc = (id) => {
  return fetch("https://jsonplaceholder.typicode.com/users")
    .then((response) => response.json())
    .then((data) => (document.querySelector(`#${id}`).__x.$data.users = data));
};

module.exports.mountApp3 = function mountApp3() {
  const opts = {
    template: templateApp3,
    xData: (data) => App3Data(data), // pass props to x-data
    xInit: myFunc,
  };
  const props = { name: "app3", title: "Alpine.js Landing Page" };
  return mount(opts, props);
};
