export function setProps(dom, oldProps, newProps) {
    let key;
    for (key in oldProps) {
        if (key !== 'children') {
            if (!newProps.hasOwnProperty(key)) {
                delProp(dom, key)
            } else {
                setProp(dom, key, newProps[key])
            }
        }
    }
    for (key in newProps) {
        if (key !== 'children') {
            if (!oldProps.hasOwnProperty(key)) {
                setProp(dom, key, newProps[key])
            }
        }
    }
}
/**
 * dom节点增加html属性
 * @param {*} dom 
 * @param {*} key 
 * @param {*} value 
 */
function setProp(dom, key, value) {
    if (key === 'className') {
        key = 'class';
    }
    if (/^on/.test(key)) {
        dom[key.toLowerCase()] = value;
    } else if (key === 'style') {
        if (value) {
            for (let styleName in value) {
                dom.style[styleName] = value[styleName];
            }
        }
    } else {
        dom.setAttribute(key, value);
    }
}
/**
 * dom节点移除html属性
 * @param {*} dom 
 * @param {*} key 
 */
function delProp(dom, key) {
    if (key === 'className') {
        key = 'class';
    }
    if (/^on/.test(key)) {
        key = key.toLowerCase();
    }
    dom.removeAttribute(key);
}