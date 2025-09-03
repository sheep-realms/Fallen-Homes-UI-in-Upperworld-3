import { FHUIElement } from './element.js';

export class FHUISpace extends FHUIElement {
    constructor() {
        super();
        this._innerTag = 'div';
    }

    static get props() {
        return {
            ...super.props,
            inline: { type: Boolean, default: false, isClass: true },
            justify: { type: String, default: 'start', isClass: true },
            reverse: { type: Boolean, default: false, isClass: true },
            size: { type: String, default: 'medium', isClass: true },
            vertical: { type: Boolean, default: false, isClass: true },
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