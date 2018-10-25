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
        this.user_data = typeof attributs.user_data !== 'undefined' ? (attributs.user_data) : {};
        socket.emit('new_user', {
            user_id: this.user_id,
            apps_id: this.skill_id,
            lang: this.lang,
            user_data: this.user_data
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
         * @param   JSON  event
         * @param   Function  callback
         * @return json
         */
        getAnswer: function (param, callback) {
            this.user_data = param.user_data;
            user_data.sender = (this.user_id).toString();

            this.socket.emit('new_log', {
                platform: "webchat",
                event_name: param.event,
                user_id: this.user_id,
                skill_id: param.skill_id,
                lang: this.lang,
                user_data: user_data,
                input: param.input,
                client_id: param.client_id
            });
        }

    };
}


/**
 * Init Smartly chat by building the html of the webchat and loading the css. Also, it add listener on DOM object.
 * @method initSmartlyChat
 * @return null
 */
function initSmartlyChat() {

    // Instantiate object Smartly
    var objSmartly = new Smartly({
        app_id: "",
        user_id: "",
        user_data: {},
        lang: "fr-fr"
    });

    // Event for Bot's answers
    objSmartly.on('onMessage', function (message) {
        console.log(message)
    });

    objSmartly.on('new_log_' + SMARTLY_APP_ID, function (message) {
        smrtJQ('#smartly-chat .message.loading').remove();

        buildHTML.insertSmartlyMessage(message.answer, new Date());
        if (message.rich_text) {
            buildHTML.insertSmartlyRichTexts(message, new Date(), false);
        }
        if (hasLocationQR && !ALREADY_DISPLAY_WARNING && !SUPPORT_PERM_QUERY) {
            var warning = LOCATION_WARNING[SMARTLY_LANG];
            buildHTML.insertSmartlyMessage(warning);
        }
        buildHTML.updateScrollbar();
    });

    objSmartly.getAnswer({
        skill_id: SMARTLY_APP_ID,
        input: '',
        user_data: {},
        event_name: "NEW_DIALOG_SESSION"
    });

    objSmartly.getAnswer({
        skill_id: SMARTLY_APP_ID,
        input: answer,
        event_name: "NEW_INPUT",
        user_data: {},
        client_id: that.client_id
    });
}
