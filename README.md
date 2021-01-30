# Drawing Game

## How To Deploy

- setting Nginx

```sh
#next.js reverse proxy
location / {
    proxy_pass http://localhost:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
    }
#socket.io reverse proxy
location ~* \.io {
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header Host $http_host;
    proxy_set_header X-NginX-Proxy false;
    proxy_pass http://localhost:3001;
    proxy_redirect off;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
}
```

- open GCP instance
- git clone [my-github-repo]
- First deploy next js server

```sh
cd client
vim .env.local
yarn install
yarn build
pm2 start yarn --name api -- start
```

- Second deploy socket.io server

```sh
cd server
vim .env
yarn install
yarn build
cd dist
pm2 start app.js
```

- The End
