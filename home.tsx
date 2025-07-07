import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Task } from '../types/Task';
import { RootStackParamList } from '../App';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
  const [tasks, setTasks] = useState<Task[]>([]);

  const loadTasks = async () => {
    const json = await AsyncStorage.getItem('tasks');
    if (json) {
      setTasks(JSON.parse(json));
    }
  };

  const deleteTask = (id: string) =>
    Alert.alert('Hapus Tugas', 'Yakin ingin menghapus?', [
      { text: 'Batal' },
      {
        text: 'Hapus',
        onPress: async () => {
          const filtered = tasks.filter((t) => t.id !== id);
          await AsyncStorage.setItem('tasks', JSON.stringify(filtered));
          setTasks(filtered);
        },
      },
    ]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadTasks);
    return unsubscribe;
  }, [navigation]);

  return (
    <View style={{ padding: 20 }}>
      <Button title="Tambah Tugas" onPress={() => navigation.navigate('AddTask')} />
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        style={{ marginTop: 20 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate('EditTask', { task: item })}
            onLongPress={() => deleteTask(item.id)}
            style={{ padding: 15, backgroundColor: '#f0f0f0', marginVertical: 5, borderRadius: 8 }}
          >
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{item.title}</Text>
            {item.desc ? <Text>{item.desc}</Text> : null}
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
