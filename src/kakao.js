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

    // HTML에서 이미 로드 중인 스크립트가 있는지 확인 (src로 검색)
    const existingScripts = document.querySelectorAll(
      'script[src*="kakao_js_sdk"]'
    );
    if (existingScripts.length > 0) {
      // 스크립트가 이미 있으면 로드 완료를 기다림
      const checkInterval = setInterval(() => {
        if (window.Kakao) {
          clearInterval(checkInterval);
          resolve();
        }
      }, 50);

      // 타임아웃 설정 (10초)
      setTimeout(() => {
        clearInterval(checkInterval);
        if (window.Kakao) {
          resolve();
        } else {
          reject(new Error('Kakao SDK load timeout'));
        }
      }, 10000);

      // 스크립트의 load 이벤트도 확인
      existingScripts[0].addEventListener('load', () => {
        clearInterval(checkInterval);
        resolve();
      });
      existingScripts[0].addEventListener('error', () => {
        clearInterval(checkInterval);
        reject(new Error('Failed to load Kakao SDK'));
      });
      return;
    }

    // 동적으로 스크립트 태그 생성 및 추가 (fallback)
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
 * @property {Array} [buttons] - 버튼 배열 (기본 방식 사용 시, 여러 버튼 가능)
 * @property {string} [templateId] - Kakao 템플릿 ID (템플릿 사용 시)
 * @property {Object} [templateArgs] - 템플릿 인자 (템플릿 사용 시)
 * @property {Object} [serverCallbackArgs] - 서버 콜백 인자 (템플릿 사용 시)
 */

/**
 * Kakao톡으로 공유합니다 (템플릿 또는 기본 방식)
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

    // 템플릿 ID가 있으면 템플릿 사용, 없으면 기본 방식
    if (options.templateId) {
      // 템플릿 사용 (sendCustom)
      // Note: Buttons are typically configured in the template, but we can add serverCallbackArgs if needed
      // templateId는 숫자여야 함
      const templateId = Number(options.templateId);
      if (isNaN(templateId)) {
        console.error('Invalid templateId:', options.templateId);
        return false;
      }

      const customOptions = {
        templateId: templateId,
      };

      // templateArgs가 있고 비어있지 않으면 추가
      if (
        options.templateArgs &&
        Object.keys(options.templateArgs).length > 0
      ) {
        customOptions.templateArgs = options.templateArgs;
      }

      // serverCallbackArgs가 있으면 추가
      if (
        options.serverCallbackArgs &&
        Object.keys(options.serverCallbackArgs).length > 0
      ) {
        customOptions.serverCallbackArgs = options.serverCallbackArgs;
      }

      console.log('Kakao Share Custom Options:', customOptions);
      window.Kakao.Share.sendCustom(customOptions);
    } else {
      // 기본 방식 (sendDefault) - supports multiple buttons
      const buttons = options.buttons || [
        {
          title: options.buttonTitle || '청접장 보기',
          link: {
            mobileWebUrl: currentUrl,
            webUrl: currentUrl,
          },
        },
      ];

      window.Kakao.Share.sendDefault({
        objectType: 'feed',
        content: {
          title: options.title || '초대장',
          description: options.description || '초대장을 공유합니다.',
          imageUrl: options.imageUrl || `${window.location.origin}/img/05.jpg`,
          link: {
            mobileWebUrl: currentUrl,
            webUrl: currentUrl,
          },
        },
        buttons: buttons,
      });
    }

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
