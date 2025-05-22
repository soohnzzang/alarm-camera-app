import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Platform, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import axios from 'axios'; // ✅ axios 임포트
import { useRouter } from 'expo-router';


export default function AlarmScreen() {
  const [time, setTime] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const router = useRouter();

  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);

  const registerForPushNotificationsAsync = async () => {
    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        Alert.alert('❌ 알림 권한이 거부되었습니다.');
        return;
      }
    } else {
      Alert.alert('❗ 푸시 알림은 실제 기기에서만 작동합니다.');
    }
  };

  // ✅ 서버에 알람 정보 저장
  const saveToServer = async () => {
    try {
      await axios.post('http://localhost:1004/api/alarms', {
        userId: "123",
        alarmTime: time.toISOString(),
        createdAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('❌ 알람 저장 실패', error);
    }
  };

  // ✅ 알람 등록 함수 (푸시 + 서버 저장)
  const scheduleAlarm = async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "📸 알람입니다!",
        body: "사진을 찍을 시간이예요!",
        data: { withCamera: true },
      },
      trigger: {
        hour: time.getHours(),
        minute: time.getMinutes(),
        repeats: true,
      },
    });

    await saveToServer(); // ⬅️ 여기서 호출!
    Alert.alert(`✅ 알람이 설정되었습니다: ${time.toLocaleTimeString()}`);
    // 👉 알람 리스트 페이지로 이동
    router.push('/alarms_list');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>⏰ 알람 시간 설정</Text>
      <Text style={styles.timeText}>{time.toLocaleTimeString()}</Text>

      <Button title="시간 선택" onPress={() => setShowPicker(true)} />

      {showPicker && (
        <DateTimePicker
          value={time}
          mode="time"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(event, selectedTime) => {
            setShowPicker(false);
            if (selectedTime) setTime(selectedTime);
          }}
        />
      )}

      <View style={{ marginTop: 20 }}>
        <Button title="저장하기" onPress={scheduleAlarm} color="#0073e6" />
      </View>
    </View>
  );
  
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 22,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  timeText: {
    fontSize: 32,
    marginBottom: 20,
    color: '#333',
  },
});

