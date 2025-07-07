import React, { useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import { v4 as uuidv4 } from 'uuid';
import { Task } from '../types/Task';

type Props = NativeStackScreenProps<RootStackParamList, 'AddTask'>;

export default function AddTaskScreen({ navigation }: Props) {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');

  const saveTask = async () => {
    if (!title.trim()) return Alert.alert('Judul kosong', 'Harap masukkan judul.');
    const newTask: Task = { id: uuidv4(), title: title.trim(), desc: desc.trim() };
    const json = await AsyncStorage.getItem('tasks');
    const tasks: Task[] = json ? JSON.parse(json) : [];
    tasks.push(newTask);
    await AsyncStorage.setItem('tasks', JSON.stringify(tasks));
    navigation.goBack();
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput
        placeholder="Judul"
        value={title}
        onChangeText={setTitle}
        style={{ borderBottomWidth: 1, marginBottom: 10 }}
      />
      <TextInput
        placeholder="Deskripsi"
        value={desc}
        onChangeText={setDesc}
        style={{ borderBottomWidth: 1, marginBottom: 10 }}
      />
      <Button title="Simpan" onPress={saveTask} />
    </View>
  );
}
