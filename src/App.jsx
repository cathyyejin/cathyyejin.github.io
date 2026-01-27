import './App.css';
import { useState, useEffect, useRef } from 'react';
import { shareKakao as shareKakaoAPI } from './kakao';

function Toast({ open, message, type, onClose, position = 'bottom' }) {
  const color = type === 'error' ? 'bg-rose-600' : 'bg-emerald-600';

  const wrapper =
    position === 'top'
      ? 'fixed inset-x-0 top-[max(1rem,env(safe-area-inset-top))] flex justify-center'
      : position === 'center'
        ? 'fixed inset-0 flex items-center justify-center'
        : // bottom (default)
          'fixed inset-x-0 bottom-[max(1rem,env(safe-area-inset-bottom))] flex justify-center';

  // 등장/퇴장 애니메이션 방향을 위치에 맞춰 살짝 다르게
  const motion =
    position === 'center'
      ? open
        ? 'opacity-100 scale-100'
        : 'opacity-0 scale-95'
      : position === 'top'
        ? open
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 -translate-y-2'
        : /* bottom */ open
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-2';

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className={`pointer-events-none z-[100] ${wrapper} transition-all duration-200`}
    >
      <div
        className={`pointer-events-auto inline-flex items-center gap-2 ${color} text-white
          rounded-full px-4 py-2 shadow-lg ring-1 ring-black/5 transform ${motion}`}
      >
        {type === 'error' ? (
          <svg
            className="w-4 h-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v4m0 4h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"
            />
          </svg>
        ) : (
          <svg
            className="w-4 h-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m5 13 4 4L19 7"
            />
          </svg>
        )}
        <span className="text-sm">{message}</span>
        <button
          type="button"
          onClick={onClose}
          className="ml-1 -mr-1 p-1 rounded hover:bg-white/20"
          aria-label="닫기"
        >
          <svg
            className="w-4 h-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18 18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

function loadKakao(appkey) {
  return new Promise((resolve, reject) => {
    if (window.kakao && window.kakao.maps) {
      window.kakao.maps.load(() => resolve(window.kakao));
      return;
    }
    const EXISTING = document.getElementById('kakao-map-sdk');
    const onLoaded = () => window.kakao.maps.load(() => resolve(window.kakao));

    if (EXISTING) {
      EXISTING.addEventListener('load', onLoaded, { once: true });
      return;
    }

    const s = document.createElement('script');
    s.id = 'kakao-map-sdk';
    s.async = true;
    // services 라이브러리(지오코더) 사용, HTTPS 사용
    s.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${appkey}&autoload=false&libraries=services`;
    s.onload = onLoaded;
    s.onerror = reject;
    document.head.appendChild(s);
  });
}

export function KakaoMap({
  appkey,
  // 둘 중 하나만 있으면 됩니다: lat/lng 또는 address
  lat,
  lng,
  address,
  title = '',
  level = 3, // 지도 확대 레벨(작을수록 확대)
  className = 'w-full h-64 sm:h-80 rounded-lg overflow-hidden',
}) {
  const ref = useRef(null);

  useEffect(() => {
    if (!appkey) return;

    let map, marker, info;
    let mounted = true;
    let handleResize = null;

    loadKakao(appkey)
      .then((kakao) => {
        if (!mounted || !ref.current) return;

        const center = new kakao.maps.LatLng(lat || 37.5665, lng || 126.978); // 기본: 서울시청
        map = new kakao.maps.Map(ref.current, { center, level });

        // 모바일에서 지도가 제대로 표시되도록 relayout 호출
        setTimeout(() => {
          if (map && mounted) {
            map.relayout();
          }
        }, 100);

        // 컨트롤(줌) 추가
        const zoomControl = new kakao.maps.ZoomControl();
        map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);

        const setMarkerWithInfo = (pos) => {
          if (!mounted) return;
          marker = new kakao.maps.Marker({ position: pos, map });
          if (title) {
            info = new kakao.maps.InfoWindow({
              content: `<div style="padding:6px 8px;white-space:nowrap;">${title}</div>`,
            });
            info.open(map, marker);
          }
          // 마커 추가 후에도 relayout 호출
          setTimeout(() => {
            if (map && mounted) {
              map.relayout();
            }
          }, 50);
        };

        if (address) {
          const geocoder = new kakao.maps.services.Geocoder();
          geocoder.addressSearch(address, (result, status) => {
            if (!mounted) return;
            if (status === kakao.maps.services.Status.OK && result[0]) {
              const pos = new kakao.maps.LatLng(result[0].y, result[0].x);
              map.setCenter(pos);
              setMarkerWithInfo(pos);
            } else {
              // 주소 실패 시 기본 좌표 사용
              setMarkerWithInfo(center);
              // console.warn('주소를 좌표로 변환하지 못했습니다.');
            }
          });
        } else if (lat && lng) {
          setMarkerWithInfo(center);
        }

        // 윈도우 리사이즈 시 지도 크기 조정
        handleResize = () => {
          if (map && mounted) {
            map.relayout();
          }
        };
        window.addEventListener('resize', handleResize);
        window.addEventListener('orientationchange', handleResize);
      })
      .catch((error) => {
        console.error('Failed to load Kakao Map:', error);
      });

    return () => {
      mounted = false;
      if (handleResize) {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('orientationchange', handleResize);
      }
    };
  }, [appkey, lat, lng, address, title, level]);

  return <div ref={ref} className={className} />;
}

function App() {
  const [currentImage, setCurrentImage] = useState(0);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  const [activeTab, setActiveTab] = useState('meal');
  const [showGroomAccounts, setShowGroomAccounts] = useState(false);
  const [showBrideAccounts, setShowBrideAccounts] = useState(false);
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // 토스트
  const [toast, setToast] = useState({
    open: false,
    message: '',
    type: 'success',
  });
  const toastTimerRef = useRef(null);

  // 토스트 표시 함수
  const showToast = (message, type = 'success', ms = 1800) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast({ open: true, message, type });
    toastTimerRef.current = setTimeout(() => {
      setToast((prev) => ({ ...prev, open: false }));
    }, ms);
  };

  // 언마운트 시 타이머 정리
  useEffect(() => {
    return () => clearTimeout(toastTimerRef.current);
  }, []);

  // Countdown to wedding day
  useEffect(() => {
    const target = new Date('2026-05-16T11:30:00+09:00'); // KST 기준 2026-05-16 11:"30"

    const tick = () => {
      const now = new Date();
      const diff = Math.max(target.getTime() - now.getTime(), 0);

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor(diff / (1000 * 60 * 60)) % 24;
      const minutes = Math.floor(diff / (1000 * 60)) % 60;
      const seconds = Math.floor(diff / 1000) % 60;

      setCountdown({ days, hours, minutes, seconds });
    };

    tick(); // 초기 값 설정
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, []);

  // Sample images - replace with your actual images
  const images = [
    'img/01.jpg',
    'img/03.jpg',
    'img/04.jpg',
    'img/07.jpg',
    'img/09.jpg',
    'img/11.jpg',
    'img/12.jpg',
    'img/13.jpg',
    'img/14.jpg',
    'img/15.jpg',
    'img/16.jpg',
    'img/17.jpg',
    'img/18.jpg',
    'img/19.jpg',
    'img/20.jpg',
  ];

  // Custom crop positions for specific images (optional)
  // Use image index as key, and position as value
  // Options: 'center', 'top', 'bottom', 'left', 'right', 'top left', 'top right', 'bottom left', 'bottom right'
  // Or use custom CSS values like '30% 70%', 'center top', etc.
  const imagePositions = {
    // Example:
    // 0: 'top',           // First image shows top portion
    // 2: 'bottom',        // Third image shows bottom portion
    // 5: 'left',          // Sixth image shows left portion
    // 7: 'center top',    // Eighth image shows center-top
    // 10: '30% 70%',      // Eleventh image uses custom position
    0: 'top',
    1: 'top',
    4: 'bottom',
    8: 'top',
    10: 'top',
  };

  const scrollerRef = useRef(null);

  const scrollToIndex = (i) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollTo({ left: i * el.clientWidth, behavior: 'smooth' });
  };

  // keep currentImage in sync while the user scrolls
  const onScrollSnap = () => {
    const el = scrollerRef.current;
    if (!el) return;
    const idx = Math.round(el.scrollLeft / el.clientWidth);
    if (idx !== currentImage) setCurrentImage(idx);
  };

  // Scroll to selected image when gallery opens
  useEffect(() => {
    if (isGalleryOpen && scrollerRef.current) {
      // Use setTimeout to ensure the DOM is ready
      setTimeout(() => {
        const el = scrollerRef.current;
        if (el) {
          el.scrollTo({
            left: currentImage * el.clientWidth,
            behavior: 'instant',
          });
        }
      }, 0);
    }
  }, [isGalleryOpen, currentImage]);

  const IconSubway = (props) => (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M16.25,3 C18.3210678,3 20,4.67893219 20,6.75 L20,15.75 C20,17.525252 18.7664279,19.0123878 17.1096977,19.4009933 L19.5724502,20.5728546 C19.9464273,20.7509389 20.1052297,21.1984731 19.9271454,21.5724502 C19.7639014,21.9152625 19.3742447,22.0772684 19.022378,21.9647184 L18.9275498,21.9271454 L13.8298251,19.5 L10.1688251,19.5 L5.07245019,21.9271454 C4.69847311,22.1052297 4.25093893,21.9464273 4.07285461,21.5724502 C3.89477029,21.1984731 4.05357274,20.7509389 4.42754981,20.5728546 L6.8898721,19.4008924 C5.23335859,19.0121304 4,17.5250984 4,15.75 L4,6.75 C4,4.67893219 5.67893219,3 7.75,3 L16.25,3 Z M18.4998251,14 L5.4998251,14 L5.5,15.75 C5.5,16.9926407 6.50735931,18 7.75,18 L16.25,18 C17.4926407,18 18.5,16.9926407 18.5,15.75 L18.4998251,14 Z M8,15 C8.55228475,15 9,15.4477153 9,16 C9,16.5522847 8.55228475,17 8,17 C7.44771525,17 7,16.5522847 7,16 C7,15.4477153 7.44771525,15 8,15 Z M16,15 C16.5522847,15 17,15.4477153 17,16 C17,16.5522847 16.5522847,17 16,17 C15.4477153,17 15,16.5522847 15,16 C15,15.4477153 15.4477153,15 16,15 Z M16.25,4.5 L7.75,4.5 C6.50735931,4.5 5.5,5.50735931 5.5,6.75 L5.4998251,12.5 L18.4998251,12.5 L18.5,6.75 C18.5,5.50735931 17.4926407,4.5 16.25,4.5 Z M13.25,6 C13.6642136,6 14,6.33578644 14,6.75 C14,7.16421356 13.6642136,7.5 13.25,7.5 L10.75,7.5 C10.3357864,7.5 10,7.16421356 10,6.75 C10,6.33578644 10.3357864,6 10.75,6 L13.25,6 Z" />
    </svg>
  );

  const IconBus = (props) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      aria-hidden="true"
      {...props}
    >
      {/* <path
        d="M8.25 20.25V21.75C8.25 22.1478 8.09196 22.5293 7.81066 22.8106C7.52936 23.0919 7.14782 23.25 6.75 23.25C6.35218 23.25 5.97064 23.0919 5.68934 22.8106C5.40804 22.5293 5.25 22.1478 5.25 21.75V20.3651"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.75 20.25V21.75C15.75 22.1478 15.908 22.5293 16.1893 22.8106C16.4706 23.0919 16.8522 23.25 17.25 23.25C17.6478 23.25 18.0294 23.0919 18.3107 22.8106C18.592 22.5293 18.75 22.1478 18.75 21.75V20.25"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M0.75 9.75V6.75C0.75 6.35218 0.908035 5.97064 1.18934 5.68934C1.47064 5.40804 1.85218 5.25 2.25 5.25H3.60938"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M23.25 9.75V6.75C23.25 6.35218 23.092 5.97064 22.8107 5.68934C22.5294 5.40804 22.1478 5.25 21.75 5.25H20.375"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18.25 0.75H5.75C4.64543 0.75 3.75 1.64543 3.75 2.75V18.25C3.75 19.3546 4.64543 20.25 5.75 20.25H18.25C19.3546 20.25 20.25 19.3546 20.25 18.25V2.75C20.25 1.64543 19.3546 0.75 18.25 0.75Z"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20.25 14.25H3.75"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.25 17.25H17.25"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.75 17.25H9.75"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.75 3.75H14.25"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      /> */}
      <path
        d="M4 10C4 6.22876 4 4.34315 5.17157 3.17157C6.34315 2 8.22876 2 12 2C15.7712 2 17.6569 2 18.8284 3.17157C20 4.34315 20 6.22876 20 10V12C20 15.7712 20 17.6569 18.8284 18.8284C17.6569 20 15.7712 20 12 20C8.22876 20 6.34315 20 5.17157 18.8284C4 17.6569 4 15.7712 4 12V10Z"
        stroke-width="1.5"
      />
      <path
        d="M4 13H20"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M15.5 16H17"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M7 16H8.5"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M6 19.5V21C6 21.5523 6.44772 22 7 22H8.5C9.05228 22 9.5 21.5523 9.5 21V20"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M18 19.5V21C18 21.5523 17.5523 22 17 22H15.5C14.9477 22 14.5 21.5523 14.5 21V20"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M20 9H21C21.5523 9 22 9.44772 22 10V11C22 11.3148 21.8518 11.6111 21.6 11.8L20 13"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M4 9H3C2.44772 9 2 9.44772 2 10V11C2 11.3148 2.14819 11.6111 2.4 11.8L4 13"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path d="M19.5 5H4.5" stroke-width="1.5" stroke-linecap="round" />
    </svg>
  );

  const IconCar = (props) => (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M3 8L5.72187 10.2682C5.90158 10.418 6.12811 10.5 6.36205 10.5H17.6379C17.8719 10.5 18.0984 10.418 18.2781 10.2682L21 8M6.5 14H6.51M17.5 14H17.51M8.16065 4.5H15.8394C16.5571 4.5 17.2198 4.88457 17.5758 5.50772L20.473 10.5777C20.8183 11.1821 21 11.8661 21 12.5623V18.5C21 19.0523 20.5523 19.5 20 19.5H19C18.4477 19.5 18 19.0523 18 18.5V17.5H6V18.5C6 19.0523 5.55228 19.5 5 19.5H4C3.44772 19.5 3 19.0523 3 18.5V12.5623C3 11.8661 3.18166 11.1821 3.52703 10.5777L6.42416 5.50772C6.78024 4.88457 7.44293 4.5 8.16065 4.5ZM7 14C7 14.2761 6.77614 14.5 6.5 14.5C6.22386 14.5 6 14.2761 6 14C6 13.7239 6.22386 13.5 6.5 13.5C6.77614 13.5 7 13.7239 7 14ZM18 14C18 14.2761 17.7761 14.5 17.5 14.5C17.2239 14.5 17 14.2761 17 14C17 13.7239 17.2239 13.5 17.5 13.5C17.7761 13.5 18 13.7239 18 14Z"
      />
    </svg>
  );

  const IconParking = (props) => (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M5,22H19a3,3,0,0,0,3-3V5a3,3,0,0,0-3-3H5A3,3,0,0,0,2,5V19A3,3,0,0,0,5,22ZM4,5A1,1,0,0,1,5,4H19a1,1,0,0,1,1,1V19a1,1,0,0,1-1,1H5a1,1,0,0,1-1-1ZM9,18a1,1,0,0,0,1-1V14h2a4,4,0,0,0,0-8H9A1,1,0,0,0,8,7V17A1,1,0,0,0,9,18ZM10,8h2a2,2,0,0,1,0,4H10Z" />
    </svg>
  );

  const copyText = async (
    text,
    okMsg = '복사되었습니다.',
    errMsg = '복사에 실패했습니다.'
  ) => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        // fallback
        const i = document.createElement('input');
        i.value = text;
        document.body.appendChild(i);
        i.select();
        document.execCommand('copy');
        document.body.removeChild(i);
      }
      showToast(okMsg, 'success'); // << use your toast
    } catch (e) {
      console.error(e);
      showToast(errMsg, 'error'); // << use your toast
    }
  };
  const copyAccount = (acct) =>
    copyText(acct, '계좌번호가 복사되었습니다', '계좌번호 복사에 실패했습니다');
  const copyPageLink = () =>
    copyText(window.location.href, '링크가 복사되었습니다');
  const copyAddress = (address) =>
    copyText(address, '주소가 복사되었습니다', '주소 복사에 실패했습니다');

  // Web Share API (falls back to copy)
  const sharePage = async () => {
    const url = window.location.href;
    const title = '초대장';
    const text = '초대장을 공유합니다.';
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
      } catch (err) {
        // user cancelled = fine; other errors -> show message
        if (err && err.name !== 'AbortError') alert('공유에 실패했습니다.');
      }
    } else {
      copyPageLink(); // fallback if Web Share API is unavailable
    }
  };

  // Kakao 공유 함수
  const shareKakao = async () => {
    const apiKey =
      import.meta.env.VITE_KAKAO_JS_KEY || import.meta.env.VITE_KAKAO_API_KEY;
    // 템플릿 ID: 환경 변수에서 가져오거나 기본값 사용 (숫자로 변환)
    const templateId = Number(
      import.meta.env.VITE_KAKAO_TEMPLATE_ID || '123425'
    );
    const currentUrl = window.location.href;

    // 템플릿 사용 (템플릿에 설정된 버튼이 자동으로 포함됨)
    // 템플릿에서 ${KEY} 형식으로 사용하는 변수들을 여기에 매핑
    // 예: 템플릿에 ${TITLE}이 있으면 TITLE: '값' 형태로 전달
    const shareOptions = {
      templateId: templateId,
      templateArgs: {
        // 템플릿에서 사용하는 키를 여기에 추가하세요
        // 예시 (템플릿에 실제로 사용하는 키에 맞게 수정):
        // TITLE: '김덕곤 ❤️ 구동민 결혼합니다',
        // DESCRIPTION: '2026년 5월 16일 토요일 오후 3시 국립외교원',
        // IMAGE_URL: `${window.location.origin}/img/05.jpg`,
        // LINK_URL: currentUrl,
      },
    };

    console.log('Sharing with template ID:', templateId);
    console.log('Share options:', shareOptions);

    const success = await shareKakaoAPI(shareOptions, apiKey);

    if (success) {
      showToast?.('카카오톡으로 공유를 시작했어요!');
    } else {
      // 실패 시 기존 공유 방법으로 대체
      sharePage?.() ?? copyPageLink?.();
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'meal':
        return (
          <div className="w-full max-w-2xl bg-white p-6 rounded-lg shadow-md text-center">
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                식사 안내
              </h3>
              <p className="text-gray-700 mb-2">식사는 결혼식 및 사진 촬영이</p>
              <p className="text-gray-700 mb-2">끝난 후, 외교원 지하 1층에서</p>
              <p className="text-gray-700 mb-6">뷔폐식으로 진행됩니다.</p>
              <p className="text-gray-700 mb-2">부족함 없이 즐기실 수 있도록</p>
              <p className="text-gray-700 mb-2">
                한식을 비롯해 중식, 양식, 일식등
              </p>
              <p className="text-gray-700 mb-2">
                다양한 메뉴가 준비되어 있습니다.
              </p>
            </div>
          </div>
        );
      case 'parking':
        return (
          <div className="w-full max-w-2xl bg-white p-6 rounded-lg shadow-md text-center">
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                예식 안내
              </h3>
              <div className="bg-yellow-50 p-4 rounded-lg mb-6">
                <p className="text-sm text-gray-600 mb-2">
                  *예식 참석 시 반드시 청첩장
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  (모바일 포함)을 제시해야만
                </p>
                <p className="text-sm text-gray-600">출입이 가능합니다.</p>
              </div>
              <p className="text-gray-700 mb-2">
                예식 후, 저희의 소중한 순간을
              </p>
              <p className="text-gray-700 mb-2">함께한 생화를 작은 감사의 </p>
              <p className="text-gray-700 mb-6">마음으로 나누어 드립니다.</p>
              <p className="text-gray-700 mb-2">원하시는 분께서는 </p>
              <p className="text-gray-700 mb-2">자유롭게 받아가 주세요.</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };
  // --- Guest book state (mobile + modal) ---
  const [posts, setPosts] = useState([
    {
      id: 1,
      name: '하객 A',
      content: '두 분 행복하세요 ✨',
      createdAt: new Date().toISOString(),
      pin: '1234',
    },
    {
      id: 2,
      name: '하객 A',
      content: '두 분 행복하세요 ✨',
      createdAt: new Date().toISOString(),
      pin: '1234',
    },
    {
      id: 3,
      name: '하객 A',
      content: '두 분 행복하세요 ✨',
      createdAt: new Date().toISOString(),
      pin: '1234',
    },
    {
      id: 4,
      name: '하객 A',
      content: '두 분 행복하세요 ✨',
      createdAt: new Date().toISOString(),
      pin: '1234',
    },
    {
      id: 5,
      name: '하객 A',
      content: '두 분 행복하세요 ✨',
      createdAt: new Date().toISOString(),
      pin: '1234',
    },
    {
      id: 6,
      name: '하객 A',
      content: '두 분 행복하세요 ✨',
      createdAt: new Date().toISOString(),
      pin: '1234',
    },
  ]);
  const PAGE_SIZE = 5; // how many posts per page
  const [page, setPage] = useState(1);
  const [showAll, setShowAll] = useState(false);

  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isWriteOpen, setIsWriteOpen] = useState(false);
  const [gbName, setGbName] = useState('');
  const [gbPassword, setGbPassword] = useState('');
  const [gbContent, setGbContent] = useState('');
  // const canSubmit = gbName.trim() && gbPassword.trim() && gbContent.trim()
  const canSubmit = gbName.trim() && is4Digits(gbPassword) && gbContent.trim();

  const contactGroups = [
    {
      title: '신랑측 GROOM',
      items: [
        {
          role: '신랑',
          name: '김덕곤',
          phone: '010-9190-4651',
        },
        {
          role: '신랑 아버지',
          name: '김기훈',
          phone: '010-9160-4551',
        },
        {
          role: '신랑 어머니',
          name: '김순희',
          phone: '010-9950-4651',
        },
      ],
    },
    {
      title: '신부측 BRIDE',
      items: [
        {
          role: '신부',
          name: '구동민',
          phone: '010-4669-0716',
        },
        {
          role: '신부 아버지',
          name: '구헌상',
          phone: '010-8795-5476',
        },
        {
          role: '신부 어머니',
          name: '나은효',
          phone: '010-4669-1429',
        },
      ],
    },
  ];

  // --- Guest book handlers ---
  const openContact = () => setIsContactOpen(true);
  const closeContact = () => setIsContactOpen(false);
  const openWrite = () => setIsWriteOpen(true);
  const closeWrite = () => {
    setIsWriteOpen(false);
    setGbName('');
    setGbPassword('');
    setGbContent('');
  };
  const totalPages = Math.max(1, Math.ceil(posts.length / PAGE_SIZE));
  const start = (page - 1) * PAGE_SIZE;
  const currentPagePosts = posts.slice(start, start + PAGE_SIZE);
  const displayPosts = showAll ? posts : currentPagePosts;

  const goTo = (n) => {
    const next = Math.min(Math.max(1, n), totalPages);
    setPage(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getPages = (p, total) => {
    if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);
    const pages = [1];
    let left = Math.max(2, p - 1);
    let right = Math.min(total - 1, p + 1);
    if (p <= 3) {
      left = 2;
      right = 4;
    }
    if (p >= total - 2) {
      left = total - 3;
      right = total - 1;
    }
    if (left > 2) pages.push('…');
    for (let i = left; i <= right; i++) pages.push(i);
    if (right < total - 1) pages.push('…');
    pages.push(total);
    return pages;
  };
  // const submitWrite = (e) => {
  //   e.preventDefault()
  //   if (!canSubmit) return
  //   const newPost = { id: Date.now(), name: gbName.trim(), content: gbContent.trim(), createdAt: new Date().toISOString() }
  //   setPosts((prev) => [newPost, ...prev])
  //   closeWrite()
  // }
  const submitWrite = (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    const newPost = {
      id: Date.now(),
      name: gbName.trim(),
      content: gbContent.trim(),
      pin: gbPassword, // save the 4-digit PIN with the post
      createdAt: new Date().toISOString(),
    };
    setPosts((prev) => [newPost, ...prev]);
    closeWrite();
  };
  // helpers for 4-digit PIN
  const digits4 = (v) => v.replace(/\D/g, '').slice(0, 4);
  const is4Digits = (v) => /^\d{4}$/.test(v);

  // password auth modal (for edit/delete)
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState(null); // 'edit' | 'delete'
  const [authPost, setAuthPost] = useState(null);
  const [authPin, setAuthPin] = useState('');
  const [authError, setAuthError] = useState('');

  // edit modal
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editName, setEditName] = useState('');
  const [editContent, setEditContent] = useState('');

  const openAuth = (mode, post) => {
    setAuthMode(mode);
    setAuthPost(post);
    setAuthPin('');
    setAuthError('');
    setIsAuthOpen(true);
  };
  const closeAuth = () => {
    setIsAuthOpen(false);
    setAuthPin('');
    setAuthError('');
  };

  // 전체보기 팝업
  const [isAllOpen, setIsAllOpen] = useState(false);
  useEffect(() => {
    if (!isAllOpen) return;
    const onPop = () => setIsAllOpen(false);
    window.history.pushState({ all: true }, '');
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, [isAllOpen]);

  return (
    <div className="w-full">
      {/* Full-Screen Banner */}
      <section className="w-full">
        {/* Full screen image container */}
        <div className="relative h-[100dvh] w-full overflow-hidden">
          {/* Background image - full screen without cropping */}
          <div className="absolute inset-0 bg-[url('/img/IMG_1519.jpg')] bg-contain bg-center bg-no-repeat" />
        </div>
      </section>

      {/* Scrollable Content Below Banner */}
      <section className="w-full bg-neutral-100 flex flex-col items-center justify-center px-6 pb-16 pt-36">
        {/* INVITATION */}
        <span className="block text-lg text-gray-500 tracking-widest mb-2 font-newyork">
          INVITATION
        </span>

        {/* Main Heading */}
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          소중한 분들을 초대합니다
        </h2>

        {/* Multiline Quote */}
        <div className="text-center text-base text-gray-700 mb-6 leading-relaxed whitespace-pre-line">
          함께 있을 때 가장 나다운 모습이 되고,
          <br />
          함께 있을 때 미래를 꿈꾸게 하는 사람을 만나
          <br />
          함께 맞는 여덟 번째 봄, 결혼합니다.
          <br />
          지금처럼 서로의 가장 친한 친구가 되어
          <br />
          예쁘고 행복하게 잘 살겠습니다.
          <br />
          <br />
          저희의 새로운 시작을 따뜻한 마음으로
          <br />
          함께 축복해 주세요.
        </div>

        {/* Names and Family Info */}
        <div className="mb-6 text-center text-lg text-gray-900">
          <div className="mb-1">
            김기훈 · 김순희 <span className="text-gray-600">의 아들</span>{' '}
            <span className="font-bold">덕곤</span>
          </div>
          <div>
            구헌상 · 나은효 <span className="text-gray-600">의 딸</span>{' '}
            <span className="font-bold">동민</span>
          </div>
        </div>
        <div className="max-w-md w-40">
          <button
            onClick={openContact}
            className="w-full bg-stone-600 text-white py-3 px-4 rounded-lg hover:bg-stone-700 transition-colors"
          >
            연락하기
          </button>
        </div>
      </section>

      {/* Image */}
      <section className="w-full">
        {/* Centered container that matches the rest of your content width */}
        <div className="relative h-screen w-full max-w-2xl mx-auto overflow-hidden">
          {/* Image - contain to show full width, crop top/bottom slightly */}
          {/* <img
            src="/img/02.jpg"
            alt=""
            className="absolute inset-0 w-full h-[78%] object-contain object-center "
          /> */}
          <div className="absolute inset-0 bg-[url('/img/02.jpg')] bg-cover bg-center" />
        </div>
      </section>

      {/* Calendar */}
      <section className="w-full bg-neutral-100 flex flex-col items-center justify-center px-6 pb-16 pt-36">
        <span className="block text-lg text-gray-500 tracking-widest mb-2  font-newyork">
          WEDDING DAY
        </span>
        {/* Date and Time */}
        <div className="mb-6 text-center">
          <div className="text-2xl text-gray-900 font-medium mb-1">
            2026.05.16
          </div>
          <div className="text-base text-gray-700">토요일 오후 3시</div>
        </div>
        <div className="w-full max-w-xs border-t border-b border-gray-400 py-4 mb-2">
          <div className="grid grid-cols-7 text-center text-gray-700 font-medium mb-2">
            <div className="text-rose-500">일</div>
            <div>월</div>
            <div>화</div>
            <div>수</div>
            <div>목</div>
            <div>금</div>
            <div>토</div>
          </div>
          {/* May 2026 Calendar with highlighted 16th */}
          <div className="grid grid-cols-7 text-center text-gray-900 gap-y-2">
            {/* Week 1 - May starts on Friday */}
            <div className="h-8 flex items-center justify-center text-rose-500"></div>
            <div className="h-8 flex items-center justify-center"></div>
            <div className="h-8 flex items-center justify-center"></div>
            <div className="h-8 flex items-center justify-center"></div>
            <div className="h-8 flex items-center justify-center"></div>
            <div className="h-8 flex items-center justify-center">1</div>
            <div className="h-8 flex items-center justify-center">2</div>

            {/* Week 2 */}
            <div className="h-8 flex items-center justify-center text-rose-500">
              3
            </div>
            <div className="h-8 flex items-center justify-center">4</div>
            <div className="h-8 flex items-center justify-center text-rose-500">
              5
            </div>
            <div className="h-8 flex items-center justify-center">6</div>
            <div className="h-8 flex items-center justify-center">7</div>
            <div className="h-8 flex items-center justify-center">8</div>
            <div className="h-8 flex items-center justify-center">9</div>

            {/* Week 3 - Highlight the 16th */}
            <div className="h-8 flex items-center justify-center text-rose-500">
              10
            </div>
            <div className="h-8 flex items-center justify-center">11</div>
            <div className="h-8 flex items-center justify-center">12</div>
            <div className="h-8 flex items-center justify-center">13</div>
            <div className="h-8 flex items-center justify-center">14</div>
            <div className="h-8 flex items-center justify-center">15</div>
            <div className="h-8 flex items-center justify-center">
              <div className="w-8 h-8 rounded-full bg-rose-300 flex items-center justify-center">
                16
              </div>
            </div>

            {/* Week 4 */}
            <div className="h-8 flex items-center justify-center text-rose-500">
              17
            </div>
            <div className="h-8 flex items-center justify-center">18</div>
            <div className="h-8 flex items-center justify-center">19</div>
            <div className="h-8 flex items-center justify-center">20</div>
            <div className="h-8 flex items-center justify-center">21</div>
            <div className="h-8 flex items-center justify-center">22</div>
            <div className="h-8 flex items-center justify-center">23</div>

            {/* Week 5 */}
            <div className="h-8 flex items-center justify-center text-rose-500">
              24
            </div>
            <div className="h-8 flex items-center justify-center text-rose-500">
              25
            </div>
            <div className="h-8 flex items-center justify-center">26</div>
            <div className="h-8 flex items-center justify-center">27</div>
            <div className="h-8 flex items-center justify-center">28</div>
            <div className="h-8 flex items-center justify-center">29</div>
            <div className="h-8 flex items-center justify-center">30</div>

            {/* Week 6 */}
            <div className="h-8 flex items-center justify-center text-rose-500">
              31
            </div>
            <div className="h-8 flex items-center justify-center"></div>
            <div className="h-8 flex items-center justify-center"></div>
            <div className="h-8 flex items-center justify-center"></div>
            <div className="h-8 flex items-center justify-center"></div>
            <div className="h-8 flex items-center justify-center"></div>
            <div className="h-8 flex items-center justify-center"></div>
          </div>
        </div>
        {/* Countdown */}
        <div className="w-full max-w-2xl mt-6 flex flex-col items-center gap-4">
          <div className="grid grid-cols-4 gap-2 sm:gap-3 w-full">
            <div className="bg-white rounded-2xl shadow p-3 sm:p-4 text-center">
              <div className="text-2xl sm:text-3xl font-semibold text-gray-900">
                {countdown.days}
              </div>
              <div className="text-[10px] sm:text-xs text-gray-500 mt-1 tracking-wide">
                DAYS
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow p-3 sm:p-4 text-center">
              <div className="text-2xl sm:text-3xl font-semibold text-gray-900">
                {countdown.hours.toString().padStart(2, '0')}
              </div>
              <div className="text-[10px] sm:text-xs text-gray-500 mt-1 tracking-wide">
                HOURS
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow p-3 sm:p-4 text-center">
              <div className="text-2xl sm:text-3xl font-semibold text-gray-900">
                {countdown.minutes.toString().padStart(2, '0')}
              </div>
              <div className="text-[10px] sm:text-xs text-gray-500 mt-1 tracking-wide">
                MINUTES
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow p-3 sm:p-4 text-center">
              <div className="text-2xl sm:text-3xl font-semibold text-gray-900">
                {countdown.seconds.toString().padStart(2, '0')}
              </div>
              <div className="text-[10px] sm:text-xs text-gray-500 mt-1 tracking-wide">
                SECONDS
              </div>
            </div>
          </div>
          <div className="text-sm text-gray-600">
            덕곤 ❤ 동민 결혼식이{' '}
            <span className="font-semibold text-rose-500">
              {countdown.days}
            </span>
            일 남았습니다
          </div>
        </div>
      </section>
      {/* Gallery Section */}
      <section className="w-full bg-white flex flex-col items-center justify-center px-6 py-20">
        {/* Section Title */}
        <span className="block text-lg text-gray-500 tracking-widest mb-2 font-newyork">
          GALLERY
        </span>
        <h2 className="text-2xl font-semibold text-gray-900 mb-8">
          우리의 이야기
        </h2>
        {/* Grid Gallery */}
        <div className="w-full max-w-3xl">
          <div className="grid grid-cols-3 gap-1 sm:gap-2">
            {images.slice(0, 15).map((src, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setCurrentImage(i);
                  setIsGalleryOpen(true);
                }}
                className="group relative aspect-square w-full overflow-hidden bg-gray-200"
              >
                <img
                  src={src}
                  alt={`Gallery ${i + 1}`}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                  style={{
                    objectPosition: imagePositions[i] || 'center',
                  }}
                  draggable={false}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section className="w-full bg-neutral-100 flex flex-col items-center justify-center px-6 py-20">
        {/* Section Title */}
        <span className="block text-lg text-gray-500 tracking-widest mb-2 font-newyork">
          LOCATION
        </span>
        <h2 className="text-2xl font-semibold text-gray-900 mb-8">오시는 길</h2>

        <p className="mb-2">국립외교원</p>
        <p className="mb-2 text-gray-600">서울 서초구 남부순환로 2572</p>
        <p className="mb-2 text-gray-600">
          <a href="tel:+821012345678">02) 3497-7600</a>
        </p>
        <div className="max-w-md mb-8">
          <button
            onClick={() => copyAddress('서울 서초구 남부순환로 2572')}
            // className="w-full bg-cyan-500 text-white py-3 px-4 rounded-lg hover:bg-cyan-600 transition-colors"
            className="w-full bg-white border border-gray-200 rounded-lg py-2 px-4 shadow-sm"
          >
            주소 복사하기
          </button>
        </div>

        {/* Map */}
        <div className="w-full max-w-2xl mb-8">
          <KakaoMap
            appkey={import.meta.env.VITE_KAKAO_JS_KEY}
            // 방법 A: 주소로 표시 (지오코딩)
            address="서울 서초구 남부순환로 2572"
            title="국립외교원"
            level={4}
            className="w-full h-64 sm:h-80 rounded-lg overflow-hidden"
          />
        </div>
        {/* Navigation Buttons */}
        <div className="w-full max-w-2xl mx-auto">
          <div className="grid grid-cols-3 gap-2">
            <a
              href="https://tmap.life/ab5faa4e"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 bg-gray-50 text-gray-700 rounded-md hover:bg-gray-100 transition-colors px-2 py-3 whitespace-nowrap [font-size:clamp(13px,2.9vw,15px)]"
            >
              <img
                src="/img/tmap.png"
                alt="Tmap"
                className="w-4 h-4 sm:w-5 sm:h-5"
              />
              티맵
            </a>

            <a
              href="https://place.map.kakao.com/8490883"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 bg-gray-50 text-gray-700 rounded-md hover:bg-gray-100 transition-colors px-2 py-3 whitespace-nowrap [font-size:clamp(13px,2.9vw,15px)]"
            >
              <img
                src="/img/kakao.png"
                alt="Kakao"
                className="w-4 h-4 sm:w-5 sm:h-5"
              />
              카카오내비
            </a>

            <a
              href="https://naver.me/5uIYnFoR"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 bg-gray-50 text-gray-700 rounded-md hover:bg-gray-100 transition-colors px-2 py-3 whitespace-nowrap [font-size:clamp(13px,2.9vw,15px)]"
            >
              <img
                src="/img/naver.png"
                alt="Naver"
                className="w-4 h-4 sm:w-5 sm:h-5"
              />
              네이버지도
            </a>
          </div>
        </div>
        <p className="px-2 py-6 text-sm">
          *국립외교원은 외교센터와 다른 건물이오니 혼동하지 않으시기 바랍니다.
        </p>
        {/* Detailed Directions */}
        <div className="w-full max-w-2xl space-y-6 px-2">
          {/* Subway Section */}
          <div className="border-y border-gray-200 py-6">
            <div className="flex items-center mb-3">
              <div className="w-8 h-8 flex items-center justify-center mr-3">
                <IconSubway className="w-5 h-5 text-gray-400" />
              </div>
              <h3 className="font-semibold text-lg">지하철</h3>
            </div>
            <div className="ml-2 space-y-2">
              <p>양재역 12번 출구 도보 3분</p>
              <div className="flex items-center">
                <div className="flex items-center whitespace-nowrap">
                  <span className="w-3 h-3 bg-orange-500 rounded-full mr-2"></span>
                  <span className="text-sm mr-3">3호선</span>

                  <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                  <span className="text-sm">신분당선</span>
                </div>
              </div>
            </div>
          </div>
          {/* Bus Section */}
          <div className="border-b border-gray-200 pb-4">
            <div className="flex items-center mb-3">
              <div className="w-8 h-8 flex items-center justify-center mr-2">
                <IconBus className="w-5 h-5 text-gray-400" />
              </div>
              <h3 className="font-semibold text-lg">버스</h3>
            </div>
            <div className="ml-2 space-y-2">
              {/* <p>서초구청 정류장 도보 1분</p> */}
              <div className="flex items-start">
                {/* left: type */}
                <div className="flex items-center whitespace-nowrap">
                  <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                  <span className="text-sm mr-3">간선:</span>
                </div>
                {/* right: lines */}
                <p className="text-sm ml-2 flex-1 min-w-0">400, 405A, 406</p>
              </div>
              <div className="flex items-start">
                {/* left: type */}
                <div className="flex items-center whitespace-nowrap">
                  <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                  <span className="text-sm mr-3">마을:</span>
                </div>
                {/* right: lines */}
                <p className="text-sm ml-2 flex-1 min-w-0">서초17, 서초21</p>
              </div>
            </div>
          </div>

          {/* Car Section */}
          <div className="border-b border-gray-200 pb-4">
            <div className="flex items-center mb-3">
              <div className="w-8 h-8 flex items-center justify-center mr-3">
                <IconCar className="w-5 h-5 text-gray-400" />
              </div>
              <h3 className="font-semibold text-lg">자가용</h3>
            </div>
            <div className="ml-2 space-y-2">
              <p>내비게이션 : "국립외교원" 검색</p>
              <p>서울 서초구 남부순환로 2572</p>
            </div>
          </div>

          {/* Parking Section */}
          <div className="border-b border-gray-200 pb-4">
            <div className="flex items-center mb-3">
              <div className="w-8 h-8 flex items-center justify-center mr-3">
                {/* <span className="text-white text-lg font-bold">P</span> */}
                <IconParking className="w-5 h-5 text-gray-400" />
              </div>
              <h3 className="font-semibold text-lg">주차</h3>
            </div>
            <div className="ml-2 space-y-2">
              <p>국립외교원 내 지상주차장</p>
              <p>주차 공간이 넉넉하여 자가용 이용이 가능합니다.</p>
            </div>
          </div>
        </div>
      </section>
      {/* Information Section */}
      <section className="w-full bg-white flex flex-col items-center justify-center px-6 py-20">
        {/* Section Title */}
        <span className="block text-lg text-gray-500 tracking-widest mb-2 font-newyork">
          INFORMATION
        </span>
        <h2 className="text-2xl font-semibold text-gray-900 mb-8">
          예식정보 및 안내사항
        </h2>

        {/* Tab Buttons
        <div className="flex space-x-2 mb-8">
          <button
            onClick={() => setActiveTab('photo')}
            className={`px-3 py-3 rounded-lg font-medium transition-colors ${activeTab === 'photo'
              ? 'bg-gray-800 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
          >
            포토부스
          </button>
          <button
            onClick={() => setActiveTab('meal')}
            className={`px-3 py-3 rounded-lg font-medium transition-colors ${activeTab === 'meal'
              ? 'bg-gray-800 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
          >
            식사
          </button>
          <button
            onClick={() => setActiveTab('parking')}
            className={`px-3 py-3 rounded-lg font-medium transition-colors ${activeTab === 'parking'
              ? 'bg-gray-800 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
          >
            예식
          </button>

        </div> */}
        {/* Tab Tabs (Segmented) */}
        {/* Tab Tabs (Underline) */}
        <div className="w-full max-w-2xl mb-8">
          <div className="grid grid-cols-2">
            {[
              { id: 'meal', label: '식사' },
              { id: 'parking', label: '예식' },
            ].map((t) => {
              const active = activeTab === t.id;
              return (
                <button
                  key={t.id}
                  role="tab"
                  aria-selected={active}
                  tabIndex={active ? 0 : -1}
                  onClick={() => setActiveTab(t.id)}
                  className={`py-3 text-sm font-medium text-center border-b-2
            ${
              active
                ? 'text-gray-900 border-gray-900'
                : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
            }`}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        {renderTabContent()}
      </section>
      {/* Guest Book */}
      <section className="w-full bg-white flex flex-col items-center justify-center px-6 py-20 mb-16">
        <span className="block text-lg text-gray-500 tracking-widest mb-2 font-newyork">
          MESSAGE
        </span>
        <h2 className="text-2xl font-semibold text-gray-900 mb-8">방명록</h2>
        {/* Write button */}
        <div className="max-w-md w-full">
          <button
            onClick={openWrite}
            className="w-full bg-stone-600 text-white py-3 px-4 rounded-lg hover:bg-stone-700 transition-colors"
          >
            글쓰기
          </button>
        </div>
        {/* Posts list */}
        <div className="w-full max-w-md space-y-3 mt-4">
          {posts.length === 0 && (
            <div className="text-center text-gray-500">
              첫 번째 메시지를 남겨주세요!
            </div>
          )}
          {displayPosts.map((p) => (
            <article
              key={p.id}
              className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="text-base font-medium text-gray-900">
                  From {p.name || '익명'}
                </div>
                {/* <button
                  onClick={() => openAuth('edit', p)}
                  className="text-xs px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-700"
                >
                  수정
                </button>
                <button
                  onClick={() => openAuth('delete', p)}
                  className="text-xs px-2 py-1 rounded bg-rose-100 hover:bg-rose-200 text-rose-700"
                >
                  삭제
                </button>
                <time className="text-xs text-gray-400" dateTime={p.createdAt}>
                  {new Date(p.createdAt).toLocaleString()}
                </time>
              </div>
              <p className="mt-2 text-gray-800 whitespace-pre-wrap">
                {p.content}
              </p>
            </article> */}
                {p.pin && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openAuth('edit', p)}
                      className="text-xs px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-700"
                      aria-label="수정"
                    >
                      수정
                    </button>
                    <button
                      onClick={() => openAuth('delete', p)}
                      className="text-xs px-2 py-1 rounded bg-rose-100 hover:bg-rose-200 text-rose-700"
                      aria-label="삭제"
                    >
                      삭제
                    </button>
                  </div>
                )}
              </div>

              {/* Body: content */}
              <p className="mt-2 text-gray-800 whitespace-pre-wrap">
                {p.content}
              </p>

              {/* Footer: date bottom-right */}
              <div className="mt-3 flex justify-end">
                <time
                  className="text-[11px] text-gray-400"
                  dateTime={p.createdAt}
                >
                  {new Date(p.createdAt).toLocaleString()}
                </time>
              </div>
            </article>
          ))}
        </div>
        {/* Pagination */}
        <div className="w-full max-w-md mt-4">
          <div className="grid grid-cols-[auto,1fr,auto] items-center">
            {/* Prev (left) */}
            <div className="justify-self-start">
              <button
                type="button"
                onClick={() => goTo(page - 1)}
                disabled={page === 1 || showAll}
                aria-label="이전 페이지"
                className={`min-w-9 h-9 px-3 rounded-md text-sm ${
                  page === 1 || showAll
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                ‹
              </button>
            </div>

            {/* Numbers (center) */}
            <div className="flex items-center justify-center gap-1">
              {showAll ? (
                <span className="text-sm text-gray-500">
                  전체 {posts.length}개
                </span>
              ) : (
                getPages(page, totalPages).map((tok, i) =>
                  tok === '…' ? (
                    <span
                      key={`dots-${i}`}
                      className="min-w-9 h-9 px-2 grid place-items-center text-sm text-gray-400"
                    >
                      …
                    </span>
                  ) : (
                    <button
                      key={tok}
                      type="button"
                      onClick={() => goTo(tok)}
                      aria-current={tok === page ? 'page' : undefined}
                      className={`min-w-9 h-9 px-3 rounded-md text-sm ${
                        tok === page
                          ? 'bg-gray-800 text-white'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      }`}
                    >
                      {tok}
                    </button>
                  )
                )
              )}
            </div>

            {/* Next (right) */}
            <div className="justify-self-end">
              <button
                type="button"
                onClick={() => goTo(page + 1)}
                disabled={page === totalPages || showAll}
                aria-label="다음 페이지"
                className={`min-w-9 h-9 px-3 rounded-md text-sm ${
                  page === totalPages || showAll
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                ›
              </button>
            </div>
          </div>

          {/* 전체보기 toggle (below) */}
          {/* <div className="max-w-md w-full mt-2 flex justify-center">
            <button
              type="button"
              onClick={() => {
                const next = !showAll;
                setShowAll(next);
                if (!next) window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="h-9 px-3 rounded-md text-sm bg-gray-50 hover:bg-gray-100 text-gray-700"
            >
              {showAll ? '페이지 보기' : '전체보기'}
            </button>
          </div> */}
        </div>
        {/* Full-width 전체보기 */}
        {/* <div className="mt-2 max-w-md w-full">
          <button
            type="button"
            onClick={() => {
              const next = !showAll;
              setShowAll(next);
              if (!next) window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="w-full h-11 rounded-lg text-sm bg-gray-50 hover:bg-gray-100 text-gray-700"
          >
            {showAll ? '페이지 보기' : '전체보기'}
          </button>
        </div> */}
        <div className="mt-2 w-full max-w-md mx-auto">
          <button
            type="button"
            onClick={() => setIsAllOpen(true)}
            className="w-full h-11 rounded-lg text-sm bg-gray-50 hover:bg-gray-100 text-gray-700"
          >
            모두 보기
          </button>
        </div>
      </section>
      <section className="w-full bg-white flex flex-col items-center justify-center px-6 py-20">
        <span className="block text-lg text-gray-500 tracking-widest mb-2 font-newyork">
          ACCOUNT
        </span>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          마음 전하실 곳
        </h2>
        <p className="mb-2 py-6 text-sm text-center">
          참석이 어려우신 분들을 위해 기재했습니다 <br /> 너그러운 마음으로 양해
          부탁드립니다
        </p>
        {/* Groom's Account Section */}
        <div className="w-full max-w-md bg-gray-50 rounded-lg shadow-sm overflow-hidden mb-4">
          <div
            className="flex justify-between items-center p-4 cursor-pointer bg-gray-100 hover:bg-gray-200 transition-colors"
            onClick={() => setShowGroomAccounts(!showGroomAccounts)}
          >
            <h3 className="font-semibold text-gray-800">신랑측 계좌번호</h3>
            <svg
              className={`w-5 h-5 text-gray-600 transform transition-transform duration-300 ease-in-out ${
                showGroomAccounts ? 'scale-y-[-1]' : 'scale-y-100'
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
          {showGroomAccounts && (
            <div className="p-4 space-y-4">
              {/* Groom Account 1 */}
              <div className="rounded-2xl bg-white shadow-sm p-4 space-y-3">
                <div className="flex items-center justify-between text-sm text-gray-700">
                  <span>신랑</span>
                  <span className="font-medium">김덕곤</span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-gray-100 px-4 py-3">
                  <div className="text-sm text-gray-600">
                    <div className="text-gray-500">국민은행</div>
                    <div className="tracking-wide">842401-01-748467</div>
                  </div>
                  <button
                    onClick={() => copyAccount('842401-01-748467')}
                    className="flex items-center gap-1 text-sm text-gray-700"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M17.676 14.248C17.676 15.8651 16.3651 17.176 14.748 17.176H7.428C5.81091 17.176 4.5 15.8651 4.5 14.248V6.928C4.5 5.31091 5.81091 4 7.428 4H14.748C16.3651 4 17.676 5.31091 17.676 6.928V14.248Z"
                        stroke="#000000"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M10.252 20H17.572C19.1891 20 20.5 18.689 20.5 17.072V9.75195"
                        stroke="#000000"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                    <span>복사</span>
                  </button>
                </div>
              </div>
              {/* Groom Account 2 */}
              <div className="rounded-2xl bg-white shadow-sm p-4 space-y-3">
                <div className="flex items-center justify-between text-sm text-gray-700">
                  <span>신랑 아버지</span>
                  <span className="font-medium">김기훈</span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-gray-100 px-4 py-3">
                  <div className="text-sm text-gray-600">
                    <div className="text-gray-500">경남은행</div>
                    <div className="tracking-wide">508-21-0361647</div>
                  </div>
                  <button
                    onClick={() => copyAccount('508-21-0361647')}
                    className="flex items-center gap-1 text-sm text-gray-700"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M17.676 14.248C17.676 15.8651 16.3651 17.176 14.748 17.176H7.428C5.81091 17.176 4.5 15.8651 4.5 14.248V6.928C4.5 5.31091 5.81091 4 7.428 4H14.748C16.3651 4 17.676 5.31091 17.676 6.928V14.248Z"
                        stroke="#000000"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M10.252 20H17.572C19.1891 20 20.5 18.689 20.5 17.072V9.75195"
                        stroke="#000000"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                    <span>복사</span>
                  </button>
                </div>
              </div>
              {/* Groom Account 3 */}
              <div className="rounded-2xl bg-white shadow-sm p-4 space-y-3">
                <div className="flex items-center justify-between text-sm text-gray-700">
                  <span>신랑 어머니</span>
                  <span className="font-medium">김순희</span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-gray-100 px-4 py-3">
                  <div className="text-sm text-gray-600">
                    <div className="text-gray-500">농협은행</div>
                    <div className="tracking-wide">865-12-344654</div>
                  </div>
                  <button
                    onClick={() => copyAccount('865-12-344654')}
                    className="flex items-center gap-1 text-sm text-gray-700"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M17.676 14.248C17.676 15.8651 16.3651 17.176 14.748 17.176H7.428C5.81091 17.176 4.5 15.8651 4.5 14.248V6.928C4.5 5.31091 5.81091 4 7.428 4H14.748C16.3651 4 17.676 5.31091 17.676 6.928V14.248Z"
                        stroke="#000000"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M10.252 20H17.572C19.1891 20 20.5 18.689 20.5 17.072V9.75195"
                        stroke="#000000"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                    <span>복사</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bride's Account Section */}
        <div className="w-full max-w-md bg-gray-50 rounded-lg shadow-sm overflow-hidden">
          <div
            className="flex justify-between items-center p-4 cursor-pointer bg-gray-100 hover:bg-gray-200 transition-colors"
            onClick={() => setShowBrideAccounts(!showBrideAccounts)}
          >
            <h3 className="font-semibold text-gray-800">신부측 계좌번호</h3>
            <svg
              className={`w-5 h-5 text-gray-600 transform transition-transform duration-300 ease-in-out ${
                showBrideAccounts ? 'scale-y-[-1]' : 'scale-y-100'
              }`}
              style={{
                transition: 'transform 0.15s ease-out',
              }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
          {showBrideAccounts && (
            <div className="p-4 space-y-4">
              {/* Bride Account 1 (신부) */}
              <div className="rounded-2xl bg-white shadow-sm p-4 space-y-3">
                <div className="flex items-center justify-between text-sm text-gray-700">
                  <span>신부</span>
                  <span className="font-medium">구동민</span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-gray-100 px-4 py-3">
                  <div className="text-sm text-gray-600">
                    <div className="text-gray-500">신한은행</div>
                    <div className="tracking-wide">368-06-704954</div>
                  </div>
                  <button
                    onClick={() => copyAccount('368-06-704954')}
                    className="flex items-center gap-1 text-sm text-gray-700"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M17.676 14.248C17.676 15.8651 16.3651 17.176 14.748 17.176H7.428C5.81091 17.176 4.5 15.8651 4.5 14.248V6.928C4.5 5.31091 5.81091 4 7.428 4H14.748C16.3651 4 17.676 5.31091 17.676 6.928V14.248Z"
                        stroke="#000000"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M10.252 20H17.572C19.1891 20 20.5 18.689 20.5 17.072V9.75195"
                        stroke="#000000"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                    <span>복사</span>
                  </button>
                </div>
              </div>
              {/* Bride Account 2 (신부 아버지) */}
              <div className="rounded-2xl bg-white shadow-sm p-4 space-y-3">
                <div className="flex items-center justify-between text-sm text-gray-700">
                  <span>신부 아버지</span>
                  <span className="font-medium">구헌상</span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-gray-100 px-4 py-3">
                  <div className="text-sm text-gray-600">
                    <div className="text-gray-500">신한은행</div>
                    <div className="tracking-wide">110-368-652685</div>
                  </div>
                  <button
                    onClick={() => copyAccount('110-368-652685')}
                    className="flex items-center gap-1 text-sm text-gray-700"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M17.676 14.248C17.676 15.8651 16.3651 17.176 14.748 17.176H7.428C5.81091 17.176 4.5 15.8651 4.5 14.248V6.928C4.5 5.31091 5.81091 4 7.428 4H14.748C16.3651 4 17.676 5.31091 17.676 6.928V14.248Z"
                        stroke="#000000"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M10.252 20H17.572C19.1891 20 20.5 18.689 20.5 17.072V9.75195"
                        stroke="#000000"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                    <span>복사</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Closing Image + Quote */}
      <section className="w-full">
        {/* Centered container that matches the rest of your content width */}
        <div className="relative h-screen w-full max-w-2xl mx-auto overflow-hidden">
          {/* Background image only inside the centered box */}
          <div className="absolute inset-0 bg-[url('/img/08.jpg')] bg-cover bg-center" />

          {/* Bottom overlay with quote */}
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-neutral-900/90 via-neutral-900/70 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 pb-14 px-6 flex justify-center">
            <div className="max-w-md text-center text-neutral-100 space-y-4">
              <p className="text-sm sm:text-base leading-relaxed">
                오늘이란 평범한 날이지만 <br /> 미래로 통하는 가장 소중한
                시간이야
              </p>
              <p className="text-xs sm:text-sm text-neutral-300">
                - 영화 &lsquo;업&rsquo; 중에서
              </p>
            </div>
          </div>
        </div>
      </section>

      {isGalleryOpen && (
        <div className="fixed inset-0 z-50">
          {/* Dim background (tap to close) */}
          <div
            className="absolute inset-0 bg-black/90"
            onClick={() => setIsGalleryOpen(false)}
          />

          {/* Content */}
          <div className="absolute inset-0 flex flex-col">
            {/* Top bar */}
            <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
              <button
                onClick={() => setIsGalleryOpen(false)}
                aria-label="닫기"
                className="p-2 rounded-md bg-white/20 hover:bg-white/30 text-white"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Swipe scroller */}
            <div
              ref={scrollerRef}
              onScroll={onScrollSnap}
              className="hide-scrollbar flex h-full overflow-x-auto snap-x snap-mandatory scroll-smooth"
            >
              {images.map((src, i) => (
                <div key={i} className="relative min-w-full h-full snap-center">
                  <img
                    src={src}
                    alt={`Gallery ${i + 1}`}
                    className="absolute inset-0 w-full h-full object-contain object-center"
                    draggable={false}
                  />
                </div>
              ))}
            </div>

            {/* Dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => scrollToIndex(i)}
                  aria-label={`${i + 1}번 이미지로 이동`}
                  className={`w-2.5 h-2.5 rounded-full ${i === currentImage ? 'bg-white' : 'bg-white/40'}`}
                />
              ))}
            </div>
          </div>
        </div>
      )}
      {isContactOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            onClick={closeContact}
          />
          <div className="relative w-full max-w-md max-h-[90vh] bg-gradient-to-b from-stone-900/95 via-stone-900/90 to-stone-800/90 text-white rounded-3xl shadow-2xl ring-1 ring-white/10 overflow-hidden flex flex-col my-auto">
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/10 flex-shrink-0">
              <div>
                <div className="text-xs uppercase tracking-[0.3em] text-white/70">
                  Contact
                </div>
                <div className="text-xl font-semibold">연락하기</div>
              </div>
              <button
                type="button"
                onClick={closeContact}
                aria-label="닫기"
                className="p-2 rounded-full hover:bg-white/10 transition"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="px-5 py-4 space-y-4 overflow-y-auto flex-1 min-h-0">
              {contactGroups.map((group) => (
                <div key={group.title} className="space-y-2">
                  <div className="text-xs uppercase tracking-[0.25em] text-white/70">
                    {group.title}
                  </div>
                  <div className="border-t border-white/15" />
                  <div className="space-y-2">
                    {group.items.map((item) => (
                      <div
                        key={item.role + item.name}
                        className="flex items-center justify-between gap-3 rounded-xl bg-white/5 px-3 py-2"
                      >
                        <div>
                          <div className="text-xs text-white/80">
                            {item.role}
                          </div>
                          <div className="text-base font-semibold">
                            {item.name}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <a
                            href={`tel:${item.phone}`}
                            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition"
                            aria-label={`${item.name}에게 전화하기`}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              className="w-4 h-4"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                              />
                            </svg>
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {/* Write Modal (mobile sheet) */}
      {isWriteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/40" onClick={closeWrite} />
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl ring-1 ring-black/5 max-h-[85vh] overflow-y-auto">
            <form onSubmit={submitWrite} className="p-5">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">글쓰기</h3>
                <button
                  type="button"
                  onClick={closeWrite}
                  aria-label="닫기"
                  className="-m-1.5 p-1.5 rounded-md hover:bg-gray-100"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    className="w-5 h-5 text-gray-600"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="mt-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    이름 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={gbName}
                    onChange={(e) => setGbName(e.target.value)}
                    placeholder="이름을 입력하세요"
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    비밀번호 <span className="text-red-500">*</span>
                  </label>
                  {/* <input type="password" value={gbPassword} onChange={(e) => setGbPassword(e.target.value)} placeholder="삭제/수정을 위한 비밀번호" className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-3 text-base tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500" autoComplete="new-password" inputMode="numeric" /> */}
                  <input
                    type="password"
                    value={gbPassword}
                    onChange={(e) => setGbPassword(digits4(e.target.value))}
                    placeholder="1234 (숫자 4자리)"
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-3 text-base tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500"
                    autoComplete="new-password"
                    inputMode="numeric"
                    pattern="\d{4}"
                    maxLength={4}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    내용 <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={gbContent}
                    onChange={(e) => setGbContent(e.target.value)}
                    placeholder="내용을 입력하세요"
                    rows={6}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={closeWrite}
                  className="h-12 rounded-lg border border-gray-300 text-gray-700 bg-white active:scale-[0.99]"
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={!canSubmit}
                  className="h-12 rounded-lg bg-blue-600 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.99]"
                >
                  등록
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {isAuthOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/40" onClick={closeAuth} />
          <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-xl ring-1 ring-black/5 p-5">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                비밀번호 확인
              </h3>
              <button
                type="button"
                onClick={closeAuth}
                aria-label="닫기"
                className="-m-1.5 p-1.5 rounded-md hover:bg-gray-100"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="w-5 h-5 text-gray-600"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!authPost || authPin !== authPost.pin) {
                  setAuthError('비밀번호가 일치하지 않습니다.');
                  return;
                }
                setIsAuthOpen(false);
                if (authMode === 'delete') {
                  setPosts((prev) => prev.filter((p) => p.id !== authPost.id));
                } else if (authMode === 'edit') {
                  setEditName(authPost.name || '');
                  setEditContent(authPost.content || '');
                  setIsEditOpen(true);
                }
              }}
              className="mt-4 space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  4자리 비밀번호 <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  value={authPin}
                  onChange={(e) => {
                    setAuthPin(digits4(e.target.value));
                    setAuthError('');
                  }}
                  placeholder="숫자 4자리"
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-3 text-base tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500"
                  inputMode="numeric"
                  pattern="\d{4}"
                  maxLength={4}
                />
                {authError && (
                  <p className="mt-2 text-sm text-red-600">{authError}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={closeAuth}
                  className="h-12 rounded-lg border border-gray-300 text-gray-700 bg-white"
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={!is4Digits(authPin)}
                  className="h-12 rounded-lg bg-blue-600 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  확인
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {isEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setIsEditOpen(false)}
          />
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl ring-1 ring-black/5 max-h-[85vh] overflow-y-auto">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setPosts((prev) =>
                  prev.map((p) =>
                    p.id === authPost.id
                      ? {
                          ...p,
                          name: editName.trim(),
                          content: editContent.trim(),
                        }
                      : p
                  )
                );
                setIsEditOpen(false);
              }}
              className="p-5"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">글 수정</h3>
                <button
                  type="button"
                  onClick={() => setIsEditOpen(false)}
                  aria-label="닫기"
                  className="-m-1.5 p-1.5 rounded-md hover:bg-gray-100"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="w-5 h-5 text-gray-600"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="mt-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    이름 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    내용 <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={6}
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditOpen(false)}
                  className="h-12 rounded-lg border border-gray-300 text-gray-700 bg-white"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="h-12 rounded-lg bg-blue-600 text-white font-medium"
                >
                  저장
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {isAllOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          {/* 배경 */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setIsAllOpen(false)}
          />
          {/* 컨텐츠 */}
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl ring-1 ring-black/5 h-[85vh] flex flex-col">
            {/* 헤더 (고정) */}
            {/* <div className="sticky top-0 z-10 bg-white border-b border-gray-200 rounded-t-2xl px-5 py-3 flex items-center justify-between">
              <h3 className="text-base font-semibold text-gray-900">
                축하 메세지
              </h3>
              <span className="text-xs text-gray-500">총 {posts.length}개</span>
              <button
                type="button"
                onClick={() => setIsAllOpen(false)}
                aria-label="닫기"
                className="-m-1.5 p-1.5 rounded-md hover:bg-gray-100"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  className="w-5 h-5 text-gray-600"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div> */}
            <div className="sticky top-0 z-10 bg-white border-b border-gray-200 rounded-t-2xl px-5 py-3 grid grid-cols-[auto,1fr,auto] items-center">
              {/* left spacer to balance the close button width */}
              <span aria-hidden className="w-8 h-8 -m-1.5 p-1.5" />

              {/* centered title */}
              <h3 className="text-base font-semibold text-gray-900 text-center">
                축하 메세지
              </h3>

              {/* close button aligned to the right, same classes as before */}
              <button
                type="button"
                onClick={() => setIsAllOpen(false)}
                aria-label="닫기"
                className="-m-1.5 p-1.5 rounded-md hover:bg-gray-100 justify-self-end"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  className="w-5 h-5 text-gray-600"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* 리스트 (스크롤 영역) */}
            <div className="flex-1 overflow-y-auto p-5 space-y-3">
              {posts.length === 0 && (
                <div className="text-center text-gray-500">
                  첫 번째 메시지를 남겨주세요!
                </div>
              )}

              {posts.map((p) => (
                <article
                  key={p.id}
                  className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm"
                >
                  {/* 헤더: 이름 / 수정·삭제 */}
                  <div className="flex items-start justify-between">
                    <div className="text-base font-medium text-gray-900">
                      {p.name || '익명'}
                    </div>
                    {p.pin && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openAuth('edit', p)}
                          className="text-xs px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-700"
                        >
                          수정
                        </button>
                        <button
                          onClick={() => openAuth('delete', p)}
                          className="text-xs px-2 py-1 rounded bg-rose-100 hover:bg-rose-200 text-rose-700"
                        >
                          삭제
                        </button>
                      </div>
                    )}
                  </div>

                  {/* 본문 */}
                  <p className="mt-2 text-gray-800 whitespace-pre-wrap">
                    {p.content}
                  </p>

                  {/* 하단: 날짜 우측 */}
                  <div className="mt-3 flex justify-end">
                    <time
                      className="text-[11px] text-gray-400"
                      dateTime={p.createdAt}
                    >
                      {new Date(p.createdAt).toLocaleString()}
                    </time>
                  </div>
                </article>
              ))}
            </div>

            {/* 하단 버튼 */}
            <div className="p-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => setIsAllOpen(false)}
                className="w-full h-11 rounded-lg bg-gray-800 text-white hover:bg-gray-900"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
      <section className="w-full bg-white flex flex-col items-center justify-center px-6 py-6 mb-16">
        {/* Share / Copy row */}
        <div className="w-full max-w-md mx-auto space-y-3">
          {/* Kakao share button */}
          <button
            type="button"
            onClick={shareKakao}
            className="w-full flex items-center justify-between px-5 py-4 rounded-full bg-[#FEE500] text-black text-sm sm:text-base hover:brightness-95 transition-colors"
          >
            <span className="font-medium">카카오톡으로 청첩장 전하기</span>
            <span className="flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M7 17L17 7M9 7h8v8"
                />
              </svg>
            </span>
          </button>

          {/* Copy link button */}
          <button
            type="button"
            onClick={copyPageLink}
            className="w-full flex items-center justify-between px-5 py-4 rounded-full bg-gray-500 text-white text-sm sm:text-base hover:bg-gray-600 transition-colors"
          >
            <span className="font-medium">청첩장 주소 복사하기</span>
            <span className="flex items-center justify-center">
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M17.676 14.248C17.676 15.8651 16.3651 17.176 14.748 17.176H7.428C5.81091 17.176 4.5 15.8651 4.5 14.248V6.928C4.5 5.31091 5.81091 4 7.428 4H14.748C16.3651 4 17.676 5.31091 17.676 6.928V14.248Z"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M10.252 20H17.572C19.1891 20 20.5 18.689 20.5 17.072V9.75195"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </span>
          </button>
        </div>
      </section>
      <section>
        <div className="w-full px-6 py-2 mb-2">
          <p className="text-gray-600 text-center text-sm">
            Copyright © 2026 Yejin Park. All rights reserved.
          </p>
        </div>
      </section>
      <Toast
        open={toast.open}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast((p) => ({ ...p, open: false }))}
        position="top" // ← 'top' | 'bottom' | 'center'
      />
    </div>
  );
}

export default App;
