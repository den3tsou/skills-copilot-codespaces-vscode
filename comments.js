// Create web server
// 1. Create web server
// 2. Read file
// 3. Write file
// 4. Delete file
// 5. Update file

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const server = http.createServer((req, res) => {
  const urlObj = url.parse(req.url, true);
  const filePath = urlObj.pathname;

  if (req.method === 'GET') {
    if (filePath === '/comments') {
      fs.readFile(path.join(__dirname, 'comments.json'), 'utf-8', (err, data) => {
        if (err) {
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end('Internal server error');
        } else {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(data);
        }
      });
    }
  } else if (req.method === 'POST') {
    if (filePath === '/comments') {
      let body = '';
      req.on('data', (chunk) => {
        body += chunk;
      });

      req.on('end', () => {
        const newComment = JSON.parse(body);

        fs.readFile(path.join(__dirname, 'comments.json'), 'utf-8', (err, data) => {
          if (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Internal server error');
          } else {
            const comments = JSON.parse(data);
            comments.push(newComment);

            fs.writeFile(path.join(__dirname, 'comments.json'), JSON.stringify(comments), 'utf-8', (err) => {
              if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Internal server error');
              } else {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(comments));
              }
            });
          }
        });
      });
    }
  } else if (req.method === 'DELETE') {
    if (filePath === '/comments') {
      fs.unlink(path.join(__dirname, 'comments.json'), (err) => {
        if (err) {
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end('Internal server error');