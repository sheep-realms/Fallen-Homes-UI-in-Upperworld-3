export class FHUIEventManager {
    /**
     * FH-UI 事件管理器
     * @param {HTMLElement} element FH-UI 元素
     */
    constructor(element) {
        this.element = element;
        this.events = {};
    }
    
    /**
     * 注册事件
     * @param {string} type 事件类型（支持命名空间）
     * @param {function} callback 回调
     * @param {boolean} once 是否只执行一次
     */
    on(type, callback, once = false) {
        if (!this.element.innerDOM) return;

        const [eventType, namespace] = type.split('.');
        if (!this.events[eventType]) {
            this.events[eventType] = [];
            // 绑定一次原生监听器
            this.element.innerDOM.addEventListener(eventType, e => {
                this.events[eventType].forEach(listener => {
                    listener.callback(e);
                    if (listener.once) {
                        this.off(`${eventType}${listener.namespace ? '.' + listener.namespace : ''}`, listener.callback);
                    }
                });
            });
        }

        this.events[eventType].push({ namespace, callback, once });
    }

    /**
     * 一次性事件
     */
    once(type, callback) {
        this.on(type, callback, true);
    }

    /**
     * 移除事件
     * @param {string} type 事件类型（支持命名空间）
     * @param {function} [callback] 指定回调
     */
    off(type, callback) {
        const [eventType, namespace] = type.split('.');
        if (!this.events[eventType]) return;

        this.events[eventType] = this.events[eventType].filter(listener => {
            if (callback && listener.callback !== callback) return true;
            if (namespace && listener.namespace !== namespace) return true;
            return false; // 移除匹配的
        });
    }

    /**
     * 移除所有事件
     */
    offAll() {
        Object.keys(this.events).forEach(eventType => {
            this.events[eventType] = [];
        });
    }

    /**
     * 手动触发事件
     * @param {string} type 事件类型（不含命名空间）
     * @param {any} detail 附加数据
     */
    emit(type, detail = null) {
        if (!this.element.innerDOM) return;
        const event = new CustomEvent(type, { detail, bubbles: true });
        this.element.innerDOM.dispatchEvent(event);
    }
}