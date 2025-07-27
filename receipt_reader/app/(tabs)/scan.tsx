import { useState } from 'react';
import { StyleSheet, Image, ScrollView, SafeAreaView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { ThemedView } from '../../components/ThemedView';
import { ThemedText } from '../../components/ThemedText';
import { Button } from 'react-native';
import { AZURE_ENDPOINT, AZURE_API_KEY } from '@env';

interface ReadOperationResponse {
  status: string;
  createdDateTime: string;
  lastUpdatedDateTime: string;
  analyzeResult?: {
    readResults: Array<{
      page: number;
      lines: Array<{
        text: string;
        boundingBox: number[];
      }>;
    }>;
  };
}

export default function ScanScreen() {
  const [image, setImage] = useState<string | null>(null);
  const [ocrText, setOcrText] = useState('');
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      analyzeImage(result.assets[0].uri);
    }
  };

  const analyzeImage = async (imageUri: string) => {
    setLoading(true);
    try {
      const response = await fetch(imageUri);
      const blob = await response.blob();
      
      // Call Azure Computer Vision API using environment variables
      const endpoint = AZURE_ENDPOINT;
      const apiKey = AZURE_API_KEY;

      // Submit the image for analysis
      const submitResponse = await fetch(
        `${endpoint}/vision/v3.2/read/analyze`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/octet-stream',
            'Ocp-Apim-Subscription-Key': apiKey,
          },
          body: blob,
        }
      );

      if (!submitResponse.ok) {
        throw new Error('Failed to submit image for analysis');
      }

      // Get the operation location URL from the response headers
      const operationLocation = submitResponse.headers.get('Operation-Location');
      if (!operationLocation) {
        throw new Error('Operation location not found in response');
      }

      // Poll the results until the analysis is complete
      let result: ReadOperationResponse;
      while (true) {
        const resultResponse = await fetch(operationLocation, {
          headers: {
            'Ocp-Apim-Subscription-Key': apiKey,
          },
        });
        
        result = await resultResponse.json();
        
        if (result.status === 'succeeded' || result.status === 'failed') {
          break;
        }
        
        // Wait 1 second before polling again
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      if (result.status === 'failed') {
        throw new Error('Image analysis failed');
      }

      // Extract text from the results
      let extractedText = '';
      if (result.analyzeResult?.readResults) {
        result.analyzeResult.readResults.forEach(pageResult => {
          pageResult.lines.forEach(line => {
            extractedText += line.text + '\n';
          });
        });
      }
      
      console.log('setOcrText Called, sendToBackend next')
      setOcrText(extractedText);
      sendToBackend(extractedText);
    } catch (error) {
      console.error('Error analyzing image:', error);
      setOcrText('Error analyzing image');
    } finally {
      setLoading(false);
    }
  };

  const sendToBackend = async (ocrText: string) => {
  try {
    console.log('Sending OCR text to backend:', ocrText);
    const response = await fetch('http://localhost:5001/parse-ocr', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ocrText }),
    });
    const parsedData = await response.json();
    console.log('Parsed Data:', parsedData);
  } catch (error) {
    console.error('Error sending to backend:', error);
  }
};

  return (
    <SafeAreaView style={styles.safeArea}>
      <ThemedView style={styles.container}>
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={true}
        >
          <Button title="Pick an image" onPress={pickImage} />
          {image && (
            <Image source={{ uri: image }} style={styles.image} />
          )}
          {loading && <ThemedText style={styles.loadingText}>Analyzing image...</ThemedText>}
          {ocrText && (
            <ThemedView style={styles.textContainer}>
              <ThemedText style={styles.text}>{ocrText}</ThemedText>
            </ThemedView>
          )}
        </ScrollView>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    width: '100%',
  },
  scrollContent: {
    alignItems: 'center',
    padding: 20,
  },
  image: {
    width: 300,
    height: 300,
    marginVertical: 20,
    resizeMode: 'contain',
  },
  textContainer: {
    marginTop: 20,
    padding: 10,
    width: '100%',
  },
  text: {
    fontSize: 16,
  },
  loadingText: {
    marginTop: 10,
  },
});
