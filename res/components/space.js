import { FHUIElement } from './element.js';

/**
 * @typedef {Object} FHUIButtonOptions
 * @property {String|HTMLElement} content 内容
 * @property {Boolean} [inline = false] 是否为行内元素
 * @property {'start'|'center'|'end'|'space-between'|'space-around'|'space-evenly'} [justify = 'start'] 对齐方式
 * @property {Boolean} [reverse = false] 是否反转
 * @property {'extra-large'|'large'|'demi-large'|'medium'|'demi-small'|'small'|'extra-small'} [size = 'medium'] 间距尺寸
 * @property {Boolean} [vertical = false] 是否垂直
 */

export class FHUISpace extends FHUIElement {
    /**
     * 间距
     * @param {FHUIButtonOptions} options 间距配置项
     */
    constructor({ content, ...props } = {}) {
        super({ content, ...props });
        this._innerTag = 'div';

        this._inputProps(props);
    }

    static get props() {
        return {
            ...super.props,
            inline: { type: Boolean, default: false, isClass: true },
            justify: { type: String, default: 'start', isClass: true },
            reverse: { type: Boolean, default: false, isClass: true },
            size: { type: String, default: 'medium', isClass: true },
            vertical: { type: Boolean, default: false, isClass: true }
        };
    }

    static template(content) {
        return `<div class="fh-space">${content || ''}</div>`;
    }

    _onPropChange(name, value) {

    }

    // render() {
    //     super.render();
    // }
}

if (!customElements.get('fh-space')) customElements.define('fh-space', FHUISpace);