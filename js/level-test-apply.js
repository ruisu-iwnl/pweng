// /* ── 레벨테스트 신청 폼 ── */
// var sel={date:null,time:null,type:null};

// (function(){
//   var days=['일','월','화','수','목','금','토'];
//   var dg=document.getElementById('dateGrid');
//   var count=0, offset=1;
//   while(count<3){
//     var d=new Date();d.setDate(d.getDate()+offset);
//     offset++;
//     if(d.getDay()===0||d.getDay()===6) continue; // skip weekends: pweng backend rejects Sat/Sun
//     count++;
//     var label=String(d.getMonth()+1).padStart(2,'0')+'/'+String(d.getDate()).padStart(2,'0')+' ('+days[d.getDay()]+')';
//     var iso=d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
//     var b=document.createElement('button');
//     b.type='button';b.className='pill-btn';b.textContent=label;
//     b.dataset.value=iso;
//     b.onclick=function(){pick(this,'date',dg)};
//     dg.appendChild(b);
//   }
//   var slots=[
//     ['오전 9시~10시','9~10'],['오전 10시~11시','10~11'],['오전 11시~12시','11~12'],
//     ['오후 12시~13시','12~13'],['오후 13시~14시','13~14'],['오후 14시~15시','14~15'],
//     ['오후 15시~16시','15~16'],['오후 16시~17시','16~17'],['오후 17시~18시','17~18'],
//     ['오후 18시~19시','18~19'],['오후 19시~20시','19~20'],['오후 20시~21시','20~21'],
//     ['오후 21시~22시','21~22'],['오후 22시~23시','22~23'],['오후 23시~24시','23~24']
//   ];
//   var tg=document.getElementById('timeGrid');
//   slots.forEach(function(s){
//     var b=document.createElement('button');
//     b.type='button';b.className='pill-btn';b.textContent=s[0];
//     b.dataset.value=s[1];
//     b.onclick=function(){pick(this,'time',tg)};
//     tg.appendChild(b);
//   });
// })();

// function pick(btn,key,grid){
//   grid.querySelectorAll('.pill-btn').forEach(function(x){x.classList.remove('sel')});
//   btn.classList.add('sel');
//   sel[key]=btn.textContent;
//   sel[key+'Value']=btn.dataset.value;
//   refreshBars();
// }
// function pickType(btn){
//   document.querySelectorAll('.type-card').forEach(function(x){x.classList.remove('sel')});
//   btn.classList.add('sel');
//   sel.type=btn.getAttribute('data-type');
//   document.getElementById('zoomField').style.display = sel.type==='화상영어' ? 'block' : 'none';
//   refreshBars();
// }
// function refreshBars(){
//   var b1=document.getElementById('selBar1'),b2=document.getElementById('selBar2');
//   if(sel.date&&sel.time){
//     b1.innerHTML='선택됨: <b>'+sel.date+'</b> &nbsp;/&nbsp; <b>'+sel.time+'</b>';
//   }
//   if(sel.date&&sel.time&&sel.type){
//     b2.innerHTML='선택됨: <b>'+sel.date+'</b> &nbsp;/&nbsp; <b>'+sel.time+'</b> &nbsp;/&nbsp; <b>'+sel.type+'</b>';
//   }
// }
// function submitApply(){
//   var msg=document.getElementById('formMsg');
//   function fail(t){msg.textContent=t;msg.style.display='block'}
//   msg.style.display='none';
//   var name=document.getElementById('uName').value.trim();
//   var phone=document.getElementById('uPhone').value.trim();
//   var email=document.getElementById('uEmail').value.trim();
//   var zoom=document.getElementById('zoomId').value.trim();

//   if(!sel.date||!sel.time) return fail('STEP 1에서 희망 날짜와 시간을 선택해주세요.');
//   if(!sel.type) return fail('STEP 2에서 수업 타입을 선택해주세요.');
//   if(sel.type==='화상영어'&&!zoom) return fail('화상영어는 ZOOM ID 입력이 필요합니다.');
//   if(!name) return fail('이름을 입력해주세요.');
//   if(!/^01[016789][-\s]?\d{3,4}[-\s]?\d{4}$/.test(phone)) return fail('올바른 휴대폰 번호를 입력해주세요. (예: 010-0000-0000)');
//   if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return fail('올바른 이메일 주소를 입력해주세요.');
//   if(!document.getElementById('agreePrivacy').checked) return fail('개인정보 수집·이용 동의(필수)에 체크해주세요.');

//   var lessonGubun = sel.type === '화상영어' ? 'S' : 'M';

//   var fields = {
//     page: '클라우드플레어 랜딩',
//     hopedate: sel.dateValue,
//     hopetime: sel.timeValue,
//     lesson_gubun: lessonGubun,
//     name: name,
//     mobile: phone,
//     email: email,
//     skype: zoom,
//     agreement_1: 'Y',
//     agreement_2: document.getElementById('agreeMkt').checked ? 'Y' : 'N'
//   };

//   var form = document.createElement('form');
//   form.method = 'post';
//   form.action = 'https://www.pweng.net/level-test.save.php';
//   form.acceptCharset = 'EUC-KR'; // pweng backend is EUC-KR; this page is UTF-8, so force the submission encoding
//   form.style.display = 'none';

//   Object.keys(fields).forEach(function(key){
//     var input = document.createElement('input');
//     input.type = 'hidden';
//     input.name = key;
//     input.value = fields[key] || '';
//     form.appendChild(input);
//   });

//   document.body.appendChild(form);
//   form.submit();
// }
