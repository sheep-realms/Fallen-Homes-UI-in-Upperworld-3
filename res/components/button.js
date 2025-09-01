import { FHUIElement } from './element.js';

class FHUIButton extends FHUIElement {
    constructor() {
        super();
        this.innerTag = 'button';
        this.render();
    }

    static template(content) {
        return `<button class="fh-button">${content}</button>`;
    }

    static get classAttribute() {
        return ['color', 'size', 'type'];
    }

    static get customAttributes() {
        return [...super.customAttributes, 'disabled'];
    }

    attributeChangedCallback(name, oldVal, newVal) {
        if (super.attributeChangedCallback()) return true;

        switch (name) {
            case 'disabled':
                this.updateDisabled(newVal !== null);
                return true;
                
            default:
                return false;
        }
    }

    render() {
        super.render();

        this.updateDisabled(this.hasAttribute('disabled'));

        // 绑定事件
        this.innerDOM.addEventListener('click', () => {
            if (this.innerDOM.disabled) return;
            this.dispatchEvent(new CustomEvent('fh-button-click', { bubbles: true }));
        });
    }

    updateDisabled(isDisabled) {
        if (!this.innerDOM) return;
        this.innerDOM.disabled = isDisabled;
    }
}

if (!customElements.get('fh-button')) customElements.define('fh-button', FHUIButton);


// 工厂函数
export function createButton({
    text = 'Button',
    color = '',
    size = '',
    disabled = false,
    onClick,
    content
} = {}) {
    const el = document.createElement('fh-button');
    if (text) el.setAttribute('text', text);
    if (color) el.setAttribute('color', color);
    if (size) el.setAttribute('size', size);
    if (disabled) el.setAttribute('disabled', '');
    if (content) el.innerHTML = FHUIButton.template(content);
    if (onClick) el.addEventListener('fh-button-click', onClick);
    return el;
}
