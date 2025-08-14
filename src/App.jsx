import './App.css';
import { useState, useEffect, useRef } from 'react';

function App() {
  const [currentImage, setCurrentImage] = useState(0);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  const [activeTab, setActiveTab] = useState('photo');
  const [showGroomAccounts, setShowGroomAccounts] = useState(false);
  const [showBrideAccounts, setShowBrideAccounts] = useState(false);

  // Sample images - replace with your actual images
  const images = [
    'img/cover.png',
    'img/wedding1.jpg',
    'img/wedding2.jpg',
    'img/wedding3.png',
    'img/wedding4.jpeg',
  ];

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

  const IconSubway = (props) => (
    <svg
      viewBox="0 0 92.81 122.88"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path
        fillRule="evenodd"
        d="M66.69,101.35H26.68l-4.7,6.94h49.24L66.69,101.35L66.69,101.35z M17.56,114.81l-5.47,8.07H0l19.64-29.46 h-3.49c-4.76,0-8.66-3.9-8.66-8.66V8.66C7.5,3.9,11.39,0,16.15,0h61.22c4.76,0,8.66,3.9,8.66,8.66v76.1c0,4.76-3.9,8.66-8.66,8.66 h-3.4l18.83,29.04H80.45l-4.99-7.65H17.56L17.56,114.81z M62.97,67.66h10.48c1.14,0,2.07,0.93,2.07,2.07V80.2 c0,1.14-0.93,2.07-2.07,2.07H62.97c-1.14,0-2.07-0.93-2.07-2.07V69.72C60.9,68.59,61.83,67.66,62.97,67.66L62.97,67.66z M18.98,67.66h10.48c1.14,0,2.07,0.93,2.07,2.07V80.2c0,1.14-0.93,2.07-2.07,2.07H18.98c-1.14,0-2.07-0.93-2.07-2.07V69.72 C16.91,68.59,17.84,67.66,18.98,67.66L18.98,67.66z M25.1,16.7h42.81c4.6,0,8.36,3.76,8.36,8.37v13.17c0,4.6-3.76,8.36-8.36,8.36 H25.1c-4.6,0-8.36-3.76-8.36-8.36V25.07C16.74,20.47,20.5,16.7,25.1,16.7L25.1,16.7z M38.33,3.8h16.2C55.34,3.8,56,4.46,56,5.27 v6.38c0,0.81-0.66,1.47-1.47,1.47h-16.2c-0.81,0-1.47-0.66-1.47-1.47V5.27C36.85,4.46,37.51,3.8,38.33,3.8L38.33,3.8z"
      />
    </svg>
  );

  const IconBus = (props) => (
    <svg
      viewBox="0 0 122.88 120.96"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path
        fillRule="evenodd"
        d="M105.5,104.64H99.44v9.53A6.81,6.81,0,0,1,92.65,121h-4a6.82,6.82,0,0,1-6.79-6.79v-9.53H40.82v9.53A6.82,6.82,0,0,1,34,121H30a6.81,6.81,0,0,1-6.78-6.79v-9.53H18.1c-3.54-.06-5.24-2-5.5-5.29V21.52c-2,.2-2.95.66-3.43,1.68V45.45H4.87A4.88,4.88,0,0,1,0,40.58V27.44a4.89,4.89,0,0,1,4.73-4.87c.41-3.82,2.06-4.93,8-5.21Q14,7.36,26.36,2.57C44.09-.68,77.73-1,96.52,2.57c8.28,3.19,12.8,8.12,13.62,14.79,6,.3,7.61,1.42,8,5.21a4.89,4.89,0,0,1,4.73,4.87V40.58A4.88,4.88,0,0,1,118,45.45h-4.3V23.14c-.48-1-1.47-1.44-3.43-1.63V98.59c0,4.46-1.44,6-4.78,6ZM16.13,84.87l.28-6.69c.16-1.17.78-1.69,1.89-1.5A129.9,129.9,0,0,1,34.39,86.85c1.09.72.66,2.11-.78,1.85L18.48,87.6a2.74,2.74,0,0,1-2.35-2.73ZM52,93.45H71.3a.94.94,0,0,1,.94.94v3.24a.94.94,0,0,1-.94.94H52a.94.94,0,0,1-.94-.94V94.39a.94.94,0,0,1,.94-.94Zm50.35,0A2.51,2.51,0,1,1,99.82,96a2.51,2.51,0,0,1,2.5-2.51Zm-82.65,0A2.51,2.51,0,1,1,17.16,96a2.51,2.51,0,0,1,2.51-2.51Zm87.08-8.63-.28-6.69c-.16-1.17-.78-1.69-1.88-1.5a129.28,129.28,0,0,0-16.1,10.17c-1.09.72-.66,2.11.78,1.85l15.13-1.1a2.73,2.73,0,0,0,2.35-2.73ZM48.19,6.11h26.5a1.63,1.63,0,0,1,1.62,1.62V12a1.63,1.63,0,0,1-1.62,1.62H48.19A1.63,1.63,0,0,1,46.57,12V7.73a1.63,1.63,0,0,1,1.62-1.62ZM20.32,18.91H102.2a2,2,0,0,1,2,2V64.09c0,1.08-.89,1.69-2,2-28.09,8.53-53.8,8.18-81.88,0-1.11-.3-2-.9-2-2V20.89a2,2,0,0,1,2-2Z"
      />
    </svg>
  );

  const IconCar = (props) => (
    <svg
      viewBox="0 0 122.88 103.26"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path
        fillRule="evenodd"
        d="M117.95,42.04v61.22h-14.31V93.8h-84.4v9.46l-14.31,0V42.04H0v-9.41h12.04l6.71-20.88 C20.73,5.59,24.03,0,30.49,0h64.39c6.46,0,10.18,5.48,11.74,11.74l5.19,20.88h11.06v9.41H117.95L117.95,42.04L117.95,42.04z M40.01,74.91h42.27v9.97l-42.27,0V74.91L40.01,74.91L40.01,74.91z M9.72,51.69c10.77,0.34,17.36,4.85,19.05,14.26H9.72V51.69 L9.72,51.69z M111.8,51.69c-10.77,0.34-17.36,4.85-19.05,14.26h19.05V51.69L111.8,51.69z M17.18,32.62h88.52l-3.79-17.51 c-1.04-4.8-4.03-8.95-8.95-8.95H31.74c-4.92,0-7.44,4.26-8.95,8.95L17.18,32.62L17.18,32.62L17.18,32.62z"
      />
    </svg>
  );

  const IconParking = (props) => (
    <svg
      viewBox="0 0 122.88 122.88"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path
        fillRule="evenodd"
        d="M61.44,0c33.93,0,61.44,27.51,61.44,61.44c0,33.93-27.51,61.44-61.44,61.44S0,95.37,0,61.44 C0,27.51,27.51,0,61.44,0L61.44,0z M43.91,38.89h25.34c5.52,0,9.65,1.31,12.4,3.94c2.74,2.63,4.12,6.37,4.12,11.22 c0,4.98-1.5,8.88-4.5,11.68c-3,2.81-7.58,4.21-13.72,4.21H59.2v18.25H43.91V38.89L43.91,38.89z M59.2,59.96h3.75 c2.96,0,5.04-0.52,6.23-1.54c1.19-1.02,1.79-2.33,1.79-3.92c0-1.55-0.52-2.86-1.56-3.94c-1.03-1.08-2.99-1.62-5.85-1.62H59.2V59.96 L59.2,59.96z M61.44,13.92c26.24,0,47.52,21.27,47.52,47.52s-21.27,47.52-47.52,47.52c-26.24,0-47.52-21.27-47.52-47.52 S35.2,13.92,61.44,13.92L61.44,13.92z M61.44,5.41c30.94,0,56.03,25.08,56.03,56.03s-25.08,56.03-56.03,56.03 S5.41,92.38,5.41,61.44S30.5,5.41,61.44,5.41L61.44,5.41z"
      />
    </svg>
  );

  const copyToClipboard = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        alert('계좌번호가 복사되었습니다');
      })
      .catch((err) => {
        console.error('복사 실패:', err);
        alert('계좌번호 복사에 실패했습니다.');
      });
  };
  const renderTabContent = () => {
    switch (activeTab) {
      case 'photo':
        return (
          <div className="w-full max-w-2xl bg-white p-6 rounded-lg shadow-md text-center">
            <img
              src="/img/placeholder.png"
              alt="Photo Booth Camera"
              className="mx-auto mb-6 max-w-full h-auto"
              style={{ maxWidth: '300px' }}
            />
            <p className="text-gray-700 mb-2">포토부스가 설치될 예정입니다.</p>
            <p className="text-gray-700 mb-2">귀한 발걸음 해주신 여러분의</p>
            <p className="text-gray-700 mb-2">
              환한 미소와 따뜻한 말씀 남겨주시면
            </p>
            <p className="text-gray-700">소중히 간직하도록 하겠습니다.</p>
          </div>
        );
      case 'meal':
        return (
          <div className="w-full max-w-2xl bg-white p-6 rounded-lg shadow-md text-center">
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                식사 안내
              </h3>
              <p className="text-gray-700 mb-2">
                예식 후 식사가 준비되어 있습니다.
              </p>
              <p className="text-gray-700 mb-2">맛있는 음식과 함께</p>
              <p className="text-gray-700 mb-2">
                소중한 시간을 나누시기 바랍니다.
              </p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">식사 시간: 오후 6시 ~ 8시</p>
              <p className="text-sm text-gray-600">위치: 2층 레스토랑</p>
            </div>
          </div>
        );
      case 'parking':
        return (
          <div className="w-full max-w-2xl bg-white p-6 rounded-lg shadow-md text-center">
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                주차 안내
              </h3>
              <p className="text-gray-700 mb-2">
                건물 내 지하 주차장을 이용하실 수 있습니다.
              </p>
              <p className="text-gray-700 mb-2">예식 참석자분들께는</p>
              <p className="text-gray-700 mb-2">
                무료 주차 서비스를 제공합니다.
              </p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">주차 시간: 3시간 무료</p>
              <p className="text-sm text-gray-600">위치: 지하 1층 ~ 3층</p>
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

  const [isWriteOpen, setIsWriteOpen] = useState(false);
  const [gbName, setGbName] = useState('');
  const [gbPassword, setGbPassword] = useState('');
  const [gbContent, setGbContent] = useState('');
  // const canSubmit = gbName.trim() && gbPassword.trim() && gbContent.trim()
  const canSubmit = gbName.trim() && is4Digits(gbPassword) && gbContent.trim();

  // --- Guest book handlers ---
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

  // Copy current page URL
  const copyPageLink = () => {
    const url = window.location.href;
    if (navigator.clipboard?.writeText) {
      navigator.clipboard
        .writeText(url)
        .then(() => alert('링크가 복사되었습니다.'))
        .catch(() => {
          // Fallback for older browsers
          const i = document.createElement('input');
          i.value = url;
          document.body.appendChild(i);
          i.select();
          document.execCommand('copy');
          document.body.removeChild(i);
          alert('링크가 복사되었습니다.');
        });
    } else {
      // Very old fallback
      const i = document.createElement('input');
      i.value = url;
      document.body.appendChild(i);
      i.select();
      document.execCommand('copy');
      document.body.removeChild(i);
      alert('링크가 복사되었습니다.');
    }
  };

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

  return (
    <div className="w-full">
      {/* Full-Screen Banner */}

      <section className="w-full mb-16">
        {/* Centered container that matches the rest of your content width */}
        <div className="relative h-screen w-full max-w-2xl mx-auto overflow-hidden">
          {/* Background image only inside the centered box */}
          <div className="absolute inset-0 bg-[url('/img/cover.png')] bg-cover bg-center" />

          {/* Dark overlay for readability */}
          <div className="absolute inset-0 bg-black/40" />

          {/* Centered Title */}
          <div className="absolute inset-0 flex items-center justify-center px-4 text-center text-white z-10">
            <h1 className="text-4xl mb-2 drop-shadow-lg font-maruburi-bold">
              김덕곤 & 구동민
            </h1>
          </div>

          {/* Bottom Text Section */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-full px-4 text-center text-white z-10">
            <p className="text-lg mb-2 drop-shadow">
              2026년 5월 16일 토요일 오후 3시
            </p>
            <p className="text-lg mb-2 drop-shadow">국립외교원</p>
          </div>
        </div>
      </section>
      {/* Scrollable Content Below Banner */}

      <section className="w-full bg-white flex flex-col items-center justify-center px-6 py-20 mb-16">
        {/* INVITATION */}
        <span className="block text-lg text-gray-500 tracking-widest mb-2">
          INVITATION
        </span>

        {/* Main Heading */}
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          소중한 분들을 초대합니다
        </h2>

        {/* Multiline Quote */}
        <div className="text-center text-base text-gray-700 mb-6 leading-relaxed whitespace-pre-line">
          우리가 서로 뜨겁게
          <br />
          사랑한다는 것은
          <br />
          그대는 나의 세상을
          <br />
          나는 그대의 세상을
          <br />
          함께 짊어지고 새벽을 향해
          <br />
          걸어가겠다는 것입니다.
        </div>

        {/* Names and Family Info */}
        <div className="mb-6 text-center text-lg text-gray-900">
          <div className="mb-1">
            성춘향 · 이몽룡 <span className="text-gray-600">의 아들</span>{' '}
            <span className="font-bold">덕곤</span>
          </div>
          <div>
            성춘향 · 이몽룡 <span className="text-gray-600">의 딸</span>{' '}
            <span className="font-bold">동민</span>
          </div>
        </div>

        {/* Date and Time */}
        <div className="mb-6 text-center">
          <div className="text-lg text-gray-900 font-medium">2026.05.16</div>
          <div className="text-base text-gray-700">토요일 오후 3시</div>
        </div>

        {/* Calendar */}
        <div className="w-full max-w-xs border-t border-b border-gray-400 py-4 mb-2">
          <div className="grid grid-cols-7 text-center text-gray-700 font-medium mb-2">
            <div>일</div>
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
            <div className="h-8 flex items-center justify-center"></div>
            <div className="h-8 flex items-center justify-center"></div>
            <div className="h-8 flex items-center justify-center"></div>
            <div className="h-8 flex items-center justify-center"></div>
            <div className="h-8 flex items-center justify-center"></div>
            <div className="h-8 flex items-center justify-center">1</div>
            <div className="h-8 flex items-center justify-center">2</div>

            {/* Week 2 */}
            <div className="h-8 flex items-center justify-center">3</div>
            <div className="h-8 flex items-center justify-center">4</div>
            <div className="h-8 flex items-center justify-center">5</div>
            <div className="h-8 flex items-center justify-center">6</div>
            <div className="h-8 flex items-center justify-center">7</div>
            <div className="h-8 flex items-center justify-center">8</div>
            <div className="h-8 flex items-center justify-center">9</div>

            {/* Week 3 - Highlight the 16th */}
            <div className="h-8 flex items-center justify-center">10</div>
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
            <div className="h-8 flex items-center justify-center">17</div>
            <div className="h-8 flex items-center justify-center">18</div>
            <div className="h-8 flex items-center justify-center">19</div>
            <div className="h-8 flex items-center justify-center">20</div>
            <div className="h-8 flex items-center justify-center">21</div>
            <div className="h-8 flex items-center justify-center">22</div>
            <div className="h-8 flex items-center justify-center">23</div>

            {/* Week 5 */}
            <div className="h-8 flex items-center justify-center">24</div>
            <div className="h-8 flex items-center justify-center">25</div>
            <div className="h-8 flex items-center justify-center">26</div>
            <div className="h-8 flex items-center justify-center">27</div>
            <div className="h-8 flex items-center justify-center">28</div>
            <div className="h-8 flex items-center justify-center">29</div>
            <div className="h-8 flex items-center justify-center">30</div>

            {/* Week 6 */}
            <div className="h-8 flex items-center justify-center">31</div>
            <div className="h-8 flex items-center justify-center"></div>
            <div className="h-8 flex items-center justify-center"></div>
            <div className="h-8 flex items-center justify-center"></div>
            <div className="h-8 flex items-center justify-center"></div>
            <div className="h-8 flex items-center justify-center"></div>
            <div className="h-8 flex items-center justify-center"></div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="w-full bg-white flex flex-col items-center justify-center px-6 py-20 mb-16">
        {/* Section Title */}
        <span className="block text-lg text-gray-500 tracking-widest mb-2">
          GALLERY
        </span>
        <h2 className="text-2xl font-semibold text-gray-900 mb-8">
          우리의 이야기
        </h2>
        {/* Carousel */}
        <div className="w-full max-w-2xl relative">
          <div
            ref={scrollerRef}
            onScroll={onScrollSnap}
            className="hide-scrollbar flex overflow-x-auto snap-x snap-mandatory scroll-smooth shadow-lg bg-black"
          >
            {images.map((src, i) => (
              <div
                key={i}
                className="relative min-w-full snap-center aspect-[4/5] max-h-[80vh] sm:aspect-[3/4] sm:max-h-[85vh]"
              >
                {/* Fill the frame, crop as needed */}
                <img
                  src={src}
                  alt={`Gallery ${i + 1}`}
                  className="absolute inset-0 w-full h-full object-cover object-center"
                  draggable={false}
                />
              </div>
            ))}
          </div>

          {/* Dots */}
          <div className="flex justify-center mt-4 space-x-2 mb-10">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImage(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentImage ? 'bg-gray-800' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section className="w-full bg-white flex flex-col items-center justify-center px-6 py-20 mb-16">
        {/* Section Title */}
        <span className="block text-lg text-gray-500 tracking-widest mb-2">
          LOCATION
        </span>
        <h2 className="text-2xl font-semibold text-gray-900 mb-8">오시는 길</h2>

        {/* Map Placeholder */}
        <div className="w-full max-w-2xl bg-gray-200 rounded-lg h-64 mb-8 flex items-center justify-center">
          <p className="text-gray-600">지도가 여기에 표시됩니다</p>
        </div>

        {/* Navigation Buttons */}
        {/* <div className="w-full max-w-2xl mx-auto flex flex-nowrap gap-2 mb-8">
          <a
            href="https://tmap.co.kr"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center bg-gray-50 text-gray-600 px-3 py-2 rounded-md hover:bg-gray-100 transition-colors"
          >
            <img src="/img/tmap.png" alt="Tmap" className="w-5 h-5 mr-2" />
            티맵
          </a>
          <a
            href="https://place.map.kakao.com/8490883"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center bg-gray-50 text-gray-600 px-3 py-2 rounded-md hover:bg-gray-100 transition-colors"
          >
            <img src="/img/kakao.png" alt="Kakao" className="w-5 h-5 mr-2" />
            카카오내비
          </a>
          <a
            href="https://naver.me/5uIYnFoR"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center bg-gray-50 text-gray-600 px-3 py-2 rounded-md hover:bg-gray-100 transition-colors"
          >
            <img src="/img/naver.png" alt="Naver" className="w-5 h-5 mr-2" />
            네이버지도
          </a>
        </div> */}
        {/* Navigation Buttons */}
        <div className="w-full max-w-2xl mx-auto mb-8">
          <div className="grid grid-cols-3 gap-2">
            <a
              href="https://tmap.co.kr"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5
                 bg-gray-50 text-gray-700 rounded-md hover:bg-gray-100 transition-colors
                 px-2 py-2
                 whitespace-nowrap
                 [font-size:clamp(13px,2.9vw,15px)]"
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
              className="flex items-center justify-center gap-1.5
                 bg-gray-50 text-gray-700 rounded-md hover:bg-gray-100 transition-colors
                 px-2 py-2
                 whitespace-nowrap
                 [font-size:clamp(13px,2.9vw,15px)]"
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
              className="flex items-center justify-center gap-1.5
                 bg-gray-50 text-gray-700 rounded-md hover:bg-gray-100 transition-colors
                 px-2 py-2
                 whitespace-nowrap
                 [font-size:clamp(13px,2.9vw,15px)]"
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

        {/* Detailed Directions */}
        <div className="w-full max-w-2xl space-y-6">
          {/* Bus */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="flex items-center mb-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">버스</h3>
            </div>
            <p className="text-gray-700">강남역 2번 출구에서 도보 5분</p>
            <p className="text-gray-600 text-sm">간선버스: 146, 360, 740</p>
            <p className="text-gray-600 text-sm">지선버스: 4412, 3412</p>
          </div>

          {/* Subway */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="flex items-center mb-3">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">지하철</h3>
            </div>
            <p className="text-gray-700">2호선 강남역 2번 출구</p>
            <p className="text-gray-600 text-sm">신분당선 강남역 4번 출구</p>
          </div>

          {/* Car */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="flex items-center mb-3">
              <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center mr-3">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">자가용</h3>
            </div>
            <p className="text-gray-700">건물 내 지하 주차장 이용 가능</p>
            <p className="text-gray-600 text-sm">
              예식 참석자 무료 주차 (3시간)
            </p>
          </div>

          {/* Parking */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="flex items-center mb-3">
              <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center mr-3">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">주차</h3>
            </div>
            <p className="text-gray-700">지하 1층 ~ 3층 주차장</p>
            <p className="text-gray-600 text-sm">예식 참석자 3시간 무료</p>
            <p className="text-gray-600 text-sm">추가 시간: 1시간당 2,000원</p>
          </div>
          {/* Bus Section */}
          <div className="border-b border-gray-200 pb-4">
            <div className="flex items-center mb-3">
              <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center mr-3">
                {/* <span className="text-white text-lg">🚌</span> */}
                <IconBus className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-semibold text-lg">버스</h3>
            </div>
            <div className="ml-11 space-y-2">
              <p>서초구청 맞은편 정류장 하차 도보 4분</p>
              <div className="flex items-center">
                <span className="w-3 h-3 bg-lime-500 rounded-full mr-2"></span>
                <span>마을버스: 서초17, 서초21</span>
              </div>
              <div className="flex items-center">
                <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                <span>간선버스: 405, 406</span>
              </div>
              <div className="flex items-center">
                <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                <span>광역버스 : 1241</span>
              </div>
              <div className="flex items-center">
                <span className="w-3 h-3 bg-cyan-500 rounded-full mr-2"></span>
                <span>인천공항 : M5439</span>
              </div>
              <p>서초구청 앞 정류장 하차 도보 1분</p>
              <div className="flex items-center">
                <span className="w-3 h-3 bg-lime-500 rounded-full mr-2"></span>
                <span>마을버스: 서초17, 서초21</span>
              </div>
              <div className="flex items-center">
                <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                <span>간선버스: 405, 406</span>
              </div>
              <div className="flex items-center">
                <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                <span>지선버스 : 7212</span>
              </div>
              <div className="flex items-center">
                <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                <span>광역버스 : 9400, 9800, 1241, G9633</span>
              </div>
            </div>
          </div>
          {/* Subway Section */}
          <div className="border-b border-gray-200 pb-4">
            <div className="flex items-center mb-3">
              <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center mr-3">
                {/* <span className="text-white text-lg">🚇</span> */}
                <IconSubway className="w-5 h-5 text-white" />
                {/* <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.5 2C2.5 1.17157 3.17157 0.5 4 0.5H14C14.8284 0.5 15.5 1.17157 15.5 2V15.5H2.5V2Z" />
                </svg> */}
              </div>
              <h3 className="font-semibold text-lg">지하철</h3>
            </div>
            <div className="ml-11 space-y-2">
              <div className="flex items-center">
                <span className="w-3 h-3 bg-orange-500 rounded-full mr-2"></span>
                <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                <span>3호선 신분당선 양재역 12번 출구 도보 5분</span>
              </div>
            </div>
          </div>
          {/* Car Section */}
          <div className="border-b border-gray-200 pb-4">
            <div className="flex items-center mb-3">
              <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center mr-3">
                {/* <span className="text-white text-lg">🚗</span> */}
                <IconCar className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-semibold text-lg">자가용</h3>
            </div>
            <div className="ml-11 space-y-2">
              <p>내비게이션 : "국립외교원" 검색</p>
              <p>주소 검색 : "서울 서초구 남부순환로 2572" 검색</p>
              <p>용산 방면 : 남산 2호 터널 통과→ 서울 신라호텔</p>
              <p>강남 방면 : 동호대교 → 체육관 → 서울 신라호텔</p>
              <p>분당 방면 : 한남대교 → 장충단길 → 서울 신라호텔</p>
            </div>
          </div>

          {/* Parking Section */}
          <div className="border-b border-gray-200 pb-4">
            <div className="flex items-center mb-3">
              <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center mr-3">
                {/* <span className="text-white text-lg font-bold">P</span> */}
                <IconParking className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-semibold text-lg">주차</h3>
            </div>
            <div className="ml-11 space-y-2">
              <div className="bg-yellow-100 p-3 rounded">
                <p className="font-medium">
                  자가용 이용 시 무료 발레파킹, 무료주차 4시간
                </p>
              </div>
              <p>양가 혼주 카운터에서 주차 등록 후 출차</p>
            </div>
          </div>
        </div>
      </section>

      {/* Information Section */}
      <section className="w-full bg-white flex flex-col items-center justify-center px-6 py-20 mb-16">
        {/* Section Title */}
        <span className="block text-lg text-gray-500 tracking-widest mb-2">
          INFORMATION
        </span>
        <h2 className="text-2xl font-semibold text-gray-900 mb-8">안내사항</h2>

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
        {/* <div className="w-full max-w-2xl mb-8">
          <div
            role="tablist"
            aria-label="안내사항 탭"
            className="grid grid-cols-3 gap-1 rounded-xl bg-gray-100 p-1"
          >
            <button
              role="tab"
              aria-selected={activeTab === 'photo'}
              tabIndex={activeTab === 'photo' ? 0 : -1}
              onClick={() => setActiveTab('photo')}
              className={`py-3 text-sm font-medium rounded-lg text-center focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400
        ${activeTab === 'photo' ? 'bg-white shadow text-gray-900' : 'text-gray-600 hover:text-gray-800'}`}
            >
              포토부스
            </button>

            <button
              role="tab"
              aria-selected={activeTab === 'meal'}
              tabIndex={activeTab === 'meal' ? 0 : -1}
              onClick={() => setActiveTab('meal')}
              className={`py-3 text-sm font-medium rounded-lg text-center focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400
        ${activeTab === 'meal' ? 'bg-white shadow text-gray-900' : 'text-gray-600 hover:text-gray-800'}`}
            >
              식사
            </button>

            <button
              role="tab"
              aria-selected={activeTab === 'parking'}
              tabIndex={activeTab === 'parking' ? 0 : -1}
              onClick={() => setActiveTab('parking')}
              className={`py-3 text-sm font-medium rounded-lg text-center focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400
        ${activeTab === 'parking' ? 'bg-white shadow text-gray-900' : 'text-gray-600 hover:text-gray-800'}`}
            >
              예식
            </button>
          </div>
        </div> */}
        {/* Tab Tabs (Underline) */}
        <div className="w-full max-w-2xl mb-8">
          <div className="grid grid-cols-3">
            {[
              { id: 'photo', label: '포토부스' },
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

      <section className="w-full bg-white flex flex-col items-center justify-center px-6 py-20 mb-16">
        <span className="block text-lg text-gray-500 tracking-widest mb-2">
          ACCOUNT
        </span>
        <h2 className="text-2xl font-semibold text-gray-900 mb-8">
          마음 전하실 곳
        </h2>
        {/* Groom's Account Section */}
        <div className="w-full max-w-md bg-gray-50 rounded-lg shadow-sm overflow-hidden mb-4">
          <div
            className="flex justify-between items-center p-4 cursor-pointer bg-gray-100 hover:bg-gray-200 transition-colors"
            onClick={() => setShowGroomAccounts(!showGroomAccounts)}
          >
            <h3 className="text-lg font-semibold text-gray-800">
              신랑측 계좌번호
            </h3>
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
              <div className="flex items-center justify-between border-b pb-4 border-gray-200">
                <div>
                  <p className="text-gray-700">신한 | 110-123-456789</p>
                  <p className="text-gray-600 text-sm">최재만</p>
                </div>
                <button
                  onClick={() => copyToClipboard('110-123-456789')}
                  className="bg-gray-200 text-gray-700 px-3 py-1 rounded-md text-sm flex items-center hover:bg-gray-300 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 002-2h2a2 2 0 002 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                    />
                  </svg>
                  복사
                </button>
              </div>
              {/* Groom Account 2 */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-700">신한 | 110-123-456789</p>
                  <p className="text-gray-600 text-sm">최도현</p>
                </div>
                <button
                  onClick={() => copyToClipboard('110-123-456789')}
                  className="bg-gray-200 text-gray-700 px-3 py-1 rounded-md text-sm flex items-center hover:bg-gray-300 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 002-2h2a2 2 0 002 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                    />
                  </svg>
                  복사
                </button>
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
            <h3 className="text-lg font-semibold text-gray-800">
              신부측 계좌번호
            </h3>
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
              {/* Bride Account 1 */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-700">국민 | 987-654-321098</p>
                  <p className="text-gray-600 text-sm">김신부</p>
                </div>
                <button
                  onClick={() => copyToClipboard('987-654-321098')}
                  className="bg-gray-200 text-gray-700 px-3 py-1 rounded-md text-sm flex items-center hover:bg-gray-300 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 002-2h2a2 2 0 002 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                    />
                  </svg>
                  복사
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
      <section className="w-full bg-white flex flex-col items-center justify-center px-6 py-20 mb-16">
        <span className="block text-lg text-gray-500 tracking-widest mb-2">
          GUEST BOOK
        </span>
        <h2 className="text-2xl font-semibold text-gray-900 mb-8">방명록</h2>
        {/* Write button */}
        <div className="max-w-md w-full">
          <button
            onClick={openWrite}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
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
                    className={`absolute inset-0 w-full h-full ${fill ? 'object-cover' : 'object-contain'} object-center`}
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

      <section className="w-full bg-white flex flex-col items-center justify-center px-6 py-2 mb-16">
        {/* Share / Copy row */}
        <div className="w-full max-w-2xl mx-auto mb-6">
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={copyPageLink}
              className="flex items-center justify-center gap-2 bg-gray-50 text-gray-700 rounded-md hover:bg-gray-100 px-3 py-2"
            >
              {/* link icon */}
              <svg
                className="w-4 h-4"
                viewBox="0 0 112.55 122.88"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M104.41,6.1c6.26,5.13,6.93,11.83,7.62,13.46l0.34,2.5c0.9,5.39-1.65,12.75-5.58,17.38L89.2,59.84 c-6.76,7.84-18.04,10.44-27.48,6.37l-0.03,0.04c3.45,5.63,3.15,9.64,3.46,10.57c0.9,5.41-1.65,12.74-5.58,17.38L41.97,114.6 c-8.53,9.89-23.58,11.1-33.53,2.61c-5.04-5.04-7.84-9.31-8.37-16.49c-0.47-6.24,1.53-12.37,5.59-17.18l17.92-20.79 c5.01-5.14,7.5-5.86,13.33-7.47l2.5-0.34l10.66,1.56c0.22,0.08,0.44,0.18,0.65,0.27l0.03-0.04c-5.35-8.71-4.57-20.11,2.14-27.97 L70.48,8.37c4.11-4.77,9.99-7.71,16.15-8.19c5.37-0.89,12.77,1.64,17.38,5.58L104.41,6.1L104.41,6.1z M74.23,51.71l-3.66,4.24 l0.64,0.01l0.02,0l0.6-0.02l0.01,0l0.14-0.01l0.02,0c2.11-0.16,4.19-0.88,5.96-2.14c0.34-0.24,0.68-0.51,1.02-0.82l0,0l0,0 c0.3-0.27,0.62-0.59,0.93-0.95l0,0l0.12-0.13l17.45-20.24c1.47-1.7,2.36-3.75,2.68-5.86c0.07-0.44,0.11-0.87,0.13-1.26 c0.02-0.41,0.01-0.85-0.01-1.28l0-0.05l-0.01-0.11c-0.16-2.11-0.88-4.19-2.14-5.96c-0.24-0.34-0.51-0.67-0.78-0.97l-0.03-0.04 c-0.29-0.32-0.61-0.64-0.94-0.94l0,0l-0.06-0.05l-0.05-0.05L96.16,15c-1.69-1.43-3.7-2.3-5.78-2.61l-0.03,0 c-0.43-0.06-0.85-0.11-1.24-0.12c-0.41-0.02-0.84-0.01-1.27,0.01l-0.07,0l-0.1,0.01c-2.11,0.16-4.19,0.88-5.96,2.14 c-0.34,0.24-0.68,0.51-0.98,0.78l-0.03,0.03c-0.33,0.29-0.64,0.61-0.94,0.95l0,0l-0.12,0.13L62.2,36.55 c-1.47,1.7-2.36,3.75-2.68,5.86h0c-0.06,0.43-0.11,0.86-0.12,1.26c-0.02,0.41-0.01,0.85,0.01,1.28l0.01,0.15l0,0.01v0.02 c0.03,0.46,0.09,0.91,0.18,1.37l3.58-4.15l0.1-0.12l0.13-0.14l0,0l0.02-0.02c1.29-1.39,3.02-2.18,4.79-2.3 c1.78-0.13,3.62,0.39,5.1,1.6l0,0l0.02,0.01l0.09,0.08l0.02,0.02l0.02,0.02l0.01,0.01l0.02,0.01l0.07,0.06l0,0l0,0 c2.06,1.83,2.82,4.6,2.21,7.13c-0.12,0.5-0.3,1-0.54,1.48c-0.22,0.46-0.51,0.9-0.83,1.31l-0.02,0.02l-0.03,0.04l0,0l-0.01,0.02 l-0.1,0.12l0,0L74.23,51.71L74.23,51.71z M40.06,80.23L40.06,80.23c2.33,2.01,5.88,1.75,7.89-0.58l5.58-6.47 c0.65,1.45,1.04,3,1.16,4.57c0.25,3.44-0.79,6.97-3.19,9.75l-17.46,20.24c-2.4,2.79-5.73,4.34-9.16,4.59 c-3.38,0.25-6.84-0.75-9.59-3.05l-0.16-0.14c-2.78-2.4-4.34-5.73-4.59-9.16c-0.25-3.4,0.76-6.89,3.1-9.65l0.09-0.1l17.25-20l0,0 l0,0l0.21-0.24c2.4-2.78,5.73-4.34,9.16-4.59c1.58-0.12,3.18,0.04,4.71,0.47l-5.58,6.47C37.47,74.67,37.73,78.22,40.06,80.23 L40.06,80.23z"
                />
              </svg>
              링크 복사하기
            </button>

            <button
              type="button"
              onClick={sharePage}
              className="flex items-center justify-center gap-2 bg-gray-800 text-white rounded-md hover:bg-gray-900 px-3 py-2"
            >
              {/* share icon */}
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
                  d="M4 12v7a1 1 0 001 1h14a1 1 0 001-1v-7"
                />
                <path
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16 6l-4-4-4 4"
                />
                <path
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 2v14"
                />
              </svg>
              공유하기
            </button>
          </div>
        </div>
      </section>
      <section>
        <div className="w-full px-6 py-2 mb-2">
          <p className="text-gray-600 text-center text-sm">
            Copyright © 2025 Yejin Park. All rights reserved.
          </p>
        </div>
      </section>
    </div>
  );
}

export default App;
