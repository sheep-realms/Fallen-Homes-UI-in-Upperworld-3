export class FHUIElement extends HTMLElement {
    constructor() {
        super();
        this.innerDOM = undefined;
        this.innerTag = 'div';
    }

    static template(content) {
        return content;
    }

    static get classAttributes() {
        return [];
    }

    static get customAttributes() {
        return ['inner-style'];
    }

    static get observedAttributes() {
        return [...this.customAttributes, ...this.classAttributes];
    }

    attributeChangedCallback(name, oldVal, newVal) {
        switch (name) {
            case 'inner-style':
                this.updateInnerStyle(newVal);
                return true;
                
            default:
                if (this.constructor.classAttribute.includes(name)) {
                    this.updateClass(name, newVal);
                    return true;
                }
                return false;
        }
    }

    render() {
        this.innerHTML = this.constructor.template(this.innerHTML);
        this.innerDOM = this.querySelector(this.innerTag);

        this.constructor.classAttribute.forEach(attr => {
            this.updateClass(attr, this.getAttribute(attr));
        });
    }

    updateClass(prefix, value) {
        if (!this.innerDOM) return;
        this.innerDOM.className = this.innerDOM.className
            .split(' ')
            .filter(cls => !cls.startsWith(`fh-${prefix}-`))
            .join(' ')
            .trim();

        if (value) {
            this.innerDOM.classList.add(`fh-${prefix}-${value}`);
        }
    }

    updateInnerStyle(value) {
        if (!this.innerDOM) return;
        this.innerDOM.style = value;
    }
}

if (!customElements.get('fh-element')) customElements.define('fh-element', FHUIElement);
