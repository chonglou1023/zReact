export function setProps(dom, oldProps, newProps) {
    let key;
    for (key in oldProps) {

    }
    for (key in newProps) {
        if (key !== 'children') {
            setProp(dom, key, newProps[key])
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