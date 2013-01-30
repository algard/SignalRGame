﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace BatchesAndHose.Models
{
    public class Player
    {
        public string Name;

		public string Image;

		public List<string> ImageURLs;

        public int LocationX;

        public int CanvasWidth;

		public Player(string name, string image, List<string> urls, int x, int canvasWidth)
        {
            this.Name = name;
			this.Image = image;
			this.ImageURLs = urls;
            this.LocationX = x;
            this.CanvasWidth = canvasWidth;
        }

        public bool CanMove(int deltax)
        {
            if (LocationX + deltax < 0 || LocationX + deltax > CanvasWidth)
            {
                return false;
            }

            return true;
        }
    }
}