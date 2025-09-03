import { FHUIElement } from './element.js';

export class FHUIButton extends FHUIElement {
    constructor() {
        super();
        this._innerTag = 'button';
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



export class FHUIButtonGroup extends FHUIElement {
    constructor() {
        super();
        this._innerTag = 'div';
    }

    static get props() {
        return {
            ...super.props,
            disabled: { type: Boolean, default: false },
            block: { type: Boolean, default: false, isClass: true },
            color: { type: String, default: 'general', isClass: true },
            reverse: { type: Boolean, default: false, isClass: true },
            size: { type: String, default: 'medium', isClass: true },
            type: { type: String, default: 'default', isClass: true },
            vertical: { type: Boolean, default: false, isClass: true }
        };
    }

    static template(content) {
        return `<div class="fh-button-group">${content || ''}</div>`;
    }

    /**
     * 属性变化回调
     * 这里扩展以同步属性到子元素
     */
    _onPropChange(name, value) {
        if (!this._innerDOM) return;

        // 获取所有 fh-button 子元素
        const buttons = this._innerDOM.querySelectorAll('fh-button');

        switch (name) {
            case 'disabled':
                buttons.forEach(btn => {
                    if (value) {
                        btn.setAttribute('disabled', '');
                    } else {
                        btn.removeAttribute('disabled');
                    }
                });
                break;

            case 'color':
                buttons.forEach(btn => {
                    if (!btn.hasAttribute('color')) {
                        btn.setAttribute('color', value);
                    }
                });
                break;

            case 'type':
                buttons.forEach(btn => {
                    btn.setAttribute('type', value);
                });
                break;

            case 'size':
                buttons.forEach(btn => {
                    btn.setAttribute('size', value);
                });
                break;
        }
    }

    /**
     * 初始化完成后，给初始的子按钮应用属性
     */
    connectedCallback() {
        super.connectedCallback();
        this._syncPropsToChildren();
    }

    /**
     * 当插槽或 DOM 动态变化时，同步属性
     * 例如用户动态插入 fh-button
     */
    _syncPropsToChildren() {
        if (!this._innerDOM) return;

        const buttons = this._innerDOM.querySelectorAll('fh-button');
        const disabled = this._props.disabled;
        const color = this._props.color;
        const size = this._props.size;

        buttons.forEach(btn => {
            if (disabled) btn.setAttribute('disabled', '');
            else btn.removeAttribute('disabled');

            if (!btn.hasAttribute('color')) btn.setAttribute('color', color);
            btn.setAttribute('size', size);
        });
    }
}


if (!customElements.get('fh-button-group')) customElements.define('fh-button-group', FHUIButtonGroup);


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