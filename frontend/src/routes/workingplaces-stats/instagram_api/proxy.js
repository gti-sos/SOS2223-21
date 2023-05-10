import http from 'http';
import httpProxy from 'http-proxy';

const API_ENDPOINT = 'https://api.twitter.com/1.1/statuses/home_timeline.json?count=10';
const proxy = httpProxy.createProxyServer({});

export function startProxy() {
  http.createServer(function(req, res) {
    // Agregar el header Access-Control-Allow-Origin a la respuesta
    res.setHeader('Access-Control-Allow-Origin', '*');
    // Hacer la solicitud a la API de Twitter
    proxy.web(req, res, { target: API_ENDPOINT });
  }).listen(3000);
}
