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

        public int LocationY;

        public Player(string name, int x, int y)
        {
            this.Name = name;
            this.LocationX = x;
            this.LocationY = y;
        }
    }
}