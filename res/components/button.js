class FHUIButton extends HTMLElement {
    constructor() {
        super();
        this.render();
    }

    static template(content) {
        return `<button class="fh-button">${content}</button>`
    }

    static get classAttribute() {
        return ['color', 'size', 'type'];
    }

    static get observedAttributes() {
        return ['disabled', 'inner-style', ...FHUIButton.classAttribute];
    }

    attributeChangedCallback(name, oldVal, newVal) {
        switch (name) {
            case 'disabled':
                this.updateDisabled(newVal !== null);
                break;

            case 'inner-style':
                this.updateInnerStyle(newVal);
                break;
                
            default:
                if (FHUIButton.classAttribute.includes(name)) {
                    this.updateClass(name, newVal);
                }
                break;
        }
    }

    render() {
        this.innerHTML = FHUIButton.template(this.innerHTML);
        this.btn = this.querySelector('button');

        // 初始化属性
        FHUIButton.classAttribute.forEach(attr => {
            this.updateClass(attr, this.getAttribute(attr));
        });
        this.updateDisabled(this.hasAttribute('disabled'));

        // 绑定事件
        this.btn.addEventListener('click', () => {
            if (this.btn.disabled) return;
            this.dispatchEvent(new CustomEvent('fh-button-click', { bubbles: true }));
        });
    }

    updateClass(prefix, value) {
        if (!this.btn) return;
        this.btn.className = this.btn.className
            .split(' ')
            .filter(cls => !cls.startsWith(`fh-${prefix}-`))
            .join(' ')
            .trim();

        if (value) {
            this.btn.classList.add(`fh-${prefix}-${value}`);
        }
    }

    updateInnerStyle(value) {
        if (!this.btn) return;
        this.btn.style = value;
    }

    updateDisabled(isDisabled) {
        if (!this.btn) return;
        this.btn.disabled = isDisabled;
    }
}

if (!customElements.get('fh-button')) {
    customElements.define('fh-button', FHUIButton);
}

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
