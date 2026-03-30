import {
  withAndroidManifest,
  withProjectBuildGradle,
} from '@expo/config-plugins';

export default ({ config }) => {
  return {
    ...config,
    // 1. 기본 앱 정보 (패키지명: com.hsh.hangangpark 확인)
    name: '한강 그늘막',
    slug: 'hangang-park',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'light',
    splash: {
      image: './assets/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#03C75A',
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.hsh.hangangpark',
    },
    android: {
      package: 'com.hsh.hangangpark',
      versionCode: 1,
      // S24+ 호환성을 위해 최신 안정화 버전인 34로 고정
      compilerSdkVersion: 34,
      targetSdkVersion: 34,
      adaptiveIcon: {
        foregroundImage: './assets/icon.png',
        backgroundColor: '#03C75A',
      },
      permissions: [
        'ACCESS_COARSE_LOCATION',
        'ACCESS_FINE_LOCATION',
        'INTERNET',
      ],
    },
    // 2. 플러그인 설정
    plugins: [
      [
        '@mj-studio/react-native-naver-map',
        {
          clientId: 'vb0jojyaaz',
        },
      ],
      // [중요] AndroidManifest 파싱 에러 강제 교정 플러그인
      (config) => {
        return withAndroidManifest(config, (config) => {
          const androidManifest = config.modResults.manifest;
          const mainApplication = androidManifest.application[0];

          // 기존에 잘못 들어갔을 수 있는 네이버 관련 메타데이터를 모두 제거 (중복 방지)
          if (mainApplication['meta-data']) {
            mainApplication['meta-data'] = mainApplication['meta-data'].filter(
              (meta) =>
                meta.$['android:name'] !== 'com.naver.maps.map.CLIENT_ID' &&
                meta.$['android:name'] !== 'com.naver.maps.map.NCP_KEY_ID',
            );
          } else {
            mainApplication['meta-data'] = [];
          }

          // 정확한 위치(Application 직계 자식)에 단 하나의 Client ID만 주입
          mainApplication['meta-data'].push({
            $: {
              'android:name': 'com.naver.maps.map.CLIENT_ID',
              'android:value': 'vb0jojyaaz',
            },
          });

          return config;
        });
      },
      // [중요] 네이버 지도 SDK 저장소(Maven) 강제 주입 플러그인
      (config) => {
        return withProjectBuildGradle(config, (config) => {
          if (config.modResults.language === 'groovy') {
            const contents = config.modResults.contents;
            const naverRepo =
              "maven { url 'https://repository.map.naver.com/archive/maven' }";

            if (!contents.includes(naverRepo)) {
              config.modResults.contents = contents.replace(
                /allprojects\s*\{\s*repositories\s*\{/,
                `allprojects {
    repositories {
        ${naverRepo}`,
              );
            }
          }
          return config;
        });
      },
    ],
    extra: {
      eas: {
        projectId: '99bf253a-f725-4682-a8af-6d420fb3ec0f',
      },
    },
    owner: 'raiqu',
  };
};
