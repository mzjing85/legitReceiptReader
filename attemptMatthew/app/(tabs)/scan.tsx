import { StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { Text } from 'react-native';
import { View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';

const AZURE_ENDPOINT = '';
const AZURE_API_KEY = '';

export default function ScanScreen() {
  const [ocrText, setOcrText] = useState<string>('');
  const [image, setImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setImage(uri);
      await processImageWithAzure(uri);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera permissions to make this work!');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setImage(uri);
      await processImageWithAzure(uri);
    }
  };

  const processImageWithAzure = async (uri: string) => {
    setIsLoading(true);
    setOcrText('Processing image...');
    try {
      // First, convert the image URI to base64
      const response = await fetch(uri);
      const blob = await response.blob();
      
      // Call Azure Computer Vision API
      const visionResponse = await fetch(`${AZURE_ENDPOINT}/vision/v3.2/read/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/octet-stream',
          'Ocp-Apim-Subscription-Key': AZURE_API_KEY,
        },
        body: blob
      });

      if (!visionResponse.ok) {
        throw new Error('Failed to process image');
      }

      // Get the operation location from headers
      const operationLocation = visionResponse.headers.get('Operation-Location');
      if (!operationLocation) {
        throw new Error('Operation location not found');
      }

      // Poll for results
      let result;
      do {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second between polls
        const resultResponse = await fetch(operationLocation, {
          headers: {
            'Ocp-Apim-Subscription-Key': AZURE_API_KEY,
          },
        });
        result = await resultResponse.json();
      } while (result.status !== 'succeeded' && result.status !== 'failed');

      if (result.status === 'succeeded') {
        // Extract text from the result
        const text = result.analyzeResult.readResults
          .map((page: any) => 
            page.lines.map((line: any) => line.text).join('\n')
          )
          .join('\n');
        
        setOcrText(text);
      } else {
        throw new Error('OCR processing failed');
      }
    } catch (error) {
      console.error('Error processing image:', error);
      setOcrText('Error processing image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Scan Receipt</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={pickImage}>
          <Text style={styles.buttonText}>Upload Picture</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={takePhoto}>
          <Text style={styles.buttonText}>Take Picture</Text>
        </TouchableOpacity>
      </View>
      {ocrText && (
        <ScrollView style={styles.textContainer}>
          <Text style={styles.ocrText}>Detected Text:{'\n\n'}{ocrText}</Text>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  buttonContainer: {
    gap: 10,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    minWidth: 200,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },

  textContainer: {
    width: '90%',
    padding: 16,
    marginTop: 20,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    maxHeight: 300,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  ocrText: {
    fontSize: 16,
    color: '#000000',
    lineHeight: 24,
  }
});
