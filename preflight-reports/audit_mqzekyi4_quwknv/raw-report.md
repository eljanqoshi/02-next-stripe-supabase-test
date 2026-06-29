# Preflight audit report

- Audit: audit_mqzekyi4_quwknv
- Repository: eljanqoshi/02-next-stripe-supabase-test
- Branch: main
- App path: .
- Framework: next
- Scan mode: sandbox
- Generated: 2026-06-29T16:05:44Z

## Executive review
Preflight installed dependencies, built the app, started a local service, and completed static plus dynamic checks.

## Findings
_These are automated candidates. A finding is not confirmed exploitable until its evidence is manually validated._

- **Informational**: Gitleaks saw 3 generated build-artifact credential-pattern match(es), but no source credential candidates. These are suppressed from priority findings unless tied to source evidence.
- **App-specific candidates**: Preflight launch checks returned 8 finding(s): 2 critical, 5 high, 1 medium, and 0 low. These checks cover authorization, payments, provider credentials, database controls, abuse protection, and production-only exposure.
- **Low candidate**: 4 recommended browser security header(s) were absent from the localhost response.

## Commands run
| Phase | Command | Output |
| --- | --- | --- |
| Install | auto package-manager install or configured override | install.log |
| Build | npm run build or configured override | build.log |
| Start | npm run start/dev or configured override | app.log |
| Secret scan | gitleaks dir target --redact | secrets-scan.log / gitleaks.json |
| SaaS launch checks | Preflight TypeScript-aware auth, provider, webhook, database, and abuse checks | launch-security.log / launch-security.json |
| SAST | semgrep p/owasp-top-ten + p/secrets + Preflight Next.js rules | semgrep.log / semgrep.json |
| Cross-ecosystem dependencies | osv-scanner scan source -r | osv-scanner.log |
| Dependency audit | npm audit --audit-level=moderate | package-audit.log |
| Port scan | nmap -sT -sV -Pn 127.0.0.1 -p 3000,3001,5173,4173 | nmap.log |
| Web fingerprint | whatweb http://127.0.0.1:3000 | whatweb.log |
| Web server scan | nikto -host http://127.0.0.1:3000 -nointeractive | nikto.log |
| WAF fingerprint | wafw00f http://127.0.0.1:3000 | wafw00f.log |
| Template scan | nuclei, non-intrusive tags, 20 req/s | nuclei.log / nuclei.jsonl |
| Header check | curl response headers | headers.log |
| Live ownership | HTTPS well-known file over a pinned public IP | live-verification.log |
| Live TLS | openssl certificate and hostname validation | live-tls-summary.log / live-tls.log |
| Live headers | curl over a pinned public IP | live-headers.log |
| Live templates | safe Nuclei profile, 10 req/s, pinned public IP | live-nuclei.log |

## Sandbox setup
The worker used ephemeral placeholder values for common build-time secrets. No production secrets are injected into the sandbox.

### Dependency install
Dependency install completed or was not required. Last output:

```text

added 58 packages, and audited 59 packages in 16s

17 packages are looking for funding
  run `npm fund` for details

2 moderate severity vulnerabilities

To address all issues (including breaking changes), run:
  npm audit fix --force

Run `npm audit` for details.
```

### Application build
Application build completed or was not required.

```text

> preflight-test-next-stripe-supabase@1.0.0 build
> next build

[warning] No build cache found. Please configure build caching for faster rebuilds. Read more: https://nextjs.org/docs/messages/no-cache
^ Next.js 16.2.9 (Turbopack)
- Environments: .env.local

  Creating an optimized production build ...
[ok] Compiled successfully in 4.7s
  Running TypeScript ...

  We detected TypeScript in your project and reconfigured your tsconfig.json file for you.
  The following suggested values were added to your tsconfig.json. These values can be changed to fit your project's needs:

  	- include was updated to add '.next/dev/types/**/*.ts'

  Finished TypeScript in 3.0s ...
  Collecting page data using 1 worker ...
  Generating static pages using 1 worker (0/6) ...
  Generating static pages using 1 worker (1/6) 
  Generating static pages using 1 worker (2/6) 
  Generating static pages using 1 worker (4/6) 
[ok] Generating static pages using 1 worker (6/6) in 124ms
  Finalizing page optimization ...

Route (app)
+ o /
+ o /_not-found
+ f /api/billing/checkout
+ f /api/internal/import
+ f /api/webhooks/stripe


o  (Static)   prerendered as static content
f  (Dynamic)  server-rendered on demand

```

## Gitleaks secret scan

```text
No source credential candidates detected by Gitleaks.

Generated build-artifact candidates suppressed from priority evidence: 3
Review gitleaks.json only if source files also expose the same value.
```

## App-specific launch security

```text
Preflight launch security checks scanned 6 source file(s) and returned 8 finding candidate(s).

[HIGH] [high confidence] preflight.launch.api-mutation-without-auth app/api/billing/checkout/route.ts:5 - POST API handler appears to mutate state without a server-side authentication check.
  Evidence: POST handler; authentication call not found
  Remediation: Resolve the authenticated user on the server before authorization and before any state change. Do not rely on middleware or client-side route guards alone.
[MEDIUM] [medium confidence] preflight.launch.sensitive-route-without-rate-limit app/api/billing/checkout/route.ts:5 - A sensitive authentication, administration, or billing endpoint has no visible rate-limit check.
  Evidence: POST sensitive handler; rate-limit call not found
  Remediation: Apply a shared, server-enforced rate limiter keyed by account and trusted client IP, with conservative limits and monitoring.
[HIGH] [medium confidence] preflight.launch.stripe-client-controlled-price app/api/billing/checkout/route.ts:7 - Stripe payment creation appears to trust an amount or price supplied by the client.
  Evidence: stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [{ price: body.price
  Remediation: Resolve product and price identifiers from a server-owned catalog. Never accept authoritative amount, currency, discount, or price values directly from the request.
[CRITICAL] [high confidence] preflight.launch.supabase-service-role-route-without-auth app/api/internal/import/route.ts:5 - An API route uses a Supabase service-role credential without a visible authentication check.
  Evidence: Supabase service-role reference; authentication call not found
  Remediation: Authenticate and authorize before creating or using the service-role client. Scope privileged operations narrowly because the service role bypasses Row Level Security.
[HIGH] [high confidence] preflight.launch.api-mutation-without-auth app/api/internal/import/route.ts:8 - POST API handler appears to mutate state without a server-side authentication check.
  Evidence: POST handler; authentication call not found
  Remediation: Resolve the authenticated user on the server before authorization and before any state change. Do not rely on middleware or client-side route guards alone.
[HIGH] [medium confidence] preflight.launch.request-object-passed-to-database app/api/internal/import/route.ts:9 - A request-derived object appears to be passed directly into a database operation.
  Evidence: payload = await request.json();
  const result = await supabase.from("customers").insert(payload
  Remediation: Validate the payload with a strict schema and construct an allowlisted database object field by field. Reject unknown keys and authorization-sensitive fields.
[CRITICAL] [high confidence] preflight.launch.stripe-webhook-unverified app/api/webhooks/stripe/route.ts:1 - Stripe webhook processing has no visible signature verification.
  Evidence: Stripe webhook route; constructEvent/signature verification not found
  Remediation: Read the raw request body and call stripe.webhooks.constructEvent with the Stripe-Signature header and a server-only webhook secret before processing any event.
[HIGH] [high confidence] preflight.launch.supabase-table-without-rls supabase/migrations/001_customers.sql:1 - Supabase migration creates public.customers without enabling Row Level Security in the same migration file.
  Evidence: create table public.customers
  Remediation: Enable RLS on public.customers, add explicit least-privilege policies, and test anonymous and authenticated access before launch.
```

## Semgrep SAST

```text
Semgrep completed successfully with no OWASP, secrets, or Preflight Next.js rule matches.
```

## OSV dependency scan

```text
Scanning dir /__w/preflight/preflight/target
Starting filesystem walk for root: /
Scanned /__w/preflight/preflight/target/package-lock.json file and found 88 packages
Scanned /__w/preflight/preflight/target/node_modules/next/dist/esm/server/route-modules/pages/vendored/contexts file and found 0 packages
Scanned /__w/preflight/preflight/target/node_modules/next/dist/esm/server/route-modules/app-page/vendored/contexts file and found 0 packages
Scanned /__w/preflight/preflight/target/node_modules/next/dist/esm/server/route-modules/app-page/vendored/rsc file and found 0 packages
Scanned /__w/preflight/preflight/target/node_modules/next/dist/esm/server/route-modules/app-page/vendored/ssr file and found 0 packages
Scanned /__w/preflight/preflight/target/node_modules/next/dist/server/route-modules/pages/vendored/contexts file and found 0 packages
Scanned /__w/preflight/preflight/target/node_modules/next/dist/server/route-modules/app-page/vendored/contexts file and found 0 packages
Scanned /__w/preflight/preflight/target/node_modules/next/dist/server/route-modules/app-page/vendored/rsc file and found 0 packages
Scanned /__w/preflight/preflight/target/node_modules/next/dist/server/route-modules/app-page/vendored/ssr file and found 0 packages
End status: 1183 dirs visited, 12824 inodes visited, 9 Extract calls, 796.510711ms elapsed, 796.510951ms wall time

Total 1 package affected by 1 known vulnerability (0 Critical, 0 High, 1 Medium, 0 Low, 0 Unknown) from 1 ecosystem.
1 vulnerability can be fixed.

+-------------------------------------+------+-----------+---------+---------+---------------+--------------------------+
| OSV URL                             | CVSS | ECOSYSTEM | PACKAGE | VERSION | FIXED VERSION | SOURCE                   |
+-------------------------------------+------+-----------+---------+---------+---------------+--------------------------+
| https://osv.dev/GHSA-qx2v-qp2m-jg93 | 6.1  | npm       | postcss | 8.4.31  | 8.5.10        | target/package-lock.json |
+-------------------------------------+------+-----------+---------+---------+---------------+--------------------------+
```

## Package audit

```text
# npm audit report

postcss  <8.5.10
Severity: moderate
PostCSS has XSS via Unescaped </style> in its CSS Stringify Output - https://github.com/advisories/GHSA-qx2v-qp2m-jg93
fix available via `npm audit fix --force`
Will install next@9.3.3, which is a breaking change
node_modules/postcss
  next  9.3.4-canary.0 - 16.3.0-canary.5
  Depends on vulnerable versions of postcss
  node_modules/next

2 moderate severity vulnerabilities

To address all issues (including breaking changes), run:
  npm audit fix --force
```

## Nuclei web scan

```text
No Nuclei template matches.
```

## Response headers

```text
HTTP/1.1 200 OK
Vary: rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch, Accept-Encoding
x-nextjs-cache: HIT
x-nextjs-prerender: 1
x-nextjs-prerender: 1
x-nextjs-stale-time: 300
X-Powered-By: Next.js
Cache-Control: s-maxage=31536000
ETag: "9sg61kbyg73gj"
Content-Type: text/html; charset=utf-8
Content-Length: 4483
Date: Mon, 29 Jun 2026 16:01:44 GMT
Connection: keep-alive
Keep-Alive: timeout=5

```

## Live target verification

```text
Live target mode was not requested.
```

## Live TLS

```text
Live target mode was not requested.
```

## Live response headers

```text
Live target mode was not requested.
```

## Live Nuclei web scan

```text
Live target mode was not requested.
```

## Local service fingerprint
### nmap

```text
$ nmap -sT -sV -Pn 127.0.0.1 -p 3000,3001,5173,4173
Starting Nmap 7.99 ( https://nmap.org ) at 2026-06-29 16:01 +0000
Nmap scan report for localhost (127.0.0.1)
Host is up (0.000098s latency).

PORT     STATE  SERVICE       VERSION
3000/tcp open   ppp?
3001/tcp closed nessus
4173/tcp closed mma-discovery
5173/tcp closed unknown
1 service unrecognized despite returning data. If you know the service/version, please submit the following fingerprint at https://nmap.org/cgi-bin/submit.cgi?new-service :
SF-Port3000-TCP:V=7.99%I=7%D=6/29%Time=6A4296D1%P=x86_64-pc-linux-gnu%r(Ge
SF:tRequest,1321,"HTTP/1\.1\x20200\x20OK\r\nVary:\x20rsc,\x20next-router-s
SF:tate-tree,\x20next-router-prefetch,\x20next-router-segment-prefetch,\x2
SF:0Accept-Encoding\r\nx-nextjs-cache:\x20HIT\r\nx-nextjs-prerender:\x201\
SF:r\nx-nextjs-prerender:\x201\r\nx-nextjs-stale-time:\x20300\r\nX-Powered
SF:-By:\x20Next\.js\r\nCache-Control:\x20s-maxage=31536000\r\nETag:\x20\"9
SF:sg61kbyg73gj\"\r\nContent-Type:\x20text/html;\x20charset=utf-8\r\nConte
SF:nt-Length:\x204483\r\nDate:\x20Mon,\x2029\x20Jun\x202026\x2016:01:21\x2
SF:0GMT\r\nConnection:\x20close\r\n\r\n<!DOCTYPE\x20html><html\x20lang=\"e
SF:n\"><head><meta\x20charSet=\"utf-8\"/><meta\x20name=\"viewport\"\x20con
SF:tent=\"width=device-width,\x20initial-scale=1\"/><link\x20rel=\"preload
SF:\"\x20as=\"script\"\x20fetchPriority=\"low\"\x20href=\"/_next/static/ch
SF:unks/3z5q_p4msz2ha\.js\"/><script\x20src=\"/_next/static/chunks/0atut6a
SF:2uuyid\.js\"\x20async=\"\"></script><script\x20src=\"/_next/static/chun
SF:ks/2nykiepra7i1k\.js\"\x20async=\"\"></script><script\x20src=\"/_next/s
SF:tatic/chunks/turbopack-1ncs5q5sgtvda\.js\"\x20async=\"\"></script><scri
SF:pt\x20src=\"/_next/static/chunks/158my")%r(Help,2F,"HTTP/1\.1\x20400\x2
SF:0Bad\x20Request\r\nConnection:\x20close\r\n\r\n")%r(NCP,2F,"HTTP/1\.1\x
SF:20400\x20Bad\x20Request\r\nConnection:\x20close\r\n\r\n")%r(HTTPOptions
SF:,DD,"HTTP/1\.1\x20405\x20Method\x20Not\x20Allowed\r\nvary:\x20rsc,\x20n
SF:ext-router-state-tree,\x20next-router-prefetch,\x20next-router-segment-
SF:prefetch\r\nAllow:\x20GET\r\nAllow:\x20HEAD\r\nDate:\x20Mon,\x2029\x20J
SF:un\x202026\x2016:01:21\x20GMT\r\nConnection:\x20close\r\n\r\nMethod\x20
SF:Not\x20Allowed")%r(RTSPRequest,DD,"HTTP/1\.1\x20405\x20Method\x20Not\x2
SF:0Allowed\r\nvary:\x20rsc,\x20next-router-state-tree,\x20next-router-pre
SF:fetch,\x20next-router-segment-prefetch\r\nAllow:\x20GET\r\nAllow:\x20HE
SF:AD\r\nDate:\x20Mon,\x2029\x20Jun\x202026\x2016:01:21\x20GMT\r\nConnecti
SF:on:\x20close\r\n\r\nMethod\x20Not\x20Allowed")%r(RPCCheck,2F,"HTTP/1\.1
SF:\x20400\x20Bad\x20Request\r\nConnection:\x20close\r\n\r\n")%r(DNSVersio
SF:nBindReqTCP,2F,"HTTP/1\.1\x20400\x20Bad\x20Request\r\nConnection:\x20cl
SF:ose\r\n\r\n");

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 11.28 seconds
```

### whatweb

```text
$ whatweb http://127.0.0.1:3000
[1m[34mhttp://127.0.0.1:3000[0m [200 OK] [1mCountry[0m[[0m[22mRESERVED[0m][[1m[31mZZ[0m], [1mHTML5[0m, [1mIP[0m[[0m[22m127.0.0.1[0m], [1mScript[0m, [1mUncommonHeaders[0m[[0m[22mx-nextjs-cache,x-nextjs-prerender,x-nextjs-stale-time[0m], [1mX-Powered-By[0m[[0m[22mNext.js[0m]
```

### nikto

```text
$ nikto -host http://127.0.0.1:3000 -nointeractive
- Nikto v2.6.0
---------------------------------------------------------------------------
+ Target IP:          127.0.0.1
+ Target Hostname:    127.0.0.1
+ Target Port:        3000
+ Platform:           Unknown
+ Start Time:         2026-06-29 16:01:25 (GMT0)
---------------------------------------------------------------------------
+ Server: No banner retrieved
+ ERROR: Failed to check for updates: 403
+ [999986] /: Retrieved x-powered-by header: Next.js.
+ [999100] /: Uncommon header(s) 'x-nextjs-cache' found, with contents: HIT.
+ [999100] /: Uncommon header(s) 'x-nextjs-stale-time' found, with contents: 300.
+ [999100] /: Uncommon header(s) 'x-nextjs-prerender' found, with contents: 1,1.
+ [999100] /icons/: Uncommon header(s) 'refresh' found, with contents: 0;url=/icons.
+ No CGI Directories found (use '-C all' to force check all possible dirs). CGI tests skipped.
+ [013587] /: Suggested security header missing: x-content-type-options. See: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Content-Type-Options
+ [013587] /: Suggested security header missing: strict-transport-security. See: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security
+ [013587] /: Suggested security header missing: referrer-policy. See: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy
+ [013587] /: Suggested security header missing: permissions-policy. See: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Permissions-Policy
+ [013587] /: Suggested security header missing: content-security-policy. See: https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP
+ [740002] /: Potential OPTIONSBLEED vulnerability detected. Allow header: ARRAY(0x561d0e582c18). See: https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2017-9798
+ [999990] OPTIONS: Allowed HTTP Methods: ARRAY(0x561d0e5ee300) .
+ [999979] http://100.100.100.200/latest/meta-data/: IP address found in the 'location' header. The IP is "100.100.100.200". See: https://portswigger.net/kb/issues/00600300_private-ip-addresses-disclosed
+ [999979] http://100.100.100.200/latest/meta-data/: IP address found in the 'refresh' header. The IP is "100.100.100.200". See: https://portswigger.net/kb/issues/00600300_private-ip-addresses-disclosed
+ [007342] /: X-Frame-Options header is deprecated and was replaced with the Content-Security-Policy HTTP header with the frame-ancestors directive. See: https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/X-Frame-Options
+ [007352] /: The X-Content-Type-Options header is not set. This could allow the user agent to render the content of the site in a different fashion to the MIME type. See: https://www.netsparker.com/web-vulnerability-scanner/vulnerabilities/missing-content-type-header/
+ 8188 requests: 0 errors and 16 items reported on the remote host
+ End Time:           2026-06-29 16:01:43 (GMT0) (18 seconds)
---------------------------------------------------------------------------
+ 1 host(s) tested
```

### wafw00f

```text
$ wafw00f http://127.0.0.1:3000

                [1;97m______
               [1;97m/      \
              [1;97m(  W00f! )
               [1;97m\  ____/
               [1;97m,,    [1;92m__            [1;93m404 Hack Not Found
           [1;96m|`-.__   [1;92m/ /                     [1;91m __     __
           [1;96m/"  _/  [1;92m/_/                       [1;91m\ \   / /
          [1;94m*===*    [1;92m/                          [1;91m\ \_/ /  [1;93m405 Not Allowed
         [1;96m/     )__//                           [1;91m\   /
    [1;96m/|  /     /---`                        [1;93m403 Forbidden
    [1;96m\\/`   \ |                                 [1;91m/ _ \
    [1;96m`\    /_\\_              [1;93m502 Bad Gateway  [1;91m/ / \ \  [1;93m500 Internal Error
      [1;96m`_____``-`                             [1;91m/_/   \_\\

                        [1;96m~ WAFW00F : [1;94mv2.4.2 ~[1;97m
        The Web Application Firewall Fingerprinting Toolkit
    [0m
[*] Checking http://127.0.0.1:3000
[+] Generic Detection results:
[-] No WAF detected by the generic detection
[~] Number of requests: 7
```
