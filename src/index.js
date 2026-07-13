import iconv from 'iconv-lite';

const TARGET_URL = 'https://www.pweng.net/level-test.save.php';
const REQUIRED_FIELDS = ['hopedate', 'hopetime', 'lesson_gubun', 'name', 'mobile', 'email'];

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === 'POST' && url.pathname === '/api/level-test-submit') {
      return handleLevelTestSubmit(request);
    }

    return env.ASSETS.fetch(request);
  },
};

async function handleLevelTestSubmit(request) {
  let data;

  try {
    data = await request.json();
  } catch (e) {
    return jsonResponse({ success: false, error: 'invalid_request' }, 400);
  }

  for (const key of REQUIRED_FIELDS) {
    if (!data[key]) {
      return jsonResponse({ success: false, error: 'missing_field', field: key }, 400);
    }
  }

  const fields = {
    page: 'Cloudflare Landing',
    hopedate: data.hopedate,
    hopetime: data.hopetime,
    lesson_gubun: data.lesson_gubun,
    name: data.name,
    mobile: data.mobile,
    email: data.email,
    skype: data.skype || '',
    agreement_1: 'Y',
    agreement_2: data.agreement_2 === 'Y' ? 'Y' : 'N',
  };

  const body = buildEucKrFormBody(fields);
  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
    'User-Agent': 'PWENG-LevelTest-Proxy/1.0 (+https://pweng.wiseeducation2023.workers.dev)',
  };

  let res = await fetch(TARGET_URL, { method: 'POST', body, redirect: 'manual', headers });
  let location = res.headers.get('location') || '';
  let bodyText = await res.clone().text();
  const debug = { attempt1: { status: res.status, location, bodyText: bodyText.slice(0, 800) } };

  // pweng.net does a one-time cookie-verification redirect (?ckattempt=1) on a
  // fresh session; capture the cookie it just issued and retry once with it attached.
  if (res.status >= 300 && res.status < 400 && location.includes('ckattempt')) {
    const cookie = collectCookieHeader(res);
    debug.cookie = cookie;

    res = await fetch(TARGET_URL, {
      method: 'POST',
      body,
      redirect: 'manual',
      headers: cookie ? { ...headers, Cookie: cookie } : headers,
    });

    location = res.headers.get('location') || '';
    bodyText = await res.clone().text();
    debug.attempt2 = { status: res.status, location, bodyText: bodyText.slice(0, 800) };
  }

  const success = location.includes('finish');

  // TEMPORARY: debug field to diagnose why success is false; remove once fixed.
  return jsonResponse({ success, debug });
}

function collectCookieHeader(res) {
  const setCookies = typeof res.headers.getSetCookie === 'function'
    ? res.headers.getSetCookie()
    : [res.headers.get('set-cookie')].filter(Boolean);

  return setCookies
    .map((c) => c.split(';')[0])
    .filter(Boolean)
    .join('; ');
}

function buildEucKrFormBody(fields) {
  return Object.entries(fields)
    .map(([key, value]) => {
      const bytes = iconv.encode(String(value), 'euc-kr');
      return `${encodeURIComponent(key)}=${percentEncodeBytes(bytes)}`;
    })
    .join('&');
}

function percentEncodeBytes(bytes) {
  let out = '';

  for (const b of bytes) {
    const isUnreserved =
      (b >= 0x41 && b <= 0x5a) || // A-Z
      (b >= 0x61 && b <= 0x7a) || // a-z
      (b >= 0x30 && b <= 0x39) || // 0-9
      b === 0x2d || b === 0x5f || b === 0x2e || b === 0x7e; // - _ . ~

    out += isUnreserved ? String.fromCharCode(b) : '%' + b.toString(16).padStart(2, '0').toUpperCase();
  }

  return out;
}

function jsonResponse(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
