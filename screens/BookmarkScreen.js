import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { COLORS } from '../constants/colors';
import { PARK_CENTERS } from '../data/zones';

const STORAGE_KEY = 'bookmarks';

export default function BookmarkScreen({ navigation }) {
  const [bookmarks, setBookmarks] = useState([]);

  // 화면 포커스될 때마다 불러오기
  useFocusEffect(
    useCallback(() => {
      loadBookmarks();
    }, []),
  );

  const loadBookmarks = async () => {
    try {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      setBookmarks(saved ? JSON.parse(saved) : []);
    } catch (e) {
      console.error(e);
    }
  };

  const removeBookmark = async (parkId) => {
    Alert.alert(
      '즐겨찾기 삭제',
      `${PARK_CENTERS[parkId].name} 한강공원을 삭제할까요?`,
      [
        { text: '취소', style: 'cancel' },
        {
          text: '삭제',
          style: 'destructive',
          onPress: async () => {
            const updated = bookmarks.filter((id) => id !== parkId);
            setBookmarks(updated);
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
          },
        },
      ],
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.hero}>
        <Text style={styles.heroSub}>⭐ 자주 가는 한강공원을 저장하세요!</Text>
      </View>

      {bookmarks.length === 0 ? (
        // 즐겨찾기 없을 때
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>📍</Text>
          <Text style={styles.emptyText}>즐겨찾기한 공원이 없어요</Text>
          <Text style={styles.emptySub}>
            지도 탭에서 공원 탭을 길게 누르면{'\n'}즐겨찾기에 추가할 수 있어요
          </Text>
        </View>
      ) : (
        <>
          <Text style={styles.sectionTitle}>
            저장된 공원 {bookmarks.length}개
          </Text>
          {bookmarks.map((parkId) => {
            const info = PARK_CENTERS[parkId];
            if (!info) return null;
            return (
              <TouchableOpacity
                key={parkId}
                style={styles.parkCard}
                onPress={() => navigation.navigate('지도', { parkId })}
                onLongPress={() => removeBookmark(parkId)}
              >
                <View style={styles.parkCardLeft}>
                  <Text style={styles.parkIcon}>{info.icon}</Text>
                  <View>
                    <Text style={styles.parkName}>{info.name} 한강공원</Text>
                    <Text style={styles.parkSub}>길게 누르면 삭제</Text>
                  </View>
                </View>
                <Text style={styles.arrow}>›</Text>
              </TouchableOpacity>
            );
          })}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  hero: { backgroundColor: COLORS.brand, padding: 24, paddingTop: 48 },
  heroTitle: { color: 'white', fontSize: 20, fontWeight: 'bold' },
  heroSub: { color: 'rgba(255,255,255,0.8)', fontSize: 16, marginTop: 4 },
  empty: { alignItems: 'center', paddingTop: 80 },
  emptyIcon: { fontSize: 48, marginBottom: 16 },
  emptyText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555',
    marginBottom: 8,
  },
  emptySub: {
    fontSize: 13,
    color: '#999',
    textAlign: 'center',
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#555',
    padding: 16,
    paddingBottom: 8,
  },
  parkCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    marginHorizontal: 12,
    marginBottom: 8,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  parkCardLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  parkIcon: { fontSize: 22 },
  parkName: { fontSize: 14, fontWeight: 'bold', color: COLORS.textMain },
  parkSub: { fontSize: 11, color: '#999', marginTop: 2 },
  arrow: { fontSize: 20, color: '#ccc' },
});
