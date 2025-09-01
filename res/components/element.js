export class FHUIElement extends HTMLElement {
    constructor() {
        super();
        this.initialized = false;
        this.innerDOM = undefined;
        this.innerTag = 'div';
    }

    /**
     * 模板
     * @param {String|HTMLElement} content 内容
     * @returns {String} DOM
     */
    static template(content) {
        return content;
    }

    /**
     * 类属性列表
     */
    static get classAttributes() {
        return [];
    }

    /**
     * 自定义属性列表
     */
    static get customAttributes() {
        return ['inner-style'];
    }

    /**
     * 需要监听的属性列表
     */
    static get observedAttributes() {
        return [...this.customAttributes, ...this.classAttributes];
    }

    /**
     * 属性值改变回调
     * @param {String} name 属性名称
     * @param {*} oldVal 旧值
     * @param {*} newVal 新值
     * @returns {Boolean} 命中状态
     */
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

    connectedCallback() {
        this.render();
    }

    disconnectedCallback() {
        this.destroy();
    }

    destroy() {
        this.initialized = false;
    }

    /**
     * 渲染
     */
    render() {
        this.setContent(this.innerHTML);
        this.innerDOM = this.querySelector(this.innerTag);

        this.constructor.classAttribute.forEach(attr => {
            this.updateClass(attr, this.getAttribute(attr));
        });
    }

    setContent(content) {
        this.innerHTML = this.constructor.template(content);
    }

    /**
     * 更新类属性
     * @param {String} prefix 类前缀
     * @param {String} value 类值
     */
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

    /**
     * 更新内联样式
     * @param {String} value 内联样式
     */
    updateInnerStyle(value) {
        if (!this.innerDOM) return;
        this.innerDOM.style = value;
    }
}

if (!customElements.get('fh-element')) customElements.define('fh-element', FHUIElement);
