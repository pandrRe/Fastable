/*exported fastable*/
/*eslint no-console: ["error", { allow: ["warn", "error"] }] */
/**
 * Creates a new Fastable object.
 */
class Fastable {
    constructor() {
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
    safeTable(elementId, tableName, objs, sanitize = true) {
        if (typeof objs == 'undefined' || objs === null || !Array.isArray(objs)) {
            return;
        }
        if (!this.areObjsEqual(objs)) {
            console.error("Fastable render failed: Objects do not possess the same properties.");
            return;
        }
        
        let tableDiv = document.getElementById(elementId);
        if (typeof objs == 'undefined' || objs === null) {
            console.error(`Fastable render failed: Cannot find element of ID ${elementId}`);
            return;
        }

        objs = sanitize? this.encodeEntries(objs) : objs;
        this.tableRender(tableName, tableDiv, objs);
    }

    /**Checks if objects in an array share the same model of keys.
     * Avoid calling it outside of safeTable() as it's not typesafe.
     * 
     * @param {*} objs 
     */
    areObjsEqual(objs) {
        let model = JSON.stringify( Object.keys(objs[0]).sort() );
        for (let obj of objs) {
            let objKeys = JSON.stringify( Object.keys(obj).sort() );
            if (objKeys != model) {
                return false;
            }
        }
        return true;
    }

    /**Calls sanitizeText() for every property of the objects.
     * 
     * @param {*} objs 
     */
    encodeEntries(objs) {
        for (let obj of objs) {
            for (let property in obj) {
                if (obj.hasOwnProperty(property) && typeof obj[property] == 'string') {
                    obj[property] = sanitizeText(obj[property]);
                }
            }
        }
        return objs;
    }

    /**Actually renders the table. Do NOT directly call this in a production environment. Use safeTable();
     * 
     * @param {*} element Already loaded HTMLElement.
     * @param {*} objs 
     */
    tableRender(name, element, objs) {
        let mainHTML = document.createElement("table");
        mainHTML.setAttribute("id", name);

        let columns = Object.keys(objs[0]);
        for (let key of columns) {
            let keyHead = document.createElement("th");
            let keyName = document.createTextNode(key);
            keyHead.appendChild(keyName);
            mainHTML.appendChild(keyHead);
        }

        //Iterating over objects to form actual rows.
        for (let row of objs) {
            let rowElem = document.createElement("tr");
            for (let key of columns) {
                let dataElem = document.createElement("td");
                let dataText = document.createTextNode(row[key]);
                dataElem.appendChild(dataText);
                rowElem.appendChild(dataElem);
            }
            mainHTML.appendChild(rowElem);
        }

        element.appendChild(mainHTML);
        this.tables[name] = document.getElementById(name);
    }

    getTables() {
        return this.tables;
    }
}

/**Takes a string and encodes it to avoid malicious inputs.
 * 
 * @param {*} text
 */
function sanitizeText(text) {
    return text
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/\//g, '&#x2F;');
}

const fastable = new Fastable();