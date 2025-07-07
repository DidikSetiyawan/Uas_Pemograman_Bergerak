import React, { useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import { Task } from '../types/Task';

type Props = NativeStackScreenProps<RootStackParamList, 'EditTask'>;

export default function EditTaskScreen({ route, navigation }: Props) {
  const { task } = route.params;
  const [title, setTitle] = useState(task.title);
  const [desc, setDesc] = useState(task.desc);

  const updateTask = async () => {
    if (!title.trim()) return Alert.alert('Judul kosong', 'Harap isi judul.');
    const json = await AsyncStorage.getItem('tasks');
    const tasks: Task[] = json ? JSON.parse(json) : [];
    const updated = tasks.map(t => t.id === task.id ? { ...t, title, desc } : t);
    await AsyncStorage.setItem('tasks', JSON.stringify(updated));
    navigation.goBack();
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput value={title} onChangeText={setTitle} style={{ borderBottomWidth: 1, marginBottom: 10 }} />
      <TextInput value={desc} onChangeText={setDesc} style={{ borderBottomWidth: 1, marginBottom: 10 }} />
      <Button title="Simpan Perubahan" onPress={updateTask} />
    </View>
  );
}
