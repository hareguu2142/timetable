const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const app = express();
const { MongoClient } = require('mongodb');
const port = process.env.PORT || 3000;
dotenv.config();
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);
const timetableRouter = require('./routes/timetable');

app.use('/timetable', timetableRouter);

app.use(express.json());
// 루트 경로에 대한 라우트 핸들러
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 정적 파일 제공을 위한 미들웨어 설정
app.use(express.static(path.join(__dirname, 'public')));

// src 폴더의 JavaScript 파일을 /js 경로로 제공
app.use('/js', express.static(path.join(__dirname, 'src')));

// 서버 시작
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

