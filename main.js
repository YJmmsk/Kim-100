(function () {
  document.documentElement.classList.add('js');

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
