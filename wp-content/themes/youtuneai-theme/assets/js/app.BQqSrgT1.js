const scriptRel = "modulepreload";
const assetsURL = function(dep, importerUrl) {
  return new URL(dep, importerUrl).href;
};
const seen = {};
const __vitePreload = function preload(baseModule, deps, importerUrl) {
  let promise = Promise.resolve();
  if (deps && deps.length > 0) {
    const links = document.getElementsByTagName("link");
    const cspNonceMeta = document.querySelector(
      "meta[property=csp-nonce]"
    );
    const cspNonce = (cspNonceMeta == null ? void 0 : cspNonceMeta.nonce) || (cspNonceMeta == null ? void 0 : cspNonceMeta.getAttribute("nonce"));
    promise = Promise.allSettled(
      deps.map((dep) => {
        dep = assetsURL(dep, importerUrl);
        if (dep in seen) return;
        seen[dep] = true;
        const isCss = dep.endsWith(".css");
        const cssSelector = isCss ? '[rel="stylesheet"]' : "";
        const isBaseRelative = !!importerUrl;
        if (isBaseRelative) {
          for (let i = links.length - 1; i >= 0; i--) {
            const link2 = links[i];
            if (link2.href === dep && (!isCss || link2.rel === "stylesheet")) {
              return;
            }
          }
        } else if (document.querySelector(`link[href="${dep}"]${cssSelector}`)) {
          return;
        }
        const link = document.createElement("link");
        link.rel = isCss ? "stylesheet" : scriptRel;
        if (!isCss) {
          link.as = "script";
        }
        link.crossOrigin = "";
        link.href = dep;
        if (cspNonce) {
          link.setAttribute("nonce", cspNonce);
        }
        document.head.appendChild(link);
        if (isCss) {
          return new Promise((res, rej) => {
            link.addEventListener("load", res);
            link.addEventListener(
              "error",
              () => rej(new Error(`Unable to preload CSS for ${dep}`))
            );
          });
        }
      })
    );
  }
  function handlePreloadError(err) {
    const e = new Event("vite:preloadError", {
      cancelable: true
    });
    e.payload = err;
    window.dispatchEvent(e);
    if (!e.defaultPrevented) {
      throw err;
    }
  }
  return promise.then((res) => {
    for (const item of res || []) {
      if (item.status !== "rejected") continue;
      handlePreloadError(item.reason);
    }
    return baseModule().catch(handlePreloadError);
  });
};
document.addEventListener("DOMContentLoaded", () => {
  console.log("🎵 YouTuneAI theme initialized");
  initializeNavigation();
  initializeAvatarChat();
  initializeVRCapabilities();
  initializeGames();
  if ("performance" in window && "observer" in window.PerformanceObserver.prototype) {
    observePerformance();
  }
});
function initializeNavigation() {
  const menuToggle = document.querySelector(".menu-toggle");
  const primaryMenu = document.querySelector("#primary-menu");
  if (menuToggle && primaryMenu) {
    menuToggle.addEventListener("click", () => {
      const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
      menuToggle.setAttribute("aria-expanded", !isExpanded);
      primaryMenu.classList.toggle("menu-open");
    });
  }
}
function initializeAvatarChat() {
  const options = youtuneaiData || {};
  if (options.enable_chat) {
    __vitePreload(async () => {
      const { ChatSystem } = await import("./ChatSystem.DQf9_PE_.js");
      return { ChatSystem };
    }, true ? [] : void 0, import.meta.url).then(({ ChatSystem }) => {
      new ChatSystem({
        container: "#avatar-chat-bubble",
        apiUrl: options.restUrl + "chat",
        avatarId: options.default_avatar || 0
      });
    });
  }
}
function initializeVRCapabilities() {
  const options = youtuneaiData || {};
  if (options.enable_vr && "xr" in navigator) {
    navigator.xr.isSessionSupported("immersive-vr").then((supported) => {
      if (supported) {
        __vitePreload(async () => {
          const { VRSystem } = await import("./VRSystem.AOUBluF3.js");
          return { VRSystem };
        }, true ? [] : void 0, import.meta.url).then(({ VRSystem }) => {
          new VRSystem();
        });
      }
    });
  }
}
function initializeGames() {
  const gameContainers = document.querySelectorAll(".game-container");
  gameContainers.forEach((container) => {
    const gameId = container.dataset.gameId;
    const platform = container.dataset.platform;
    if (platform && gameId) {
      __vitePreload(async () => {
        const { GameLoader } = await import("./GameLoader.3aZuqD-A.js");
        return { GameLoader };
      }, true ? [] : void 0, import.meta.url).then(({ GameLoader }) => {
        new GameLoader(container, { gameId, platform });
      });
    }
  });
}
function observePerformance() {
  const lcpObserver = new PerformanceObserver((entryList) => {
    for (const entry of entryList.getEntries()) {
      console.log("LCP:", entry.startTime);
    }
  });
  lcpObserver.observe({ entryTypes: ["largest-contentful-paint"] });
  let clsValue = 0;
  const clsObserver = new PerformanceObserver((entryList) => {
    for (const entry of entryList.getEntries()) {
      if (!entry.hadRecentInput) {
        clsValue += entry.value;
      }
    }
    console.log("CLS:", clsValue);
  });
  clsObserver.observe({ entryTypes: ["layout-shift"] });
  const fidObserver = new PerformanceObserver((entryList) => {
    for (const entry of entryList.getEntries()) {
      console.log("FID:", entry.processingStart - entry.startTime);
    }
  });
  fidObserver.observe({ entryTypes: ["first-input"] });
}
window.youtuneai = {
  // Utility functions available globally
  formatPrice: (price, currency = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency
    }).format(price);
  },
  // Lazy load images
  lazyLoad: (selector = "img[data-src]") => {
    const images = document.querySelectorAll(selector);
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.remove("lazy");
          imageObserver.unobserve(img);
        }
      });
    });
    images.forEach((img) => imageObserver.observe(img));
  },
  // Show notification
  notify: (message, type = "info") => {
    const notification = document.createElement("div");
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => notification.classList.add("show"), 100);
    setTimeout(() => {
      notification.classList.remove("show");
      setTimeout(() => notification.remove(), 300);
    }, 5e3);
  }
};
window.youtuneai.lazyLoad();
