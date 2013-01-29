using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using BatchesAndHose.Models;
using Microsoft.AspNet.SignalR;


public class ChatHub : Hub
{
    private const int CanvasHeight = 600;
    private const int CanvasWidth = 800;
    private const int PlayerHeight = 50;
    private const int PlayerWidth = 50;

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
    public void Move(string name, int deltax)
    {
        var player = GetPlayerByName(name);
        if (player.CanMove(deltax))
        {
            player.LocationX += deltax;
            Clients.All.movePlayer(name, player.LocationX);
        }
    }

    private Player GetPlayerByName(string name)
    {
        return _players.FirstOrDefault(player => player.Name.Equals(name, StringComparison.InvariantCultureIgnoreCase));
    }

    /*
     *  Add a new player to the game
     */
    public void AddNewPlayer(string name)
    {
        var x = RandomLocation(50, CanvasWidth) - PlayerWidth;
        var y = CanvasHeight;

        var newPlayer = new Player(name, x, CanvasWidth);

        // send the list of players to this new player
        foreach (var player in _players)
        {
            Clients.Caller.addPlayer(player.Name, player.LocationX);
        }
        _players.Add(newPlayer);

        //notify other players that a new player has been added
        Clients.Others.addPlayer(name, x, y);
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
