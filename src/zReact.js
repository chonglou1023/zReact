import { REACT_ELEMENT_TYPE } from './zSymbols';
import { TEXT_NODE } from './zreact-dom/shared/HTMLNodeType';
import { Update } from './UpdateQuene';
import { scheduleRoot,useReducer,useState } from './schedule';


const ReactCurrentOwner = {
    /**
     * @internal
     * @type {ReactComponent}
     */
    current: (null),
};
const hasOwnProperty = Object.prototype.hasOwnProperty;
// react保留props
const RESERVED_PROPS = {
    key: true,
    ref: true,
    __self: true,
    __source: true,
};
function hasValidRef(config) {
    return config.ref !== undefined;
}
function hasValidKey(config) {
    return config.key !== undefined;
}
/**
 * Factory method to create a new React element. This no longer adheres to
 * the class pattern, so do not use new to call it. Also, instanceof check
 * will not work. Instead test $$typeof field against Symbol.for('react.element') to check
 * if something is a React Element.
 *
 * @param {*} type
 * @param {*} props
 * @param {*} key
 * @param {string|object} ref
 * @param {*} owner
 * @param {*} self A *temporary* helper to detect places where `this` is
 * different from the `owner` when React.createElement is called, so that we
 * can warn. We want to get rid of owner and replace string `ref`s with arrow
 * functions, and as long as `this` and owner are the same, there will be no
 * change in behavior.
 * @param {*} source An annotation object (added by a transpiler or otherwise)
 * indicating filename, line number, and/or other information.
 * @internal
 */
const ReactElement = function (type, key, ref, self, source, owner, props) {
    const element = {
        // This tag allows us to uniquely identify this as a React Element
        $$typeof: REACT_ELEMENT_TYPE,

        // Built-in properties that belong on the element
        type: type,
        key: key,
        ref: ref,
        props: props,

        // Record the component responsible for creating this element.
        _owner: owner,
    };

    return element;
};
export function createElement(type, config, children) {
    let propName;

    // Reserved names are extracted
    const props = {};

    let key = null;
    let ref = null;
    let self = null;
    let source = null;

    if (config != null) {
        if (hasValidRef(config)) {
            ref = config.ref;
        }
        if (hasValidKey(config)) {
            key = '' + config.key;
        }

        self = config.__self === undefined ? null : config.__self;
        source = config.__source === undefined ? null : config.__source;
        // Remaining properties are added to a new props object
        for (propName in config) {
            if (
                hasOwnProperty.call(config, propName) &&
                !RESERVED_PROPS.hasOwnProperty(propName)
            ) {
                props[propName] = config[propName];
            }
        }
    }

    // Children can be more than one argument, and those are transferred onto
    // the newly allocated props object.
    const childrenLength = arguments.length - 2;
    // 文本节点特殊处理，方便区分
    const formatChildren = (child) => {
        return typeof child === 'object' ? child : { type: TEXT_NODE, props: { text: child, children: [] } }
    }
    if (childrenLength === 1) {
        props.children = [formatChildren(children)];
    } else if (childrenLength > 1) {
        const childArray = Array(childrenLength);
        for (let i = 0; i < childrenLength; i++) {
            childArray[i] = formatChildren(arguments[i + 2]);
        }
        props.children = childArray;
    }

    // Resolve default props
    if (type && type.defaultProps) {
        const defaultProps = type.defaultProps;
        for (propName in defaultProps) {
            if (props[propName] === undefined) {
                props[propName] = defaultProps[propName];
            }
        }
    }

    return ReactElement(
        type,
        key,
        ref,
        self,
        source,
        ReactCurrentOwner.current,
        props,
    );
}
class Component {
    constructor(props) {
        this.props = props;
        // this.updateQuene = new UpdateQuene();
    }
    setState(payload) {
        let update = new Update(payload);
        // updateQuene是放在类组件对应的fiber节点的internalFiber上的
        this.internalFiber.updateQuene.enqueneUpdate(update);
        // this.updateQuene.enqueneUpdate(update);
        scheduleRoot();
    }
}
Component.prototype.isReactComponent = {
};
export default {
    createElement,
    Component,
    useReducer,
    useState,
}