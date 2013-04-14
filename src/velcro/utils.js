Velcro.utils = {
    addEvent: function(element, event, callback) {
        if (element.attachEvent) {
            element.attachEvent('on' + event, function() {
                callback.call(element);
            });
        } else if(element.addEventListener) {
            element.addEventListener(event, callback, false);
        }
    },

    createElement: function(html) {
        var div = document.createElement('div');
        div.innerHTML = html;
        var element = div.childNodes[0];
        div.removeChild(element);
        return element;
    },

    destroyElement: function(element) {
        element.parentNode.removeChild(element);
        element.innerHTML = '';
        delete element.attributes;
        delete element.childNodes;
    },

    elementIndex: function(element) {
        for (var i = 0; i < element.parentNode.childNodes; i++) {
            if (element === element.parentNode.childNodes[i]) {
                return i;
            }
        }

        return false;
    },

    html: function(element) {
        var div = document.createElement('div');
        div.appendChild(element.cloneNode(true));
        return div.innerHTML;
    },

    each: function(items, fn) {
        items = items || [];

        if (typeof items === 'string') {
            items = [items];
        }

        if (typeof items.length === 'number') {
            for (var i = 0; i < items.length; i++) {
                if (fn(i, items[i]) === false) {
                    return;
                }
            }
        } else {
            for (var x in items) {
                if (fn(x, items[x]) === false) {
                    return;
                }
            }
        }
    },

    fnCompare: function(fn, str) {
        if (!fn) {
            return false;
        }

        if (typeof fn === 'object' && fn.constructor) {
            fn = fn.constructor;
        }

        if (typeof fn === 'function') {
            fn = fn.toString();
        }

        return fn === str;
    },

    isArray: function(obj) {
        return Object.prototype.toString.call(obj) === '[object Array]';
    },

    isClass: function(obj) {
        return typeof obj === 'function' && typeof obj.extend === 'function' && obj.extend === Velcro.Class.extend;
    },

    isInstance: function(obj) {
        return obj && typeof obj.constructor === 'function';
    },

    isObject: function(obj) {
        return Object.prototype.toString.call(obj) === '[object Object]';
    },

    isValue: function(value) {
        return typeof value === 'function' && value.toString() === Velcro.value().toString();
    },

    merge: function() {
        var merged = {};

        for (var i = 0; i < arguments.length; i++) {
            var param = arguments[i];

            if (!Velcro.utils.isObject(param)) {
                continue;
            }

            for (var ii in param) {
                var value = param[ii];

                if (Velcro.utils.isObject(value)) {
                    if (typeof merged[ii] === 'undefined' || Velcro.utils.isInstance(value)) {
                        merged[ii] = value;
                    } else {
                        merged[ii] = Velcro.utils.merge(merged[ii], value);
                    }
                } else {
                    merged[ii] = value;
                }
            }
        }

        return merged;
    },

    parseBinding: function(json, context) {
        var code = '';

        for (var i in context || {}) {
            if (i === 'import' || i === 'export' || i === '') {
                continue;
            }

            code += 'var ' + i + '=__context[\'' + i + '\'];';
        }

        code += 'return {' + json + '};';

        try {
            return new Function('__context', code)(context);
        } catch (e) {
            throw 'Error parsing binding "' + json + '" with message: "' + e + '"';
        }
    },

    parseJson: function(json) {
        try {
            return JSON.parse(json);
        } catch (error) {
            throw 'Error parsing response "' + response + '" with message "' + error + '".';
        }
    },

    extract: function(obj) {
        var options = {};

        Velcro.utils.each(obj, function(name, value) {
            if (Velcro.utils.isValue(value)) {
                options[name] = value();
            } else {
                options[name] = value;
            }
        });

        return options;
    },

    throwForElement: function(element, message) {
        throw message + "\n" + Velcro.html(element);
    }
};