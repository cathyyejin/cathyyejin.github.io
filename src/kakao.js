/**
 * Kakao SDK 초기화 및 공유 기능
 */

const KAKAO_SDK_URL = 'https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js';
const SDK_SCRIPT_ID = 'kakao-sdk-script';

/**
 * Kakao SDK 스크립트를 동적으로 로드합니다
 * @returns {Promise<void>}
 */
const loadKakaoSDK = () => {
  return new Promise((resolve, reject) => {
    // 이미 SDK가 로드되어 있는지 확인
    if (window.Kakao) {
      resolve();
      return;
    }

    // 이미 스크립트 태그가 있는지 확인
    const existingScript = document.getElementById(SDK_SCRIPT_ID);
    if (existingScript) {
      existingScript.addEventListener('load', resolve);
      existingScript.addEventListener('error', reject);
      return;
    }

    // 스크립트 태그 생성 및 추가
    const script = document.createElement('script');
    script.id = SDK_SCRIPT_ID;
    script.src = KAKAO_SDK_URL;
    script.async = true;
    script.defer = true;

    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Kakao SDK'));

    document.head.appendChild(script);
  });
};

/**
 * Kakao SDK를 초기화합니다
 * @param {string} apiKey - Kakao JavaScript API Key
 * @returns {Promise<boolean>} 초기화 성공 여부
 */
export const initKakao = async (apiKey) => {
  try {
    // API 키가 없으면 에러
    if (!apiKey) {
      console.error('Kakao API key is required');
      return false;
    }

    // SDK 로드
    await loadKakaoSDK();

    // 이미 초기화되어 있으면 스킵
    if (window.Kakao && window.Kakao.isInitialized()) {
      console.log('Kakao SDK already initialized');
      return true;
    }

    // 초기화
    if (window.Kakao) {
      window.Kakao.init(apiKey);
      console.log('Kakao SDK initialized:', window.Kakao.isInitialized());
      return window.Kakao.isInitialized();
    }

    return false;
  } catch (error) {
    console.error('Failed to initialize Kakao SDK:', error);
    return false;
  }
};

/**
 * Kakao 공유 옵션 타입 정의
 * @typedef {Object} ShareOptions
 * @property {string} title - 공유할 제목
 * @property {string} description - 공유할 설명
 * @property {string} imageUrl - 공유할 이미지 URL (HTTPS 필수)
 * @property {string} [url] - 공유할 링크 (기본값: 현재 페이지 URL)
 * @property {string} [buttonTitle] - 버튼 제목 (기본값: '자세히 보기')
 */

/**
 * Kakao톡으로 공유합니다
 * @param {ShareOptions} options - 공유 옵션
 * @param {string} apiKey - Kakao JavaScript API Key
 * @returns {Promise<boolean>} 공유 성공 여부
 */
export const shareKakao = async (options, apiKey) => {
  try {
    // API 키 확인
    const key =
      apiKey ||
      import.meta.env.VITE_KAKAO_API_KEY ||
      import.meta.env.VITE_KAKAO_JS_KEY;
    if (!key) {
      console.error('Kakao API key is required');
      return false;
    }

    // SDK 초기화
    const initialized = await initKakao(key);
    if (!initialized) {
      console.error('Failed to initialize Kakao SDK');
      return false;
    }

    // 현재 URL 가져오기
    const currentUrl = options.url || window.location.href;

    // 공유 실행
    window.Kakao.Share.sendDefault({
      objectType: 'feed',
      content: {
        title: options.title || '초대장',
        description: options.description || '초대장을 공유합니다.',
        imageUrl: options.imageUrl || `${window.location.origin}/img/intro.jpg`,
        link: {
          mobileWebUrl: currentUrl,
          webUrl: currentUrl,
        },
      },
      buttons: [
        {
          title: options.buttonTitle || '자세히 보기',
          link: {
            mobileWebUrl: currentUrl,
            webUrl: currentUrl,
          },
        },
      ],
    });

    return true;
  } catch (error) {
    console.error('Failed to share via Kakao:', error);
    return false;
  }
};

/**
 * Kakao SDK가 초기화되었는지 확인합니다
 * @returns {boolean}
 */
export const isKakaoInitialized = () => {
  return window.Kakao && window.Kakao.isInitialized();
};

/**
 * Kakao SDK가 로드되었는지 확인합니다
 * @returns {boolean}
 */
export const isKakaoLoaded = () => {
  return typeof window.Kakao !== 'undefined';
};
