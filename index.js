/**
 * smartly-socket-client - Simple customer service built to chat with smartly bots through sockets.
 * @version v1.0.0
 * @author Smartly.ai https://smartly.ai/
 * @date 25/10/2018
 */

var Smartly;

var headHTML = document.getElementsByTagName('head')[0];
var scoketJsLib = document.createElement('script');
scoketJsLib.src = "https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.0.4/socket.io.js";
scoketJsLib.onreadystatechange = smartlyClass;
scoketJsLib.onload = function () {
    smartlyClass();
};

headHTML.appendChild(scoketJsLib);


function smartlyClass() {

    /**
     * Smartly class
     *
     * @class Smartly
     */

    Smartly = function (attributs) {

        // --- class Attribut's
        this.socket = io.connect('https://webchat.smartly.ai', {
            transports: ['websocket']
        });
        this.user_id = typeof attributs.user_id !== 'undefined' ? attributs.user_id : Date.now();
        this.lang = typeof attributs.lang !== 'undefined' ? attributs.lang : "en-gb";
        this.skill_id = typeof attributs.skill_id !== 'undefined' ? (attributs.skill_id) : '';
        socket.emit('new_user', {
            user_id: this.user_id,
            apps_id: this.skill_id,
            lang: this.lang,
            user_data: {}
        });
    }

    /**
     * methods of class
     * @property prototype
     * @type Object
     */

    Smartly.prototype = {

        /**
         * When event is trigged.
         * @method on
         * @param   string  event
         * @param   Function  callback
         * @return void
         */
        on: function (event, callback) {
            var self = this;
            self.socket.on(event, callback);
        },

        /**
         * Get output from API REST.
         * @method getAnswer
         * @param   JSON  param
         * @param   Function  callback
         * @return json
         */
        getAnswer: function (param, callback) {
            param.user_data.sender = (this.user_id).toString();
            this.socket.emit('new_log', {
                platform: "webchat",
                user_id: this.user_id,
                skill_id: this.skill_id,
                lang: this.lang,
                event_name: param.event_name,
                user_data: param.user_data,
                input: param.input
            });
        }

    };
}

// Instantiate object from SmartlyClass
var objSmartly = new Smartly({
    skill_id: "5b7a9c169a99d7260bc2c18a",
    user_id: "userIdcomposed",
    lang: "fr-fr"
});

// Event for conversation module messages
objSmartly.on('onMessage', function (message) {
    console.log(message)
});

// Event for Bot answers
objSmartly.on('new_log_' + SMARTLY_APP_ID, function (message) {
    console.log(message);
});

// Send a NEW_DIALOG_SESSION. Get the message of the welcome state
objSmartly.getAnswer({
    event_name: NEW_DIALOG_SESSION,
    user_data: {},
});

// Send a NEW_INPUT
objSmartly.getAnswer({
    event_name: NEW_INPUT,
    input: "",
    user_data: {}
});
