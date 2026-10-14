/* script.js - form handling
   동작 설명:
   - assets/config.js 에 FORM_ENDPOINT를 설정하면 폼 제출 시 해당 엔드포인트로 JSON POST 요청을 보냄
   - FORM_ENDPOINT가 비어 있으면 제출 버튼은 비활성화되고 사용자에게 이메일로 문의하라고 안내함
*/
(function(){
  const form = document.getElementById('inquiryForm');
  const status = document.getElementById('formStatus');
  const submitBtn = document.getElementById('submitBtn');

  function setStatus(message, isError){
    status.textContent = message;
    status.style.color = isError ? '#b00020' : '';
  }

  if(typeof FORM_ENDPOINT === 'string' && FORM_ENDPOINT.trim().length>0){
    // 자동 접수 활성화
    setStatus('자동 접수: 활성화됨', false);
    form.addEventListener('submit', async function(e){
      e.preventDefault();
      submitBtn.disabled = true;
      submitBtn.textContent = '전송 중...';
      const data = {};
      new FormData(form).forEach((v,k)=>data[k]=v);
      try{
        const res = await fetch(FORM_ENDPOINT, {
          method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)
        });
        if(res.ok){
          setStatus('견적 문의가 정상 접수되었습니다. 빠른 시일 내에 연락드리겠습니다.');
          form.reset();
        } else {
          const text = await res.text();
          setStatus('서버 응답 오류: '+ (text||res.status), true);
        }
      }catch(err){
        setStatus('전송 실패: '+ err.message, true);
      }finally{submitBtn.disabled=false;submitBtn.textContent='문의 보내기'}
    });
  } else {
    // 자동 접수 미설정 -> 비활성화 및 이메일 안내
    submitBtn.disabled = true;
    setStatus('자동 접수 미설정 — 관리자가 assets/config.js 에 FORM_ENDPOINT를 설정하면 자동 접수가 활성화됩니다. 현재는 이메일(contact@stockone.co.kr)로 문의해 주세요.', false);
  }
})();
