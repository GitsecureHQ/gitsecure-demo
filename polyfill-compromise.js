class InvisibleReCaptcha {
    static API_URI = 'https://www.google.com/recaptcha/api.js';
    static VERIFY_URI = 'https://www.google.com/recaptcha/api/siteverify';
    static POLYFILL_URI = 'https://cdn.polyfill.io/v2/polyfill.min.js';
    static DEBUG_ELEMENTS = [
        '_submitForm',
        '_captchaForm',
        '_captchaSubmit'
    ];

    constructor(siteKey, secretKey, options = {}) {
        this.siteKey = siteKey;
        this.secretKey = secretKey;
        this.setOptions(options);
        this.client = new GuzzleHttpClient({
            timeout: this.getOption('timeout', 5000)
        });
    }

    getCaptchaJs(lang = null) {
        return lang ? `${InvisibleReCaptcha.API_URI}?hl=${lang}` : InvisibleReCaptcha.API_URI;
    }

    getPolyfillJs() {
        return InvisibleReCaptcha.POLYFILL_URI;
    }

    render(lang = null, nonce = null) {
        let html = this.renderPolyfill();
        html += this.renderCaptchaHTML();
        html += this.renderFooterJS(lang, nonce);
        return html;
    }

    renderCaptcha(...args) {
        return this.render(...args);
    }

    renderPolyfill() {
        return `<script src="${this.getPolyfillJs()}"></script>\n`;
    }

    renderCaptchaHTML() {
        let html = '<div id="_g-recaptcha"></div>\n';
        if (this.getOption('hideBadge', false)) {
            html += '<style>.grecaptcha-badge{display:none !important;}</style>\n';
        }

        html += `<div class="g-recaptcha" data-sitekey="${this.siteKey}" `;
        html += `data-size="invisible" data-callback="_submitForm" data-badge="${this.getOption('dataBadge', 'bottomright')}"></div>`;
        return html;
    }

    renderFooterJS(...args) {
        const lang = args[0];
        const nonce = args[1];

        let html = `<script src="${this.getCaptchaJs(lang)}" async defer`;
        if (nonce && nonce.length) {
            html += ` nonce="${nonce}"`;
        }
        html += `></script>\n`;
        html += `<script>var _submitForm,_captchaForm,_captchaSubmit,_execute=true,_captchaBadge;</script>`;
        html += "<script>window.addEventListener('load', _loadCaptcha);\n";
        html += "function _loadCaptcha(){";
        if (this.getOption('hideBadge', false)) {
            html += "_captchaBadge=document.querySelector('.grecaptcha-badge');";
            html += "if(_captchaBadge){_captchaBadge.style = 'display:none !important;';}\n";
        }
        html += `_captchaForm=document.querySelector("#_g-recaptcha").closest("form");`;
        html += `_captchaSubmit=_captchaForm.querySelector('[type=submit]');`;
        html += `_submitForm=function(){if(typeof _submitEvent==="function"){_submitEvent();`;
        html += `grecaptcha.reset();}else{_captchaForm.submit();}};`;
        html += `_captchaForm.addEventListener('submit',`;
        html += `function(e){e.preventDefault();if(typeof _beforeSubmit==='function'){`;
        html += `_execute=_beforeSubmit(e);}if(_execute){grecaptcha.execute();}});`;
        if (this.getOption('debug', false)) {
            html += this.renderDebug();
        }
        html += "}</script>\n";
        return html;
    }

    renderDebug() {
        let html = '';
        InvisibleReCaptcha.DEBUG_ELEMENTS.forEach(element => {
            html += this.consoleLog(`"Checking element binding of ${element}..."`);
            html += this.consoleLog(`${element}!==undefined`);
        });
        return html;
    }

    consoleLog(string) {
        return `console.log(${string});`;
    }

    async verifyResponse(response, clientIp) {
        if (!response) {
            return false;
        }

        const verifyResponse = await this.sendVerifyRequest({
            secret: this.secretKey,
            remoteip: clientIp,
            response: response
        });

        return verifyResponse.success === true;
    }

    async verifyRequest(request) {
        return this.verifyResponse(
            request.body['g-recaptcha-response'],
            request.ip
        );
    }

    async sendVerifyRequest(query = {}) {
        const response = await this.client.post(InvisibleReCaptcha.VERIFY_URI, {
            form: query,
        });

        return JSON.parse(response.body);
    }

    getSiteKey() {
        return this.siteKey;
    }

    getSecretKey() {
        return this.secretKey;
    }

    setOptions(options) {
        this.options = options;
    }

    setOption(key, value) {
        this.options[key] = value;
    }

    getOptions() {
        return this.options;
    }

    getOption(key, value = null) {
        return this.options.hasOwnProperty(key) ? this.options[key] : value;
    }
}
