"use strict";
(() => {
  var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
    get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
  }) : x)(function(x) {
    if (typeof require !== "undefined") return require.apply(this, arguments);
    throw Error('Dynamic require of "' + x + '" is not supported');
  });

  // src/components/index.tsx
  var import_jsx_runtime = __require("react/jsx-runtime");
  var MyButton = () => {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { children: "This is the update!" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Latest" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", { children: " Hello World" })
    ] });
  };
  var components_default = MyButton;
})();
//# sourceMappingURL=index.js.map
