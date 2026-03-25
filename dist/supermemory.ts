// @i-know-the-amp-plugin-api-is-wip-and-very-experimental-right-now
var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});

// node_modules/supermemory/internal/tslib.mjs
function __classPrivateFieldSet(receiver, state, value, kind, f) {
  if (kind === "m")
    throw new TypeError("Private method is not writable");
  if (kind === "a" && !f)
    throw new TypeError("Private accessor was defined without a setter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
    throw new TypeError("Cannot write private member to an object whose class did not declare it");
  return kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
}
__name(__classPrivateFieldSet, "__classPrivateFieldSet");
function __classPrivateFieldGet(receiver, state, kind, f) {
  if (kind === "a" && !f)
    throw new TypeError("Private accessor was defined without a getter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
    throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
}
__name(__classPrivateFieldGet, "__classPrivateFieldGet");

// node_modules/supermemory/internal/utils/uuid.mjs
var uuid4 = /* @__PURE__ */ __name(function() {
  const { crypto } = globalThis;
  if (crypto?.randomUUID) {
    uuid4 = crypto.randomUUID.bind(crypto);
    return crypto.randomUUID();
  }
  const u8 = new Uint8Array(1);
  const randomByte = crypto ? () => crypto.getRandomValues(u8)[0] : () => Math.random() * 255 & 255;
  return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (c) => (+c ^ randomByte() & 15 >> +c / 4).toString(16));
}, "uuid4");

// node_modules/supermemory/internal/errors.mjs
function isAbortError(err) {
  return typeof err === "object" && err !== null && // Spec-compliant fetch implementations
  ("name" in err && err.name === "AbortError" || // Expo fetch
  "message" in err && String(err.message).includes("FetchRequestCanceledException"));
}
__name(isAbortError, "isAbortError");
var castToError = /* @__PURE__ */ __name((err) => {
  if (err instanceof Error)
    return err;
  if (typeof err === "object" && err !== null) {
    try {
      if (Object.prototype.toString.call(err) === "[object Error]") {
        const error = new Error(err.message, err.cause ? { cause: err.cause } : {});
        if (err.stack)
          error.stack = err.stack;
        if (err.cause && !error.cause)
          error.cause = err.cause;
        if (err.name)
          error.name = err.name;
        return error;
      }
    } catch {
    }
    try {
      return new Error(JSON.stringify(err));
    } catch {
    }
  }
  return new Error(err);
}, "castToError");

// node_modules/supermemory/core/error.mjs
var SupermemoryError = class extends Error {
  static {
    __name(this, "SupermemoryError");
  }
};
var APIError = class _APIError extends SupermemoryError {
  static {
    __name(this, "APIError");
  }
  constructor(status, error, message, headers) {
    super(`${_APIError.makeMessage(status, error, message)}`);
    this.status = status;
    this.headers = headers;
    this.error = error;
  }
  static makeMessage(status, error, message) {
    const msg = error?.message ? typeof error.message === "string" ? error.message : JSON.stringify(error.message) : error ? JSON.stringify(error) : message;
    if (status && msg) {
      return `${status} ${msg}`;
    }
    if (status) {
      return `${status} status code (no body)`;
    }
    if (msg) {
      return msg;
    }
    return "(no status code or body)";
  }
  static generate(status, errorResponse, message, headers) {
    if (!status || !headers) {
      return new APIConnectionError({ message, cause: castToError(errorResponse) });
    }
    const error = errorResponse;
    if (status === 400) {
      return new BadRequestError(status, error, message, headers);
    }
    if (status === 401) {
      return new AuthenticationError(status, error, message, headers);
    }
    if (status === 403) {
      return new PermissionDeniedError(status, error, message, headers);
    }
    if (status === 404) {
      return new NotFoundError(status, error, message, headers);
    }
    if (status === 409) {
      return new ConflictError(status, error, message, headers);
    }
    if (status === 422) {
      return new UnprocessableEntityError(status, error, message, headers);
    }
    if (status === 429) {
      return new RateLimitError(status, error, message, headers);
    }
    if (status >= 500) {
      return new InternalServerError(status, error, message, headers);
    }
    return new _APIError(status, error, message, headers);
  }
};
var APIUserAbortError = class extends APIError {
  static {
    __name(this, "APIUserAbortError");
  }
  constructor({ message } = {}) {
    super(void 0, void 0, message || "Request was aborted.", void 0);
  }
};
var APIConnectionError = class extends APIError {
  static {
    __name(this, "APIConnectionError");
  }
  constructor({ message, cause }) {
    super(void 0, void 0, message || "Connection error.", void 0);
    if (cause)
      this.cause = cause;
  }
};
var APIConnectionTimeoutError = class extends APIConnectionError {
  static {
    __name(this, "APIConnectionTimeoutError");
  }
  constructor({ message } = {}) {
    super({ message: message ?? "Request timed out." });
  }
};
var BadRequestError = class extends APIError {
  static {
    __name(this, "BadRequestError");
  }
};
var AuthenticationError = class extends APIError {
  static {
    __name(this, "AuthenticationError");
  }
};
var PermissionDeniedError = class extends APIError {
  static {
    __name(this, "PermissionDeniedError");
  }
};
var NotFoundError = class extends APIError {
  static {
    __name(this, "NotFoundError");
  }
};
var ConflictError = class extends APIError {
  static {
    __name(this, "ConflictError");
  }
};
var UnprocessableEntityError = class extends APIError {
  static {
    __name(this, "UnprocessableEntityError");
  }
};
var RateLimitError = class extends APIError {
  static {
    __name(this, "RateLimitError");
  }
};
var InternalServerError = class extends APIError {
  static {
    __name(this, "InternalServerError");
  }
};

// node_modules/supermemory/internal/utils/values.mjs
var startsWithSchemeRegexp = /^[a-z][a-z0-9+.-]*:/i;
var isAbsoluteURL = /* @__PURE__ */ __name((url) => {
  return startsWithSchemeRegexp.test(url);
}, "isAbsoluteURL");
var isArray = /* @__PURE__ */ __name((val) => (isArray = Array.isArray, isArray(val)), "isArray");
var isReadonlyArray = isArray;
function isEmptyObj(obj) {
  if (!obj)
    return true;
  for (const _k in obj)
    return false;
  return true;
}
__name(isEmptyObj, "isEmptyObj");
function hasOwn(obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key);
}
__name(hasOwn, "hasOwn");
var validatePositiveInteger = /* @__PURE__ */ __name((name, n) => {
  if (typeof n !== "number" || !Number.isInteger(n)) {
    throw new SupermemoryError(`${name} must be an integer`);
  }
  if (n < 0) {
    throw new SupermemoryError(`${name} must be a positive integer`);
  }
  return n;
}, "validatePositiveInteger");
var safeJSON = /* @__PURE__ */ __name((text) => {
  try {
    return JSON.parse(text);
  } catch (err) {
    return void 0;
  }
}, "safeJSON");

// node_modules/supermemory/internal/utils/sleep.mjs
var sleep = /* @__PURE__ */ __name((ms) => new Promise((resolve) => setTimeout(resolve, ms)), "sleep");

// node_modules/supermemory/version.mjs
var VERSION = "4.17.0";

// node_modules/supermemory/internal/detect-platform.mjs
function getDetectedPlatform() {
  if (typeof Deno !== "undefined" && Deno.build != null) {
    return "deno";
  }
  if (typeof EdgeRuntime !== "undefined") {
    return "edge";
  }
  if (Object.prototype.toString.call(typeof globalThis.process !== "undefined" ? globalThis.process : 0) === "[object process]") {
    return "node";
  }
  return "unknown";
}
__name(getDetectedPlatform, "getDetectedPlatform");
var getPlatformProperties = /* @__PURE__ */ __name(() => {
  const detectedPlatform = getDetectedPlatform();
  if (detectedPlatform === "deno") {
    return {
      "X-Stainless-Lang": "js",
      "X-Stainless-Package-Version": VERSION,
      "X-Stainless-OS": normalizePlatform(Deno.build.os),
      "X-Stainless-Arch": normalizeArch(Deno.build.arch),
      "X-Stainless-Runtime": "deno",
      "X-Stainless-Runtime-Version": typeof Deno.version === "string" ? Deno.version : Deno.version?.deno ?? "unknown"
    };
  }
  if (typeof EdgeRuntime !== "undefined") {
    return {
      "X-Stainless-Lang": "js",
      "X-Stainless-Package-Version": VERSION,
      "X-Stainless-OS": "Unknown",
      "X-Stainless-Arch": `other:${EdgeRuntime}`,
      "X-Stainless-Runtime": "edge",
      "X-Stainless-Runtime-Version": globalThis.process.version
    };
  }
  if (detectedPlatform === "node") {
    return {
      "X-Stainless-Lang": "js",
      "X-Stainless-Package-Version": VERSION,
      "X-Stainless-OS": normalizePlatform(globalThis.process.platform ?? "unknown"),
      "X-Stainless-Arch": normalizeArch(globalThis.process.arch ?? "unknown"),
      "X-Stainless-Runtime": "node",
      "X-Stainless-Runtime-Version": globalThis.process.version ?? "unknown"
    };
  }
  const browserInfo = getBrowserInfo();
  if (browserInfo) {
    return {
      "X-Stainless-Lang": "js",
      "X-Stainless-Package-Version": VERSION,
      "X-Stainless-OS": "Unknown",
      "X-Stainless-Arch": "unknown",
      "X-Stainless-Runtime": `browser:${browserInfo.browser}`,
      "X-Stainless-Runtime-Version": browserInfo.version
    };
  }
  return {
    "X-Stainless-Lang": "js",
    "X-Stainless-Package-Version": VERSION,
    "X-Stainless-OS": "Unknown",
    "X-Stainless-Arch": "unknown",
    "X-Stainless-Runtime": "unknown",
    "X-Stainless-Runtime-Version": "unknown"
  };
}, "getPlatformProperties");
function getBrowserInfo() {
  if (typeof navigator === "undefined" || !navigator) {
    return null;
  }
  const browserPatterns = [
    { key: "edge", pattern: /Edge(?:\W+(\d+)\.(\d+)(?:\.(\d+))?)?/ },
    { key: "ie", pattern: /MSIE(?:\W+(\d+)\.(\d+)(?:\.(\d+))?)?/ },
    { key: "ie", pattern: /Trident(?:.*rv\:(\d+)\.(\d+)(?:\.(\d+))?)?/ },
    { key: "chrome", pattern: /Chrome(?:\W+(\d+)\.(\d+)(?:\.(\d+))?)?/ },
    { key: "firefox", pattern: /Firefox(?:\W+(\d+)\.(\d+)(?:\.(\d+))?)?/ },
    { key: "safari", pattern: /(?:Version\W+(\d+)\.(\d+)(?:\.(\d+))?)?(?:\W+Mobile\S*)?\W+Safari/ }
  ];
  for (const { key, pattern } of browserPatterns) {
    const match = pattern.exec(navigator.userAgent);
    if (match) {
      const major = match[1] || 0;
      const minor = match[2] || 0;
      const patch = match[3] || 0;
      return { browser: key, version: `${major}.${minor}.${patch}` };
    }
  }
  return null;
}
__name(getBrowserInfo, "getBrowserInfo");
var normalizeArch = /* @__PURE__ */ __name((arch) => {
  if (arch === "x32")
    return "x32";
  if (arch === "x86_64" || arch === "x64")
    return "x64";
  if (arch === "arm")
    return "arm";
  if (arch === "aarch64" || arch === "arm64")
    return "arm64";
  if (arch)
    return `other:${arch}`;
  return "unknown";
}, "normalizeArch");
var normalizePlatform = /* @__PURE__ */ __name((platform) => {
  platform = platform.toLowerCase();
  if (platform.includes("ios"))
    return "iOS";
  if (platform === "android")
    return "Android";
  if (platform === "darwin")
    return "MacOS";
  if (platform === "win32")
    return "Windows";
  if (platform === "freebsd")
    return "FreeBSD";
  if (platform === "openbsd")
    return "OpenBSD";
  if (platform === "linux")
    return "Linux";
  if (platform)
    return `Other:${platform}`;
  return "Unknown";
}, "normalizePlatform");
var _platformHeaders;
var getPlatformHeaders = /* @__PURE__ */ __name(() => {
  return _platformHeaders ?? (_platformHeaders = getPlatformProperties());
}, "getPlatformHeaders");

// node_modules/supermemory/internal/shims.mjs
function getDefaultFetch() {
  if (typeof fetch !== "undefined") {
    return fetch;
  }
  throw new Error("`fetch` is not defined as a global; Either pass `fetch` to the client, `new Supermemory({ fetch })` or polyfill the global, `globalThis.fetch = fetch`");
}
__name(getDefaultFetch, "getDefaultFetch");
function makeReadableStream(...args) {
  const ReadableStream = globalThis.ReadableStream;
  if (typeof ReadableStream === "undefined") {
    throw new Error("`ReadableStream` is not defined as a global; You will need to polyfill it, `globalThis.ReadableStream = ReadableStream`");
  }
  return new ReadableStream(...args);
}
__name(makeReadableStream, "makeReadableStream");
function ReadableStreamFrom(iterable) {
  let iter = Symbol.asyncIterator in iterable ? iterable[Symbol.asyncIterator]() : iterable[Symbol.iterator]();
  return makeReadableStream({
    start() {
    },
    async pull(controller) {
      const { done, value } = await iter.next();
      if (done) {
        controller.close();
      } else {
        controller.enqueue(value);
      }
    },
    async cancel() {
      await iter.return?.();
    }
  });
}
__name(ReadableStreamFrom, "ReadableStreamFrom");
async function CancelReadableStream(stream) {
  if (stream === null || typeof stream !== "object")
    return;
  if (stream[Symbol.asyncIterator]) {
    await stream[Symbol.asyncIterator]().return?.();
    return;
  }
  const reader = stream.getReader();
  const cancelPromise = reader.cancel();
  reader.releaseLock();
  await cancelPromise;
}
__name(CancelReadableStream, "CancelReadableStream");

// node_modules/supermemory/internal/request-options.mjs
var FallbackEncoder = /* @__PURE__ */ __name(({ headers, body }) => {
  return {
    bodyHeaders: {
      "content-type": "application/json"
    },
    body: JSON.stringify(body)
  };
}, "FallbackEncoder");

// node_modules/supermemory/internal/utils/query.mjs
function stringifyQuery(query) {
  return Object.entries(query).filter(([_, value]) => typeof value !== "undefined").map(([key, value]) => {
    if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
      return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
    }
    if (value === null) {
      return `${encodeURIComponent(key)}=`;
    }
    throw new SupermemoryError(`Cannot stringify type ${typeof value}; Expected string, number, boolean, or null. If you need to pass nested query parameters, you can manually encode them, e.g. { query: { 'foo[key1]': value1, 'foo[key2]': value2 } }, and please open a GitHub issue requesting better support for your use case.`);
  }).join("&");
}
__name(stringifyQuery, "stringifyQuery");

// node_modules/supermemory/internal/uploads.mjs
var checkFileSupport = /* @__PURE__ */ __name(() => {
  if (typeof File === "undefined") {
    const { process: process2 } = globalThis;
    const isOldNode = typeof process2?.versions?.node === "string" && parseInt(process2.versions.node.split(".")) < 20;
    throw new Error("`File` is not defined as a global, which is required for file uploads." + (isOldNode ? " Update to Node 20 LTS or newer, or set `globalThis.File` to `import('node:buffer').File`." : ""));
  }
}, "checkFileSupport");
function makeFile(fileBits, fileName, options) {
  checkFileSupport();
  return new File(fileBits, fileName ?? "unknown_file", options);
}
__name(makeFile, "makeFile");
function getName(value) {
  return (typeof value === "object" && value !== null && ("name" in value && value.name && String(value.name) || "url" in value && value.url && String(value.url) || "filename" in value && value.filename && String(value.filename) || "path" in value && value.path && String(value.path)) || "").split(/[\\/]/).pop() || void 0;
}
__name(getName, "getName");
var isAsyncIterable = /* @__PURE__ */ __name((value) => value != null && typeof value === "object" && typeof value[Symbol.asyncIterator] === "function", "isAsyncIterable");
var multipartFormRequestOptions = /* @__PURE__ */ __name(async (opts, fetch2) => {
  return { ...opts, body: await createForm(opts.body, fetch2) };
}, "multipartFormRequestOptions");
var supportsFormDataMap = /* @__PURE__ */ new WeakMap();
function supportsFormData(fetchObject) {
  const fetch2 = typeof fetchObject === "function" ? fetchObject : fetchObject.fetch;
  const cached = supportsFormDataMap.get(fetch2);
  if (cached)
    return cached;
  const promise = (async () => {
    try {
      const FetchResponse = "Response" in fetch2 ? fetch2.Response : (await fetch2("data:,")).constructor;
      const data = new FormData();
      if (data.toString() === await new FetchResponse(data).text()) {
        return false;
      }
      return true;
    } catch {
      return true;
    }
  })();
  supportsFormDataMap.set(fetch2, promise);
  return promise;
}
__name(supportsFormData, "supportsFormData");
var createForm = /* @__PURE__ */ __name(async (body, fetch2) => {
  if (!await supportsFormData(fetch2)) {
    throw new TypeError("The provided fetch function does not support file uploads with the current global FormData class.");
  }
  const form = new FormData();
  await Promise.all(Object.entries(body || {}).map(([key, value]) => addFormValue(form, key, value)));
  return form;
}, "createForm");
var isNamedBlob = /* @__PURE__ */ __name((value) => value instanceof Blob && "name" in value, "isNamedBlob");
var addFormValue = /* @__PURE__ */ __name(async (form, key, value) => {
  if (value === void 0)
    return;
  if (value == null) {
    throw new TypeError(`Received null for "${key}"; to pass null in FormData, you must use the string 'null'`);
  }
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    form.append(key, String(value));
  } else if (value instanceof Response) {
    form.append(key, makeFile([await value.blob()], getName(value)));
  } else if (isAsyncIterable(value)) {
    form.append(key, makeFile([await new Response(ReadableStreamFrom(value)).blob()], getName(value)));
  } else if (isNamedBlob(value)) {
    form.append(key, value, getName(value));
  } else if (Array.isArray(value)) {
    await Promise.all(value.map((entry) => addFormValue(form, key + "[]", entry)));
  } else if (typeof value === "object") {
    await Promise.all(Object.entries(value).map(([name, prop]) => addFormValue(form, `${key}[${name}]`, prop)));
  } else {
    throw new TypeError(`Invalid value given to form, expected a string, number, boolean, object, Array, File or Blob but got ${value} instead`);
  }
}, "addFormValue");

// node_modules/supermemory/internal/to-file.mjs
var isBlobLike = /* @__PURE__ */ __name((value) => value != null && typeof value === "object" && typeof value.size === "number" && typeof value.type === "string" && typeof value.text === "function" && typeof value.slice === "function" && typeof value.arrayBuffer === "function", "isBlobLike");
var isFileLike = /* @__PURE__ */ __name((value) => value != null && typeof value === "object" && typeof value.name === "string" && typeof value.lastModified === "number" && isBlobLike(value), "isFileLike");
var isResponseLike = /* @__PURE__ */ __name((value) => value != null && typeof value === "object" && typeof value.url === "string" && typeof value.blob === "function", "isResponseLike");
async function toFile(value, name, options) {
  checkFileSupport();
  value = await value;
  if (isFileLike(value)) {
    if (value instanceof File) {
      return value;
    }
    return makeFile([await value.arrayBuffer()], value.name);
  }
  if (isResponseLike(value)) {
    const blob = await value.blob();
    name || (name = new URL(value.url).pathname.split(/[\\/]/).pop());
    return makeFile(await getBytes(blob), name, options);
  }
  const parts = await getBytes(value);
  name || (name = getName(value));
  if (!options?.type) {
    const type = parts.find((part) => typeof part === "object" && "type" in part && part.type);
    if (typeof type === "string") {
      options = { ...options, type };
    }
  }
  return makeFile(parts, name, options);
}
__name(toFile, "toFile");
async function getBytes(value) {
  let parts = [];
  if (typeof value === "string" || ArrayBuffer.isView(value) || // includes Uint8Array, Buffer, etc.
  value instanceof ArrayBuffer) {
    parts.push(value);
  } else if (isBlobLike(value)) {
    parts.push(value instanceof Blob ? value : await value.arrayBuffer());
  } else if (isAsyncIterable(value)) {
    for await (const chunk of value) {
      parts.push(...await getBytes(chunk));
    }
  } else {
    const constructor = value?.constructor?.name;
    throw new Error(`Unexpected data type: ${typeof value}${constructor ? `; constructor: ${constructor}` : ""}${propsForError(value)}`);
  }
  return parts;
}
__name(getBytes, "getBytes");
function propsForError(value) {
  if (typeof value !== "object" || value === null)
    return "";
  const props = Object.getOwnPropertyNames(value);
  return `; props: [${props.map((p) => `"${p}"`).join(", ")}]`;
}
__name(propsForError, "propsForError");

// node_modules/supermemory/core/resource.mjs
var APIResource = class {
  static {
    __name(this, "APIResource");
  }
  constructor(client) {
    this._client = client;
  }
};

// node_modules/supermemory/internal/headers.mjs
var brand_privateNullableHeaders = /* @__PURE__ */ Symbol("brand.privateNullableHeaders");
function* iterateHeaders(headers) {
  if (!headers)
    return;
  if (brand_privateNullableHeaders in headers) {
    const { values, nulls } = headers;
    yield* values.entries();
    for (const name of nulls) {
      yield [name, null];
    }
    return;
  }
  let shouldClear = false;
  let iter;
  if (headers instanceof Headers) {
    iter = headers.entries();
  } else if (isReadonlyArray(headers)) {
    iter = headers;
  } else {
    shouldClear = true;
    iter = Object.entries(headers ?? {});
  }
  for (let row of iter) {
    const name = row[0];
    if (typeof name !== "string")
      throw new TypeError("expected header name to be a string");
    const values = isReadonlyArray(row[1]) ? row[1] : [row[1]];
    let didClear = false;
    for (const value of values) {
      if (value === void 0)
        continue;
      if (shouldClear && !didClear) {
        didClear = true;
        yield [name, null];
      }
      yield [name, value];
    }
  }
}
__name(iterateHeaders, "iterateHeaders");
var buildHeaders = /* @__PURE__ */ __name((newHeaders) => {
  const targetHeaders = new Headers();
  const nullHeaders = /* @__PURE__ */ new Set();
  for (const headers of newHeaders) {
    const seenHeaders = /* @__PURE__ */ new Set();
    for (const [name, value] of iterateHeaders(headers)) {
      const lowerName = name.toLowerCase();
      if (!seenHeaders.has(lowerName)) {
        targetHeaders.delete(name);
        seenHeaders.add(lowerName);
      }
      if (value === null) {
        targetHeaders.delete(name);
        nullHeaders.add(lowerName);
      } else {
        targetHeaders.append(name, value);
        nullHeaders.delete(lowerName);
      }
    }
  }
  return { [brand_privateNullableHeaders]: true, values: targetHeaders, nulls: nullHeaders };
}, "buildHeaders");

// node_modules/supermemory/internal/utils/path.mjs
function encodeURIPath(str) {
  return str.replace(/[^A-Za-z0-9\-._~!$&'()*+,;=:@]+/g, encodeURIComponent);
}
__name(encodeURIPath, "encodeURIPath");
var EMPTY = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.create(null));
var createPathTagFunction = /* @__PURE__ */ __name((pathEncoder = encodeURIPath) => /* @__PURE__ */ __name(function path2(statics, ...params) {
  if (statics.length === 1)
    return statics[0];
  let postPath = false;
  const invalidSegments = [];
  const path3 = statics.reduce((previousValue, currentValue, index) => {
    if (/[?#]/.test(currentValue)) {
      postPath = true;
    }
    const value = params[index];
    let encoded = (postPath ? encodeURIComponent : pathEncoder)("" + value);
    if (index !== params.length && (value == null || typeof value === "object" && // handle values from other realms
    value.toString === Object.getPrototypeOf(Object.getPrototypeOf(value.hasOwnProperty ?? EMPTY) ?? EMPTY)?.toString)) {
      encoded = value + "";
      invalidSegments.push({
        start: previousValue.length + currentValue.length,
        length: encoded.length,
        error: `Value of type ${Object.prototype.toString.call(value).slice(8, -1)} is not a valid path parameter`
      });
    }
    return previousValue + currentValue + (index === params.length ? "" : encoded);
  }, "");
  const pathOnly = path3.split(/[?#]/, 1)[0];
  const invalidSegmentPattern = /(?<=^|\/)(?:\.|%2e){1,2}(?=\/|$)/gi;
  let match;
  while ((match = invalidSegmentPattern.exec(pathOnly)) !== null) {
    invalidSegments.push({
      start: match.index,
      length: match[0].length,
      error: `Value "${match[0]}" can't be safely passed as a path parameter`
    });
  }
  invalidSegments.sort((a, b) => a.start - b.start);
  if (invalidSegments.length > 0) {
    let lastEnd = 0;
    const underline = invalidSegments.reduce((acc, segment) => {
      const spaces = " ".repeat(segment.start - lastEnd);
      const arrows = "^".repeat(segment.length);
      lastEnd = segment.start + segment.length;
      return acc + spaces + arrows;
    }, "");
    throw new SupermemoryError(`Path parameters result in path with invalid segments:
${invalidSegments.map((e) => e.error).join("\n")}
${path3}
${underline}`);
  }
  return path3;
}, "path"), "createPathTagFunction");
var path = /* @__PURE__ */ createPathTagFunction(encodeURIPath);

// node_modules/supermemory/resources/connections.mjs
var Connections = class extends APIResource {
  static {
    __name(this, "Connections");
  }
  /**
   * Initialize connection and get authorization URL
   *
   * @example
   * ```ts
   * const connection = await client.connections.create(
   *   'notion',
   * );
   * ```
   */
  create(provider, body = {}, options) {
    return this._client.post(path`/v3/connections/${provider}`, { body, ...options });
  }
  /**
   * List all connections
   *
   * @example
   * ```ts
   * const connections = await client.connections.list();
   * ```
   */
  list(body = {}, options) {
    return this._client.post("/v3/connections/list", { body, ...options });
  }
  /**
   * Configure resources for a connection (supported providers: GitHub for now)
   *
   * @example
   * ```ts
   * const response = await client.connections.configure(
   *   'connectionId',
   *   { resources: [{ foo: 'bar' }] },
   * );
   * ```
   */
  configure(connectionID, body, options) {
    return this._client.post(path`/v3/connections/${connectionID}/configure`, { body, ...options });
  }
  /**
   * Delete a specific connection by ID
   *
   * @example
   * ```ts
   * const response = await client.connections.deleteByID(
   *   'connectionId',
   * );
   * ```
   */
  deleteByID(connectionID, params = {}, options) {
    const { deleteDocuments } = params ?? {};
    return this._client.delete(path`/v3/connections/${connectionID}`, {
      query: { deleteDocuments },
      ...options
    });
  }
  /**
   * Delete connection for a specific provider and container tags
   *
   * @example
   * ```ts
   * const response = await client.connections.deleteByProvider(
   *   'notion',
   *   { containerTags: ['user_123', 'project_123'] },
   * );
   * ```
   */
  deleteByProvider(provider, body, options) {
    return this._client.delete(path`/v3/connections/${provider}`, { body, ...options });
  }
  /**
   * Get connection details with id
   *
   * @example
   * ```ts
   * const response = await client.connections.getByID(
   *   'connectionId',
   * );
   * ```
   */
  getByID(connectionID, options) {
    return this._client.get(path`/v3/connections/${connectionID}`, options);
  }
  /**
   * Get connection details with provider and container tags
   *
   * @example
   * ```ts
   * const response = await client.connections.getByTag(
   *   'notion',
   *   { containerTags: ['user_123', 'project_123'] },
   * );
   * ```
   */
  getByTag(provider, body, options) {
    return this._client.post(path`/v3/connections/${provider}/connection`, { body, ...options });
  }
  /**
   * Initiate a manual sync of connections
   *
   * @example
   * ```ts
   * const response = await client.connections.import('notion');
   * ```
   */
  import(provider, body = {}, options) {
    return this._client.post(path`/v3/connections/${provider}/import`, {
      body,
      ...options,
      headers: buildHeaders([{ Accept: "text/plain" }, options?.headers])
    });
  }
  /**
   * List documents indexed for a provider and container tags
   *
   * @example
   * ```ts
   * const response = await client.connections.listDocuments(
   *   'notion',
   * );
   * ```
   */
  listDocuments(provider, body = {}, options) {
    return this._client.post(path`/v3/connections/${provider}/documents`, { body, ...options });
  }
  /**
   * Fetch resources for a connection (supported providers: GitHub for now)
   *
   * @example
   * ```ts
   * const response = await client.connections.resources(
   *   'connectionId',
   * );
   * ```
   */
  resources(connectionID, query = {}, options) {
    return this._client.get(path`/v3/connections/${connectionID}/resources`, { query, ...options });
  }
};

// node_modules/supermemory/resources/documents.mjs
var Documents = class extends APIResource {
  static {
    __name(this, "Documents");
  }
  /**
   * Update a document with any content type (text, url, file, etc.) and metadata
   *
   * @example
   * ```ts
   * const document = await client.documents.update('id');
   * ```
   */
  update(id, body = {}, options) {
    return this._client.patch(path`/v3/documents/${id}`, { body, ...options });
  }
  /**
   * Retrieves a paginated list of documents with their metadata and workflow status
   *
   * @example
   * ```ts
   * const documents = await client.documents.list();
   * ```
   */
  list(body = {}, options) {
    return this._client.post("/v3/documents/list", { body, ...options });
  }
  /**
   * Delete a document by ID or customId
   *
   * @example
   * ```ts
   * await client.documents.delete('id');
   * ```
   */
  delete(id, options) {
    return this._client.delete(path`/v3/documents/${id}`, {
      ...options,
      headers: buildHeaders([{ Accept: "*/*" }, options?.headers])
    });
  }
  /**
   * Add a document with any content type (text, url, file, etc.) and metadata
   *
   * @example
   * ```ts
   * const response = await client.documents.add({
   *   content: 'content',
   * });
   * ```
   */
  add(body, options) {
    return this._client.post("/v3/documents", { body, ...options });
  }
  /**
   * Add multiple documents in a single request. Each document can have any content
   * type (text, url, file, etc.) and metadata
   *
   * @example
   * ```ts
   * const response = await client.documents.batchAdd({
   *   documents: [
   *     {
   *       content:
   *         'This is a detailed article about machine learning concepts...',
   *     },
   *   ],
   * });
   * ```
   */
  batchAdd(body, options) {
    return this._client.post("/v3/documents/batch", { body, ...options });
  }
  /**
   * Bulk delete documents by IDs or container tags
   *
   * @example
   * ```ts
   * const response = await client.documents.deleteBulk();
   * ```
   */
  deleteBulk(body = {}, options) {
    return this._client.delete("/v3/documents/bulk", { body, ...options });
  }
  /**
   * Get a document by ID
   *
   * @example
   * ```ts
   * const document = await client.documents.get('id');
   * ```
   */
  get(id, options) {
    return this._client.get(path`/v3/documents/${id}`, options);
  }
  /**
   * Get documents that are currently being processed
   *
   * @example
   * ```ts
   * const response = await client.documents.listProcessing();
   * ```
   */
  listProcessing(options) {
    return this._client.get("/v3/documents/processing", options);
  }
  /**
   * Upload a file to be processed
   *
   * @example
   * ```ts
   * const response = await client.documents.uploadFile({
   *   file: fs.createReadStream('path/to/file'),
   * });
   * ```
   */
  uploadFile(body, options) {
    return this._client.post("/v3/documents/file", multipartFormRequestOptions({ body, ...options }, this._client));
  }
};

// node_modules/supermemory/resources/memories.mjs
var Memories = class extends APIResource {
  static {
    __name(this, "Memories");
  }
  /**
   * Forget (soft delete) a memory entry. The memory is marked as forgotten but not
   * permanently deleted.
   *
   * @example
   * ```ts
   * const response = await client.memories.forget({
   *   containerTag: 'user_123',
   * });
   * ```
   */
  forget(body, options) {
    return this._client.delete("/v4/memories", { body, ...options });
  }
  /**
   * Update a memory by creating a new version. The original memory is preserved with
   * isLatest=false.
   *
   * @example
   * ```ts
   * const response = await client.memories.updateMemory({
   *   containerTag: 'user_123',
   *   newContent: 'John now prefers light mode',
   * });
   * ```
   */
  updateMemory(body, options) {
    return this._client.patch("/v4/memories", { body, ...options });
  }
};

// node_modules/supermemory/resources/search.mjs
var Search = class extends APIResource {
  static {
    __name(this, "Search");
  }
  /**
   * Search memories with advanced filtering
   *
   * @example
   * ```ts
   * const response = await client.search.documents({
   *   q: 'machine learning concepts',
   * });
   * ```
   */
  documents(body, options) {
    return this._client.post("/v3/search", { body, ...options });
  }
  /**
   * Search memories with advanced filtering
   *
   * @example
   * ```ts
   * const response = await client.search.execute({
   *   q: 'machine learning concepts',
   * });
   * ```
   */
  execute(body, options) {
    return this._client.post("/v3/search", { body, ...options });
  }
  /**
   * Search memory entries - Low latency for conversational
   *
   * @example
   * ```ts
   * const response = await client.search.memories({
   *   q: 'machine learning concepts',
   * });
   * ```
   */
  memories(body, options) {
    return this._client.post("/v4/search", { body, ...options });
  }
};

// node_modules/supermemory/resources/settings.mjs
var Settings = class extends APIResource {
  static {
    __name(this, "Settings");
  }
  /**
   * Update settings for an organization
   */
  update(body = {}, options) {
    return this._client.patch("/v3/settings", { body, ...options });
  }
  /**
   * Get settings for an organization
   */
  get(options) {
    return this._client.get("/v3/settings", options);
  }
};

// node_modules/supermemory/internal/utils/log.mjs
var levelNumbers = {
  off: 0,
  error: 200,
  warn: 300,
  info: 400,
  debug: 500
};
var parseLogLevel = /* @__PURE__ */ __name((maybeLevel, sourceName, client) => {
  if (!maybeLevel) {
    return void 0;
  }
  if (hasOwn(levelNumbers, maybeLevel)) {
    return maybeLevel;
  }
  loggerFor(client).warn(`${sourceName} was set to ${JSON.stringify(maybeLevel)}, expected one of ${JSON.stringify(Object.keys(levelNumbers))}`);
  return void 0;
}, "parseLogLevel");
function noop() {
}
__name(noop, "noop");
function makeLogFn(fnLevel, logger, logLevel) {
  if (!logger || levelNumbers[fnLevel] > levelNumbers[logLevel]) {
    return noop;
  } else {
    return logger[fnLevel].bind(logger);
  }
}
__name(makeLogFn, "makeLogFn");
var noopLogger = {
  error: noop,
  warn: noop,
  info: noop,
  debug: noop
};
var cachedLoggers = /* @__PURE__ */ new WeakMap();
function loggerFor(client) {
  const logger = client.logger;
  const logLevel = client.logLevel ?? "off";
  if (!logger) {
    return noopLogger;
  }
  const cachedLogger = cachedLoggers.get(logger);
  if (cachedLogger && cachedLogger[0] === logLevel) {
    return cachedLogger[1];
  }
  const levelLogger = {
    error: makeLogFn("error", logger, logLevel),
    warn: makeLogFn("warn", logger, logLevel),
    info: makeLogFn("info", logger, logLevel),
    debug: makeLogFn("debug", logger, logLevel)
  };
  cachedLoggers.set(logger, [logLevel, levelLogger]);
  return levelLogger;
}
__name(loggerFor, "loggerFor");
var formatRequestDetails = /* @__PURE__ */ __name((details) => {
  if (details.options) {
    details.options = { ...details.options };
    delete details.options["headers"];
  }
  if (details.headers) {
    details.headers = Object.fromEntries((details.headers instanceof Headers ? [...details.headers] : Object.entries(details.headers)).map(([name, value]) => [
      name,
      name.toLowerCase() === "authorization" || name.toLowerCase() === "cookie" || name.toLowerCase() === "set-cookie" ? "***" : value
    ]));
  }
  if ("retryOfRequestLogID" in details) {
    if (details.retryOfRequestLogID) {
      details.retryOf = details.retryOfRequestLogID;
    }
    delete details.retryOfRequestLogID;
  }
  return details;
}, "formatRequestDetails");

// node_modules/supermemory/internal/parse.mjs
async function defaultParseResponse(client, props) {
  const { response, requestLogID, retryOfRequestLogID, startTime } = props;
  const body = await (async () => {
    if (response.status === 204) {
      return null;
    }
    if (props.options.__binaryResponse) {
      return response;
    }
    const contentType = response.headers.get("content-type");
    const mediaType = contentType?.split(";")[0]?.trim();
    const isJSON = mediaType?.includes("application/json") || mediaType?.endsWith("+json");
    if (isJSON) {
      const contentLength = response.headers.get("content-length");
      if (contentLength === "0") {
        return void 0;
      }
      const json = await response.json();
      return json;
    }
    const text = await response.text();
    return text;
  })();
  loggerFor(client).debug(`[${requestLogID}] response parsed`, formatRequestDetails({
    retryOfRequestLogID,
    url: response.url,
    status: response.status,
    body,
    durationMs: Date.now() - startTime
  }));
  return body;
}
__name(defaultParseResponse, "defaultParseResponse");

// node_modules/supermemory/core/api-promise.mjs
var _APIPromise_client;
var APIPromise = class _APIPromise extends Promise {
  static {
    __name(this, "APIPromise");
  }
  constructor(client, responsePromise, parseResponse = defaultParseResponse) {
    super((resolve) => {
      resolve(null);
    });
    this.responsePromise = responsePromise;
    this.parseResponse = parseResponse;
    _APIPromise_client.set(this, void 0);
    __classPrivateFieldSet(this, _APIPromise_client, client, "f");
  }
  _thenUnwrap(transform) {
    return new _APIPromise(__classPrivateFieldGet(this, _APIPromise_client, "f"), this.responsePromise, async (client, props) => transform(await this.parseResponse(client, props), props));
  }
  /**
   * Gets the raw `Response` instance instead of parsing the response
   * data.
   *
   * If you want to parse the response body but still get the `Response`
   * instance, you can use {@link withResponse()}.
   *
   * 👋 Getting the wrong TypeScript type for `Response`?
   * Try setting `"moduleResolution": "NodeNext"` or add `"lib": ["DOM"]`
   * to your `tsconfig.json`.
   */
  asResponse() {
    return this.responsePromise.then((p) => p.response);
  }
  /**
   * Gets the parsed response data and the raw `Response` instance.
   *
   * If you just want to get the raw `Response` instance without parsing it,
   * you can use {@link asResponse()}.
   *
   * 👋 Getting the wrong TypeScript type for `Response`?
   * Try setting `"moduleResolution": "NodeNext"` or add `"lib": ["DOM"]`
   * to your `tsconfig.json`.
   */
  async withResponse() {
    const [data, response] = await Promise.all([this.parse(), this.asResponse()]);
    return { data, response };
  }
  parse() {
    if (!this.parsedPromise) {
      this.parsedPromise = this.responsePromise.then((data) => this.parseResponse(__classPrivateFieldGet(this, _APIPromise_client, "f"), data));
    }
    return this.parsedPromise;
  }
  then(onfulfilled, onrejected) {
    return this.parse().then(onfulfilled, onrejected);
  }
  catch(onrejected) {
    return this.parse().catch(onrejected);
  }
  finally(onfinally) {
    return this.parse().finally(onfinally);
  }
};
_APIPromise_client = /* @__PURE__ */ new WeakMap();

// node_modules/supermemory/internal/utils/env.mjs
var readEnv = /* @__PURE__ */ __name((env) => {
  if (typeof globalThis.process !== "undefined") {
    return globalThis.process.env?.[env]?.trim() ?? void 0;
  }
  if (typeof globalThis.Deno !== "undefined") {
    return globalThis.Deno.env?.get?.(env)?.trim();
  }
  return void 0;
}, "readEnv");

// node_modules/supermemory/client.mjs
var _Supermemory_instances;
var _a;
var _Supermemory_encoder;
var _Supermemory_baseURLOverridden;
var Supermemory = class {
  static {
    __name(this, "Supermemory");
  }
  /**
   * API Client for interfacing with the Supermemory API.
   *
   * @param {string | undefined} [opts.apiKey=process.env['SUPERMEMORY_API_KEY'] ?? undefined]
   * @param {string} [opts.baseURL=process.env['SUPERMEMORY_BASE_URL'] ?? https://api.supermemory.ai] - Override the default base URL for the API.
   * @param {number} [opts.timeout=1 minute] - The maximum amount of time (in milliseconds) the client will wait for a response before timing out.
   * @param {MergedRequestInit} [opts.fetchOptions] - Additional `RequestInit` options to be passed to `fetch` calls.
   * @param {Fetch} [opts.fetch] - Specify a custom `fetch` function implementation.
   * @param {number} [opts.maxRetries=2] - The maximum number of times the client will retry a request.
   * @param {HeadersLike} opts.defaultHeaders - Default headers to include with every request to the API.
   * @param {Record<string, string | undefined>} opts.defaultQuery - Default query parameters to include with every request to the API.
   */
  constructor({ baseURL = readEnv("SUPERMEMORY_BASE_URL"), apiKey = readEnv("SUPERMEMORY_API_KEY"), ...opts } = {}) {
    _Supermemory_instances.add(this);
    _Supermemory_encoder.set(this, void 0);
    this.memories = new Memories(this);
    this.documents = new Documents(this);
    this.search = new Search(this);
    this.settings = new Settings(this);
    this.connections = new Connections(this);
    if (apiKey === void 0) {
      throw new SupermemoryError("The SUPERMEMORY_API_KEY environment variable is missing or empty; either provide it, or instantiate the Supermemory client with an apiKey option, like new Supermemory({ apiKey: 'My API Key' }).");
    }
    const options = {
      apiKey,
      ...opts,
      baseURL: baseURL || `https://api.supermemory.ai`
    };
    this.baseURL = options.baseURL;
    this.timeout = options.timeout ?? _a.DEFAULT_TIMEOUT;
    this.logger = options.logger ?? console;
    const defaultLogLevel = "warn";
    this.logLevel = defaultLogLevel;
    this.logLevel = parseLogLevel(options.logLevel, "ClientOptions.logLevel", this) ?? parseLogLevel(readEnv("SUPERMEMORY_LOG"), "process.env['SUPERMEMORY_LOG']", this) ?? defaultLogLevel;
    this.fetchOptions = options.fetchOptions;
    this.maxRetries = options.maxRetries ?? 2;
    this.fetch = options.fetch ?? getDefaultFetch();
    __classPrivateFieldSet(this, _Supermemory_encoder, FallbackEncoder, "f");
    this._options = options;
    this.apiKey = apiKey;
  }
  /**
   * Create a new client instance re-using the same options given to the current client with optional overriding.
   */
  withOptions(options) {
    const client = new this.constructor({
      ...this._options,
      baseURL: this.baseURL,
      maxRetries: this.maxRetries,
      timeout: this.timeout,
      logger: this.logger,
      logLevel: this.logLevel,
      fetch: this.fetch,
      fetchOptions: this.fetchOptions,
      apiKey: this.apiKey,
      ...options
    });
    return client;
  }
  /**
   * Add a document with any content type (text, url, file, etc.) and metadata
   */
  add(body, options) {
    return this.post("/v3/documents", { body, ...options });
  }
  /**
   * Get user profile with optional search results
   */
  profile(body, options) {
    return this.post("/v4/profile", { body, ...options });
  }
  defaultQuery() {
    return this._options.defaultQuery;
  }
  validateHeaders({ values, nulls }) {
    return;
  }
  async authHeaders(opts) {
    return buildHeaders([{ Authorization: `Bearer ${this.apiKey}` }]);
  }
  /**
   * Basic re-implementation of `qs.stringify` for primitive types.
   */
  stringifyQuery(query) {
    return stringifyQuery(query);
  }
  getUserAgent() {
    return `${this.constructor.name}/JS ${VERSION}`;
  }
  defaultIdempotencyKey() {
    return `stainless-node-retry-${uuid4()}`;
  }
  makeStatusError(status, error, message, headers) {
    return APIError.generate(status, error, message, headers);
  }
  buildURL(path2, query, defaultBaseURL) {
    const baseURL = !__classPrivateFieldGet(this, _Supermemory_instances, "m", _Supermemory_baseURLOverridden).call(this) && defaultBaseURL || this.baseURL;
    const url = isAbsoluteURL(path2) ? new URL(path2) : new URL(baseURL + (baseURL.endsWith("/") && path2.startsWith("/") ? path2.slice(1) : path2));
    const defaultQuery = this.defaultQuery();
    const pathQuery = Object.fromEntries(url.searchParams);
    if (!isEmptyObj(defaultQuery) || !isEmptyObj(pathQuery)) {
      query = { ...pathQuery, ...defaultQuery, ...query };
    }
    if (typeof query === "object" && query && !Array.isArray(query)) {
      url.search = this.stringifyQuery(query);
    }
    return url.toString();
  }
  /**
   * Used as a callback for mutating the given `FinalRequestOptions` object.
   */
  async prepareOptions(options) {
  }
  /**
   * Used as a callback for mutating the given `RequestInit` object.
   *
   * This is useful for cases where you want to add certain headers based off of
   * the request properties, e.g. `method` or `url`.
   */
  async prepareRequest(request, { url, options }) {
  }
  get(path2, opts) {
    return this.methodRequest("get", path2, opts);
  }
  post(path2, opts) {
    return this.methodRequest("post", path2, opts);
  }
  patch(path2, opts) {
    return this.methodRequest("patch", path2, opts);
  }
  put(path2, opts) {
    return this.methodRequest("put", path2, opts);
  }
  delete(path2, opts) {
    return this.methodRequest("delete", path2, opts);
  }
  methodRequest(method, path2, opts) {
    return this.request(Promise.resolve(opts).then((opts2) => {
      return { method, path: path2, ...opts2 };
    }));
  }
  request(options, remainingRetries = null) {
    return new APIPromise(this, this.makeRequest(options, remainingRetries, void 0));
  }
  async makeRequest(optionsInput, retriesRemaining, retryOfRequestLogID) {
    const options = await optionsInput;
    const maxRetries = options.maxRetries ?? this.maxRetries;
    if (retriesRemaining == null) {
      retriesRemaining = maxRetries;
    }
    await this.prepareOptions(options);
    const { req, url, timeout: timeout2 } = await this.buildRequest(options, {
      retryCount: maxRetries - retriesRemaining
    });
    await this.prepareRequest(req, { url, options });
    const requestLogID = "log_" + (Math.random() * (1 << 24) | 0).toString(16).padStart(6, "0");
    const retryLogStr = retryOfRequestLogID === void 0 ? "" : `, retryOf: ${retryOfRequestLogID}`;
    const startTime = Date.now();
    loggerFor(this).debug(`[${requestLogID}] sending request`, formatRequestDetails({
      retryOfRequestLogID,
      method: options.method,
      url,
      options,
      headers: req.headers
    }));
    if (options.signal?.aborted) {
      throw new APIUserAbortError();
    }
    const controller = new AbortController();
    const response = await this.fetchWithTimeout(url, req, timeout2, controller).catch(castToError);
    const headersTime = Date.now();
    if (response instanceof globalThis.Error) {
      const retryMessage = `retrying, ${retriesRemaining} attempts remaining`;
      if (options.signal?.aborted) {
        throw new APIUserAbortError();
      }
      const isTimeout = isAbortError(response) || /timed? ?out/i.test(String(response) + ("cause" in response ? String(response.cause) : ""));
      if (retriesRemaining) {
        loggerFor(this).info(`[${requestLogID}] connection ${isTimeout ? "timed out" : "failed"} - ${retryMessage}`);
        loggerFor(this).debug(`[${requestLogID}] connection ${isTimeout ? "timed out" : "failed"} (${retryMessage})`, formatRequestDetails({
          retryOfRequestLogID,
          url,
          durationMs: headersTime - startTime,
          message: response.message
        }));
        return this.retryRequest(options, retriesRemaining, retryOfRequestLogID ?? requestLogID);
      }
      loggerFor(this).info(`[${requestLogID}] connection ${isTimeout ? "timed out" : "failed"} - error; no more retries left`);
      loggerFor(this).debug(`[${requestLogID}] connection ${isTimeout ? "timed out" : "failed"} (error; no more retries left)`, formatRequestDetails({
        retryOfRequestLogID,
        url,
        durationMs: headersTime - startTime,
        message: response.message
      }));
      if (isTimeout) {
        throw new APIConnectionTimeoutError();
      }
      throw new APIConnectionError({ cause: response });
    }
    const responseInfo = `[${requestLogID}${retryLogStr}] ${req.method} ${url} ${response.ok ? "succeeded" : "failed"} with status ${response.status} in ${headersTime - startTime}ms`;
    if (!response.ok) {
      const shouldRetry = await this.shouldRetry(response);
      if (retriesRemaining && shouldRetry) {
        const retryMessage2 = `retrying, ${retriesRemaining} attempts remaining`;
        await CancelReadableStream(response.body);
        loggerFor(this).info(`${responseInfo} - ${retryMessage2}`);
        loggerFor(this).debug(`[${requestLogID}] response error (${retryMessage2})`, formatRequestDetails({
          retryOfRequestLogID,
          url: response.url,
          status: response.status,
          headers: response.headers,
          durationMs: headersTime - startTime
        }));
        return this.retryRequest(options, retriesRemaining, retryOfRequestLogID ?? requestLogID, response.headers);
      }
      const retryMessage = shouldRetry ? `error; no more retries left` : `error; not retryable`;
      loggerFor(this).info(`${responseInfo} - ${retryMessage}`);
      const errText = await response.text().catch((err2) => castToError(err2).message);
      const errJSON = safeJSON(errText);
      const errMessage = errJSON ? void 0 : errText;
      loggerFor(this).debug(`[${requestLogID}] response error (${retryMessage})`, formatRequestDetails({
        retryOfRequestLogID,
        url: response.url,
        status: response.status,
        headers: response.headers,
        message: errMessage,
        durationMs: Date.now() - startTime
      }));
      const err = this.makeStatusError(response.status, errJSON, errMessage, response.headers);
      throw err;
    }
    loggerFor(this).info(responseInfo);
    loggerFor(this).debug(`[${requestLogID}] response start`, formatRequestDetails({
      retryOfRequestLogID,
      url: response.url,
      status: response.status,
      headers: response.headers,
      durationMs: headersTime - startTime
    }));
    return { response, options, controller, requestLogID, retryOfRequestLogID, startTime };
  }
  async fetchWithTimeout(url, init, ms, controller) {
    const { signal, method, ...options } = init || {};
    const abort = this._makeAbort(controller);
    if (signal)
      signal.addEventListener("abort", abort, { once: true });
    const timeout2 = setTimeout(abort, ms);
    const isReadableBody = globalThis.ReadableStream && options.body instanceof globalThis.ReadableStream || typeof options.body === "object" && options.body !== null && Symbol.asyncIterator in options.body;
    const fetchOptions = {
      signal: controller.signal,
      ...isReadableBody ? { duplex: "half" } : {},
      method: "GET",
      ...options
    };
    if (method) {
      fetchOptions.method = method.toUpperCase();
    }
    try {
      return await this.fetch.call(void 0, url, fetchOptions);
    } finally {
      clearTimeout(timeout2);
    }
  }
  async shouldRetry(response) {
    const shouldRetryHeader = response.headers.get("x-should-retry");
    if (shouldRetryHeader === "true")
      return true;
    if (shouldRetryHeader === "false")
      return false;
    if (response.status === 408)
      return true;
    if (response.status === 409)
      return true;
    if (response.status === 429)
      return true;
    if (response.status >= 500)
      return true;
    return false;
  }
  async retryRequest(options, retriesRemaining, requestLogID, responseHeaders) {
    let timeoutMillis;
    const retryAfterMillisHeader = responseHeaders?.get("retry-after-ms");
    if (retryAfterMillisHeader) {
      const timeoutMs = parseFloat(retryAfterMillisHeader);
      if (!Number.isNaN(timeoutMs)) {
        timeoutMillis = timeoutMs;
      }
    }
    const retryAfterHeader = responseHeaders?.get("retry-after");
    if (retryAfterHeader && !timeoutMillis) {
      const timeoutSeconds = parseFloat(retryAfterHeader);
      if (!Number.isNaN(timeoutSeconds)) {
        timeoutMillis = timeoutSeconds * 1e3;
      } else {
        timeoutMillis = Date.parse(retryAfterHeader) - Date.now();
      }
    }
    if (timeoutMillis === void 0) {
      const maxRetries = options.maxRetries ?? this.maxRetries;
      timeoutMillis = this.calculateDefaultRetryTimeoutMillis(retriesRemaining, maxRetries);
    }
    await sleep(timeoutMillis);
    return this.makeRequest(options, retriesRemaining - 1, requestLogID);
  }
  calculateDefaultRetryTimeoutMillis(retriesRemaining, maxRetries) {
    const initialRetryDelay = 0.5;
    const maxRetryDelay = 8;
    const numRetries = maxRetries - retriesRemaining;
    const sleepSeconds = Math.min(initialRetryDelay * Math.pow(2, numRetries), maxRetryDelay);
    const jitter = 1 - Math.random() * 0.25;
    return sleepSeconds * jitter * 1e3;
  }
  async buildRequest(inputOptions, { retryCount = 0 } = {}) {
    const options = { ...inputOptions };
    const { method, path: path2, query, defaultBaseURL } = options;
    const url = this.buildURL(path2, query, defaultBaseURL);
    if ("timeout" in options)
      validatePositiveInteger("timeout", options.timeout);
    options.timeout = options.timeout ?? this.timeout;
    const { bodyHeaders, body } = this.buildBody({ options });
    const reqHeaders = await this.buildHeaders({ options: inputOptions, method, bodyHeaders, retryCount });
    const req = {
      method,
      headers: reqHeaders,
      ...options.signal && { signal: options.signal },
      ...globalThis.ReadableStream && body instanceof globalThis.ReadableStream && { duplex: "half" },
      ...body && { body },
      ...this.fetchOptions ?? {},
      ...options.fetchOptions ?? {}
    };
    return { req, url, timeout: options.timeout };
  }
  async buildHeaders({ options, method, bodyHeaders, retryCount }) {
    let idempotencyHeaders = {};
    if (this.idempotencyHeader && method !== "get") {
      if (!options.idempotencyKey)
        options.idempotencyKey = this.defaultIdempotencyKey();
      idempotencyHeaders[this.idempotencyHeader] = options.idempotencyKey;
    }
    const headers = buildHeaders([
      idempotencyHeaders,
      {
        Accept: "application/json",
        "User-Agent": this.getUserAgent(),
        "X-Stainless-Retry-Count": String(retryCount),
        ...options.timeout ? { "X-Stainless-Timeout": String(Math.trunc(options.timeout / 1e3)) } : {},
        ...getPlatformHeaders()
      },
      await this.authHeaders(options),
      this._options.defaultHeaders,
      bodyHeaders,
      options.headers
    ]);
    this.validateHeaders(headers);
    return headers.values;
  }
  _makeAbort(controller) {
    return () => controller.abort();
  }
  buildBody({ options: { body, headers: rawHeaders } }) {
    if (!body) {
      return { bodyHeaders: void 0, body: void 0 };
    }
    const headers = buildHeaders([rawHeaders]);
    if (
      // Pass raw type verbatim
      ArrayBuffer.isView(body) || body instanceof ArrayBuffer || body instanceof DataView || typeof body === "string" && // Preserve legacy string encoding behavior for now
      headers.values.has("content-type") || // `Blob` is superset of `File`
      globalThis.Blob && body instanceof globalThis.Blob || // `FormData` -> `multipart/form-data`
      body instanceof FormData || // `URLSearchParams` -> `application/x-www-form-urlencoded`
      body instanceof URLSearchParams || // Send chunked stream (each chunk has own `length`)
      globalThis.ReadableStream && body instanceof globalThis.ReadableStream
    ) {
      return { bodyHeaders: void 0, body };
    } else if (typeof body === "object" && (Symbol.asyncIterator in body || Symbol.iterator in body && "next" in body && typeof body.next === "function")) {
      return { bodyHeaders: void 0, body: ReadableStreamFrom(body) };
    } else if (typeof body === "object" && headers.values.get("content-type") === "application/x-www-form-urlencoded") {
      return {
        bodyHeaders: { "content-type": "application/x-www-form-urlencoded" },
        body: this.stringifyQuery(body)
      };
    } else {
      return __classPrivateFieldGet(this, _Supermemory_encoder, "f").call(this, { body, headers });
    }
  }
};
_a = Supermemory, _Supermemory_encoder = /* @__PURE__ */ new WeakMap(), _Supermemory_instances = /* @__PURE__ */ new WeakSet(), _Supermemory_baseURLOverridden = /* @__PURE__ */ __name(function _Supermemory_baseURLOverridden2() {
  return this.baseURL !== "https://api.supermemory.ai";
}, "_Supermemory_baseURLOverridden");
Supermemory.Supermemory = _a;
Supermemory.DEFAULT_TIMEOUT = 6e4;
Supermemory.SupermemoryError = SupermemoryError;
Supermemory.APIError = APIError;
Supermemory.APIConnectionError = APIConnectionError;
Supermemory.APIConnectionTimeoutError = APIConnectionTimeoutError;
Supermemory.APIUserAbortError = APIUserAbortError;
Supermemory.NotFoundError = NotFoundError;
Supermemory.ConflictError = ConflictError;
Supermemory.RateLimitError = RateLimitError;
Supermemory.BadRequestError = BadRequestError;
Supermemory.AuthenticationError = AuthenticationError;
Supermemory.InternalServerError = InternalServerError;
Supermemory.PermissionDeniedError = PermissionDeniedError;
Supermemory.UnprocessableEntityError = UnprocessableEntityError;
Supermemory.toFile = toFile;
Supermemory.Memories = Memories;
Supermemory.Documents = Documents;
Supermemory.Search = Search;
Supermemory.Settings = Settings;
Supermemory.Connections = Connections;

// src/services/client.ts
var TIMEOUT = 3e4;
var ENTITY_CONTEXT = "Extract and remember: user preferences, coding patterns, architectural decisions, debugging insights, project conventions, technical context, and workflow habits.";
var SupermemoryClient = class {
  static {
    __name(this, "SupermemoryClient");
  }
  client;
  constructor(apiKey) {
    this.client = new Supermemory({ apiKey });
  }
  async addMemory(content, containerTag, metadata) {
    await Promise.race([
      this.client.add({
        content,
        containerTags: [containerTag],
        metadata,
        entityContext: ENTITY_CONTEXT
      }),
      timeout(TIMEOUT)
    ]);
  }
  async searchMemories(query, containerTag, limit = 5) {
    const result = await Promise.race([
      this.client.search.memories({
        q: query,
        containerTags: [containerTag],
        limit
      }),
      timeout(TIMEOUT)
    ]);
    if (!result?.results) return [];
    return result.results.map((r) => ({
      id: r.id,
      content: r.content || r.text || "",
      score: r.score,
      createdAt: r.createdAt,
      metadata: r.metadata
    }));
  }
  async getProfile(containerTag, query) {
    const result = await Promise.race([
      this.client.profile({
        containerTags: [containerTag],
        q: query
      }),
      timeout(TIMEOUT)
    ]);
    return {
      staticFacts: result?.staticFacts || result?.facts || [],
      dynamicFacts: result?.dynamicFacts || result?.recentContext || []
    };
  }
  async listMemories(containerTag, limit = 10) {
    const result = await Promise.race([
      this.client.search.memories({
        containerTags: [containerTag],
        limit
      }),
      timeout(TIMEOUT)
    ]);
    if (!result?.results) return [];
    return result.results.map((r) => ({
      id: r.id,
      content: r.content || r.text || "",
      score: r.score,
      createdAt: r.createdAt,
      metadata: r.metadata
    })).sort((a, b) => {
      if (!a.createdAt || !b.createdAt) return 0;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }
  async deleteMemory(memoryId) {
    await Promise.race([this.client.delete({ id: memoryId }), timeout(TIMEOUT)]);
  }
};
function timeout(ms) {
  return new Promise((_, reject) => setTimeout(() => reject(new Error("Request timed out")), ms));
}
__name(timeout, "timeout");

// src/services/config.ts
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";

// src/types.ts
var DEFAULT_CONFIG = {
  similarityThreshold: 0.6,
  maxMemories: 5,
  maxProjectMemories: 10,
  maxProfileItems: 5,
  injectProfile: true,
  containerTagPrefix: "amp",
  compactionThreshold: 0.8,
  filterPrompt: "You are a stateful coding agent memory system. Filter and extract only information that would be useful for a coding assistant to remember across sessions: code patterns, user preferences, architectural decisions, debugging insights, project conventions, and technical context."
};

// src/services/config.ts
var CONFIG_DIR = join(homedir(), ".supermemory-amp");
var CONFIG_FILE = join(CONFIG_DIR, "config.json");
var CREDENTIALS_FILE = join(CONFIG_DIR, "credentials.json");
function ensureConfigDir() {
  if (!existsSync(CONFIG_DIR)) {
    mkdirSync(CONFIG_DIR, { recursive: true, mode: 448 });
  }
}
__name(ensureConfigDir, "ensureConfigDir");
function loadConfig() {
  const config = { ...DEFAULT_CONFIG };
  try {
    if (existsSync(CONFIG_FILE)) {
      const raw = readFileSync(CONFIG_FILE, "utf-8");
      const parsed = JSON.parse(raw);
      Object.assign(config, parsed);
    }
  } catch {
  }
  return config;
}
__name(loadConfig, "loadConfig");
function loadCredentials() {
  try {
    if (existsSync(CREDENTIALS_FILE)) {
      const raw = readFileSync(CREDENTIALS_FILE, "utf-8");
      return JSON.parse(raw);
    }
  } catch {
  }
  return null;
}
__name(loadCredentials, "loadCredentials");
function saveCredentials(apiKey) {
  ensureConfigDir();
  const creds = {
    apiKey,
    createdAt: (/* @__PURE__ */ new Date()).toISOString()
  };
  writeFileSync(CREDENTIALS_FILE, JSON.stringify(creds, null, 2), { mode: 384 });
}
__name(saveCredentials, "saveCredentials");
function deleteCredentials() {
  try {
    const { unlinkSync } = __require("node:fs");
    if (existsSync(CREDENTIALS_FILE)) {
      unlinkSync(CREDENTIALS_FILE);
      return true;
    }
  } catch {
  }
  return false;
}
__name(deleteCredentials, "deleteCredentials");
function getApiKey(config) {
  const envKey = process.env.SUPERMEMORY_API_KEY;
  if (envKey) return envKey;
  if (config.apiKey) return config.apiKey;
  const creds = loadCredentials();
  if (creds?.apiKey) return creds.apiKey;
  return null;
}
__name(getApiKey, "getApiKey");

// src/services/auth.ts
import { createServer } from "node:http";
var AUTH_PORT = 19878;
var AUTH_TIMEOUT = 12e4;
var AUTH_URL = process.env.SUPERMEMORY_AUTH_URL || "https://app.supermemory.ai/auth/connect";
var AUTH_CLIENT = "claude_code";
var SUCCESS_HTML = `<!DOCTYPE html>
<html><head><title>Supermemory Connected</title>
<style>body{font-family:system-ui;display:flex;justify-content:center;align-items:center;min-height:100vh;margin:0;background:#0a0a0a;color:#fff}
.card{text-align:center;padding:2rem;border-radius:12px;background:#1a1a1a;border:1px solid #333;max-width:400px}
h1{color:#22c55e;margin-bottom:0.5rem}p{color:#999}</style></head>
<body><div class="card"><h1>\u2713 Connected</h1><p>Supermemory is connected to Amp. You can close this tab.</p></div></body></html>`;
var ERROR_HTML = `<!DOCTYPE html>
<html><head><title>Connection Failed</title>
<style>body{font-family:system-ui;display:flex;justify-content:center;align-items:center;min-height:100vh;margin:0;background:#0a0a0a;color:#fff}
.card{text-align:center;padding:2rem;border-radius:12px;background:#1a1a1a;border:1px solid #333;max-width:400px}
h1{color:#ef4444;margin-bottom:0.5rem}p{color:#999}</style></head>
<body><div class="card"><h1>\u2717 Failed</h1><p>Could not connect to Supermemory. Please try again.</p></div></body></html>`;
async function startAuthFlow(openUrl) {
  return new Promise((resolve) => {
    let resolved = false;
    const server = createServer((req, res) => {
      if (resolved) return;
      const url = new URL(req.url || "/", `http://localhost:${AUTH_PORT}`);
      if (url.pathname === "/callback") {
        const apiKey = url.searchParams.get("apikey") || url.searchParams.get("apiKey") || url.searchParams.get("api_key");
        if (apiKey && apiKey.startsWith("sm_")) {
          saveCredentials(apiKey);
          res.writeHead(200, { "Content-Type": "text/html" });
          res.end(SUCCESS_HTML);
          resolved = true;
          server.close();
          resolve({ success: true, apiKey });
        } else {
          res.writeHead(400, { "Content-Type": "text/html" });
          res.end(ERROR_HTML);
          resolved = true;
          server.close();
          resolve({ success: false, error: "Invalid API key received" });
        }
      } else {
        res.writeHead(404);
        res.end("Not found");
      }
    });
    server.listen(AUTH_PORT, async () => {
      const callbackUrl = `http://localhost:${AUTH_PORT}/callback`;
      const authUrl = `${AUTH_URL}?callback=${encodeURIComponent(callbackUrl)}&client=${AUTH_CLIENT}`;
      try {
        await openUrl(authUrl);
      } catch {
        resolved = true;
        server.close();
        resolve({ success: false, error: "Could not open browser for authentication" });
      }
    });
    server.on("error", (err) => {
      if (!resolved) {
        resolved = true;
        resolve({ success: false, error: `Auth server error: ${err.message}` });
      }
    });
    setTimeout(() => {
      if (!resolved) {
        resolved = true;
        server.close();
        resolve({ success: false, error: "Authentication timed out after 2 minutes" });
      }
    }, AUTH_TIMEOUT);
  });
}
__name(startAuthFlow, "startAuthFlow");

// src/services/tags.ts
import { createHash } from "node:crypto";
import { execSync } from "node:child_process";
function sha256(input) {
  return createHash("sha256").update(input).digest("hex");
}
__name(sha256, "sha256");
function getGitRoot(cwd) {
  try {
    return execSync("git rev-parse --show-toplevel", {
      cwd,
      encoding: "utf-8",
      stdio: ["pipe", "pipe", "pipe"]
    }).trim();
  } catch {
    return null;
  }
}
__name(getGitRoot, "getGitRoot");
function getGitEmail() {
  try {
    return execSync("git config user.email", {
      encoding: "utf-8",
      stdio: ["pipe", "pipe", "pipe"]
    }).trim();
  } catch {
    return null;
  }
}
__name(getGitEmail, "getGitEmail");
function getGitRemoteName(cwd) {
  try {
    const remote = execSync("git remote get-url origin", {
      cwd,
      encoding: "utf-8",
      stdio: ["pipe", "pipe", "pipe"]
    }).trim();
    const match = remote.match(/\/([^/]+?)(?:\.git)?$/);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}
__name(getGitRemoteName, "getGitRemoteName");
function generateTags(cwd, config) {
  const prefix = config.containerTagPrefix || "amp";
  let userTag;
  if (config.userContainerTag) {
    userTag = config.userContainerTag;
  } else {
    const email = getGitEmail();
    const identifier = email || cwd;
    userTag = `${prefix}_user_${sha256(identifier).slice(0, 16)}`;
  }
  let projectTag;
  if (config.projectContainerTag) {
    projectTag = config.projectContainerTag;
  } else {
    const gitRoot = getGitRoot(cwd);
    const remoteName = getGitRemoteName(cwd);
    if (remoteName) {
      const sanitized = remoteName.replace(/[^a-zA-Z0-9_-]/g, "_").toLowerCase();
      projectTag = `${prefix}_project_${sanitized}`;
    } else {
      const dir = gitRoot || cwd;
      projectTag = `${prefix}_project_${sha256(dir).slice(0, 16)}`;
    }
  }
  return { user: userTag, project: projectTag };
}
__name(generateTags, "generateTags");

// src/services/privacy.ts
function stripPrivateContent(content) {
  return content.replace(/<private>[\s\S]*?<\/private>/gi, "[REDACTED]");
}
__name(stripPrivateContent, "stripPrivateContent");

// src/services/context.ts
function formatContext(profile, userMemories, projectMemories, config) {
  const sections = [];
  if (config.injectProfile && profile) {
    const facts = [
      ...profile.staticFacts.slice(0, config.maxProfileItems),
      ...profile.dynamicFacts.slice(0, 3)
    ];
    if (facts.length > 0) {
      sections.push("## User Profile\n" + facts.map((f) => `- ${f}`).join("\n"));
    }
  }
  if (userMemories.length > 0) {
    const formatted = userMemories.filter((m) => !m.score || m.score >= config.similarityThreshold).slice(0, config.maxMemories).map((m) => {
      const score = m.score ? `[${Math.round(m.score * 100)}%]` : "";
      const age = m.createdAt ? ` (${relativeTime(m.createdAt)})` : "";
      return `- ${score} ${m.content.slice(0, 500)}${age}`;
    }).join("\n");
    if (formatted) {
      sections.push("## Relevant Memories\n" + formatted);
    }
  }
  if (projectMemories.length > 0) {
    const formatted = projectMemories.slice(0, config.maxProjectMemories).map((m) => {
      const score = m.score ? `[${Math.round(m.score * 100)}%]` : "";
      return `- ${score} ${m.content.slice(0, 500)}`;
    }).join("\n");
    if (formatted) {
      sections.push("## Project Knowledge\n" + formatted);
    }
  }
  if (sections.length === 0) return "";
  return [
    "<supermemory-context>",
    "The following context is from your persistent memory (Supermemory).",
    "Use it naturally when relevant \u2014 do not force it into every response.",
    "",
    ...sections,
    "</supermemory-context>"
  ].join("\n");
}
__name(formatContext, "formatContext");
function formatSearchResults(memories, scope) {
  if (memories.length === 0) {
    return `No memories found in ${scope} scope.`;
  }
  const lines = memories.map((m, i) => {
    const score = m.score ? ` (${Math.round(m.score * 100)}% match)` : "";
    const age = m.createdAt ? ` \u2014 ${relativeTime(m.createdAt)}` : "";
    const id = m.id ? `
  ID: ${m.id}` : "";
    return `${i + 1}. ${m.content.slice(0, 800)}${score}${age}${id}`;
  });
  return `Found ${memories.length} memories (${scope}):

${lines.join("\n\n")}`;
}
__name(formatSearchResults, "formatSearchResults");
function formatProfileResults(profile) {
  const sections = [];
  if (profile.staticFacts.length > 0) {
    sections.push("**Profile Facts:**\n" + profile.staticFacts.map((f) => `- ${f}`).join("\n"));
  }
  if (profile.dynamicFacts.length > 0) {
    sections.push(
      "**Recent Context:**\n" + profile.dynamicFacts.map((f) => `- ${f}`).join("\n")
    );
  }
  if (sections.length === 0) {
    return "No profile data available yet. Use Supermemory more to build your profile.";
  }
  return sections.join("\n\n");
}
__name(formatProfileResults, "formatProfileResults");
function formatListResults(memories) {
  if (memories.length === 0) {
    return "No memories stored yet.";
  }
  const lines = memories.map((m, i) => {
    const age = m.createdAt ? ` \u2014 ${relativeTime(m.createdAt)}` : "";
    const type = m.metadata?.type ? ` [${m.metadata.type}]` : "";
    const id = m.id ? `
  ID: ${m.id}` : "";
    return `${i + 1}.${type} ${m.content.slice(0, 400)}${age}${id}`;
  });
  return `Stored memories (${memories.length}):

${lines.join("\n\n")}`;
}
__name(formatListResults, "formatListResults");
function relativeTime(dateStr) {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = now - then;
  const minutes = Math.floor(diff / 6e4);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}
__name(relativeTime, "relativeTime");

// src/plugin.ts
function supermemoryPlugin(amp) {
  const config = loadConfig();
  let client = null;
  let tags = null;
  const injectedSessions = /* @__PURE__ */ new Set();
  function ensureClient() {
    if (client) return client;
    const apiKey = getApiKey(config);
    if (!apiKey) return null;
    client = new SupermemoryClient(apiKey);
    return client;
  }
  __name(ensureClient, "ensureClient");
  amp.on("agent.start", async (event, ctx) => {
    const sessionKey = `${event.id}`;
    if (event.id !== 1) return {};
    const c = ensureClient();
    if (!c) {
      return {
        message: {
          content: '<supermemory-context>\nSupermemory is not connected. Use the "supermemory: login" command (Ctrl-O) to authenticate.\n</supermemory-context>',
          display: true
        }
      };
    }
    let cwd = process.cwd();
    try {
      const result = await ctx.$`pwd`;
      if (result.stdout.trim()) cwd = result.stdout.trim();
    } catch {
    }
    tags = tags || generateTags(cwd, config);
    try {
      const [profile, userMemories, projectMemories] = await Promise.all([
        config.injectProfile ? c.getProfile(tags.user, event.message).catch(() => null) : Promise.resolve(null),
        c.searchMemories(event.message, tags.user, config.maxMemories).catch(() => []),
        c.listMemories(tags.project, config.maxProjectMemories).catch(() => [])
      ]);
      const contextStr = formatContext(profile, userMemories, projectMemories, config);
      if (!contextStr) return {};
      return { message: { content: contextStr, display: true } };
    } catch (err) {
      amp.logger.log("Failed to fetch Supermemory context:", err);
      return {};
    }
  });
  amp.on("agent.end", async (event, ctx) => {
    const c = ensureClient();
    if (!c || !tags) return {};
    if (event.message && event.message.length > 20) {
      try {
        const sessionId = `amp_session_${Date.now()}`;
        await c.addMemory(
          `[User request] ${event.message}`,
          tags.user,
          { type: "session", source: "amp" }
        );
      } catch (err) {
        amp.logger.log("Failed to save session memory:", err);
      }
    }
    return {};
  });
  amp.registerTool({
    name: "supermemory",
    description: `Persistent memory across Amp sessions. Use this tool to save important information, search past memories, view your profile, list stored memories, or forget specific memories.

Modes:
- "save": Save important context (architecture decisions, debugging insights, user preferences, conventions). Content should be a clear, self-contained description. Specify scope "user" for personal or "project" for team-shared.
- "search": Search past memories semantically. Specify scope "user", "project", or "both".
- "profile": View your auto-built profile of preferences and patterns.
- "list": List recent stored memories. Specify scope "user" or "project".
- "forget": Delete a specific memory by ID.

Use this tool proactively when:
- The user asks you to remember something
- You discover important patterns, conventions, or decisions
- You encounter and resolve tricky bugs
- The user shares preferences about coding style or workflow`,
    inputSchema: {
      type: "object",
      properties: {
        mode: {
          type: "string",
          enum: ["save", "search", "profile", "list", "forget"],
          description: "The operation to perform"
        },
        content: {
          type: "string",
          description: 'For "save": the content to remember. For "search": the search query.'
        },
        scope: {
          type: "string",
          enum: ["user", "project", "both"],
          description: 'Memory scope. "user" = personal cross-project memories, "project" = shared project knowledge. Default: "user" for save, "both" for search.'
        },
        memoryId: {
          type: "string",
          description: 'For "forget": the ID of the memory to delete.'
        }
      },
      required: ["mode"]
    },
    async execute(input) {
      const mode = input.mode;
      const content = input.content;
      const scope = input.scope || (mode === "search" ? "both" : "user");
      const memoryId = input.memoryId;
      const c = ensureClient();
      if (!c) {
        return 'Supermemory is not connected. Use the "supermemory: login" command (Ctrl-O) to authenticate, or set SUPERMEMORY_API_KEY environment variable.';
      }
      let cwd = process.cwd();
      tags = tags || generateTags(cwd, config);
      switch (mode) {
        case "save": {
          if (!content) return "Error: content is required for save mode.";
          const sanitized = stripPrivateContent(content);
          const tag = scope === "project" ? tags.project : tags.user;
          const metaType = scope === "project" ? "project-knowledge" : "manual";
          await c.addMemory(sanitized, tag, { type: metaType, source: "amp-tool" });
          return `Memory saved to ${scope} scope.`;
        }
        case "search": {
          if (!content) return "Error: content (query) is required for search mode.";
          const results = [];
          if (scope === "user" || scope === "both") {
            const memories = await c.searchMemories(content, tags.user, config.maxMemories);
            results.push(formatSearchResults(memories, "user"));
          }
          if (scope === "project" || scope === "both") {
            const memories = await c.searchMemories(content, tags.project, config.maxProjectMemories);
            results.push(formatSearchResults(memories, "project"));
          }
          return results.join("\n\n---\n\n");
        }
        case "profile": {
          const tag = scope === "project" ? tags.project : tags.user;
          const profile = await c.getProfile(tag);
          return formatProfileResults(profile);
        }
        case "list": {
          const tag = scope === "project" ? tags.project : tags.user;
          const limit = scope === "project" ? config.maxProjectMemories : config.maxMemories;
          const memories = await c.listMemories(tag, limit);
          return formatListResults(memories);
        }
        case "forget": {
          if (!memoryId) return "Error: memoryId is required for forget mode.";
          await c.deleteMemory(memoryId);
          return `Memory ${memoryId} deleted.`;
        }
        default:
          return `Unknown mode: ${mode}. Use save, search, profile, list, or forget.`;
      }
    }
  });
  amp.registerCommand("login", {
    title: "Login",
    category: "Supermemory",
    description: "Connect to Supermemory for persistent memory across sessions"
  }, async (ctx) => {
    const existingKey = getApiKey(config);
    if (existingKey) {
      const reconnect = await ctx.ui.confirm({
        title: "Already Connected",
        message: "Supermemory is already connected. Do you want to reconnect with a different account?",
        confirmButtonText: "Reconnect"
      });
      if (!reconnect) return;
    }
    await ctx.ui.notify("Opening browser for Supermemory authentication...");
    const result = await startAuthFlow((url) => ctx.system.open(url));
    if (result.success) {
      client = new SupermemoryClient(result.apiKey);
      await ctx.ui.notify("\u2713 Supermemory connected successfully!");
    } else {
      await ctx.ui.notify(`\u2717 Authentication failed: ${result.error}`);
    }
  });
  amp.registerCommand("logout", {
    title: "Logout",
    category: "Supermemory",
    description: "Disconnect from Supermemory"
  }, async (ctx) => {
    const confirmed = await ctx.ui.confirm({
      title: "Logout from Supermemory",
      message: "This will remove your saved credentials. Your memories will remain on the server.",
      confirmButtonText: "Logout"
    });
    if (!confirmed) return;
    deleteCredentials();
    client = null;
    await ctx.ui.notify("Logged out from Supermemory.");
  });
  amp.registerCommand("status", {
    title: "Status",
    category: "Supermemory",
    description: "Show Supermemory connection status and configuration"
  }, async (ctx) => {
    const apiKey = getApiKey(config);
    const connected = !!apiKey;
    const maskedKey = apiKey ? `${apiKey.slice(0, 6)}...${apiKey.slice(-4)}` : "none";
    let cwd = process.cwd();
    const currentTags = generateTags(cwd, config);
    const status = [
      `Connected: ${connected ? "\u2713 Yes" : "\u2717 No"}`,
      `API Key: ${maskedKey}`,
      `User Tag: ${currentTags.user}`,
      `Project Tag: ${currentTags.project}`,
      `Profile Injection: ${config.injectProfile ? "enabled" : "disabled"}`,
      `Max Memories: ${config.maxMemories}`,
      `Max Project Memories: ${config.maxProjectMemories}`
    ].join("\n");
    await ctx.ui.notify(status);
  });
}
__name(supermemoryPlugin, "supermemoryPlugin");
export {
  supermemoryPlugin as default
};
