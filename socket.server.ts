import puppeteer from "puppeteer";
import { Server } from "socket.io";


const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const port = process.env.PORT || 3000
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "pineapple-lab", "onyx-m1"]
  }
});

app.get('/', (req, res) => {

  res.send('<h1>Hello world Now what??</h1>');
});

app.get('/e-ink/active-batch', async (req, res) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://example.com');
  await page.screenshot({ path: 'example.png' });

  await browser.close();
  res.send({ done: true })
})

const nodeHtmlToImage = require('node-html-to-image');

app.get(`/api/tweet/render`, async function (req, res) {

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // const { roast: { name }, roastDate } = await getActiveBatch()
  const name = "The Big One"
  const date = "10/33/20"
  const image = await nodeHtmlToImage({
    content: { name, date },
    html: `<html>
      <head>
      <style>
      html{
          font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
          padding:0;
          margin: 0;
        height: 100px;
        width: 266px;
        overflow:hidden;
      }
      body {
        font-size: 26px;
        padding: 10px;
        height: 100%;
        font-weight: bold;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      }
      .date{
        font-size: 19px;
        font-weight: normal;
      }
      </style>
      </head>
      <body>
        <div>${name}</div>
        <div class="date">{{date}}</div>
       </body>
  </html>`
  });
  res.writeHead(200, { 'Content-Type': 'image/png' });
  res.end(image, 'binary');
});

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on("ping", () => {
    console.log("ping recieved")
    socket.emit("pong", { yeet: "hello there" })
  })
});
io.on('disconnect', (socket) => {
  console.log('a user connected');
});

server.listen(port, () => {
  console.log(`listening on *:${port}`);
});

export { }
