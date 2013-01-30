// Declare a proxy to reference the hub. 
var chat = $.connection.chatHub;

var canvasWidth = WIDTH;
var canvasHeight = HEIGHT;
var playerHeight = 50;

var PLAYER_COLORS = ["#00FFFF", "#FFFF00", "#FF00FF", "#006666", "#666600", "#660066"];

var WIDTH = 1024;		// Canvas width
var HEIGHT = 600;		// Canvas height
var FPS = 24;			// Framerate
var rateLimit = 1;
var currentWait = 0;
var newAsteroid = 100;

var canvas;				// Canvas element
var g; 					// Graphics context
var players = [];		// Contains all the active player objects
var n = 0;				// Index of the player being controlled by this client

var projectiles = [];
var asteroids = [];

var mouseX;
var mouseY;