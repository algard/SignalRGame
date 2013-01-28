using System;
using System.Collections.Generic;
using System.Web;
using BatchesAndHose.Models;
using Microsoft.AspNet.SignalR;


public class ChatHub : Hub
{
    private const int CanvasHeight = 800;
    private const int CanvasWidth = 800;

    private List<Player> _players = new List<Player>();

    /*
     * Send a chat message to all clients
     */
    public void Send(string name, string message)
    {
        Clients.All.broadcastMessage(name, message);
    }

    /*
     * Move a player 
     */
    public void Move(string name, int deltax, int deltay)
    {
        Clients.All.movePlayer(name, deltax, deltay);
    }

    /*
     *  Add a new player to the game
     */
    public void AddNewPlayer(string name)
    {
        var x = 500;  //TODO pick a random location within the canvas
        var y = 50;

        var newPlayer = new Player(name, x, y);
        _players.Add(newPlayer);

        // send the list of players to this new player
        foreach (var player in _players)
        {
            Clients.Caller.addPlayer(player.Name, player.LocationX, player.LocationY);
        }

        //notify other players that a new player has been added
        Clients.AllExcept(Clients.Caller).addPlayer(name, x, y);
    }

    public void RenamePlayer(string oldName, string newName)
    {

    }
}
