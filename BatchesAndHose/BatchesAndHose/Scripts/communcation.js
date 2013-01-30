$(function () {

    /*
     * broadcastMessage - recieve a message from another player
     */
    chat.client.broadcastMessage = function(playerIndex, message) {
        var name = players[playerIndex].name;
        // Html encode display name and message. 
        var encodedName = $('<strong />').text(name + ":").html();
        var encodedMsg = $('<span />').text(message).html();
        var count = $('.room li').size();
        var yourName = $('#displayname').val();
        var time = new Date();
        // Add the message to the page.

        if (count >= 3) {
            $('.room li:first').remove();
        }

        var newMessage = $('<li />',
            {
                "class": "msg",
                "style": "border-color: " + players[playerIndex].color + ";",
            });

        var avatarImage = $('<img />').attr('src', players[playerIndex].avatarURL).css("border-color", players[playerIndex].color);

        var messageP = $('<p />');

        var nameSpan = $('<strong />').text(name.substring(0, 5)).css("color", players[playerIndex].color);

        var messageText = $('<span />',
            {
                "class": "msgText"
            }).text(message.substring(0, 50));

        var timeSpan = $('<time />').text(time.toTimeString().substring(0, 8)).css("border-color", players[playerIndex].color).css("color", players[playerIndex].color);


        newMessage.append(avatarImage);
        messageP.append(nameSpan);
        messageP.append(messageText);
        messageP.append(timeSpan);
        newMessage.append(messageP);
        
        $('.room').append(newMessage);

        /*
        $('.room').append('<li class="msg" style="border-color: ' + players[playerIndex].color + ';">' +
            '<img alt="'+name+'" src="' + players[playerIndex].avatarURL + '">' +
            '<p>' +
            '<strong>' + name.substring(0, 5) + ': </strong>' +
            '<span class="msgText">' + message.substring(0, 50) + '</span>' +
            '<time>' + time.toTimeString().substring(0, 8) + '</time>' +
            '</p>' +
            '</li>');*/
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
    chat.client.addPlayer = function (newPlayerName, avatar, urls, x, index) {
        if (newPlayerName == $('#displayname').val()) {
            lastX = x;
        }

        console.log("Here's your stuff: ");
        console.log(avatar);
        console.log(urls);

        var playerScoreBar = $('<div />', {
            id: 'ScoreBar' + newPlayerName,
            "class": 'progressbar-outer metroButton'
        });

        var score = $('<div />', {
            id: 'Score' + newPlayerName,
            "class": 'progressbar-inner'
        }).text(newPlayerName);

        playerScoreBar.append(score);
        $(".dark").append(playerScoreBar);

        createPlayer(newPlayerName, x, index, avatar, urls);
    };


    chat.client.addNewAsteroid = function(index, x) {
        var ast = createAsteroid(players[index], x);
        ast.y = HEIGHT + 49;
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
    var avatar = image;
    $('#displayname').val(playerName);
    // Set initial focus to message input box.  
    $('#message-box').focus();
    // Start the connection.
    $.connection.hub.start().done(function () {
        chat.server.addNewPlayer($('#displayname').val(), avatar, image);

        $('#message-send').click(function () {
            // Call the Send method on the hub. 
            chat.server.send(n, $('#message-box').val());
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