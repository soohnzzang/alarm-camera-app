import { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import axios from 'axios';

export default function AlarmListScreen() {
  const [alarms, setAlarms] = useState([]);

  const fetchAlarms = async () => {
    try {
      const res = await axios.get('http://Localhost:1004/api/alarms');
      setAlarms(res.data);
    } catch (error) {
      console.error('알람 목록 불러오기 실패', error);
    }
  };

  useEffect(() => {
    fetchAlarms();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🕒 알람 리스트</Text>
      <FlatList
        data={alarms}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text>{new Date(item.alarmTime).toLocaleTimeString()}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  item: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
});
