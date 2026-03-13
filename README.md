# Web Chat

A real-time messaging web app with chat and image sharing, similar to WhatsApp.

## Features

- Real-time chat using WebSocket
- Image sharing
- Emoji picker
- Sticker sharing (add your own stickers to `stickers/` folder)
- GIF search and sharing (using Tenor API)

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Add sticker images to `stickers/` folder (e.g., sticker1.png, sticker2.png)

3. Run the server:
   ```
   npm start
   ```

3. Open `http://localhost:3000` in your browser.

## Usage

- Enter username
- Type messages or use emoji button for emojis
- Use sticker button to select stickers
- Use GIF button to search and send GIFs
- Upload images as before
- Messages appear in real-time

## Deployment on AWS EC2

1. Launch an EC2 instance (e.g., t2.micro with Ubuntu).

2. Install Node.js:
   ```
   
   ```

3. Clone or upload your project to the instance.

4. Install dependencies:
   ```
   npm install
   ```

5. Run the app:
   ```
   npm start
   ```

6. Configure security group to allow inbound traffic on port 3000.

7. Access via `http://your-ec2-public-ip:3000`.

For production, use PM2:
```
npm install -g pm2
pm2 start server.js
pm2 startup
pm2 save
```

## Usage

- Enter username
- Type messages or select images to send
- Messages appear in real-time