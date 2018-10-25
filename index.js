/**
 * smartly-socket-client - Simple customer service built to chat with smartly bots through sockets.
 * @version v1.0.0
 * @author Smartly.ai https://smartly.ai/
 * @date 25/10/2018
 */

var remote_socket_server = 'https://webchat.smartly.ai';
var Smartly;

function smartlyClass() {

    /**
     * Smartly class
     *
     * @class Smartly
     */

    Smartly = function (attributs) {

        // Static var
        Smartly.NEW_DIALOG_SESSION = 'NEW_DIALOG_SESSION';
        Smartly.NEW_INPUT = 'NEW_INPUT';
            
        // --- class Attribut's
        this.socket = io.connect(remote_socket_server, {
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
         * @method sendRequest
         * @param   JSON  param
         * @return json
         */
        sendRequest: function (param) {
            param.user_data.sender = (this.user_id).toString();
            this.socket.emit('new_log', {
                platform: "webchat",
                user_id: this.user_id,
                skill_id: this.skill_id,
                lang: this.lang,
                event_name: param.event_name,
                user_data: param.user_data,
                input: typeof param.input !== 'undefined' ? param.input : ''
            });
        }

    };
}

var headHTML = document.getElementsByTagName('head')[0];
var scoketJsLib = document.createElement('script');
scoketJsLib.src = "https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.0.4/socket.io.js";
scoketJsLib.onreadystatechange = smartlyClass;

scoketJsLib.onload = function () {
    smartlyClass();
    
    // Instantiate object from SmartlyClass
    var dialog = new Smartly({
        skill_id: "5b7a9c169a99d7260bc2c18a",
        user_id: "userIdcomposedOfLettersAndNumbers123456789",
        lang: "fr-fr"
    });
    
    // Event for conversation module messages
    dialog.on('onMessage', function (message) {
        console.log(message)
    });

    // Event for Bot answers
    dialog.on('new_log_' + dialog.skill_id, function (message) {
        console.log(message);
    });

    // Example of NEW_DIALOG_SESSION request. Get the message of the welcome state
    dialog.sendRequest({
        event_name: Smartly.NEW_DIALOG_SESSION,
        user_data: {},
    });

    // Example a NEW_INPUT request
    dialog.sendRequest({
        event_name: Smartly.NEW_INPUT,
        input: "suivant",
        user_data: {}
    });
};

headHTML.appendChild(scoketJsLib);

