import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../../../firebaseConfig'; // Correct import

export default function ReportIncidentScreen({ navigation }) {
  const [incidentType, setIncidentType] = useState('');
  const [details, setDetails] = useState('');
  const [tricycleBodyNumber, setTricycleBodyNumber] = useState('');

  const handleReportSubmit = async () => {
    if (!incidentType || !details || !tricycleBodyNumber) {
      Alert.alert('Missing Information', 'Please fill in all fields.');
      return;
    }

    try {
      const user = auth.currentUser;
      if (user) {
        await addDoc(collection(db, 'reports'), {
          userId: user.uid,
          complainantName: user.displayName || 'N/A', // Assumes user name is set during registration
          incidentType: incidentType,
          details: details,
          tricycleBodyNumber: tricycleBodyNumber,
          status: 'Pending',
          timestamp: serverTimestamp(),
        });

        Alert.alert('Report Submitted', 'Your report has been successfully submitted.');
        navigation.goBack();
      } else {
        Alert.alert('Error', 'You must be logged in to submit a report.');
      }
    } catch (error) {
      Alert.alert('Submission Failed', 'An error occurred. Please try again.');
      console.error("Error submitting report: ", error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Report an Incident</Text>
      <TextInput
        style={styles.input}
        placeholder="Tricycle Body Number (e.g., 1234)"
        value={tricycleBodyNumber}
        onChangeText={setTricycleBodyNumber}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Type of Incident (e.g., Overcharging)"
        value={incidentType}
        onChangeText={setIncidentType}
      />
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Details of the incident"
        value={details}
        onChangeText={setDetails}
        multiline
      />
      <TouchableOpacity style={styles.button} onPress={handleReportSubmit}>
        <Text style={styles.buttonText}>Submit Report</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: 'white',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  textArea: {
    height: 150,
    textAlignVertical: 'top',
    paddingTop: 15,
  },
  button: {
    width: '100%',
    backgroundColor: 'green',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
