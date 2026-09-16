// node_modules/github-slugger/index.js

// node_modules/@quartz-community/utils/dist/path.js
function simplifySlug(fp) {
  const res = stripSlashes(trimSuffix(fp, "index"), true);
  return res.length === 0 ? "/" : res;
}
function joinSegments(...args) {
  if (args.length === 0) {
    return "";
  }
  let joined = args.filter((segment) => segment !== "" && segment !== "/").map((segment) => stripSlashes(segment)).join("/");
  const first = args[0];
  const last = args[args.length - 1];
  if (first?.startsWith("/")) {
    joined = "/" + joined;
  }
  if (last?.endsWith("/")) {
    joined = joined + "/";
  }
  return joined;
}
function endsWith(s2, suffix) {
  return s2 === suffix || s2.endsWith("/" + suffix);
}
function trimSuffix(s2, suffix) {
  if (endsWith(s2, suffix)) {
    s2 = s2.slice(0, -suffix.length);
  }
  return s2;
}
function stripSlashes(s2, onlyStripPrefix) {
  if (s2.startsWith("/")) {
    s2 = s2.substring(1);
  }
  if (!onlyStripPrefix && s2.endsWith("/")) {
    s2 = s2.slice(0, -1);
  }
  return s2;
}
function pathToRoot(slug2) {
  let rootPath = slug2.split("/").filter((x2) => x2 !== "").slice(0, -1).map((_2) => "..").join("/");
  if (rootPath.length === 0) {
    rootPath = ".";
  }
  return rootPath;
}
function resolveRelative(current, target) {
  const res = joinSegments(pathToRoot(current), simplifySlug(target));
  return res;
}

// node_modules/@quartz-community/utils/dist/sort.js
function getDate(data) {
  const defaultDateType = data.defaultDateType;
  if (!defaultDateType) {
    return void 0;
  }
  const dates = data.dates;
  return dates?.[defaultDateType];
}

// src/components/styles/timeline.scss
var timeline_default = ".timeline {\n  position: relative;\n  flex: 1 1 auto;\n  min-height: 0;\n  overflow-y: auto;\n  overscroll-behavior: contain;\n  box-sizing: border-box;\n  padding: 0.75rem 0 0.75rem 2.5rem;\n}\n\n.timeline-axis {\n  position: absolute;\n  left: 4rem;\n  top: 0;\n  bottom: 0;\n  width: 1px;\n  background-color: var(--lightgray);\n  pointer-events: none;\n}\n\n.timeline-node {\n  position: absolute;\n  left: 0;\n  right: 0;\n  height: 0;\n  display: block;\n  text-decoration: none;\n  color: inherit;\n  background-color: transparent;\n  padding: 0;\n  border-radius: 0;\n  line-height: 1;\n  font-weight: inherit;\n}\n\n.timeline-dot {\n  position: absolute;\n  top: 0;\n  left: 4rem;\n  width: 6px;\n  height: 6px;\n  transform: translate(-50%, -50%);\n  border-radius: 50%;\n  background-color: var(--secondary);\n  transition: transform 0.15s ease;\n}\n\n.timeline-node:hover .timeline-dot,\n.timeline-node:focus-visible .timeline-dot {\n  transform: translate(-50%, -50%) scale(1.4);\n  background-color: var(--tertiary);\n}\n\n.timeline-node[data-current=true] .timeline-dot {\n  outline: 2px solid var(--secondary);\n  outline-offset: 2px;\n}\n\n.timeline-title {\n  position: absolute;\n  top: 0;\n  left: calc(4rem + 0.65rem);\n  right: 0.5rem;\n  transform: translateY(-50%);\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  color: var(--darkgray);\n  font-size: 0.8rem;\n  font-weight: 600;\n  line-height: 1;\n  transition: color 0.15s ease;\n}\n\n.timeline-node:hover .timeline-title,\n.timeline-node:focus-visible .timeline-title {\n  color: var(--dark);\n}\n\n.timeline-month {\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: calc(4rem - 1.4rem);\n  transform: translateY(-50%);\n  text-align: right;\n  font-family: var(--codeFont, monospace);\n  font-size: 0.65rem;\n  color: var(--gray);\n  white-space: nowrap;\n  pointer-events: none;\n}\n\n@media (prefers-reduced-motion: reduce) {\n  .timeline-dot,\n  .timeline-title {\n    transition: none;\n  }\n}\n@media all and (max-width: 800px) {\n  .timeline {\n    display: none;\n  }\n}";

// src/components/scripts/timeline.inline.ts
var timeline_inline_default = 'var E="timelineZoom",v="timelineScrollTop";function p(t,o,i){return Math.max(o,Math.min(i,t))}var y=p(1,2,6);function g(){try{let t=sessionStorage.getItem(E),o=t?parseFloat(t):y;return Number.isFinite(o)?p(o,2,6):y}catch{return y}}function R(t){try{sessionStorage.setItem(E,String(t))}catch{}}function I(t,o){let i=Array.from(t.querySelectorAll(".timeline-node"));if(t.querySelectorAll(".timeline-month").forEach(e=>e.remove()),i.length===0){t.style.height="12px";return}let r=9.5*o,a=0,l=0,f=i.map(e=>{let s=parseInt(e.dataset.days,10)||0,n=parseInt(e.dataset.words,10)||0;return s>a&&(a=s),n>l&&(l=n),{node:e,days:s,words:n}}),h=e=>l<=0?3:3+8*p(Math.sqrt(e)/Math.sqrt(l),0,1),d=f.slice().sort((e,s)=>s.days-e.days),c=[],M,A;d.forEach(({node:e,days:s,words:n},u)=>{let m=h(n),S=12+(a-s)*r,_=u===0?Math.max(S,12+m):Math.max(S,M+A+m+3.6);c.push({node:e,y:_,r:m}),M=_,A=m});for(let{node:e,y:s,r:n}of c){e.style.top=`${s}px`;let u=e.querySelector(".timeline-dot");u&&(u.style.width=`${n*2}px`,u.style.height=`${n*2}px`)}for(let{node:e,y:s}of c){if(e.dataset.firstOfMonth!=="true")continue;let n=document.createElement("div");n.className="timeline-month",n.textContent=e.dataset.month||"",n.style.top=`${s}px`,t.appendChild(n)}let O=c[c.length-1];t.style.height=`${O.y+O.r+3.6}px`}function w(t){if(t.dataset.initialized==="true")return;t.dataset.initialized="true";let o=g();I(t,o);try{let r=sessionStorage.getItem(v);if(r!=null)t.scrollTop=parseInt(r,10)||0;else{let a=t.querySelector(\'.timeline-node[data-current="true"]\');if(a){let l=parseFloat(a.style.top)||0;t.scrollTop=Math.max(0,l-t.clientHeight/2)}}}catch{}let i=r=>{if(!r.ctrlKey&&!r.metaKey)return;r.preventDefault();let a=t.getBoundingClientRect(),l=r.clientY-a.top,f=t.scrollTop+l,h=r.deltaY<0?1.08:.92,d=p(o*h,2,6);if(d===o)return;let c=d/o;o=d,R(o),I(t,o),t.scrollTop=f*c-l};t.addEventListener("wheel",i,{passive:!1}),typeof window<"u"&&window.addCleanup&&window.addCleanup(()=>t.removeEventListener("wheel",i))}function D(){document.querySelectorAll(".timeline[data-timeline]").forEach(t=>{w(t)})}document.addEventListener("nav",D);document.addEventListener("render",D);document.addEventListener("prenav",()=>{let t=document.querySelector(".timeline[data-timeline]");if(t)try{sessionStorage.setItem(v,String(t.scrollTop))}catch{}});\n';
var l;
l = { __e: function(n2, l2, u3, t2) {
  for (var i2, r2, o2; l2 = l2.__; ) if ((i2 = l2.__c) && !i2.__) try {
    if ((r2 = i2.constructor) && null != r2.getDerivedStateFromError && (i2.setState(r2.getDerivedStateFromError(n2)), o2 = i2.__d), null != i2.componentDidCatch && (i2.componentDidCatch(n2, t2 || {}), o2 = i2.__d), o2) return i2.__E = i2;
  } catch (l3) {
    n2 = l3;
  }
  throw n2;
} }, "function" == typeof Promise ? Promise.prototype.then.bind(Promise.resolve()) : setTimeout, Math.random().toString(8);

// node_modules/preact/jsx-runtime/dist/jsxRuntime.mjs
var f2 = 0;
function u2(e2, t2, n2, o2, i2, u3) {
  t2 || (t2 = {});
  var a2, c2, p2 = t2;
  if ("ref" in p2) for (c2 in p2 = {}, t2) "ref" == c2 ? a2 = t2[c2] : p2[c2] = t2[c2];
  var l2 = { type: e2, props: p2, key: n2, ref: a2, __k: null, __: null, __b: 0, __e: null, __c: null, constructor: void 0, __v: --f2, __i: -1, __u: 0, __source: i2, __self: u3 };
  if ("function" == typeof e2 && (a2 = e2.defaultProps)) for (c2 in a2) void 0 === p2[c2] && (p2[c2] = a2[c2]);
  return l.vnode && l.vnode(l2), l2;
}

// src/components/Timeline.tsx
var defaultOptions = {
  folder: "posts"
};
var cachedForFiles;
var cachedEntries = [];
function buildEntries(allFiles, folder) {
  const prefix = `${folder}/`;
  const withDates = [];
  for (const file of allFiles) {
    const slug2 = file.slug;
    if (!slug2 || !slug2.startsWith(prefix)) continue;
    if (slug2.endsWith("/index")) continue;
    const date = getDate(file);
    if (!date) continue;
    withDates.push({ file, date });
  }
  return withDates.slice().sort((a2, b2) => b2.date.getTime() - a2.date.getTime());
}
function dayNumber(d2) {
  return Math.floor(d2.getTime() / 864e5);
}
var Timeline_default = ((userOpts) => {
  const opts = { ...defaultOptions, ...userOpts };
  const TimelineComponent = ({ fileData, allFiles }) => {
    if (cachedForFiles !== allFiles) {
      cachedEntries = buildEntries(allFiles, opts.folder);
      cachedForFiles = allFiles;
    }
    if (cachedEntries.length === 0) return null;
    const oldestDay = dayNumber(cachedEntries[cachedEntries.length - 1].date);
    const currentSlug = fileData.slug;
    const currentFullSlug = fileData.slug;
    let lastMonth;
    const nodes = cachedEntries.map(({ file, date }) => {
      const slug2 = file.slug;
      const days = dayNumber(date) - oldestDay;
      const words = (file.text ?? "").split(/\s+/).filter(Boolean).length;
      const month = `${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getFullYear() % 100).padStart(2, "0")}`;
      const isFirstOfMonth = month !== lastMonth;
      lastMonth = month;
      const title = file.frontmatter?.title ?? slug2;
      const href = resolveRelative(currentFullSlug, slug2);
      const isCurrent = slug2 === currentSlug;
      return /* @__PURE__ */ u2(
        "a",
        {
          class: "internal timeline-node",
          href,
          "data-days": days,
          "data-words": words,
          "data-month": month,
          "data-first-of-month": isFirstOfMonth ? "true" : "false",
          "data-current": isCurrent ? "true" : "false",
          children: [
            /* @__PURE__ */ u2("span", { class: "timeline-dot" }),
            /* @__PURE__ */ u2("span", { class: "timeline-title", children: title })
          ]
        },
        slug2
      );
    });
    return /* @__PURE__ */ u2("div", { class: "timeline", "data-timeline": true, children: [
      /* @__PURE__ */ u2("div", { class: "timeline-axis" }),
      nodes
    ] });
  };
  TimelineComponent.css = timeline_default;
  TimelineComponent.afterDOMLoaded = timeline_inline_default;
  return TimelineComponent;
});

export { Timeline_default as Timeline };
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map