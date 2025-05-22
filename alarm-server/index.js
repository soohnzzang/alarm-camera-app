const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors()); // 모바일 앱에서 접근 허용
app.use(express.json());

// MongoDB 연결
mongoose.connect('mongodb://localhost:27017/alarmDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("✅ MongoDB 연결 완료"))
  .catch((err) => console.error("❌ MongoDB 연결 실패", err));

// 스키마 정의
const alarmSchema = new mongoose.Schema({
  userId: String,
  alarmTime: String,
  createdAt: String
});

const Alarm = mongoose.model('Alarm', alarmSchema);

// 알람 저장 API
app.post('/api/alarms', async (req, res) => {
  try {
    const alarm = new Alarm(req.body);
    await alarm.save();
    res.status(201).json({ message: '✅ 알람 저장 성공!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '❌ 서버 오류' });
  }
});

// 서버 실행
app.listen(1004, () => {
  console.log('🚀 서버 실행 중: http://localhost:1004');
});

app.get('/api/alarms', async (req, res) => {
  try {
    const alarms = await Alarm.find().sort({ alarmTime: 1 });
    res.json(alarms);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '❌ 목록 불러오기 실패' });
  }
});