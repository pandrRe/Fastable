/*eslint-disable*/
'use strict';

/*exported fastable*/
/*eslint no-console: ["error", { allow: ["warn", "error"] }] */
/**
 * Creates a new Fastable object.
 */

function Fastable() {
    this.tables = {};
}

/**Takes the ID of a HTML element and an array of objects.
 * Checks if the parameters are valid and sanitizes everything before
 * passing to tableRender.
 * 
 * @param {*} elementId The id of the HTML element. Use an empty <div>.
 * @param {*} tableName This will be the table element id after completion and the table's reference
 * in this.tables;
 * @param {*} objs The array of objects.
 * @param {*} sanitize If true, the function will sanitize every element of the table. True by default.
 * Do NOT set it as false if it's related to user input in any way.
 */
Fastable.prototype.safeTable = function (elementId, tableName, objs) {
    var sanitize = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;

    if (typeof objs == 'undefined' || objs === null || !Array.isArray(objs)) {
        return;
    }
    if (!this.areObjsEqual(objs)) {
        return;
    }

    var tableDiv = document.getElementById(elementId);
    if (typeof objs == 'undefined' || objs === null) {
        return;
    }

    objs = sanitize ? this.encodeEntries(objs) : objs;
    this.tableRender(tableName, tableDiv, objs);
};

/**Checks if objects in an array share the same model of keys.
 * Avoid calling it outside of safeTable() as it's not typesafe.
 * 
 * @param {*} objs 
 */
Fastable.prototype.areObjsEqual = function (objs) {
    var model = JSON.stringify(Object.keys(objs[0]).sort());
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = objs[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var obj = _step.value;

            var objKeys = JSON.stringify(Object.keys(obj).sort());
            if (objKeys != model) {
                return false;
            }
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }

    return true;
};

/**Calls sanitizeText() for every property of the objects.
 * 
 * @param {*} objs 
 */
Fastable.prototype.encodeEntries = function (objs) {
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
        for (var _iterator2 = objs[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var obj = _step2.value;

            for (var property in obj) {
                if (obj.hasOwnProperty(property) && typeof obj[property] == 'string') {
                    obj[property] = sanitizeText(obj[property]);
                }
            }
        }
    } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion2 && _iterator2.return) {
                _iterator2.return();
            }
        } finally {
            if (_didIteratorError2) {
                throw _iteratorError2;
            }
        }
    }

    return objs;
};

/**Actually renders the table. Do NOT directly call this in a production environment. Use safeTable();
 * 
 * @param {*} element Already loaded HTMLElement.
 * @param {*} objs 
 */
Fastable.prototype.tableRender = function (name, element, objs) {
    var baseHTML = void 0;
    var mainHTML = '<tr>\n';

    var columns = Object.keys(objs[0]);
    var _iteratorNormalCompletion3 = true;
    var _didIteratorError3 = false;
    var _iteratorError3 = undefined;

    try {
        for (var _iterator3 = columns[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
            var key = _step3.value;

            mainHTML += '\n            <th>' + key + '</th>\n\n        ';
        }
    } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion3 && _iterator3.return) {
                _iterator3.return();
            }
        } finally {
            if (_didIteratorError3) {
                throw _iteratorError3;
            }
        }
    }

    mainHTML += '</tr>\n';

    //Iterating over objects to form actual rows.
    var _iteratorNormalCompletion4 = true;
    var _didIteratorError4 = false;
    var _iteratorError4 = undefined;

    try {
        for (var _iterator4 = objs[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
            var row = _step4.value;

            mainHTML += '<tr>\n';
            var _iteratorNormalCompletion5 = true;
            var _didIteratorError5 = false;
            var _iteratorError5 = undefined;

            try {
                for (var _iterator5 = columns[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                    var _key = _step5.value;

                    mainHTML += '\n                <td>' + row[_key] + '</td>\n\n            ';
                }
            } catch (err) {
                _didIteratorError5 = true;
                _iteratorError5 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion5 && _iterator5.return) {
                        _iterator5.return();
                    }
                } finally {
                    if (_didIteratorError5) {
                        throw _iteratorError5;
                    }
                }
            }

            mainHTML += '</tr>\n';
        }
    } catch (err) {
        _didIteratorError4 = true;
        _iteratorError4 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion4 && _iterator4.return) {
                _iterator4.return();
            }
        } finally {
            if (_didIteratorError4) {
                throw _iteratorError4;
            }
        }
    }

    baseHTML = '\n        <table id="' + name + '">\n        ' + mainHTML + '\n        </table>\n    ';
    element.innerHTML = baseHTML;
    this.tables[name] = document.getElementById(name);
};

Fastable.prototype.getTables = function () {
    return this.tables;
};

/**Takes a string and encodes it to avoid malicious inputs.
 * 
 * @param {*} text
 */
function sanitizeText(text) {
    return text.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\//g, '&#x2F;');
}

var fastable = new Fastable();