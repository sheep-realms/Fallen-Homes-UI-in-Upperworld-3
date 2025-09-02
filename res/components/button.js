import { FHUIElement } from './element.js';

class FHUIButton extends FHUIElement {
    constructor() {
        super();
        this.innerTag = 'button';
    }

    static get props() {
        return {
            ...super.props,
            disabled: { type: Boolean, default: false },
            block: { type: Boolean, default: false, isClass: true },
            color: { type: String, default: 'general', isClass: true },
            size: { type: String, default: 'medium', isClass: true },
            type: { type: String, default: 'default', isClass: true }
        };
    }

    static template(content) {
        return `<button class="fh-button">${content || ''}</button>`;
    }

    _onPropChange(name, value) {
        if (name === 'disabled' && this._innerDOM) {
            this._innerDOM.disabled = value;
        }
    }

    // render() {
    //     super.render();
    // }
}

if (!customElements.get('fh-button')) customElements.define('fh-button', FHUIButton);


/**
 * @typedef {Object} FHUIButtonOptions
 * @property {'general'|'success'|'warning'|'danger'|'special'} color 按钮颜色
 * @property {'large'|'medium'|'small'} size 按钮尺寸
 * @property {Boolean} [disabled = false] 是否禁用
 * @property {Function} onClick 点击时的回调函数
 * @property {String|HTMLElement} content 按钮内容
 */

/**
 * 创建一个按钮
 * @param {FHUIButtonOptions} options 按钮配置项
 */
export function createButton({
    color = '',
    size = '',
    disabled = false,
    onClick,
    content
} = {}) {
    const el = document.createElement('fh-button');
    if (color) el.setAttribute('color', color);
    if (size) el.setAttribute('size', size);
    if (disabled) el.setAttribute('disabled', '');
    if (content) el.innerHTML = FHUIButton.template(content);
    if (onClick) el.addEventListener('fh-button-click', onClick);
    return el;
}