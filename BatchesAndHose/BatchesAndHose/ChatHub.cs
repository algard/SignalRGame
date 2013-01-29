using System;
using System.Collections.Generic;
using System.Web;
using BatchesAndHose.Models;
using Microsoft.AspNet.SignalR;


public class ChatHub : Hub
{
    private const int CanvasHeight = 600;
    private const int CanvasWidth = 800;
    private const int PlayerHeight = 50;

    private static List<Player> _players = new List<Player>();

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
        var x = RandomLocation(0, CanvasWidth);
        var y = CanvasHeight - PlayerHeight;

        var newPlayer = new Player(name, x, y);
        _players.Add(newPlayer);

        // send the list of players to this new player
        foreach (var player in _players)
        {
            Clients.Caller.addPlayer(player.Name, player.LocationX, player.LocationY);
        }

        //notify other players that a new player has been added
        Clients.All.addPlayer(name, x, y);
    }

    private static int RandomLocation(int startX, int endX)
    {
        var rnd = new Random();
        return rnd.Next(startX, endX + 1);
    }

    public void RenamePlayer(string oldName, string newName)
    {

    }
}
