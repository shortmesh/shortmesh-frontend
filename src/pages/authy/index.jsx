import { useState, useEffect } from 'react';
import axios from 'axios';

// material-ui
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid2';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

// ant-design icons
import {
  AndroidOutlined,
  ApiOutlined,
  CheckCircleOutlined,
  CloseOutlined,
  CodeOutlined,
  CopyOutlined,
  GlobalOutlined,
  KeyOutlined,
  LockOutlined,
  RocketOutlined,
  SafetyCertificateOutlined,
  ThunderboltOutlined
} from '@ant-design/icons';

// api
import { subscribeToService, getUserSubscriptions } from '../../api/services';

// ==============================|| SYNTAX TOKENIZER ||============================== //

const TOKEN_COLORS = {
  comment: '#8b949e',
  string: '#a5d6ff',
  keyword: '#ff7b72',
  number: '#79c0ff',
  tag: '#7ee787',
  attr: '#ffa657',
  builtin: '#d2a8ff'
};

const RULES = {
  html: [
    { name: 'comment', re: /<!--[\s\S]*?-->/ },
    { name: 'tag', re: /<\/?[a-zA-Z][^>]*>/ },
    { name: 'string', re: /"[^"]*"|'[^']*'/ }
  ],
  kotlin: [
    { name: 'comment', re: /\/\/[^\n]*/ },
    { name: 'string', re: /"(?:[^"\\]|\\.)*"/ },
    { name: 'builtin', re: /\b(?:ShortMeshWidget|ShortMeshEndpoints|Toast|Log|Button|Text)\b/ },
    {
      name: 'keyword',
      re: /\b(?:import|fun|val|var|class|object|override|companion|return|if|else|this|true|false|null|include|implementation|dependencies|plugins|android)\b/
    },
    { name: 'number', re: /\b\d+\b/ }
  ],
  bash: [
    { name: 'comment', re: /#[^\n]*/ },
    { name: 'string', re: /"(?:[^"\\]|\\.)*"|'[^']*'/ },
    { name: 'builtin', re: /\b(?:git|make|cd|curl|cp|openssl)\b/ },
    { name: 'number', re: /\b\d+\b/ }
  ],
  xml: [
    { name: 'comment', re: /<!--[\s\S]*?-->/ },
    { name: 'tag', re: /<\/?[a-zA-Z][^>]*>/ },
    { name: 'attr', re: /\b[a-zA-Z_:][a-zA-Z0-9_:.-]*(?==)/ },
    { name: 'string', re: /"[^"]*"|'[^']*'/ }
  ]
};

// default JS/JSON rules
const JS_RULES = [
  { name: 'comment', re: /\/\/[^\n]*/ },
  { name: 'string', re: /"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`/ },
  { name: 'builtin', re: /\b(?:console|document|ShortMeshWidget|navigator|window|alert)\b/ },
  {
    name: 'keyword',
    re: /\b(?:import|export|from|const|let|var|function|return|if|else|new|await|async|true|false|null|undefined|this|class|extends|of|for|while|do|switch|case|break|continue|typeof|instanceof)\b/
  },
  { name: 'number', re: /\b\d+\.?\d*\b/ }
];

function tokenize(code, lang) {
  const rules = RULES[lang] || JS_RULES;
  const result = [];
  let remaining = code;
  let key = 0;

  while (remaining.length > 0) {
    let earliest = null;
    let matchedRule = null;

    for (const rule of rules) {
      const m = rule.re.exec(remaining);
      if (m && (earliest === null || m.index < earliest.index)) {
        earliest = m;
        matchedRule = rule;
      }
    }

    if (!earliest) {
      result.push(<span key={key++}>{remaining}</span>);
      break;
    }

    if (earliest.index > 0) {
      result.push(<span key={key++}>{remaining.slice(0, earliest.index)}</span>);
    }

    result.push(
      <span key={key++} style={{ color: TOKEN_COLORS[matchedRule.name] }}>
        {earliest[0]}
      </span>
    );

    remaining = remaining.slice(earliest.index + earliest[0].length);
  }

  return result;
}

// ==============================|| CODE BLOCK ||============================== //

function CodeBlock({ code, language = 'js' }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <Box sx={{ position: 'relative', mt: 1 }}>
      <Paper
        variant="outlined"
        sx={{
          bgcolor: '#0d1117',
          borderColor: '#30363d',
          borderRadius: 2,
          overflow: 'auto'
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 2,
            py: 1,
            borderBottom: '1px solid #21262d'
          }}
        >
          <Typography variant="caption" sx={{ color: '#8b949e', fontFamily: 'monospace' }}>
            {language}
          </Typography>
          <Tooltip title={copied ? 'Copied!' : 'Copy'}>
            <IconButton size="small" onClick={handleCopy} sx={{ color: copied ? '#3fb950' : '#8b949e' }}>
              {copied ? <CheckCircleOutlined style={{ fontSize: 14 }} /> : <CopyOutlined style={{ fontSize: 14 }} />}
            </IconButton>
          </Tooltip>
        </Box>
        <Box
          component="pre"
          sx={{
            m: 0,
            p: 2,
            overflow: 'auto',
            fontSize: '0.8rem',
            lineHeight: 1.7,
            color: '#e6edf3',
            fontFamily: '"Fira Code", "Cascadia Code", monospace'
          }}
        >
          <code>{tokenize(code, language)}</code>
        </Box>
      </Paper>
    </Box>
  );
}

// ==============================|| SECTION HEADING ||============================== //

function SectionHeading({ icon, title, description }) {
  return (
    <Stack spacing={0.75} sx={{ mb: 2.5 }}>
      <Stack direction="row" alignItems="center" spacing={1.25}>
        <Typography variant="h5" fontWeight={600}>
          {title}
        </Typography>
      </Stack>
      {description && (
        <Typography variant="body2" color="text.secondary" sx={{ pl: 0.5 }}>
          {description}
        </Typography>
      )}
    </Stack>
  );
}

// ==============================|| COMING SOON DIALOG ||============================== //

function ComingSoonDialog({ open, onClose }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
      <DialogContent sx={{ p: 4, textAlign: 'center' }}>
        <IconButton onClick={onClose} sx={{ position: 'absolute', top: 12, right: 12, color: 'text.secondary' }}>
          <CloseOutlined />
        </IconButton>
        <Box
          sx={{
            width: 72,
            height: 72,
            borderRadius: '50%',
            bgcolor: 'primary.lighter',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            mb: 2.5
          }}
        >
          <RocketOutlined style={{ fontSize: 32, color: '#1890ff' }} />
        </Box>
        <Chip label="Coming Soon" color="primary" size="small" sx={{ mb: 2 }} />
        <Typography variant="h5" fontWeight={700} gutterBottom>
          Authy Authentication
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.75 }}>
          One-click OTP authentication via WhatsApp is on its way. You&apos;ll be able to trigger the Authy widget directly from this
          dashboard to verify users in seconds.
        </Typography>
        <Button variant="contained" onClick={onClose} sx={{ mt: 3, borderRadius: 2, px: 4 }}>
          Got it
        </Button>
      </DialogContent>
    </Dialog>
  );
}

// ==============================|| WEB WIDGET TAB ||============================== //

const webCdnSnippet = `<!-- 1. Include the widget script -->
<script src="https://shortmesh.com/widget.js"></script>

<!-- 2. Add a trigger button -->
<button id="verify-btn">Verify with ShortMesh</button>

<!-- 3. Initialise -->
<script>
  document.getElementById('verify-btn').addEventListener('click', function () {
    ShortMeshWidget.open({
      identifier: '+1234567890',   // the phone number to verify
      endpoints: {
        platforms: 'https://yourapi.com/api/v1/platforms',
        sendOtp:   'https://yourapi.com/api/v1/otp/generate',
        verifyOtp: 'https://yourapi.com/api/v1/otp/verify',
      },
      onSuccess: (data) => {
        console.log('Verified!', data);
        // redirect or update UI here
      },
      onError: (err) => {
        console.error('Verification failed:', err);
      },
    });
  });
</script>`;

const webReactSnippet = `import { useEffect, useState } from 'react';

const WIDGET_URL = 'https://shortmesh.com/widget.js';

export default function VerifyButton({ phoneNumber }) {
  const [ready, setReady] = useState(false);

  // Dynamically inject the widget script once on mount.
  // It attaches ShortMeshWidget to window when loaded.
  useEffect(() => {
    if (window.ShortMeshWidget) { setReady(true); return; }

    const script = document.createElement('script');
    script.src = WIDGET_URL;
    script.async = true;
    script.onload = () => setReady(true);
    document.body.appendChild(script);

    return () => { document.body.removeChild(script); };
  }, []);

  const handleVerify = () => {
    // window.ShortMeshWidget is set by the script above
    window.ShortMeshWidget.open({
      identifier: phoneNumber,      // e.g. '+1234567890'
      endpoints: {
        platforms: '/api/v1/platforms',
        sendOtp:   '/api/v1/otp/generate',
        verifyOtp: '/api/v1/otp/verify',
      },
      onSuccess: (data) => {
        console.log('Verified!', data);
        // navigate('/dashboard') or update your auth state here
      },
      onError: (err) => {
        console.error('Verification failed:', err);
      },
    });
  };

  return (
    <button onClick={handleVerify} disabled={!ready}>
      {ready ? 'Verify with ShortMesh' : 'Loading...'}
    </button>
  );
}`;

const webApiSnippet = `// GET  /api/v1/platforms  →  list available platforms
// Response:
[
  { "platform": "wa" },      // WhatsApp
  { "platform": "telegram" }
]

// POST /api/v1/otp/generate  →  send OTP to user
// Request body:
{ "identifier": "+1234567890", "platform": "wa" }
// Response:
{ "success": true, "expiresIn": 120, "message": "OTP sent successfully" }

// POST /api/v1/otp/verify  →  validate the code
// Request body:
{ "identifier": "+1234567890", "platform": "wa", "code": "123456" }
// Response (any of these fields triggers success):
{ "verified": true, "success": true, "message": "OTP verified successfully" }`;

function WebWidgetTab() {
  const [tab, setTab] = useState(0);
  return (
    <Stack spacing={3.5}>
      <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.8 }}>
        A lightweight, embeddable JavaScript widget. Include one script tag from{' '}
        <Box component="code" sx={{ fontSize: '0.8rem', color: 'primary.main' }}>
          shortmesh.com/widget.js
        </Box>{' '}
        and users can verify via WhatsApp in seconds — works in plain HTML or any JS framework.
      </Typography>

      <Box>
        <Typography variant="subtitle2" fontWeight={600} gutterBottom>
          Usage example
        </Typography>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 1.5, minHeight: 36 }}>
          <Tab label="HTML" sx={{ minHeight: 36, py: 0.5, fontSize: '0.8rem' }} />
          <Tab label="React" sx={{ minHeight: 36, py: 0.5, fontSize: '0.8rem' }} />
        </Tabs>
        {tab === 0 && <CodeBlock code={webCdnSnippet} language="html" />}
        {tab === 1 && <CodeBlock code={webReactSnippet} language="js" />}
      </Box>

      <Box>
        <Typography variant="subtitle2" fontWeight={600} gutterBottom>
          Backend API contract
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          Your backend must expose three endpoints. The widget handles all UI, retries, and error states.
        </Typography>
        <CodeBlock code={webApiSnippet} language="json" />
      </Box>

      <Box>
        <Typography variant="subtitle2" fontWeight={600} gutterBottom>
          Error handling
        </Typography>
        <Stack spacing={1}>
          {[
            ['Network timeout', 'User sees a friendly retry prompt.'],
            ['Wrong OTP', 'Shown inline — user can retry without losing progress.'],
            ['No platforms returned', 'Fatal error screen with a Retry button.'],
            ['HTTP 401 / 403', '"Unauthorized. Check your API credentials."'],
            ['HTTP 5xx', '"Server error. Please try again later."']
          ].map(([scenario, behaviour]) => (
            <Stack key={scenario} direction="row" spacing={1.5} alignItems="flex-start">
              <CheckCircleOutlined style={{ fontSize: 14, color: '#52c41a', marginTop: 4, flexShrink: 0 }} />
              <Typography variant="body2" color="text.secondary">
                <strong>{scenario}</strong> — {behaviour}
              </Typography>
            </Stack>
          ))}
        </Stack>
      </Box>

      {/* <Button
        variant="outlined"
        size="small"
        startIcon={<GlobalOutlined />}
        href="https://github.com/shortmesh/Widgets"
        target="_blank"
        rel="noopener noreferrer"
        sx={{ alignSelf: 'flex-start', borderRadius: 2 }}
      >
        View on GitHub
      </Button> */}
    </Stack>
  );
}

// ==============================|| ANDROID SDK TAB ||============================== //

const androidGradleSnippet = `// settings.gradle.kts — include the module
include(":shortmesh-ui")

// app/build.gradle.kts — add dependency
dependencies {
    implementation(project(":shortmesh-ui"))
}

// Enable core library desugaring (required for API < 26)
android {
    compileOptions {
        isCoreLibraryDesugaringEnabled = true
        sourceCompatibility = JavaVersion.VERSION_11
        targetCompatibility = JavaVersion.VERSION_11
    }
}

dependencies {
    coreLibraryDesugaring("com.android.tools.desugar_jdk_libs:2.1.4")
}`;

const androidManifestSnippet = `<!-- AndroidManifest.xml -->
<uses-permission android:name="android.permission.INTERNET" />`;

const androidKotlinSnippet = `import io.shortmesh.sdk.ShortMeshEndpoints
import io.shortmesh.sdk.ShortMeshWidget

ShortMeshWidget.launch(
    context    = this,
    identifier = "+237650393369",      // phone number to verify
    endpoints  = ShortMeshEndpoints(
        platforms = "https://yourapi.com/api/v1/platforms",
        sendOtp   = "https://yourapi.com/api/v1/otp/generate",
        verifyOtp = "https://yourapi.com/api/v1/otp/verify",
        resendOtp = "https://yourapi.com/api/v1/otp/resend"
    ),
    onSuccess = {
        Toast.makeText(this, "Verified!", Toast.LENGTH_SHORT).show()
    },
    onError = { errorMessage ->
        Log.e("MyApp", "Verification failed: \$errorMessage")
    }
)`;

const androidComposeSnippet = `@Composable
fun MyScreen() {
    val context = LocalContext.current

    Button(onClick = {
        ShortMeshWidget.launch(
            context    = context,
            identifier = "+237650393369",
            endpoints  = ShortMeshEndpoints(
                platforms = "https://yourapi.com/api/v1/platforms",
                sendOtp   = "https://yourapi.com/api/v1/otp/generate",
                verifyOtp = "https://yourapi.com/api/v1/otp/verify",
                resendOtp = "https://yourapi.com/api/v1/otp/resend"
            ),
            onSuccess = { /* proceed to next screen */ },
            onError   = { error -> /* handle */ }
        )
    }) {
        Text("Verify my number")
    }
}`;

function AndroidSdkTab() {
  const [tab, setTab] = useState(0);
  return (
    <Stack spacing={3.5}>
      <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.8 }}>
        A plug-and-play Android library (API 24+, Kotlin 1.9+, Jetpack Compose). Drop it into your project and call one function — the SDK
        handles all UI, loading states, countdown timers, and retries.
      </Typography>

      <Box>
        <Typography variant="subtitle2" fontWeight={600} gutterBottom>
          Requirements
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          {['Android API 24+', 'Kotlin 1.9+', 'Jetpack Compose'].map((req) => (
            <Chip key={req} label={req} size="small" variant="outlined" sx={{ borderRadius: 1.5 }} />
          ))}
        </Stack>
      </Box>

      <Box>
        <Typography variant="subtitle2" fontWeight={600} gutterBottom>
          1 — Gradle setup
        </Typography>
        <CodeBlock code={androidGradleSnippet} language="kotlin" />
      </Box>

      <Box>
        <Typography variant="subtitle2" fontWeight={600} gutterBottom>
          2 — Internet permission
        </Typography>
        <CodeBlock code={androidManifestSnippet} language="xml" />
      </Box>

      <Box>
        <Typography variant="subtitle2" fontWeight={600} gutterBottom>
          3 — Launch the widget
        </Typography>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 1.5, minHeight: 36 }}>
          <Tab label="Activity / Fragment" sx={{ minHeight: 36, py: 0.5, fontSize: '0.8rem' }} />
          <Tab label="Jetpack Compose" sx={{ minHeight: 36, py: 0.5, fontSize: '0.8rem' }} />
        </Tabs>
        {tab === 0 && <CodeBlock code={androidKotlinSnippet} language="kotlin" />}
        {tab === 1 && <CodeBlock code={androidComposeSnippet} language="kotlin" />}
      </Box>

      <Box>
        <Typography variant="subtitle2" fontWeight={600} gutterBottom>
          Screen flow
        </Typography>
        <Stack spacing={1}>
          {[
            ['Loading', 'Spinner while platforms are fetched.'],
            ['Select platform', 'Cards for each platform; user taps one and presses Continue.'],
            ['OTP entry', '6-digit code input, countdown timer, and Resend button.'],
            ['Success', 'Confirmation screen — stays until dismissed.'],
            ['Error', 'Full-screen error with Retry if fatal (e.g. no platforms).']
          ].map(([step, desc], i) => (
            <Stack key={step} direction="row" spacing={1.5} alignItems="flex-start">
              <Box
                sx={{
                  width: 22,
                  height: 22,
                  borderRadius: '50%',
                  bgcolor: 'primary.main',
                  color: '#fff',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  mt: 0.2
                }}
              >
                {i + 1}
              </Box>
              <Typography variant="body2" color="text.secondary">
                <strong>{step}</strong> — {desc}
              </Typography>
            </Stack>
          ))}
        </Stack>
      </Box>

      {/* <Button
        variant="outlined"
        size="small"
        startIcon={<AndroidOutlined />}
        href="https://github.com/shortmesh/Widget-android"
        target="_blank"
        rel="noopener noreferrer"
        sx={{ alignSelf: 'flex-start', borderRadius: 2 }}
      >
        View on GitHub
      </Button> */}
    </Stack>
  );
}

// ==============================|| SELF-HOST API TAB ||============================== //

const apiSetupSnippet = `git clone https://github.com/shortmesh/Authy-API.git
cd Authy-API
make setup        # generates .env with auto-generated keys
make migrate-up   # run database migrations
make run          # start server on http://localhost:8080`;

const apiEnvSnippet = `# .env
ENCRYPTION_KEY=<base64-encoded 32-byte key>   # auto-generated by make setup
HASH_KEY=<base64-encoded 32-byte key>          # auto-generated by make setup

INTERFACE_API_URL=http://localhost:8080        # ShortMesh Interface API URL
INTERFACE_API_KEY=your-interface-api-key

# Generate keys manually:
# openssl rand -base64 32`;

const apiEndpointsSnippet = `# Swagger UI (interactive docs):
http://localhost:8080/docs/index.html

# Regenerate docs:
make docs

# Key endpoints exposed by the Authy API:
GET  /api/v1/platforms       → list available OTP platforms
POST /api/v1/otp/generate    → send OTP to user
POST /api/v1/otp/verify      → verify submitted code
POST /api/v1/otp/resend      → resend OTP (re-uses generate internally)`;

function SelfHostTab() {
  return (
    <Stack spacing={3.5}>
      <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.8 }}>
        The Authy API is a self-hosted Go service that manages OTP generation, delivery via ShortMesh, and verification. Run it alongside
        your existing backend.
      </Typography>

      <Box>
        <Typography variant="subtitle2" fontWeight={600} gutterBottom>
          Requirements
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          {['Go 1.25+', 'SQLite (default) or MySQL', 'ShortMesh API key'].map((req) => (
            <Chip key={req} label={req} size="small" variant="outlined" sx={{ borderRadius: 1.5 }} />
          ))}
        </Stack>
      </Box>

      <Box>
        <Typography variant="subtitle2" fontWeight={600} gutterBottom>
          Quick start
        </Typography>
        <CodeBlock code={apiSetupSnippet} language="bash" />
      </Box>

      <Box>
        <Typography variant="subtitle2" fontWeight={600} gutterBottom>
          Environment variables
        </Typography>
        <CodeBlock code={apiEnvSnippet} language="bash" />
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
          ⚠ In production, set <code>AUTO_MIGRATE=false</code> and run <code>make migrate-up</code> manually.
        </Typography>
      </Box>

      <Box>
        <Typography variant="subtitle2" fontWeight={600} gutterBottom>
          API endpoints &amp; docs
        </Typography>
        <CodeBlock code={apiEndpointsSnippet} language="bash" />
      </Box>

      <Box>
        <Typography variant="subtitle2" fontWeight={600} gutterBottom>
          Useful make commands
        </Typography>
        <Stack spacing={0.75}>
          {[
            ['make setup', 'Setup .env with auto-generated keys'],
            ['make run', 'Start the server'],
            ['make build', 'Build binaries'],
            ['make test', 'Run test suite'],
            ['make docs', 'Regenerate Swagger docs'],
            ['make migrate-up', 'Apply pending migrations'],
            ['make migrate-down', 'Rollback last migration']
          ].map(([cmd, desc]) => (
            <Stack key={cmd} direction="row" spacing={1.5} alignItems="center">
              <Box
                component="code"
                sx={{
                  bgcolor: 'grey.100',
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 1,
                  px: 1,
                  py: 0.25,
                  fontSize: '0.78rem',
                  fontFamily: 'monospace',
                  minWidth: 160,
                  flexShrink: 0
                }}
              >
                {cmd}
              </Box>
              <Typography variant="body2" color="text.secondary">
                {desc}
              </Typography>
            </Stack>
          ))}
        </Stack>
      </Box>

      {/* <Button
        variant="outlined"
        size="small"
        startIcon={<ApiOutlined />}
        href="https://github.com/shortmesh/Authy-API"
        target="_blank"
        rel="noopener noreferrer"
        sx={{ alignSelf: 'flex-start', borderRadius: 2 }}
      >
        View on GitHub
      </Button> */}
    </Stack>
  );
}

// ==============================|| CREDENTIALS DIALOG ||============================== //

function CopyField({ label, value }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <Box>
      <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
        {label}
      </Typography>
      <Stack direction="row" alignItems="center" spacing={1}>
        <Paper variant="outlined" sx={{ flex: 1, px: 1.5, py: 0.75, bgcolor: 'grey.50', borderRadius: 1.5, overflow: 'hidden' }}>
          <Typography component="code" sx={{ fontSize: '0.8rem', fontFamily: 'monospace', color: 'text.primary', wordBreak: 'break-all' }}>
            {value}
          </Typography>
        </Paper>
        <Tooltip title={copied ? 'Copied!' : 'Copy'}>
          <IconButton size="small" onClick={handleCopy} sx={{ color: copied ? 'success.main' : 'text.secondary' }}>
            {copied ? <CheckCircleOutlined style={{ fontSize: 15 }} /> : <CopyOutlined style={{ fontSize: 15 }} />}
          </IconButton>
        </Tooltip>
      </Stack>
    </Box>
  );
}

function CredentialsDialog({ open, onClose, credentials }) {
  if (!credentials) return null;
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
      <DialogTitle sx={{ pb: 0 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Stack direction="row" alignItems="center" spacing={1.25}>
            <KeyOutlined style={{ fontSize: 18, color: '#1890ff' }} />
            <Typography variant="h6" fontWeight={700}>
              Authy Credentials
            </Typography>
          </Stack>
          <IconButton size="small" onClick={onClose}>
            <CloseOutlined />
          </IconButton>
        </Stack>
      </DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        <Alert severity="warning" sx={{ mb: 2.5, borderRadius: 1.5 }}>
          Save these credentials now — the <strong>client secret</strong> will not be shown again.
        </Alert>
        <Stack spacing={2}>
          <CopyField label="Client ID" value={credentials.client_id} />
          <CopyField label="Client Secret" value={credentials.client_secret} />
        </Stack>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2 }}>
          Use these when configuring your Authy API instance or integrating with the ShortMesh widget.
        </Typography>
        <Button variant="contained" fullWidth onClick={onClose} sx={{ mt: 3, borderRadius: 2 }}>
          Done
        </Button>
      </DialogContent>
    </Dialog>
  );
}

// ==============================|| WIDGET PREVIEW (fanned screens) ||============================== //

const screens = [
  { src: '/3.svg', label: 'Verified screen', rotate: '8deg', left: 90, z: 1 },
  { src: '/2.svg', label: 'Enter OTP', rotate: '4deg', left: 45, z: 2 },
  { src: '/1.svg', label: 'Select platform', rotate: '0deg', left: 0, z: 3 }
];

function WidgetPreview() {
  const [hovered, setHovered] = useState(null);

  return (
    <Box
      sx={{
        position: 'relative',
        width: { xs: 320, sm: 420, md: 490 },
        height: { xs: 260, sm: 330, md: 390 },
        flexShrink: 0
      }}
    >
      {screens.map((screen, i) => (
        <Tooltip key={screen.src} title={screen.label} placement="top" arrow>
          <Box
            component="img"
            src={screen.src}
            alt={screen.label}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            sx={{
              position: 'absolute',
              bottom: 0,
              left: screen.left,
              width: { xs: 200, sm: 200, md: 300 },
              height: 'auto',
              borderRadius: 2.5,
              boxShadow: hovered === i ? '0 20px 48px rgba(0,0,0,0.22)' : '0 6px 24px rgba(0,0,0,0.13)',
              transformOrigin: 'bottom center',
              transform:
                hovered === i ? 'translateZ(0) rotate(0deg) translateY(-14px) scale(1.04)' : `translateZ(0) rotate(${screen.rotate})`,
              zIndex: hovered === i ? 10 : screen.z,
              transition: 'all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
              willChange: 'transform',
              backfaceVisibility: 'hidden',
              imageRendering: 'auto',
              cursor: 'default'
            }}
          />
        </Tooltip>
      ))}
    </Box>
  );
}

// ==============================|| MAIN PAGE ||============================== //

export default function Authy() {
  const [docTab, setDocTab] = useState(0);

  // ── subscription state ───────────────────────────────────────────────────
  // subInfo: the authy entry from /services/subscriptions, null = not subscribed
  const [subInfo, setSubInfo] = useState(undefined); // undefined = loading
  const [subLoading, setSubLoading] = useState(true);
  const [subscribing, setSubscribing] = useState(false);
  const [subscribeError, setSubscribeError] = useState('');
  const [credentials, setCredentials] = useState(null);
  const [credDialogOpen, setCredDialogOpen] = useState(false);
  const [secretVisible, setSecretVisible] = useState(false);
  const [copiedField, setCopiedField] = useState('');

  const fetchSubInfo = () => {
    if (!localStorage.getItem('token')) {
      setSubLoading(false);
      return;
    }
    setSubLoading(true);
    getUserSubscriptions()
      .then((list) => setSubInfo((list || []).find((s) => s.name === 'authy') || null))
      .catch(() => setSubInfo(null))
      .finally(() => setSubLoading(false));
  };

  useEffect(() => {
    fetchSubInfo();
  }, []); // runs once on mount

  const handleCopyField = (val, key) => {
    navigator.clipboard.writeText(val);
    setCopiedField(key);
    setTimeout(() => setCopiedField(''), 2000);
  };

  const handleSubscribe = async () => {
    setSubscribing(true);
    setSubscribeError('');
    try {
      const data = await subscribeToService('authy');
      setCredentials(data);
      setCredDialogOpen(true);
      fetchSubInfo();
    } catch (err) {
      const msg = err?.response?.data?.error || err?.response?.data?.message || err?.message || '';
      setSubscribeError(
        msg.toLowerCase().includes('already') ? 'Already subscribed — try refreshing the page.' : 'Subscription failed. Please try again.'
      );
    } finally {
      setSubscribing(false);
    }
  };

  // ── subscription section ─────────────────────────────────────────────────
  const renderSubscriptionSection = () => {
    if (!localStorage.getItem('token')) {
      return (
        <Alert severity="info" sx={{ mb: 4, borderRadius: 2 }}>
          Please log in to manage your Authy subscription.
        </Alert>
      );
    }
    if (subLoading) {
      return (
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 4 }}>
          <CircularProgress size={18} />
          <Typography variant="body2" color="text.secondary">
            Checking subscription…
          </Typography>
        </Stack>
      );
    }

    // ── SUBSCRIBED ──
    if (subInfo) {
      const statusColor = subInfo.is_expired ? 'error' : subInfo.is_enabled ? 'success' : 'warning';
      const statusLabel = subInfo.is_expired ? 'Expired' : subInfo.is_enabled ? 'Active' : 'Disabled';
      return (
        <Paper variant="outlined" sx={{ mb: 4, borderRadius: 2.5, overflow: 'hidden' }}>
          {/* Header */}
          <Box
            sx={{
              px: 2.5,
              py: 2,
              bgcolor: 'grey.50',
              borderBottom: '1px solid',
              borderColor: 'divider',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 1
            }}
          >
            <Stack direction="row" alignItems="center" spacing={1.25}>
              <SafetyCertificateOutlined style={{ fontSize: 18, color: '#1890ff' }} />
              <Typography variant="subtitle1" fontWeight={700}>
                {subInfo.display_name || 'Authy OTP Service'}
              </Typography>
            </Stack>
            <Chip label={statusLabel} color={statusColor} size="small" sx={{ borderRadius: 1 }} />
          </Box>

          {/* Credential rows */}
          <Stack divider={<Divider />} sx={{ px: 2.5, py: 1.5 }}>
            {/* Client ID */}
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ py: 1.25 }}>
              <Typography variant="caption" color="text.secondary" sx={{ minWidth: 110 }}>
                Client ID
              </Typography>
              <Stack direction="row" alignItems="center" spacing={0.5} sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  component="code"
                  variant="body2"
                  sx={{ fontFamily: 'monospace', fontSize: '0.78rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                >
                  {subInfo.client_id}
                </Typography>
                <Tooltip title={copiedField === 'id' ? 'Copied!' : 'Copy'}>
                  <IconButton
                    size="small"
                    onClick={() => handleCopyField(subInfo.client_id, 'id')}
                    sx={{ color: copiedField === 'id' ? 'success.main' : 'text.secondary', flexShrink: 0 }}
                  >
                    {copiedField === 'id' ? <CheckCircleOutlined style={{ fontSize: 13 }} /> : <CopyOutlined style={{ fontSize: 13 }} />}
                  </IconButton>
                </Tooltip>
              </Stack>
            </Stack>

            {/* Client Secret */}
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ py: 1.25 }}>
              <Typography variant="caption" color="text.secondary" sx={{ minWidth: 110 }}>
                Client Secret
              </Typography>
              <Stack direction="row" alignItems="center" spacing={0.5} sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  component="code"
                  variant="body2"
                  sx={{ fontFamily: 'monospace', fontSize: '0.78rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                >
                  {secretVisible ? subInfo.client_secret : '•'.repeat(32)}
                </Typography>
                <Tooltip title={secretVisible ? 'Hide' : 'Reveal'}>
                  <IconButton size="small" onClick={() => setSecretVisible((v) => !v)} sx={{ color: 'text.secondary', flexShrink: 0 }}>
                    <LockOutlined style={{ fontSize: 13 }} />
                  </IconButton>
                </Tooltip>
                <Tooltip title={copiedField === 'secret' ? 'Copied!' : 'Copy'}>
                  <IconButton
                    size="small"
                    onClick={() => handleCopyField(subInfo.client_secret, 'secret')}
                    sx={{ color: copiedField === 'secret' ? 'success.main' : 'text.secondary', flexShrink: 0 }}
                  >
                    {copiedField === 'secret' ? (
                      <CheckCircleOutlined style={{ fontSize: 13 }} />
                    ) : (
                      <CopyOutlined style={{ fontSize: 13 }} />
                    )}
                  </IconButton>
                </Tooltip>
              </Stack>
            </Stack>

            {/* Dates */}
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ py: 1.25 }}>
              {subInfo.created_at && (
                <Stack direction="row" spacing={1}>
                  <Typography variant="caption" color="text.secondary">
                    Subscribed:
                  </Typography>
                  <Typography variant="caption">{new Date(subInfo.created_at).toLocaleDateString()}</Typography>
                </Stack>
              )}
              {subInfo.expires_at && (
                <Stack direction="row" spacing={1}>
                  <Typography variant="caption" color="text.secondary">
                    Expires:
                  </Typography>
                  <Typography variant="caption" color={subInfo.is_expired ? 'error.main' : 'text.primary'}>
                    {new Date(subInfo.expires_at).toLocaleDateString()}
                  </Typography>
                </Stack>
              )}
            </Stack>
          </Stack>
        </Paper>
      );
    }

    // ── NOT SUBSCRIBED ──
    return (
      <Paper
        variant="outlined"
        sx={{
          mb: 4,
          p: 2.5,
          borderRadius: 2.5,
          borderColor: 'primary.light',
          bgcolor: 'primary.lighter',
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'flex-start', sm: 'center' },
          gap: 2
        }}
      >
        <Stack spacing={0.5} sx={{ flex: 1 }}>
          <Typography variant="subtitle2" fontWeight={700}>
            Subscribe to Authy OTP Service
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Subscribe to get auto-generated credentials and enable one-click OTP verification for your users.
          </Typography>
          {subscribeError && (
            <Typography variant="caption" color="error.main" sx={{ mt: 0.5 }}>
              {subscribeError}
            </Typography>
          )}
        </Stack>
        <Button
          variant="contained"
          size="small"
          startIcon={subscribing ? <CircularProgress size={14} color="inherit" /> : <KeyOutlined />}
          disabled={subscribing}
          onClick={handleSubscribe}
          sx={{ borderRadius: 2, px: 3, flexShrink: 0, fontWeight: 600 }}
        >
          {subscribing ? 'Subscribing…' : 'Subscribe'}
        </Button>
      </Paper>
    );
  };

  return (
    <>
      {/* ── Hero ── */}
      <Grid container spacing={4} alignItems="center" sx={{ mb: 6, minHeight: 340 }}>
        {/* Left: text */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Stack spacing={2.5}>
            <Typography variant="h3" fontWeight={700} lineHeight={1.2}>
              Authy
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.85 }}>
              Verify users via WhatsApp OTP — no auth UI to build. Drop in the JavaScript widget or Android SDK, point it at the self-hosted
              Authy API, and users are verified in seconds.
            </Typography>
            <Box>
              {subInfo ? (
                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<CheckCircleOutlined />}
                  disabled
                  sx={{ borderRadius: 2, px: 4, fontWeight: 600 }}
                >
                  Subscribed
                </Button>
              ) : (
                <Button
                  variant="contained"
                  size="large"
                  // startIcon={subscribing ? <CircularProgress size={16} color="inherit" /> : <KeyOutlined />}
                  disabled={subscribing || subLoading}
                  onClick={handleSubscribe}
                  sx={{ borderRadius: 2, px: 4, fontWeight: 600 }}
                >
                  {subscribing ? 'Subscribing…' : 'Subscribe to Authy'}
                </Button>
              )}
            </Box>
          </Stack>
        </Grid>

        {/* Right: overlapping screens */}
        <Grid size={{ xs: 12, md: 5 }} sx={{ display: 'flex', justifyContent: 'center' }}>
          <WidgetPreview />
        </Grid>
      </Grid>

      {/* ── Subscription section ── */}
      {renderSubscriptionSection()}

      {/* ── Integration Guide ── */}
      <Box>
        <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>
          Integration Guide
        </Typography>

        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={docTab} onChange={(_, v) => setDocTab(v)}>
            <Tab label="Web Widget" sx={{ minHeight: 44, gap: 0.75, fontSize: '0.875rem' }} />
            <Tab label="Android SDK" sx={{ minHeight: 44, gap: 0.75, fontSize: '0.875rem' }} />
            <Tab label="Self-host API" sx={{ minHeight: 44, gap: 0.75, fontSize: '0.875rem' }} />
          </Tabs>
        </Box>

        <Box>
          {docTab === 0 && (
            <>
              <SectionHeading
                title="JavaScript Widget"
                description="For web apps — CDN or self-hosted. Supports WhatsApp, more platforms coming soon."
              />
              <WebWidgetTab />
            </>
          )}
          {docTab === 1 && (
            <>
              <SectionHeading
                icon={<AndroidOutlined style={{ fontSize: 16, color: '#52c41a' }} />}
                title="Android SDK"
                description="Drop-in Kotlin library with Jetpack Compose UI. Minimum API 24."
              />
              <AndroidSdkTab />
            </>
          )}
          {docTab === 2 && (
            <>
              <SectionHeading
                icon={<ApiOutlined style={{ fontSize: 16, color: '#722ed1' }} />}
                title="Self-hosted Authy API"
                description="Run the Go-based OTP service on your own infrastructure."
              />
              <SelfHostTab />
            </>
          )}
        </Box>
      </Box>

      {/* ── Footer links ── */}
      <Divider sx={{ my: 4 }} />
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ xs: 'flex-start', sm: 'center' }}>
        <Typography variant="body2" color="text.secondary" sx={{ mr: 'auto' }}>
          Open source — contributions welcome.
        </Typography>
        {[
          { label: 'Authy API', href: 'https://github.com/shortmesh/Authy-API' },
          { label: 'Web Widget', href: 'https://github.com/shortmesh/Widgets' },
          { label: 'Android SDK', href: 'https://github.com/shortmesh/Widget-android' }
        ].map(({ label, href }) => (
          <Button
            key={label}
            size="small"
            variant="text"
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            sx={{ color: 'text.secondary', borderRadius: 1.5 }}
          >
            {label} ↗
          </Button>
        ))}
      </Stack>

      <CredentialsDialog open={credDialogOpen} onClose={() => setCredDialogOpen(false)} credentials={credentials} />
    </>
  );
}
