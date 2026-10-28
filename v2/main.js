(function () {
  document.documentElement.classList.add('js');

  // 첫 화면 높이와 화면 배율(--ui)을 창 크기에 맞춤.
  // 휴대폰(폭 700px 미만): 처음 열린 높이로 고정하고 폭이 바뀔 때(화면 회전)만 다시 잰다.
  //   카카오톡 등 인앱 브라우저는 위아래 바가 숨을 때 높이가 커져 첫 화면이 늘어나기 때문.
  // 아이패드·맥(폭 700px 이상): 창 크기가 바뀔 때마다 다시 재서 첫 화면이 창에 딱 맞게 한다.
  //   단, 본문을 읽는 중에는 내용이 밀리지 않도록 맨 위로 돌아왔을 때 맞춘다.
  var root = document.documentElement;
  var lastW = 0, lastH = 0;
  function fitCover() {
    var w = window.innerWidth, h = window.innerHeight;
    if (w === lastW && (w < 700 || h === lastH)) return;
    if (w === lastW && window.scrollY > 10) return;
    lastW = w; lastH = h;
    root.style.setProperty('--cover-h', h + 'px');
    // 큰 화면에서는 글자·여백·사진을 화면 크기에 맞춰 키움. 기준은 휴대폰 약 400×760
    var ui = Math.min(w / 400, h / 760);
    root.style.setProperty('--ui', Math.max(1, Math.min(ui, 1.5)).toFixed(3));
  }
  fitCover();
  window.addEventListener('resize', fitCover);
  window.addEventListener('scroll', function () { if (window.scrollY <= 10) fitCover(); }, { passive: true });

  // D-day: 보는 사람의 시간대와 무관하게 한국 시간(UTC+9) 날짜 기준으로 계산
  var EVENT_KST = Date.UTC(2026, 11, 12); // 2026-12-12 (KST 날짜)
  var DAY = 86400000;
  var todayKst = Math.floor((Date.now() + 9 * 3600000) / DAY) * DAY;
  var diff = Math.round((EVENT_KST - todayKst) / DAY);
  var el = document.getElementById('dday');
  if (diff > 0) {
    el.innerHTML = '<b>D-' + diff + '</b>그날까지 ' + diff + '일 남았어요';
  } else if (diff === 0) {
    el.innerHTML = '<b>D-DAY</b>오늘입니다';
  } else {
    el.textContent = '함께해 주셔서 감사합니다';
  }

  // 주소 복사
  var toast = document.getElementById('toast');
  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(function () { toast.classList.remove('show'); }, 1800);
  }
  document.getElementById('copy-addr').addEventListener('click', function () {
    var text = '대전 유성구 봉명로 27-27, 4층 (라미컨벤션웨딩)';
    function fallback() {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); showToast('주소가 복사되었습니다'); }
      catch (e) { showToast(text); }
      document.body.removeChild(ta);
    }
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(function () { showToast('주소가 복사되었습니다'); }, fallback);
    } else {
      fallback();
    }
  });

  // 티맵: 앱으로 바로 열고, 앱이 없으면 스토어로 안내
  // 좌표(TMAP_X=경도, TMAP_Y=위도)가 있으면 길안내, 없으면 장소명 검색
  var TMAP_NAME = '라미컨벤션웨딩';
  var TMAP_X = null;
  var TMAP_Y = null;
  var ua = navigator.userAgent;
  var isAndroid = /Android/i.test(ua);
  var isIOS = /iPhone|iPad|iPod/i.test(ua) || (/Macintosh/.test(ua) && 'ontouchend' in document);
  var tmapQuery = (TMAP_X && TMAP_Y)
    ? 'route?rGoName=' + encodeURIComponent(TMAP_NAME) + '&rGoX=' + TMAP_X + '&rGoY=' + TMAP_Y
    : 'search?name=' + encodeURIComponent(TMAP_NAME);
  document.getElementById('tmap').addEventListener('click', function (ev) {
    if (!isAndroid && !isIOS) return; // PC는 티맵 홈페이지로
    ev.preventDefault();
    if (isAndroid) {
      // intent 링크는 앱이 없으면 플레이스토어로 자동 이동
      location.href = 'intent://' + tmapQuery + '#Intent;scheme=tmap;package=com.skt.tmap.ku;end';
      return;
    }
    var start = Date.now();
    location.href = 'tmap://' + tmapQuery;
    setTimeout(function () {
      if (!document.hidden && Date.now() - start < 2500) {
        location.href = 'https://apps.apple.com/kr/app/id431589174';
      }
    }, 1500);
  });

  // 스크롤 시 페이드인
  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.15 });
    items.forEach(function (n) { io.observe(n); });
  } else {
    items.forEach(function (n) { n.classList.add('in'); });
  }
})();
