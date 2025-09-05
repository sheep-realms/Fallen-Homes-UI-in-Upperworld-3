import { FHUIElement } from './element.js';

/**
 * @typedef {Object} FHUIHolderOptions
 * @property {String|HTMLElement} content 内容
 * @property {'general'|'success'|'warning'|'danger'|'special'} [color = 'general'] 容器格颜色
 * @property {'large'|'medium'|'small'} [size = 'medium'] 容器格尺寸
 * @property {Boolean} [disabled = false] 是否禁用
 */

export class FHUIHolder extends FHUIElement {
    /**
     * 容器格
     * @param {FHUIHolderOptions} options 按钮配置项
     */
    constructor({ content, ...props } = {}) {
        super({ content, ...props });
        this._innerTag = 'button';

        this._inputProps(props);
    }

    static get props() {
        return {
            ...super.props,
            disabled: { type: Boolean, default: false },
            color: { type: String, default: 'general', isClass: true },
            size: { type: String, default: 'medium', isClass: true }
        };
    }

    static template(content) {
        return `<button class="fh-holder">${content || this.templateEmpty()}</button>`;
    }

    static templateEmpty() {
        return `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><clipPath id="clip-circle"><circle cx="12" cy="12" r="10"/></clipPath><line x1="24" y1="0" x2="0" y2="24" stroke="currentColor" stroke-width="1" vector-effect="non-scaling-stroke" clip-path="url(#clip-circle)" /></svg>`;
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

if (!customElements.get('fh-holder')) customElements.define('fh-holder', FHUIHolder);