import { Interpreter } from './snippets/dioxus-web-d9f09a47683c47a5/src/interpreter.js';

const lAudioContext = (typeof AudioContext !== 'undefined' ? AudioContext : (typeof webkitAudioContext !== 'undefined' ? webkitAudioContext : undefined));
let wasm;

const heap = new Array(32).fill(undefined);

heap.push(undefined, null, true, false);

function getObject(idx) { return heap[idx]; }

let heap_next = heap.length;

function dropObject(idx) {
    if (idx < 36) return;
    heap[idx] = heap_next;
    heap_next = idx;
}

function takeObject(idx) {
    const ret = getObject(idx);
    dropObject(idx);
    return ret;
}

let cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });

cachedTextDecoder.decode();

let cachegetUint8Memory0 = null;
function getUint8Memory0() {
    if (cachegetUint8Memory0 === null || cachegetUint8Memory0.buffer !== wasm.memory.buffer) {
        cachegetUint8Memory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachegetUint8Memory0;
}

function getStringFromWasm0(ptr, len) {
    return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
}

function addHeapObject(obj) {
    if (heap_next === heap.length) heap.push(heap.length + 1);
    const idx = heap_next;
    heap_next = heap[idx];

    heap[idx] = obj;
    return idx;
}

let WASM_VECTOR_LEN = 0;

let cachedTextEncoder = new TextEncoder('utf-8');

const encodeString = (typeof cachedTextEncoder.encodeInto === 'function'
    ? function (arg, view) {
    return cachedTextEncoder.encodeInto(arg, view);
}
    : function (arg, view) {
    const buf = cachedTextEncoder.encode(arg);
    view.set(buf);
    return {
        read: arg.length,
        written: buf.length
    };
});

function passStringToWasm0(arg, malloc, realloc) {

    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length);
        getUint8Memory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len);

    const mem = getUint8Memory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }

    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3);
        const view = getUint8Memory0().subarray(ptr + offset, ptr + len);
        const ret = encodeString(arg, view);

        offset += ret.written;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

function isLikeNone(x) {
    return x === undefined || x === null;
}

let cachegetInt32Memory0 = null;
function getInt32Memory0() {
    if (cachegetInt32Memory0 === null || cachegetInt32Memory0.buffer !== wasm.memory.buffer) {
        cachegetInt32Memory0 = new Int32Array(wasm.memory.buffer);
    }
    return cachegetInt32Memory0;
}

let cachegetFloat64Memory0 = null;
function getFloat64Memory0() {
    if (cachegetFloat64Memory0 === null || cachegetFloat64Memory0.buffer !== wasm.memory.buffer) {
        cachegetFloat64Memory0 = new Float64Array(wasm.memory.buffer);
    }
    return cachegetFloat64Memory0;
}

function debugString(val) {
    // primitive types
    const type = typeof val;
    if (type == 'number' || type == 'boolean' || val == null) {
        return  `${val}`;
    }
    if (type == 'string') {
        return `"${val}"`;
    }
    if (type == 'symbol') {
        const description = val.description;
        if (description == null) {
            return 'Symbol';
        } else {
            return `Symbol(${description})`;
        }
    }
    if (type == 'function') {
        const name = val.name;
        if (typeof name == 'string' && name.length > 0) {
            return `Function(${name})`;
        } else {
            return 'Function';
        }
    }
    // objects
    if (Array.isArray(val)) {
        const length = val.length;
        let debug = '[';
        if (length > 0) {
            debug += debugString(val[0]);
        }
        for(let i = 1; i < length; i++) {
            debug += ', ' + debugString(val[i]);
        }
        debug += ']';
        return debug;
    }
    // Test for built-in
    const builtInMatches = /\[object ([^\]]+)\]/.exec(toString.call(val));
    let className;
    if (builtInMatches.length > 1) {
        className = builtInMatches[1];
    } else {
        // Failed to match the standard '[object ClassName]'
        return toString.call(val);
    }
    if (className == 'Object') {
        // we're a user defined class or Object
        // JSON.stringify avoids problems with cycles, and is generally much
        // easier than looping through ownProperties of `val`.
        try {
            return 'Object(' + JSON.stringify(val) + ')';
        } catch (_) {
            return 'Object';
        }
    }
    // errors
    if (val instanceof Error) {
        return `${val.name}: ${val.message}\n${val.stack}`;
    }
    // TODO we could test for more things here, like `Set`s and `Map`s.
    return className;
}

function makeMutClosure(arg0, arg1, dtor, f) {
    const state = { a: arg0, b: arg1, cnt: 1, dtor };
    const real = (...args) => {
        // First up with a closure we increment the internal reference
        // count. This ensures that the Rust closure environment won't
        // be deallocated while we're invoking it.
        state.cnt++;
        const a = state.a;
        state.a = 0;
        try {
            return f(a, state.b, ...args);
        } finally {
            if (--state.cnt === 0) {
                wasm.__wbindgen_export_2.get(state.dtor)(a, state.b);

            } else {
                state.a = a;
            }
        }
    };
    real.original = state;

    return real;
}
function __wbg_adapter_34(arg0, arg1) {
    wasm._dyn_core__ops__function__FnMut_____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__hb30a5c89d791797a(arg0, arg1);
}

function __wbg_adapter_37(arg0, arg1, arg2) {
    wasm._dyn_core__ops__function__FnMut__A____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__heeba9495f2eb409c(arg0, arg1, addHeapObject(arg2));
}

let stack_pointer = 32;

function addBorrowedObject(obj) {
    if (stack_pointer == 1) throw new Error('out of js stack');
    heap[--stack_pointer] = obj;
    return stack_pointer;
}
function __wbg_adapter_40(arg0, arg1, arg2) {
    try {
        wasm._dyn_core__ops__function__FnMut___A____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__h20c70f1c78b99fb1(arg0, arg1, addBorrowedObject(arg2));
    } finally {
        heap[stack_pointer++] = undefined;
    }
}

function makeClosure(arg0, arg1, dtor, f) {
    const state = { a: arg0, b: arg1, cnt: 1, dtor };
    const real = (...args) => {
        // First up with a closure we increment the internal reference
        // count. This ensures that the Rust closure environment won't
        // be deallocated while we're invoking it.
        state.cnt++;
        try {
            return f(state.a, state.b, ...args);
        } finally {
            if (--state.cnt === 0) {
                wasm.__wbindgen_export_2.get(state.dtor)(state.a, state.b);
                state.a = 0;

            }
        }
    };
    real.original = state;

    return real;
}
function __wbg_adapter_43(arg0, arg1, arg2) {
    wasm._dyn_core__ops__function__Fn__A____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__h02fac5db224ebdbc(arg0, arg1, addHeapObject(arg2));
}

function __wbg_adapter_46(arg0, arg1, arg2) {
    wasm._dyn_core__ops__function__FnMut__A____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__h8bd7357b6936cea9(arg0, arg1, addHeapObject(arg2));
}

function __wbg_adapter_49(arg0, arg1) {
    wasm._dyn_core__ops__function__FnMut_____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__ha2a0a24996bf691a(arg0, arg1);
}

function __wbg_adapter_52(arg0, arg1, arg2) {
    try {
        wasm._dyn_core__ops__function__FnMut___A____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__hcfa9484b39dde20c(arg0, arg1, addBorrowedObject(arg2));
    } finally {
        heap[stack_pointer++] = undefined;
    }
}

const u32CvtShim = new Uint32Array(2);

const uint64CvtShim = new BigUint64Array(u32CvtShim.buffer);

function getCachedStringFromWasm0(ptr, len) {
    if (ptr === 0) {
        return getObject(len);
    } else {
        return getStringFromWasm0(ptr, len);
    }
}

function handleError(f, args) {
    try {
        return f.apply(this, args);
    } catch (e) {
        wasm.__wbindgen_exn_store(addHeapObject(e));
    }
}

function notDefined(what) { return () => { throw new Error(`${what} is not defined`); }; }

let cachegetUint32Memory0 = null;
function getUint32Memory0() {
    if (cachegetUint32Memory0 === null || cachegetUint32Memory0.buffer !== wasm.memory.buffer) {
        cachegetUint32Memory0 = new Uint32Array(wasm.memory.buffer);
    }
    return cachegetUint32Memory0;
}

function getArrayJsValueFromWasm0(ptr, len) {
    const mem = getUint32Memory0();
    const slice = mem.subarray(ptr / 4, ptr / 4 + len);
    const result = [];
    for (let i = 0; i < slice.length; i++) {
        result.push(takeObject(slice[i]));
    }
    return result;
}

async function load(module, imports) {
    if (typeof Response === 'function' && module instanceof Response) {
        if (typeof WebAssembly.instantiateStreaming === 'function') {
            try {
                return await WebAssembly.instantiateStreaming(module, imports);

            } catch (e) {
                if (module.headers.get('Content-Type') != 'application/wasm') {
                    console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);

                } else {
                    throw e;
                }
            }
        }

        const bytes = await module.arrayBuffer();
        return await WebAssembly.instantiate(bytes, imports);

    } else {
        const instance = await WebAssembly.instantiate(module, imports);

        if (instance instanceof WebAssembly.Instance) {
            return { instance, module };

        } else {
            return instance;
        }
    }
}

async function init(input) {
    if (typeof input === 'undefined') {
        input = new URL('index-1eb9a63c8447dd16_bg.wasm', import.meta.url);
    }
    const imports = {};
    imports.wbg = {};
    imports.wbg.__wbindgen_object_drop_ref = function(arg0) {
        takeObject(arg0);
    };
    imports.wbg.__wbindgen_string_new = function(arg0, arg1) {
        var ret = getStringFromWasm0(arg0, arg1);
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_cb_drop = function(arg0) {
        const obj = takeObject(arg0).original;
        if (obj.cnt-- == 1) {
            obj.a = 0;
            return true;
        }
        var ret = false;
        return ret;
    };
    imports.wbg.__wbindgen_object_clone_ref = function(arg0) {
        var ret = getObject(arg0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_new_48900979f8f40f34 = function(arg0) {
        var ret = new Interpreter(takeObject(arg0));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_setnode_8377ee4c1ddf6dfd = function(arg0, arg1, arg2) {
        getObject(arg0).set_node(arg1 >>> 0, takeObject(arg2));
    };
    imports.wbg.__wbg_PushRoot_522f0ca4895fd456 = function(arg0, arg1, arg2) {
        u32CvtShim[0] = arg1;
        u32CvtShim[1] = arg2;
        const n0 = uint64CvtShim[0];
        getObject(arg0).PushRoot(n0);
    };
    imports.wbg.__wbg_AppendChildren_635b7d595ea71402 = function(arg0, arg1) {
        getObject(arg0).AppendChildren(arg1 >>> 0);
    };
    imports.wbg.__wbg_ReplaceWith_c3276a33dadd8922 = function(arg0, arg1, arg2, arg3) {
        u32CvtShim[0] = arg1;
        u32CvtShim[1] = arg2;
        const n0 = uint64CvtShim[0];
        getObject(arg0).ReplaceWith(n0, arg3 >>> 0);
    };
    imports.wbg.__wbg_InsertAfter_da4a45abf382e33d = function(arg0, arg1, arg2, arg3) {
        u32CvtShim[0] = arg1;
        u32CvtShim[1] = arg2;
        const n0 = uint64CvtShim[0];
        getObject(arg0).InsertAfter(n0, arg3 >>> 0);
    };
    imports.wbg.__wbg_InsertBefore_a34036be3e2bc4cc = function(arg0, arg1, arg2, arg3) {
        u32CvtShim[0] = arg1;
        u32CvtShim[1] = arg2;
        const n0 = uint64CvtShim[0];
        getObject(arg0).InsertBefore(n0, arg3 >>> 0);
    };
    imports.wbg.__wbg_Remove_9c7e3aa34ef0a395 = function(arg0, arg1, arg2) {
        u32CvtShim[0] = arg1;
        u32CvtShim[1] = arg2;
        const n0 = uint64CvtShim[0];
        getObject(arg0).Remove(n0);
    };
    imports.wbg.__wbg_CreateTextNode_bdb1fb6b6ebe2710 = function(arg0, arg1, arg2, arg3, arg4) {
        var v0 = getCachedStringFromWasm0(arg1, arg2);
        u32CvtShim[0] = arg3;
        u32CvtShim[1] = arg4;
        const n1 = uint64CvtShim[0];
        getObject(arg0).CreateTextNode(v0, n1);
    };
    imports.wbg.__wbg_CreateElement_1eadb75f94d0cd88 = function(arg0, arg1, arg2, arg3, arg4) {
        var v0 = getCachedStringFromWasm0(arg1, arg2);
        u32CvtShim[0] = arg3;
        u32CvtShim[1] = arg4;
        const n1 = uint64CvtShim[0];
        getObject(arg0).CreateElement(v0, n1);
    };
    imports.wbg.__wbg_CreateElementNs_0a8b5df300b16678 = function(arg0, arg1, arg2, arg3, arg4, arg5, arg6) {
        var v0 = getCachedStringFromWasm0(arg1, arg2);
        u32CvtShim[0] = arg3;
        u32CvtShim[1] = arg4;
        const n1 = uint64CvtShim[0];
        var v2 = getCachedStringFromWasm0(arg5, arg6);
        getObject(arg0).CreateElementNs(v0, n1, v2);
    };
    imports.wbg.__wbg_CreatePlaceholder_6eba6b6fd8cf0f62 = function(arg0, arg1, arg2) {
        u32CvtShim[0] = arg1;
        u32CvtShim[1] = arg2;
        const n0 = uint64CvtShim[0];
        getObject(arg0).CreatePlaceholder(n0);
    };
    imports.wbg.__wbg_NewEventListener_3968909e0cd1e625 = function(arg0, arg1, arg2, arg3, arg4, arg5) {
        var v0 = getCachedStringFromWasm0(arg1, arg2);
        u32CvtShim[0] = arg3;
        u32CvtShim[1] = arg4;
        const n1 = uint64CvtShim[0];
        getObject(arg0).NewEventListener(v0, n1, getObject(arg5));
    };
    imports.wbg.__wbg_RemoveEventListener_a9d4a9aa8f93852a = function(arg0, arg1, arg2, arg3, arg4) {
        u32CvtShim[0] = arg1;
        u32CvtShim[1] = arg2;
        const n0 = uint64CvtShim[0];
        var v1 = getCachedStringFromWasm0(arg3, arg4);
        getObject(arg0).RemoveEventListener(n0, v1);
    };
    imports.wbg.__wbg_SetText_9237827d957fd2f5 = function(arg0, arg1, arg2, arg3, arg4) {
        u32CvtShim[0] = arg1;
        u32CvtShim[1] = arg2;
        const n0 = uint64CvtShim[0];
        var v1 = getCachedStringFromWasm0(arg3, arg4);
        getObject(arg0).SetText(n0, v1);
    };
    imports.wbg.__wbg_SetAttribute_35a0203984ff28a7 = function(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8) {
        u32CvtShim[0] = arg1;
        u32CvtShim[1] = arg2;
        const n0 = uint64CvtShim[0];
        var v1 = getCachedStringFromWasm0(arg3, arg4);
        var v2 = getCachedStringFromWasm0(arg5, arg6);
        var v3 = getCachedStringFromWasm0(arg7, arg8);
        getObject(arg0).SetAttribute(n0, v1, v2, v3);
    };
    imports.wbg.__wbg_RemoveAttribute_d591f0c53f20381f = function(arg0, arg1, arg2, arg3, arg4) {
        u32CvtShim[0] = arg1;
        u32CvtShim[1] = arg2;
        const n0 = uint64CvtShim[0];
        var v1 = getCachedStringFromWasm0(arg3, arg4);
        getObject(arg0).RemoveAttribute(n0, v1);
    };
    imports.wbg.__wbindgen_is_function = function(arg0) {
        var ret = typeof(getObject(arg0)) === 'function';
        return ret;
    };
    imports.wbg.__wbg_new_693216e109162396 = function() {
        var ret = new Error();
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_stack_0ddaca5d1abfb52f = function(arg0, arg1) {
        var ret = getObject(arg1).stack;
        var ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len0;
        getInt32Memory0()[arg0 / 4 + 0] = ptr0;
    };
    imports.wbg.__wbg_error_09919627ac0992f5 = function(arg0, arg1) {
        var v0 = getCachedStringFromWasm0(arg0, arg1);
    if (arg0 !== 0) { wasm.__wbindgen_free(arg0, arg1); }
    console.error(v0);
};
imports.wbg.__wbg_clearTimeout_d8b36ad8fa330187 = typeof clearTimeout == 'function' ? clearTimeout : notDefined('clearTimeout');
imports.wbg.__wbg_setTimeout_290c28f3580809b6 = function() { return handleError(function (arg0, arg1) {
    var ret = setTimeout(getObject(arg0), arg1);
    return ret;
}, arguments) };
imports.wbg.__wbindgen_string_get = function(arg0, arg1) {
    const obj = getObject(arg1);
    var ret = typeof(obj) === 'string' ? obj : undefined;
    var ptr0 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len0;
    getInt32Memory0()[arg0 / 4 + 0] = ptr0;
};
imports.wbg.__wbindgen_is_string = function(arg0) {
    var ret = typeof(getObject(arg0)) === 'string';
    return ret;
};
imports.wbg.__wbindgen_is_object = function(arg0) {
    const val = getObject(arg0);
    var ret = typeof(val) === 'object' && val !== null;
    return ret;
};
imports.wbg.__wbindgen_number_new = function(arg0) {
    var ret = arg0;
    return addHeapObject(ret);
};
imports.wbg.__wbindgen_is_null = function(arg0) {
    var ret = getObject(arg0) === null;
    return ret;
};
imports.wbg.__wbindgen_is_undefined = function(arg0) {
    var ret = getObject(arg0) === undefined;
    return ret;
};
imports.wbg.__wbindgen_boolean_get = function(arg0) {
    const v = getObject(arg0);
    var ret = typeof(v) === 'boolean' ? (v ? 1 : 0) : 2;
    return ret;
};
imports.wbg.__wbindgen_number_get = function(arg0, arg1) {
    const obj = getObject(arg1);
    var ret = typeof(obj) === 'number' ? obj : undefined;
    getFloat64Memory0()[arg0 / 8 + 1] = isLikeNone(ret) ? 0 : ret;
    getInt32Memory0()[arg0 / 4 + 0] = !isLikeNone(ret);
};
imports.wbg.__wbg_get_2d1407dba3452350 = function(arg0, arg1) {
    var ret = getObject(arg0)[takeObject(arg1)];
    return addHeapObject(ret);
};
imports.wbg.__wbg_set_f1a4ac8f3a605b11 = function(arg0, arg1, arg2) {
    getObject(arg0)[takeObject(arg1)] = takeObject(arg2);
};
imports.wbg.__wbg_log_06b7ffc63a0f8bee = function(arg0, arg1) {
    var v0 = getArrayJsValueFromWasm0(arg0, arg1).slice();
    wasm.__wbindgen_free(arg0, arg1 * 4);
    console.log(...v0);
};
imports.wbg.__wbg_instanceof_Window_434ce1849eb4e0fc = function(arg0) {
    var ret = getObject(arg0) instanceof Window;
    return ret;
};
imports.wbg.__wbg_document_5edd43643d1060d9 = function(arg0) {
    var ret = getObject(arg0).document;
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
};
imports.wbg.__wbg_location_11472bb76bf5bbca = function(arg0) {
    var ret = getObject(arg0).location;
    return addHeapObject(ret);
};
imports.wbg.__wbg_history_52cfc93c824e772b = function() { return handleError(function (arg0) {
    var ret = getObject(arg0).history;
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_navigator_0e0588c949560476 = function(arg0) {
    var ret = getObject(arg0).navigator;
    return addHeapObject(ret);
};
imports.wbg.__wbg_requestAnimationFrame_0c71cd3c6779a371 = function() { return handleError(function (arg0, arg1) {
    var ret = getObject(arg0).requestAnimationFrame(getObject(arg1));
    return ret;
}, arguments) };
imports.wbg.__wbg_requestIdleCallback_83096961d4f988d3 = function() { return handleError(function (arg0, arg1) {
    var ret = getObject(arg0).requestIdleCallback(getObject(arg1));
    return ret;
}, arguments) };
imports.wbg.__wbg_createElement_d017b8d2af99bab9 = function() { return handleError(function (arg0, arg1, arg2) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
    var ret = getObject(arg0).createElement(v0);
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_getElementById_b30e88aff96f66a1 = function(arg0, arg1, arg2) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
    var ret = getObject(arg0).getElementById(v0);
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
};
imports.wbg.__wbg_new_7b23bc5a2d082b0d = function() { return handleError(function () {
    var ret = new lAudioContext();
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_createMediaStreamDestination_0b39000b369b4cc1 = function() { return handleError(function (arg0) {
    var ret = getObject(arg0).createMediaStreamDestination();
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_createMediaStreamSource_3e10fb1a73ec683b = function() { return handleError(function (arg0, arg1) {
    var ret = getObject(arg0).createMediaStreamSource(getObject(arg1));
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_newwithbuffersourcesequence_d7f10fb669e7d2d8 = function() { return handleError(function (arg0) {
    var ret = new Blob(getObject(arg0));
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_addEventListener_55682f77717d7665 = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
    getObject(arg0).addEventListener(v0, getObject(arg3), getObject(arg4));
}, arguments) };
imports.wbg.__wbg_removeEventListener_9cd36e5806463d5d = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
    getObject(arg0).removeEventListener(v0, getObject(arg3), arg4 !== 0);
}, arguments) };
imports.wbg.__wbg_instanceof_HtmlVideoElement_78748c2f476b026e = function(arg0) {
    var ret = getObject(arg0) instanceof HTMLVideoElement;
    return ret;
};
imports.wbg.__wbg_newwithtracks_7e7143f635f94136 = function() { return handleError(function (arg0) {
    var ret = new MediaStream(getObject(arg0));
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_getAudioTracks_b452fb6fb9718dae = function(arg0) {
    var ret = getObject(arg0).getAudioTracks();
    return addHeapObject(ret);
};
imports.wbg.__wbg_getTracks_ba7ed3118f55bfb4 = function(arg0) {
    var ret = getObject(arg0).getTracks();
    return addHeapObject(ret);
};
imports.wbg.__wbg_getVideoTracks_30f5b71836410ca9 = function(arg0) {
    var ret = getObject(arg0).getVideoTracks();
    return addHeapObject(ret);
};
imports.wbg.__wbg_pageX_41351f8d39f32f3b = function(arg0) {
    var ret = getObject(arg0).pageX;
    return ret;
};
imports.wbg.__wbg_pageY_c0e51cfead96c94d = function(arg0) {
    var ret = getObject(arg0).pageY;
    return ret;
};
imports.wbg.__wbg_which_a82f3f5ff4c2de7b = function(arg0) {
    var ret = getObject(arg0).which;
    return ret;
};
imports.wbg.__wbg_data_fe99f57fcbb6e157 = function(arg0) {
    var ret = getObject(arg0).data;
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
};
imports.wbg.__wbg_state_582d717f9eed0fc9 = function() { return handleError(function (arg0) {
    var ret = getObject(arg0).state;
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_pushState_89ce908020e1d6aa = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5) {
    var v0 = getCachedStringFromWasm0(arg2, arg3);
    var v1 = getCachedStringFromWasm0(arg4, arg5);
    getObject(arg0).pushState(getObject(arg1), v0, v1);
}, arguments) };
imports.wbg.__wbg_pathname_d0014089875ea691 = function() { return handleError(function (arg0, arg1) {
    var ret = getObject(arg1).pathname;
    var ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len0;
    getInt32Memory0()[arg0 / 4 + 0] = ptr0;
}, arguments) };
imports.wbg.__wbg_search_7e1c9ba7f3985c36 = function() { return handleError(function (arg0, arg1) {
    var ret = getObject(arg1).search;
    var ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len0;
    getInt32Memory0()[arg0 / 4 + 0] = ptr0;
}, arguments) };
imports.wbg.__wbg_hash_2f90ddae1e6efe5f = function() { return handleError(function (arg0, arg1) {
    var ret = getObject(arg1).hash;
    var ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len0;
    getInt32Memory0()[arg0 / 4 + 0] = ptr0;
}, arguments) };
imports.wbg.__wbg_setonended_ebcc56e0b0bd7fbc = function(arg0, arg1) {
    getObject(arg0).onended = getObject(arg1);
};
imports.wbg.__wbg_stop_193f790c38f39d77 = function(arg0) {
    getObject(arg0).stop();
};
imports.wbg.__wbg_instanceof_Node_235c78aca8f70c08 = function(arg0) {
    var ret = getObject(arg0) instanceof Node;
    return ret;
};
imports.wbg.__wbg_parentElement_96e1e07348340043 = function(arg0) {
    var ret = getObject(arg0).parentElement;
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
};
imports.wbg.__wbg_childNodes_2cc9324ea7605e96 = function(arg0) {
    var ret = getObject(arg0).childNodes;
    return addHeapObject(ret);
};
imports.wbg.__wbg_textContent_dbe4d2d612abcd96 = function(arg0, arg1) {
    var ret = getObject(arg1).textContent;
    var ptr0 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len0;
    getInt32Memory0()[arg0 / 4 + 0] = ptr0;
};
imports.wbg.__wbg_settextContent_07dfb193b5deabbc = function(arg0, arg1, arg2) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
    getObject(arg0).textContent = v0;
};
imports.wbg.__wbg_instanceof_Text_2b91a768db957a84 = function(arg0) {
    var ret = getObject(arg0) instanceof Text;
    return ret;
};
imports.wbg.__wbg_instanceof_CompositionEvent_98c7ac3087e63202 = function(arg0) {
    var ret = getObject(arg0) instanceof CompositionEvent;
    return ret;
};
imports.wbg.__wbg_data_9562112603a9aa89 = function(arg0, arg1) {
    var ret = getObject(arg1).data;
    var ptr0 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len0;
    getInt32Memory0()[arg0 / 4 + 0] = ptr0;
};
imports.wbg.__wbg_instanceof_IdleDeadline_4fad2202696b050a = function(arg0) {
    var ret = getObject(arg0) instanceof IdleDeadline;
    return ret;
};
imports.wbg.__wbg_timeRemaining_a95c5045575c3f7f = function(arg0) {
    var ret = getObject(arg0).timeRemaining();
    return ret;
};
imports.wbg.__wbg_instanceof_MouseEvent_e20234cd6f6ebeb5 = function(arg0) {
    var ret = getObject(arg0) instanceof MouseEvent;
    return ret;
};
imports.wbg.__wbg_screenX_04a681cd21c0ca9b = function(arg0) {
    var ret = getObject(arg0).screenX;
    return ret;
};
imports.wbg.__wbg_screenY_a78aa0201d03a4e8 = function(arg0) {
    var ret = getObject(arg0).screenY;
    return ret;
};
imports.wbg.__wbg_clientX_849ccdf456d662ac = function(arg0) {
    var ret = getObject(arg0).clientX;
    return ret;
};
imports.wbg.__wbg_clientY_1aaff30fe0cd0876 = function(arg0) {
    var ret = getObject(arg0).clientY;
    return ret;
};
imports.wbg.__wbg_ctrlKey_4e536bedb069129f = function(arg0) {
    var ret = getObject(arg0).ctrlKey;
    return ret;
};
imports.wbg.__wbg_shiftKey_cc93bd2f12bfcc9c = function(arg0) {
    var ret = getObject(arg0).shiftKey;
    return ret;
};
imports.wbg.__wbg_altKey_d24e3f7e465410ec = function(arg0) {
    var ret = getObject(arg0).altKey;
    return ret;
};
imports.wbg.__wbg_metaKey_0b396e35a4941247 = function(arg0) {
    var ret = getObject(arg0).metaKey;
    return ret;
};
imports.wbg.__wbg_button_a18f33eb55774d89 = function(arg0) {
    var ret = getObject(arg0).button;
    return ret;
};
imports.wbg.__wbg_buttons_974d3032e355335f = function(arg0) {
    var ret = getObject(arg0).buttons;
    return ret;
};
imports.wbg.__wbg_instanceof_HtmlTextAreaElement_16f2c6ca1b8ccd65 = function(arg0) {
    var ret = getObject(arg0) instanceof HTMLTextAreaElement;
    return ret;
};
imports.wbg.__wbg_value_d3a30bc2c7caf357 = function(arg0, arg1) {
    var ret = getObject(arg1).value;
    var ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len0;
    getInt32Memory0()[arg0 / 4 + 0] = ptr0;
};
imports.wbg.__wbg_state_e51ee6eca56606f1 = function(arg0) {
    var ret = getObject(arg0).state;
    return addHeapObject(ret);
};
imports.wbg.__wbg_setondataavailable_3fe981dbcea42c78 = function(arg0, arg1) {
    getObject(arg0).ondataavailable = getObject(arg1);
};
imports.wbg.__wbg_setonstart_bd6fa64419f535f5 = function(arg0, arg1) {
    getObject(arg0).onstart = getObject(arg1);
};
imports.wbg.__wbg_setonstop_bd98f37a871fc3ff = function(arg0, arg1) {
    getObject(arg0).onstop = getObject(arg1);
};
imports.wbg.__wbg_newwithmediastream_593ddf780173537f = function() { return handleError(function (arg0) {
    var ret = new MediaRecorder(getObject(arg0));
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_pause_276e363bd784e187 = function() { return handleError(function (arg0) {
    getObject(arg0).pause();
}, arguments) };
imports.wbg.__wbg_resume_dc61a775378565a2 = function() { return handleError(function (arg0) {
    getObject(arg0).resume();
}, arguments) };
imports.wbg.__wbg_start_fd19f05a2982f1d4 = function() { return handleError(function (arg0, arg1) {
    getObject(arg0).start(arg1);
}, arguments) };
imports.wbg.__wbg_stop_9cef848ff503e2d7 = function() { return handleError(function (arg0) {
    getObject(arg0).stop();
}, arguments) };
imports.wbg.__wbg_createObjectURL_c7ec2d7d39afe850 = function() { return handleError(function (arg0, arg1) {
    var ret = URL.createObjectURL(getObject(arg1));
    var ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len0;
    getInt32Memory0()[arg0 / 4 + 0] = ptr0;
}, arguments) };
imports.wbg.__wbg_instanceof_WheelEvent_4b1a05cbd5815664 = function(arg0) {
    var ret = getObject(arg0) instanceof WheelEvent;
    return ret;
};
imports.wbg.__wbg_deltaX_df228181f4d1a561 = function(arg0) {
    var ret = getObject(arg0).deltaX;
    return ret;
};
imports.wbg.__wbg_deltaY_afa6edde136e1500 = function(arg0) {
    var ret = getObject(arg0).deltaY;
    return ret;
};
imports.wbg.__wbg_deltaZ_30dcbd02ca271c39 = function(arg0) {
    var ret = getObject(arg0).deltaZ;
    return ret;
};
imports.wbg.__wbg_deltaMode_ed9d7974a0c11323 = function(arg0) {
    var ret = getObject(arg0).deltaMode;
    return ret;
};
imports.wbg.__wbg_instanceof_Element_c9423704dd5d9b1d = function(arg0) {
    var ret = getObject(arg0) instanceof Element;
    return ret;
};
imports.wbg.__wbg_getAttribute_25ddac571fec98e1 = function(arg0, arg1, arg2, arg3) {
    var v0 = getCachedStringFromWasm0(arg2, arg3);
    var ret = getObject(arg1).getAttribute(v0);
    var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len1 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len1;
    getInt32Memory0()[arg0 / 4 + 0] = ptr1;
};
imports.wbg.__wbg_setAttribute_1776fcc9b98d464e = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
    var v1 = getCachedStringFromWasm0(arg3, arg4);
    getObject(arg0).setAttribute(v0, v1);
}, arguments) };
imports.wbg.__wbg_instanceof_HtmlElement_d3e8f1c1d6788b24 = function(arg0) {
    var ret = getObject(arg0) instanceof HTMLElement;
    return ret;
};
imports.wbg.__wbg_click_7ee23722788fc1b8 = function(arg0) {
    getObject(arg0).click();
};
imports.wbg.__wbg_instanceof_AnimationEvent_8cf515b4164539c2 = function(arg0) {
    var ret = getObject(arg0) instanceof AnimationEvent;
    return ret;
};
imports.wbg.__wbg_animationName_adbb951bd855fd25 = function(arg0, arg1) {
    var ret = getObject(arg1).animationName;
    var ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len0;
    getInt32Memory0()[arg0 / 4 + 0] = ptr0;
};
imports.wbg.__wbg_elapsedTime_2bfabf1ffd1449f6 = function(arg0) {
    var ret = getObject(arg0).elapsedTime;
    return ret;
};
imports.wbg.__wbg_pseudoElement_f440b49d6733a4f1 = function(arg0, arg1) {
    var ret = getObject(arg1).pseudoElement;
    var ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len0;
    getInt32Memory0()[arg0 / 4 + 0] = ptr0;
};
imports.wbg.__wbg_instanceof_HtmlInputElement_8969541a2a0bded0 = function(arg0) {
    var ret = getObject(arg0) instanceof HTMLInputElement;
    return ret;
};
imports.wbg.__wbg_checked_5b6eab0ab31f5d34 = function(arg0) {
    var ret = getObject(arg0).checked;
    return ret;
};
imports.wbg.__wbg_type_f7dc0f33611f497c = function(arg0, arg1) {
    var ret = getObject(arg1).type;
    var ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len0;
    getInt32Memory0()[arg0 / 4 + 0] = ptr0;
};
imports.wbg.__wbg_value_fc1c354d1a0e9714 = function(arg0, arg1) {
    var ret = getObject(arg1).value;
    var ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len0;
    getInt32Memory0()[arg0 / 4 + 0] = ptr0;
};
imports.wbg.__wbg_stream_bcc0c953f6d567e9 = function(arg0) {
    var ret = getObject(arg0).stream;
    return addHeapObject(ret);
};
imports.wbg.__wbg_instanceof_PointerEvent_7a157d9f2eb5fc33 = function(arg0) {
    var ret = getObject(arg0) instanceof PointerEvent;
    return ret;
};
imports.wbg.__wbg_pointerId_60c6c29cc58f32a9 = function(arg0) {
    var ret = getObject(arg0).pointerId;
    return ret;
};
imports.wbg.__wbg_width_2cc86e9ec447ca00 = function(arg0) {
    var ret = getObject(arg0).width;
    return ret;
};
imports.wbg.__wbg_height_1fe88e19b9767a03 = function(arg0) {
    var ret = getObject(arg0).height;
    return ret;
};
imports.wbg.__wbg_pressure_37cef495bc1ea47f = function(arg0) {
    var ret = getObject(arg0).pressure;
    return ret;
};
imports.wbg.__wbg_tangentialPressure_33f4ea2cd1cda77f = function(arg0) {
    var ret = getObject(arg0).tangentialPressure;
    return ret;
};
imports.wbg.__wbg_tiltX_3f463ec69e4f7b1f = function(arg0) {
    var ret = getObject(arg0).tiltX;
    return ret;
};
imports.wbg.__wbg_tiltY_c048ee33d0c56e13 = function(arg0) {
    var ret = getObject(arg0).tiltY;
    return ret;
};
imports.wbg.__wbg_twist_fdd6e53521038b9d = function(arg0) {
    var ret = getObject(arg0).twist;
    return ret;
};
imports.wbg.__wbg_pointerType_d791634374f3f4d4 = function(arg0, arg1) {
    var ret = getObject(arg1).pointerType;
    var ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len0;
    getInt32Memory0()[arg0 / 4 + 0] = ptr0;
};
imports.wbg.__wbg_isPrimary_a34bca42dea9ee74 = function(arg0) {
    var ret = getObject(arg0).isPrimary;
    return ret;
};
imports.wbg.__wbg_instanceof_TouchEvent_6f8e0e90b91dcab3 = function(arg0) {
    var ret = getObject(arg0) instanceof TouchEvent;
    return ret;
};
imports.wbg.__wbg_altKey_a69529f01610f7e8 = function(arg0) {
    var ret = getObject(arg0).altKey;
    return ret;
};
imports.wbg.__wbg_metaKey_d76f860a7314b6c9 = function(arg0) {
    var ret = getObject(arg0).metaKey;
    return ret;
};
imports.wbg.__wbg_ctrlKey_6fb659a0acdb08d2 = function(arg0) {
    var ret = getObject(arg0).ctrlKey;
    return ret;
};
imports.wbg.__wbg_shiftKey_644bf95e5ac01f02 = function(arg0) {
    var ret = getObject(arg0).shiftKey;
    return ret;
};
imports.wbg.__wbg_instanceof_TransitionEvent_3a2d8321fec2d7c8 = function(arg0) {
    var ret = getObject(arg0) instanceof TransitionEvent;
    return ret;
};
imports.wbg.__wbg_propertyName_d092e58e9cc512c9 = function(arg0, arg1) {
    var ret = getObject(arg1).propertyName;
    var ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len0;
    getInt32Memory0()[arg0 / 4 + 0] = ptr0;
};
imports.wbg.__wbg_elapsedTime_c9532b60001b7ab9 = function(arg0) {
    var ret = getObject(arg0).elapsedTime;
    return ret;
};
imports.wbg.__wbg_pseudoElement_fbd578e5f7b13974 = function(arg0, arg1) {
    var ret = getObject(arg1).pseudoElement;
    var ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len0;
    getInt32Memory0()[arg0 / 4 + 0] = ptr0;
};
imports.wbg.__wbg_instanceof_Event_39e54e1fe6593f4c = function(arg0) {
    var ret = getObject(arg0) instanceof Event;
    return ret;
};
imports.wbg.__wbg_type_e32f387f5584c765 = function(arg0, arg1) {
    var ret = getObject(arg1).type;
    var ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len0;
    getInt32Memory0()[arg0 / 4 + 0] = ptr0;
};
imports.wbg.__wbg_target_e560052e31e4567c = function(arg0) {
    var ret = getObject(arg0).target;
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
};
imports.wbg.__wbg_preventDefault_fa00541ff125b78c = function(arg0) {
    getObject(arg0).preventDefault();
};
imports.wbg.__wbg_instanceof_HtmlAnchorElement_d5797efd1395fd83 = function(arg0) {
    var ret = getObject(arg0) instanceof HTMLAnchorElement;
    return ret;
};
imports.wbg.__wbg_setdownload_bf061e99ffb570bb = function(arg0, arg1, arg2) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
    getObject(arg0).download = v0;
};
imports.wbg.__wbg_sethref_90772480eb0439e5 = function(arg0, arg1, arg2) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
    getObject(arg0).href = v0;
};
imports.wbg.__wbg_instanceof_HtmlMediaElement_a540864d496c8ee2 = function(arg0) {
    var ret = getObject(arg0) instanceof HTMLMediaElement;
    return ret;
};
imports.wbg.__wbg_setsrc_579baf76725d93d9 = function(arg0, arg1, arg2) {
    var v0 = getCachedStringFromWasm0(arg1, arg2);
    getObject(arg0).src = v0;
};
imports.wbg.__wbg_setsrcObject_a2484a6a322a0115 = function(arg0, arg1) {
    getObject(arg0).srcObject = getObject(arg1);
};
imports.wbg.__wbg_setmuted_ac586806709ede92 = function(arg0, arg1) {
    getObject(arg0).muted = arg1 !== 0;
};
imports.wbg.__wbg_getDisplayMedia_df053cf5443424c5 = function() { return handleError(function (arg0, arg1) {
    var ret = getObject(arg0).getDisplayMedia(getObject(arg1));
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_getUserMedia_55aa2788a18b9774 = function() { return handleError(function (arg0, arg1) {
    var ret = getObject(arg0).getUserMedia(getObject(arg1));
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_connect_23205ccf67cb254c = function() { return handleError(function (arg0, arg1) {
    var ret = getObject(arg0).connect(getObject(arg1));
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_instanceof_HtmlSelectElement_e3dbe2a40aa03cfe = function(arg0) {
    var ret = getObject(arg0) instanceof HTMLSelectElement;
    return ret;
};
imports.wbg.__wbg_value_d4cea9e999ffb147 = function(arg0, arg1) {
    var ret = getObject(arg1).value;
    var ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len0;
    getInt32Memory0()[arg0 / 4 + 0] = ptr0;
};
imports.wbg.__wbg_instanceof_KeyboardEvent_39e350edcd4936d4 = function(arg0) {
    var ret = getObject(arg0) instanceof KeyboardEvent;
    return ret;
};
imports.wbg.__wbg_charCode_e15a2aba71bbaa8c = function(arg0) {
    var ret = getObject(arg0).charCode;
    return ret;
};
imports.wbg.__wbg_keyCode_8a05b1390fced3c8 = function(arg0) {
    var ret = getObject(arg0).keyCode;
    return ret;
};
imports.wbg.__wbg_altKey_773e7f8151c49bb1 = function(arg0) {
    var ret = getObject(arg0).altKey;
    return ret;
};
imports.wbg.__wbg_ctrlKey_8c7ff99be598479e = function(arg0) {
    var ret = getObject(arg0).ctrlKey;
    return ret;
};
imports.wbg.__wbg_shiftKey_894b631364d8db13 = function(arg0) {
    var ret = getObject(arg0).shiftKey;
    return ret;
};
imports.wbg.__wbg_metaKey_99a7d3732e1b7856 = function(arg0) {
    var ret = getObject(arg0).metaKey;
    return ret;
};
imports.wbg.__wbg_location_802154aca73cf67f = function(arg0) {
    var ret = getObject(arg0).location;
    return ret;
};
imports.wbg.__wbg_repeat_248c3b6d2b3e0a33 = function(arg0) {
    var ret = getObject(arg0).repeat;
    return ret;
};
imports.wbg.__wbg_key_7f10b1291a923361 = function(arg0, arg1) {
    var ret = getObject(arg1).key;
    var ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len0;
    getInt32Memory0()[arg0 / 4 + 0] = ptr0;
};
imports.wbg.__wbg_mediaDevices_931f35a83dbb1470 = function() { return handleError(function (arg0) {
    var ret = getObject(arg0).mediaDevices;
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_get_a307c30b5f5df814 = function(arg0, arg1) {
    var ret = getObject(arg0)[arg1 >>> 0];
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
};
imports.wbg.__wbg_get_f45dff51f52d7222 = function(arg0, arg1) {
    var ret = getObject(arg0)[arg1 >>> 0];
    return addHeapObject(ret);
};
imports.wbg.__wbg_length_7b60f47bde714631 = function(arg0) {
    var ret = getObject(arg0).length;
    return ret;
};
imports.wbg.__wbg_new_16f24b0728c5e67b = function() {
    var ret = new Array();
    return addHeapObject(ret);
};
imports.wbg.__wbg_newnoargs_f579424187aa1717 = function(arg0, arg1) {
    var v0 = getCachedStringFromWasm0(arg0, arg1);
    var ret = new Function(v0);
    return addHeapObject(ret);
};
imports.wbg.__wbg_call_89558c3e96703ca1 = function() { return handleError(function (arg0, arg1) {
    var ret = getObject(arg0).call(getObject(arg1));
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_new_d3138911a89329b0 = function() {
    var ret = new Object();
    return addHeapObject(ret);
};
imports.wbg.__wbg_concat_e0bc1865fc7bfdc8 = function(arg0, arg1) {
    var ret = getObject(arg0).concat(getObject(arg1));
    return addHeapObject(ret);
};
imports.wbg.__wbg_push_a72df856079e6930 = function(arg0, arg1) {
    var ret = getObject(arg0).push(getObject(arg1));
    return ret;
};
imports.wbg.__wbg_instanceof_ArrayBuffer_649f53c967aec9b3 = function(arg0) {
    var ret = getObject(arg0) instanceof ArrayBuffer;
    return ret;
};
imports.wbg.__wbg_new_55259b13834a484c = function(arg0, arg1) {
    var v0 = getCachedStringFromWasm0(arg0, arg1);
    var ret = new Error(v0);
    return addHeapObject(ret);
};
imports.wbg.__wbg_isSafeInteger_91192d88df6f12b9 = function(arg0) {
    var ret = Number.isSafeInteger(getObject(arg0));
    return ret;
};
imports.wbg.__wbg_instanceof_Object_d6dae7f4da812832 = function(arg0) {
    var ret = getObject(arg0) instanceof Object;
    return ret;
};
imports.wbg.__wbg_entries_38f300d4350c7466 = function(arg0) {
    var ret = Object.entries(getObject(arg0));
    return addHeapObject(ret);
};
imports.wbg.__wbg_hasOwnProperty_5f7af26bc3dc1b0f = function(arg0, arg1) {
    var ret = getObject(arg0).hasOwnProperty(getObject(arg1));
    return ret;
};
imports.wbg.__wbg_resolve_4f8f547f26b30b27 = function(arg0) {
    var ret = Promise.resolve(getObject(arg0));
    return addHeapObject(ret);
};
imports.wbg.__wbg_then_a6860c82b90816ca = function(arg0, arg1) {
    var ret = getObject(arg0).then(getObject(arg1));
    return addHeapObject(ret);
};
imports.wbg.__wbg_then_58a04e42527f52c6 = function(arg0, arg1, arg2) {
    var ret = getObject(arg0).then(getObject(arg1), getObject(arg2));
    return addHeapObject(ret);
};
imports.wbg.__wbg_self_e23d74ae45fb17d1 = function() { return handleError(function () {
    var ret = self.self;
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_window_b4be7f48b24ac56e = function() { return handleError(function () {
    var ret = window.window;
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_globalThis_d61b1f48a57191ae = function() { return handleError(function () {
    var ret = globalThis.globalThis;
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_global_e7669da72fd7f239 = function() { return handleError(function () {
    var ret = global.global;
    return addHeapObject(ret);
}, arguments) };
imports.wbg.__wbg_buffer_5e74a88a1424a2e0 = function(arg0) {
    var ret = getObject(arg0).buffer;
    return addHeapObject(ret);
};
imports.wbg.__wbg_new_e3b800e570795b3c = function(arg0) {
    var ret = new Uint8Array(getObject(arg0));
    return addHeapObject(ret);
};
imports.wbg.__wbg_set_5b8081e9d002f0df = function(arg0, arg1, arg2) {
    getObject(arg0).set(getObject(arg1), arg2 >>> 0);
};
imports.wbg.__wbg_length_30803400a8f15c59 = function(arg0) {
    var ret = getObject(arg0).length;
    return ret;
};
imports.wbg.__wbg_instanceof_Uint8Array_8a8537f46e056474 = function(arg0) {
    var ret = getObject(arg0) instanceof Uint8Array;
    return ret;
};
imports.wbg.__wbg_set_c42875065132a932 = function() { return handleError(function (arg0, arg1, arg2) {
    var ret = Reflect.set(getObject(arg0), getObject(arg1), getObject(arg2));
    return ret;
}, arguments) };
imports.wbg.__wbindgen_debug_string = function(arg0, arg1) {
    var ret = debugString(getObject(arg1));
    var ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len0;
    getInt32Memory0()[arg0 / 4 + 0] = ptr0;
};
imports.wbg.__wbindgen_throw = function(arg0, arg1) {
    throw new Error(getStringFromWasm0(arg0, arg1));
};
imports.wbg.__wbindgen_memory = function() {
    var ret = wasm.memory;
    return addHeapObject(ret);
};
imports.wbg.__wbindgen_closure_wrapper319 = function(arg0, arg1, arg2) {
    var ret = makeMutClosure(arg0, arg1, 103, __wbg_adapter_34);
    return addHeapObject(ret);
};
imports.wbg.__wbindgen_closure_wrapper320 = function(arg0, arg1, arg2) {
    var ret = makeMutClosure(arg0, arg1, 103, __wbg_adapter_37);
    return addHeapObject(ret);
};
imports.wbg.__wbindgen_closure_wrapper433 = function(arg0, arg1, arg2) {
    var ret = makeMutClosure(arg0, arg1, 169, __wbg_adapter_40);
    return addHeapObject(ret);
};
imports.wbg.__wbindgen_closure_wrapper435 = function(arg0, arg1, arg2) {
    var ret = makeClosure(arg0, arg1, 169, __wbg_adapter_43);
    return addHeapObject(ret);
};
imports.wbg.__wbindgen_closure_wrapper612 = function(arg0, arg1, arg2) {
    var ret = makeMutClosure(arg0, arg1, 274, __wbg_adapter_46);
    return addHeapObject(ret);
};
imports.wbg.__wbindgen_closure_wrapper756 = function(arg0, arg1, arg2) {
    var ret = makeMutClosure(arg0, arg1, 333, __wbg_adapter_49);
    return addHeapObject(ret);
};
imports.wbg.__wbindgen_closure_wrapper807 = function(arg0, arg1, arg2) {
    var ret = makeMutClosure(arg0, arg1, 364, __wbg_adapter_52);
    return addHeapObject(ret);
};

if (typeof input === 'string' || (typeof Request === 'function' && input instanceof Request) || (typeof URL === 'function' && input instanceof URL)) {
    input = fetch(input);
}



const { instance, module } = await load(await input, imports);

wasm = instance.exports;
init.__wbindgen_wasm_module = module;
wasm.__wbindgen_start();
return wasm;
}

export default init;

