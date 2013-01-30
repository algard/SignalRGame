﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Xml.XPath;
using BatchesAndHose.Models;
using Microsoft.AspNet.SignalR;
using System.Xml;


public class ChatHub : Hub
{
    private const int CanvasHeight = 600;
    private const int CanvasWidth = 1024;
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
    public void Move(int index, int deltax)
    {
        var player = _players[index];
        if (player.CanMove(deltax))
        {
            player.LocationX += deltax;
            Clients.All.movePlayer(index, player.LocationX);
        }
    }

    /*
     *  Add a new player to the game
     */
    public void AddNewPlayer(string name, string avatar, string image)
    {
        var x = RandomLocation(50, CanvasWidth) - PlayerWidth;
        var y = CanvasHeight;

        var urlArray = getPhotoThumbnails(image).ToArray();

	    avatar = getSinglePhotoThumbnail(avatar);

        var newPlayer = new Player(name, avatar, image, urlArray, x, CanvasWidth);

        // send the list of players to this new player
        int i = 0;
        foreach (var player in _players)
        {
			Clients.Caller.addPlayer(player.Name, player.Avatar, player.Image, player.ImageURLs, player.LocationX, i++);
        }
        _players.Add(newPlayer);

        //notify other players that a new player has been added
        Clients.All.addPlayer(name, avatar, image, urlArray, x, _players.Count - 1);

        Clients.Caller.updatePlayerIndex(_players.Count - 1);
    }

    private IEnumerable<string> getPhotoThumbnails(string searchTerm)
    {
        XmlDocument urlDoc = new XmlDocument();

        urlDoc.Load("http://api.flickr.com/services/rest/?&method=flickr.photos.search&api_key=8531f340cce6465f6570d9933698ec52&text=" + searchTerm);

        foreach (XmlElement photo in urlDoc.SelectNodes("/rsp/photos/photo"))
        {
            yield return "http://farm" + photo.GetAttribute("farm") + ".staticflickr.com/" + photo.GetAttribute("server") + "/" + photo.GetAttribute("id") + "_" + photo.GetAttribute("secret") + "_s.jpg";
        }
    }

    private string getSinglePhotoThumbnail(string searchTerm)
    {
        XmlDocument avatarDoc = new XmlDocument();
        avatarDoc.Load("http://api.flickr.com/services/rest/?&method=flickr.photos.search&api_key=8531f340cce6465f6570d9933698ec52&text=" + searchTerm);

        try
        {
            foreach (XmlElement photo in avatarDoc.SelectNodes("/rsp/photos/photo"))
            {
                return "http://farm" + photo.GetAttribute("farm") + ".staticflickr.com/" + photo.GetAttribute("server") +
                       "/" + photo.GetAttribute("id") + "_" + photo.GetAttribute("secret") + "_s.jpg";
            }
        }
        catch
        {
        }
        return "";
    }

    private static int RandomLocation(int startX, int endX)
    {
        var rnd = new Random();
        return rnd.Next(startX, endX + 1);
    }

    public void RenamePlayer(string oldName, string newName)
    {

    }

    public void ShotsFired(int playerIndex, float theta)
    {
        Clients.All.addEnemyProjectile(playerIndex, theta);
    }
}

