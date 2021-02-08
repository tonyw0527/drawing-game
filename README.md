# Drawing Game, GRINDA

- GRINDA는 특정 유저가 그림으로 표현하는 제시어를 다른 유저들이 추측하여 맞추는 게임입니다. [https://grinda.ga](https://grinda.ga) 초대코드: love
- 채팅 기능을 지원합니다.
- 채팅 기능을 이용하여 terminal을 이용하듯이 관리자 기능을 지원합니다. ex) 강퇴 명령어 'sudo kick [유저네임]'
- 다크모드를 지원합니다.

## 게임 진행

### 출제 예약

- 문제 예약 버튼을 눌러 출제 차례를 기다립니다.
- 예약 버튼을 누른 순서대로 대기열에 들어가며 채팅창을 통해 순서가 공지됩니다. (예약자 없을 시 버튼을 누르면 바로 시작)

### 문제 출제

- 출제자가 되면 painter 페이지의 canvas 아래에 있는 control box의 버튼들이 출제자 모드로 바뀌며 서버에서 제시어를 랜덤으로 제공하며 그림을 그릴 수 있게 됩니다.
- 출제자는 제시어를 마음대로 변경하거나 주사위 버튼을 눌러 랜덤으로 제시어를 제공 받을 수 있습니다.
- 출제자는 제시어에 맞게 그림을 그립니다.
- 다른 유저들은 제한 시간안(디폴트 20초 - 원할한 테스트를 위해)에 문제를 맞춰야합니다.
- 어떤 유저가 제시어를 맞추면 해당 유저의 이름과 함께 정답을 맞췄다는 메세지가 채팅창에 공지됩니다.
- 출제자를 제외한 모든 유저가 제한시간 안에 정답을 맞춘 경우 '전원 빙고!' 메세지가 채팅창에 공지됩니다.

### 출제자 변경

- 제한 시간이 끝나거나 전원 빙고된 경우 현재 출제자는 일반 유저 모드로, 다음 예약자가 출제자 모드로 변경되며 준비 시간(10초)가 주어집니다.
- 위와 같은 방법으로 진행 됩니다.
- 출제자가 없는 경우 마지막 출제자가 계속해서 출제자 모드를 유지하며 자유 출제 할 수 있습니다.

## Tech Stack

- Typescript
- Next.js
- Mobx
- Styled-components
- Express.js
- Socket.io
- Mongoose

## Pages

### index

- 닉네임과 초대코드로 간단한 로그인 기능을 구현하였습니다.
- state 관리로 mobx를 사용하였습니다.

### painter

- 게임을 진행하는 페이지입니다.
- socket.io를 통해 접속자간 실시간 그림 연동과 채팅 기능을 구현하였습니다.
- 채팅에서 누가 접속중인지, 누가 출제자(👑 표시)인지 확인 할 수 있습니다.
- 채팅창에 게임진행을 위한 INFO 메세지도 같이 출력됩니다.
- HTML5의 canvas를 이용하여 drawing을 구현하였고 그림 초기화, 지우개, 펜 색깔변경, Undo&Redo, 이미지 저장, 랜덤 제시어 생성 등의 기능을 지원합니다.

### gallery

- Grinda 앱을 통해 그려진 작품들을 모아 보는 페이지입니다.
- 현재 painter 페이지의 저장 버튼을 누르면 작품 이미지가 db에 저장되어 gallery 페이지에서 확인 할 수 있도록 연결 되어 있습니다.
- db와의 CRUD 작업이 socket.io로 구현되어있습니다.
- 좋아요 버튼이 있으며 하나의 작품에는 닉네임을 중복하여 좋아요를 누를 수 없습니다.
- 관리자 로그인 시 작품 삭제를 할 수 있습니다.

### 404

- 404 에러 페이지입니다.

## Deploy

- GCP에서 호스팅되고 있습니다.
- 웹서버로 Nginx를 사용하였으며 리버스 프록시를 통해 Next.js 서버와 Express 서버를 연결하였습니다.
- Let's encrypt로 https를 지원합니다.
- DB server는 MongoDB atlas를 이용하였습니다.

### Setting Nginx

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

### Clone Repogitory

- git clone [my-github-repo]
- First! deploy next js server

```sh
cd client
vim .env.local
yarn install
yarn build
pm2 start yarn --name next.js -- start
```

- Second! deploy socket.io server

```sh
cd server
vim .env
yarn install
yarn build
cd dist
pm2 start app.js
```

- The End

## Info

- Create React App 구조에서 Next.js 구조로 넘어오며 몇 몇 부분을 개선하고 있습니다.
