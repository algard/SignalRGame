$(function () {

    /*
     * broadcastMessage - recieve a message from another player
     */
    chat.client.broadcastMessage = function (name, message) {
        // Html encode display name and message. 
        var encodedName = $('<strong />').text(name + ":").html();
        var encodedMsg = $('<span />').text(message).html();
        var count = $('.room li').size();
        var yourName = $('#displayname').val();
        var time = new Date();
        // Add the message to the page.

        if (count < 3) {
            if (name === yourName) {
                $('.room').append('<li class="msg playerOne">' +
                    '<img alt="">' +
                    '<p>' +
                    '<strong>' + name.substring(0, 5) + ': </strong>' +
                    '<span class="msgText">' + message.substring(0, 50) + '</span>' +
                    '<time>' + time.toTimeString().substring(0, 8) + '</time>' +
                    '</p>' +
                    '</li>');
            } else {
                $('.room').append('<li class="msg playerTwo">' +
                   '<img alt="">' +
                   '<p>' +
                   '<strong>' + name.substring(0, 5) + ': </strong>' +
                   '<span class="msgText p2">' + message.substring(0, 50) + '</span>' +
                   '<time>' + time.toTimeString().substring(0, 8) + '</time>' +
                   '</p>' +
                   '</li>');
            }

        } else {
            $('.room li:first').remove();
            if (name === yourName) {
                $('.room').append('<li class="msg playerOne">' +
                    '<img alt="">' +
                    '<p>' +
                    '<strong>' + name.substring(0, 5) + ': </strong>' +
                    '<span class="msgText">' + message.substring(0, 50) + '</span>' +
                    '<time>' + time.toTimeString().substring(0, 8) + '</time>' +
                    '</p>' +
                    '</li>');
            } else {
                $('.room').append('<li class="msg playerTwo">' +
                   '<img alt="">' +
                   '<p>' +
                   '<strong>' + name.substring(0, 5) + ': </strong>' +
                   '<span class="msgText p2">' + message.substring(0, 50) + '</span>' +
                   '<time>' + time.toTimeString().substring(0, 8) + '</time>' +
                   '</p>' +
                   '</li>');
            }
        }
    };

    /*
     * movePlayer - notify the client that a player has moved
     */
    chat.client.movePlayer = function (index, x) {
        players[index].x = x;
    };

    /*
     * addPlayer - notify the client that a player has been added to the game
     */
    chat.client.addPlayer = function (newPlayerName, image, urls, x, index) {
        if (newPlayerName == $('#displayname').val()) {
            lastX = x;
        }

        var playerScoreBar = $('<div />', {
            id: 'ScoreBar' + newPlayerName,
            "class": 'progressbar-outer'
        });

        var score = $('<div />', {
            id: 'Score' + newPlayerName,
            "class": 'progressbar-inner'
        }).text(newPlayerName);

        playerScoreBar.append(score);
        $(".dark").append(playerScoreBar);

        createPlayer(newPlayerName, '#' + parseInt(x) + parseInt(canvasHeight), x, index);
    };


    /*
     *   updatePlayerIndex - a hack to let this client know which index in the player array they are
     */
    chat.client.updatePlayerIndex = function(index) {
        n = index;
    };

    /*
     *  addEnemyProjectile - notify this player that another player has fired
     */
    chat.client.addEnemyProjectile = function (index, theta) {
        // don't do anything with the projectile if we shot it
        if (index == n) {
            return;
        }
        players[index].theta = theta;
        createProjectile(players[index]);
    };
    
    /*
     * init code
     */
    // Get the user name and store it to prepend to messages.
    var playerName = prompt('Enter your name:', '');
    var image = prompt('Enter the images you want to represent your team (i.e. "kittens"):', '');
    var avatar = prompt('What do you want your chat avatar to be a picture of?', '');
    $('#displayname').val(playerName);
    // Set initial focus to message input box.  
    $('#message-box').focus();
    // Start the connection.
    $.connection.hub.start().done(function () {
        chat.server.addNewPlayer($('#displayname').val(), image);
        $('#testurls').append(chat.server.testUrls(image) + "test");

        $('#message-send').click(function () {
            // Call the Send method on the hub. 
            chat.server.send($('#displayname').val(), $('#message-box').val());


            // Clear text box and reset focus for next comment. 
            $('#message-box').val('').focus();
        });


        /*
         * stop moving
         */
        $("body").keyup(function (event) {
            // todo: use moveStartLocation and lastX(current x?) to figure out 
            switch (event.keyCode) {
                case 37:
                    chat.server.move($('#displayname').val(), -25);
                    break;
                case 39:
                    chat.server.move($('#displayname').val(), 25);
                    break;
            }
        });


    });
});