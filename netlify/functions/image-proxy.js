/* Proxies Lumenear product photos so the PDF report generator (client-side
   jsPDF) can embed them — lumenear.com doesn't send CORS headers, so the
   browser refuses to read pixel data from an <img> loaded directly from
   there. This function fetches the image server-side (no CORS involved)
   and re-serves it with Access-Control-Allow-Origin: *.

   Locked to https://lumenear.com/ URLs only — never proxies arbitrary
   URLs, to avoid this becoming an open SSRF proxy. */

exports.handler = async (event) => {
  const url = event.queryStringParameters && event.queryStringParameters.url;

  if (!url || !/^https:\/\/lumenear\.com\//.test(url)) {
    return { statusCode: 400, body: 'Invalid or missing url parameter' };
  }

  let res;
  try {
    res = await fetch(url);
  } catch (e) {
    return { statusCode: 502, body: 'Upstream fetch failed' };
  }

  if (!res.ok) {
    return { statusCode: res.status, body: 'Upstream returned an error' };
  }

  const buffer = Buffer.from(await res.arrayBuffer());
  const contentType = res.headers.get('content-type') || 'image/jpeg';

  return {
    statusCode: 200,
    headers: {
      'Content-Type': contentType,
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=86400',
    },
    body: buffer.toString('base64'),
    isBase64Encoded: true,
  };
};
