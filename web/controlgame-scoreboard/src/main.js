var App = require('./app.js');

// Create and launch the application
var app = new App({
    container: document.getElementById("server-stats-container"),
    server: "hatchery"
});
app.run();
