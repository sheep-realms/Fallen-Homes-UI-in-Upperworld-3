import { FHUIEventManager } from "../class/FHUIEventManager.js";

export class FHUIElement extends HTMLElement {
    constructor() {
        super();
        this._initialized = false;
        this._innerDOM = undefined;
        this.innerTag = 'div';
        this.event = new FHUIEventManager(this);
        this._props = {};
        this._pendingUpdates = [];
        this._initProps();
    }

    /**
     * 模板
     * @param {String|HTMLElement} content 内容
     * @returns {String} DOM
     */
    static template(content) {
        return content;
    }

    static get props() {
        return {
            'inner-style': { type: String }
        };
    }

    /**
     * 需要监听的属性列表
     */
    static get observedAttributes() {
        return Object.keys(this.props || {});
    }

    _initProps() {
        const propsConfig = this.constructor.props || {};
        for (const key in propsConfig) {
            const { default: defaultValue } = propsConfig[key];

            this._defineProp(key);

            // 如果 attribute 没有设置，应用默认值
            if (!this.hasAttribute(key) && defaultValue !== undefined) {
                this._props[key] = defaultValue;
            } else if (this.hasAttribute(key)) {
                this._props[key] = this._parseAttrValue(key, this.getAttribute(key));
            }
        }
    }

    _defineProp(key) {
        Object.defineProperty(this, key, {
            get: () => this._props[key],
            set: (val) => {
                this._updateProp(key, val);
            }
        });
    }

    _updateProp(key, val) {
        const { type } = this.constructor.props[key];
        if (type && !(val instanceof type) && typeof val !== type.name.toLowerCase()) {
            console.warn(`Invalid type for prop "${key}". Expected ${type.name}, got ${typeof val}`);
            return;
        }

        this._props[key] = val;

        if (typeof val === 'boolean') {
            if (val) {
                this.setAttribute(key, '');
            } else {
                this.removeAttribute(key);
            }
        } else {
            this.setAttribute(key, val);
        }

        this._handlePropUpdate(key, val);
    }

    _parseAttrValue(key, val) {
        const { type } = this.constructor.props[key];
        if (type === Boolean) return val !== null;
        if (type === Number) return Number(val);
        return val;
    }

    /**
     * 属性值改变回调
     * @param {String} name 属性名称
     * @param {*} oldVal 旧值
     * @param {*} newVal 新值
     */
    attributeChangedCallback(name, oldVal, newVal) {
        if (oldVal === newVal) return;
        this._props[name] = this._parseAttrValue(name, newVal);
        this._handlePropUpdate(name, this._props[name]);
    }

    _handlePropUpdate(name, value) {
        const config = this.constructor.props[name];

        // 如果 innerDOM 还没准备好，先缓存
        if (!this._innerDOM) {
            this._pendingUpdates.push({ name, value });
            return;
        }

        this._applyPropUpdate(name, value, config);
    }

    /**
     * 应用属性更新
     * @param {String} name 属性名
     * @param {*} value 属性值
     * @param {Object} config 属性配置
     * @description attributeChangedCallback 会在 connectedCallback 之前触发。So, Web Component, FUCK YOU!
     */
    _applyPropUpdate(name, value, config) {
        // 更新 class
        if (config.isClass) {
            this._updateClass(name, value, config.type === Boolean);
        }
        
        if (name === 'inner-style') {
            this.updateInnerStyle(value);
        }

        this._onPropChange(name, value);
    }

    /**
     * 更新类属性
     * @param {String} prefix 类前缀
     * @param {String} value 类值
     * @param {Boolean} isBoolean 是布尔值
     */
    _updateClass(prefix, value, isBoolean = false) {
        const dom = this._innerDOM;
        if (!dom) return;

        if (isBoolean) {
            dom.classList.toggle(`fh-${prefix}`, value);
        } else {
            dom.className = dom.className
                .split(' ')
                .filter(cls => !cls.startsWith(`fh-${prefix}-`))
                .join(' ')
                .trim();

            if (value) {
                dom.classList.add(`fh-${prefix}-${value}`);
            }
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
        this.offAll();
    }

    /**
     * 渲染
     */
    render() {
        this.setContent(this.innerHTML, true);
        this._innerDOM = this.querySelector(this.innerTag);

        // 初始化 classPrefix
        const propsConfig = this.constructor.props;
        for (const key in propsConfig) {
            const cfg = propsConfig[key];
            if (cfg.classPrefix) {
                this._updateClass(cfg.classPrefix, this._props[key], cfg.type === Boolean);
            }
        }

        this._pendingUpdates.forEach(({ name, value }) => {
            this._applyPropUpdate(name, value, propsConfig[name]);
        });
        this._pendingUpdates = [];

        this._initialized = true;
    }

    setContent(content, isInit = false) {
        if (isInit) {
            this.innerHTML = this.constructor.template(content);
        } else {
            this._innerDOM.innerHTML = content;
        }
    }

    /**
     * 更新内联样式
     * @param {String} value 内联样式
     */
    updateInnerStyle(value) {
        if (!value) return;
        if (!this._innerDOM) return;
        
        this._innerDOM.style = value;
    }

    _onPropChange(name, value) {
        // console.log(`Prop changed: ${name} = ${value}`);
    }
}

if (!customElements.get('fh-element')) customElements.define('fh-element', FHUIElement);