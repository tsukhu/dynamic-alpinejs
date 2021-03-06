import "alpinejs";

function normalizeString(str) {
  return str.replace(/[^a-z0-9,. ]/gi, '_')
}

function wrap(htmlId, domEl) {
  // get base
  let domElement = document.getElementById(htmlId);
  if (!domElement) {
    domElement = document.createElement("div");
    domElement.id = htmlId;
  }
  domElement.appendChild(domEl);
  document.body.appendChild(domElement);
}

function getAppMountElement(htmlId, xData, xInit, props) {
  return Promise.resolve()
    .then(() => {
      if (xData) {
        return typeof xData === "function" ? xData({ ...props }) : xData;
      } else {
        return {};
      }
    })
    .then((originalData) => {
      const { name } = props;
      const domElement = document.createElement("div");
      domElement.id = `alpine-${name}`;
      const finalData = Object.assign({}, props, originalData);
      domElement.setAttribute("x-data", JSON.stringify(finalData));
      if (typeof xInit === "string" && xInit !== null) {
        domElement.setAttribute("x-init", xInit);
      }
      return domElement;
    });
}

function mount({ template, xData, xInit }, props) {
  Promise.resolve()
    .then(() => {
      let domEl;
      const { name } = props;
      if (xInit) {
        if (window.hasOwnProperty("xInitFn")) {
          window.xInitFn[normalizeString(name)] = xInit;
        } else {
          window.xInitFn = { [normalizeString(name)]: xInit };
        }
        domEl = getAppMountElement(
          name,
          xData,
          `xInitFn.${normalizeString(name)}('alpine-${name}')`,
          {
            ...props,
          }
        );
      } else domEl = getAppMountElement(name, xData, xInit, { ...props });
      return domEl;
    })
    .then((finalDomEl) => {
      console.log(finalDomEl);
      const { name } = props;
      finalDomEl.innerHTML = template();
      wrap(name, finalDomEl);
    });
}

// check if the app is mounted
module.exports.isMountedApp = function isMounted(id) {
  const domEl = document.getElementById(id);
  return domEl && domEl.innerHTML.length > 0;
};

// unmount the app
module.exports.unmountApp = function unmountApp(id) {
  if (window.hasOwnProperty("xInitFn")) {
    delete window.xInitFn[`${normalizeString(id)}`];
  }
  const domEl = document.getElementById(`${id}`);
  if (domEl) {
    domEl.innerHTML = "";
  }
};

// --- APP 1 -----

function templateApp1() {
  return `
  <div class="mui-panel" x-data="{ open: false }">
      <div class="mui--test-display1"> Test x-show - App 1</div>
      <button class="mui-btn mui-btn--primary" @click="open = !open">Open/Close</button>
      <div x-show="open" class="mui--text-display4">
          Hey, I'm open
      </div>
      <div x-data="{}">
        Trigger 1
        <button @click="$dispatch('flash', { level: 'info', msg: 'This is an info message' })" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-1">
          Flash Info
        </button>
      </div>
      <div x-data="{}">
        Trigger 2
        <button @click="$dispatch('flash', { level: 'error', msg: 'This is an error message' })" class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded m-1">
          Flash Error
        </button>
      </div>
      <div x-data="{}">
        Trigger 3
        <button @click="$dispatch('flash', { level: '', msg: '' })" class="font-bold py-2 px-4 border rounded m-1">
          Clear Flash
        </button>
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
  <div class="rounded overflow-hidden shadow-lg font-sans p-1 m-1">
      <div class="font-bold p-1"> Test x-show - App 2</div>
      <button class="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded" @click="open = !open">Open/Close</button>
      <div x-show="open" class="text-4xl">
          Hey, I'm open
      </div>
      <div x-data="{ msg: '', level: '', timeoutId: null }">
        Flash Component
        <template x-on:flash.window="msg = $event.detail.msg; level = $event.detail.level; if (timeoutId){clearTimeout(timeoutId);} timeoutId = setTimeout(() => {msg= ''; level= '';},3000)"></template>
        <template x-if="msg && level">
          <div role="alert" class="mt-2"
            x-transition:enter="transition ease-out duration-300"
            x-transition:enter-start="opacity-0 transform scale-90"
            x-transition:enter-end="opacity-100 transform scale-100"
            x-transition:leave="transition ease-in duration-300"
            x-transition:leave-start="opacity-100 transform scale-100"
            x-transition:leave-end="opacity-0 transform scale-90"
          >
            <div class="text-white font-bold rounded-t px-4 py-2 capitalize" :class="{'bg-red-500': level === 'error', 'bg-blue-500': level === 'info'}" x-text="level">
            </div>
            <div class="border border-t-0 rounded-b px-4 py-3" :class="{'bg-red-100 text-red-700 border-red-400': level === 'error', 'bg-blue-100 text-blue-700 border-blue-400': level === 'info'}">
              <p x-text="msg"></p>
            </div>
          </div>
        </template>
      </div>
  </div>
  `;
}

function xDataFn(props) {
  var promise = new Promise(function (resolve, reject) {
    resolve({ open: false });
  });

  return promise;
}

module.exports.mountApp2 = function mountApp2() {
  const opts = {
    template: templateApp2,
    xData: xDataFn,
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

const App3Data = ({ title, name }) => ({
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
    .then((data) => (document.getElementById(`${id}`).__x.$data.users = data));
};

module.exports.mountApp3 = function mountApp3() {
  const opts = {
    template: templateApp3,
    xData: (data) => App3Data(data), // pass props to x-data
    xInit: myFunc,
  };
  const props = { name: "@my/app3", title: "Alpine.js Landing Page" };
  return mount(opts, props);
};

// --- APP4 ---
// Reference :JEFFREY WAY https://gist.github.com/JeffreyWay/0aff02a63ffd87b59b1a343fee7a803d

function templateApp4() {
  return `
  <div x-data="{ show: false }" @click.away="show = false" class="mx-2">
  <button @click="show = ! show" class="font-medium" >Links</button>

  <div class="absolute bg-black text-white py-2 rounded mt-1"
       x-show="show"
       x-transition:enter="transition duration-200 transform ease-out"
       x-transition:enter-start="scale-75"
       x-transition:leave="transition duration-100 transform ease-in"
       x-transition:leave-end="opacity-0 scale-90"
  >
      <a class="block hover:bg-gray-800 text-xs py-px px-4 hover:no-underline" href="#">Edit</a>
      <a class="block hover:bg-gray-800 text-xs py-px px-4 hover:no-underline" href="#">Delete</a>
      <a class="block hover:bg-gray-800 text-xs py-px px-4 hover:no-underline" href="#">Report Spam</a>
  </div>
</div>
    `;
}

module.exports.mountApp4 = function mountApp4() {
  const opts = {
    template: templateApp4,
  };
  const props = { name: "app4" };
  return mount(opts, props);
};
