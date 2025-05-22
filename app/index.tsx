import { useState } from 'react';
import { View, Text, StyleSheet, Button, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function AlarmScreen() {
  const [time, setTime] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const onChange = (event: any, selectedTime: Date | undefined) => {
    setShowPicker(false);
    if (selectedTime) setTime(selectedTime);
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
          onChange={onChange}
        />
      )}

      <Button
        title="저장하기"
        onPress={() => {
          // 여기에 저장 로직 추가 예정 (로컬/서버)
          alert(`설정된 시간: ${time.toLocaleTimeString()}`);
        }}
        color="#0073e6"
      />
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
