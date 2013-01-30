using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace BatchesAndHose.Models
{
    public class Player
    {
        public string Name;

	    public string Avatar;

		public string Image;

		public string[] ImageURLs;

        public int LocationX;

        public int CanvasWidth;

        public int Score;

		public Player(string name, string avatar, string image, string[] urls, int x, int canvasWidth)
        {
            this.Name = name;
			this.Avatar = avatar;
			this.Image = image;
			this.ImageURLs = urls;
            this.LocationX = x;
            this.CanvasWidth = canvasWidth;
        }


        public bool CanMove(int deltax)
        {
            if (LocationX + deltax < 0 || LocationX + deltax > CanvasWidth)
            {
                return true;
            }

            return true;
        }
    }
}