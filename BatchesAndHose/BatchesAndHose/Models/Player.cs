using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace BatchesAndHose.Models
{
    public class Player
    {
        public string Name;

        public int LocationX;

        public int CanvasWidth;

        public Player(string name, int x, int canvasWidth)
        {
            this.Name = name;
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