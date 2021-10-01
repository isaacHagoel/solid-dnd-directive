import { dndzone as dndActionZone, setDebugMode, overrideItemIdKeyNameBeforeInitialisingDndZones as overrideId } from "svelte-dnd-action";
import {createEffect, createRenderEffect, onCleanup} from "solid-js";
import {createFlipper} from "./util/flip";
export {
    TRIGGERS,
    SOURCES,
    SHADOW_ITEM_MARKER_PROPERTY_NAME,
    SHADOW_PLACEHOLDER_ITEM_ID,
    DRAGGED_ELEMENT_ID,
    alertToScreenReader,
    setDebugMode
} from "svelte-dnd-action";

const DEFAULT_FLIP_DURATION_MS = 150;
let ID_KEY = "id";
export function overrideItemIdKeyNameBeforeInitialisingDndZones(newId) {
    overrideId(newId);
    ID_KEY = newId;
}

/**
 ** @typedef {object} Options
 * @property {function} items - the list of items that was used to generate the children of the given node (the list used in the #each block
 * @property {string || function} [type] - the type of the dnd zone. children dragged from here can only be dropped in other zones of the same type, default to a base type
 * @property {number || function} [flipDurationMs] - if the list animated using flip (recommended), specifies the flip duration such that everything syncs with it without conflict, defaults to zero
 * @property {boolean || function} [dragDisabled]
 * @property {boolean || function} [morphDisabled] - whether dragged element should morph to zone dimensions
 * @property {boolean || function} [dropFromOthersDisabled]
 * @property {number || function} [zoneTabIndex] - set the tabindex of the list container when not dragging
 * @property {object || function} [dropTargetStyle]
 * @property {string[] || function} [dropTargetClasses]
 * @property {function} [transformDraggedElement]
 * @param {HTMLElement} node - the element to enhance
 * @param {Options} optionsGetter
 */
export function dndzone(node, optionsGetter) {
    const options = optionsGetter();
    validateOptions(options);
    const optionsGetters = addDefaultOptions(optionsToGetters(options));
    const {items: getItems, flipDurationMs: getFlipDurationMs} = optionsGetters;
    let flipper;
    const {update, destroy} = dndActionZone(node, gettersToOptions(optionsGetters));
    onCleanup(destroy);

    createEffect(function updateFlipperWhenFipDurationChanges() {
        flipper = createFlipper(node, getFlipDurationMs())
    })
    createEffect(function updateOptionsAndTriggerFlip() {
        update(gettersToOptions(optionsGetters));
        if (flipper.flip) {
            flipper.flip(getItems().map(item => item[ID_KEY]));
        }
    });

    createRenderEffect(function storeFlipInformation() {
        function adaptConsider() {
            if (flipper.read) {
                flipper.read(getItems().map(item => item[ID_KEY]));
            }
        }
        function adaptFinalize() {
            if (flipper.read) {
                flipper.read(getItems().map(item => item[ID_KEY]));
            }
        }
        node.addEventListener('consider', adaptConsider);
        node.addEventListener('finalize', adaptFinalize);
        onCleanup(() => {
            node.removeEventListener('consider', adaptConsider);
            node.removeEventListener('finalize', adaptFinalize)
        })
    });
}

/* Helper functions */

function makeGetter(option) {
    return (typeof option === "function") ? option : () => option;
}

/**
 * Converts an object with either getters or values to an object of getters so that all of the element can be treated the same
 */
function optionsToGetters(options) {
    return Object.keys(options).reduce((res, optName) => {res[optName] = makeGetter(options[optName]); return res;}, {});
}
function validateOptions(options) {
    if(typeof options.items !== "function") {
        throw new Error(`dndzone didn't get an items getter, which is a mandatory option in ${JSON.stringify(options)}`);
    }
}
function addDefaultOptions(optionGetters) {
    if (typeof optionGetters.flipDurationMs !== "function") {
        return {...optionGetters, flipDurationMs: () => DEFAULT_FLIP_DURATION_MS}
    }
    return  optionGetters;
}

/**
 * Calls each getter and maps it to its value (so it can be given to the lib
 */
function gettersToOptions(optionGetters) {
    return Object.keys(optionGetters).reduce((res, optName) => {res[optName] = optionGetters[optName](); return res;}, {});
}
