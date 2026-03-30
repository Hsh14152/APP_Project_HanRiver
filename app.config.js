import {
  withAndroidManifest,
  withProjectBuildGradle,
} from '@expo/config-plugins';

export default ({ config }) => {
  return {
    ...config,
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
    plugins: [
      // @mj-studio 플러그인 제거하고 직접 주입만 사용
      (config) => {
        return withAndroidManifest(config, (config) => {
          const androidManifest = config.modResults.manifest;
          const mainApplication = androidManifest.application[0];

          if (!mainApplication['meta-data']) {
            mainApplication['meta-data'] = [];
          }

          // 기존 네이버 관련 메타데이터 전부 제거
          mainApplication['meta-data'] = mainApplication['meta-data'].filter(
            (meta) => !meta.$['android:name'].includes('naver'),
          );

          // 강제 주입
          mainApplication['meta-data'].push({
            $: {
              'android:name': 'com.naver.maps.map.CLIENT_ID',
              'android:value': 'vb0jojyaaz',
            },
          });

          return config;
        });
      },
      // 네이버 Maven 저장소 주입
      (config) => {
        return withProjectBuildGradle(config, (config) => {
          if (config.modResults.language === 'groovy') {
            const contents = config.modResults.contents;
            const naverRepo =
              "maven { url 'https://repository.map.naver.com/archive/maven' }";
            if (!contents.includes(naverRepo)) {
              config.modResults.contents = contents.replace(
                /allprojects\s*\{\s*repositories\s*\{/,
                `allprojects {\n    repositories {\n        ${naverRepo}`,
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
