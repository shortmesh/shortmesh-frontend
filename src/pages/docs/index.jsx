import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Divider, Chip, Alert, Paper, List, ListItem, ListItemText, Tabs, Tab, IconButton, Tooltip } from '@mui/material';
import Grid from '@mui/material/Grid2';
import {
  CheckCircleOutlined,
  CopyOutlined,
  GithubOutlined,
  ApiOutlined,
  SafetyOutlined,
  DeploymentUnitOutlined,
  ThunderboltOutlined,
  KeyOutlined
} from '@ant-design/icons';
// import Nav from 'components/nav';

// ==============================|| CODE BLOCK COMPONENT ||============================== //

function CodeBlock({ code, language = 'bash' }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <Paper
      variant="outlined"
      sx={{
        position: 'relative',
        backgroundColor: '#0d1117',
        borderColor: '#30363d',
        borderRadius: 2,
        my: 1.5,
        overflow: 'hidden'
      }}
    >
      {language && (
        <Box
          sx={{
            px: 2,
            py: 0.5,
            backgroundColor: '#161b22',
            borderBottom: '1px solid #30363d',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
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
      )}
      <Box
        component="pre"
        sx={{
          m: 0,
          p: 2,
          overflowX: 'auto',
          fontFamily: '"SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace',
          fontSize: '0.85rem',
          lineHeight: 1.6,
          color: '#e6edf3',
          whiteSpace: 'pre'
        }}
      >
        <code>{code}</code>
      </Box>
    </Paper>
  );
}

// ==============================|| SECTION COMPONENT ||============================== //

function Section({ id, children, sx = {} }) {
  return (
    <Box id={id} component="section" sx={{ mb: 6, scrollMarginTop: '80px', ...sx }}>
      {children}
    </Box>
  );
}

function SectionTitle({ children, chip }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2, flexWrap: 'wrap' }}>
      <Typography variant="h4" sx={{ fontWeight: 700 }}>
        {children}
      </Typography>
      {chip && <Chip label={chip} size="small" color="primary" variant="outlined" />}
    </Box>
  );
}

function SubSection({ title, children }) {
  return (
    <Box sx={{ my: 4 }}>
      <Typography variant="h5" sx={{ fontWeight: 600, mb: 1.5, color: 'text.primary' }}>
        {title}
      </Typography>
      {children}
    </Box>
  );
}

function StepLabel({ number, label }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
      <Box
        sx={{
          width: 28,
          height: 28,
          borderRadius: '50%',
          backgroundColor: 'primary.main',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 700,
          fontSize: 13,
          flexShrink: 0
        }}
      >
        {number}
      </Box>
      <Typography variant="body1" sx={{ fontWeight: 500 }}>
        {label}
      </Typography>
    </Box>
  );
}

// ==============================|| TABLE OF CONTENTS ||============================== //

const tocItems = [
  { id: 'overview', label: 'Overview' },
  { id: 'architecture', label: 'Architecture' },
  { id: 'synapse', label: '1. Synapse Homeserver' },
  { id: 'mas', label: '2. MAS (Auth Service)' },
  { id: 'client', label: '3. ShortMesh Client' },
  { id: 'interface-api', label: '4. Interface API' },
  { id: 'authy-api', label: '5. Authy API' },
  { id: 'api-usage', label: 'API Usage' },
  { id: 'production', label: 'Production Notes' }
];

// ==============================|| DOCS PAGE ||============================== //

export default function DocsPage() {
  const [apiTab, setApiTab] = useState(0);
  const [activeId, setActiveId] = useState('overview');
  const observerRef = useRef(null);

  useEffect(() => {
    const headings = tocItems.map(({ id }) => document.getElementById(id)).filter(Boolean);

    observerRef.current = new IntersectionObserver(
      (entries) => {
        // Find the topmost visible section
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        rootMargin: '-80px 0px -40% 0px',
        threshold: 0
      }
    );

    headings.forEach((el) => observerRef.current.observe(el));
    return () => observerRef.current?.disconnect();
  }, []);

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
      {/* <Nav /> */}

      {/* Hero */}
      <Box
        sx={{
          pt: 14,
          pb: 6,
          px: { xs: 3, md: 8 },
          textAlign: 'center',
          background: 'linear-gradient(135deg, #f0f4ff 0%, #ffffff 60%)'
        }}
      >
        <Typography variant="h2" sx={{ fontWeight: 800, mb: 2 }}>
          ShortMesh Setup Guide
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 640, mx: 'auto', fontWeight: 400 }}>
          Everything you need to self-host the full ShortMesh stack.
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 3, flexWrap: 'wrap' }}>
          {[
            { label: 'ShortMesh Client', href: 'https://github.com/shortmesh/Client' },
            { label: 'Interface API', href: 'https://github.com/shortmesh/Interface-API' },
            { label: 'Authy API', href: 'https://github.com/shortmesh/Authy-API' }
          ].map((repo) => (
            <Chip
              key={repo.label}
              icon={<GithubOutlined size="small" />}
              label={repo.label}
              component="a"
              href={repo.href}
              target="_blank"
              rel="noopener noreferrer"
              clickable
              size="small"
            />
          ))}
        </Box>
      </Box>

      <Divider />

      {/* Main content */}
      <Box sx={{ maxWidth: 1200, mx: 'auto', px: { xs: 2, md: 4 }, py: 6 }}>
        <Grid container spacing={4}>
          {/* TOC Sidebar */}
          <Grid size={{ xs: 12, md: 3 }}>
            <Box
              sx={{
                position: { md: 'sticky' },
                top: 80,
                p: 2,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
                backgroundColor: 'background.paper'
              }}
            >
              <Typography variant="overline" sx={{ fontWeight: 700, color: 'text.secondary', letterSpacing: 1 }}>
                Contents
              </Typography>
              <List dense disablePadding sx={{ mt: 1 }}>
                {tocItems.map((item) => {
                  const isActive = activeId === item.id;
                  return (
                    <ListItem key={item.id} disablePadding>
                      <ListItemText
                        primary={
                          <Box
                            component="a"
                            href={`#${item.id}`}
                            sx={{
                              display: 'block',
                              py: 0.5,
                              px: 1,
                              borderRadius: 1,
                              borderLeft: isActive ? '3px solid' : '3px solid transparent',
                              borderColor: isActive ? 'primary.main' : 'transparent',
                              color: isActive ? 'primary.main' : 'text.secondary',
                              fontWeight: isActive ? 600 : 400,
                              textDecoration: 'none',
                              fontSize: '0.875rem',
                              transition: 'all 0.2s ease',
                              '&:hover': { backgroundColor: 'action.hover', color: 'primary.main' }
                            }}
                          >
                            {item.label}
                          </Box>
                        }
                      />
                    </ListItem>
                  );
                })}
              </List>
            </Box>
          </Grid>

          {/* Main Docs */}
          <Grid size={{ xs: 12, md: 9 }}>
            {/* ===== OVERVIEW ===== */}
            <Section id="overview">
              <SectionTitle icon={<DeploymentUnitOutlined />}>Overview</SectionTitle>
              <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.8 }}>
                ShortMesh is a self-hostable platform that lets you send messages across multiple chat platforms (WhatsApp, Signal, etc.)
                via a simple REST API. It is built on top of the{' '}
                <Box component="a" href="https://matrix.org" target="_blank" rel="noopener noreferrer" sx={{ color: 'primary.main' }}>
                  Matrix protocol
                </Box>
                , using bridges to interface with third-party messengers.
              </Typography>
              <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                The full stack consists of four components that work together:
              </Typography>
              <List sx={{ mt: 1 }}>
                {[
                  ['Synapse', 'The Matrix homeserver — the backbone of the messaging infrastructure.'],
                  ['MAS (Matrix Authentication Service)', 'Handles user authentication and OAuth2/OIDC flows for Synapse.'],
                  ['ShortMesh Client', 'A headless Matrix client (Go) that bridges devices and routes messages via RabbitMQ.'],
                  ['Interface API', 'The primary REST API your applications call to manage tokens, link devices, and send messages.'],
                  ['Authy API', 'An OTP microservice for generating, delivering, and verifying one-time passwords via linked devices.']
                ].map(([name, desc]) => (
                  <ListItem key={name} sx={{ py: 0.5, px: 0 }}>
                    <ListItemText
                      primary={
                        <Typography variant="body2">
                          <Box component="span" sx={{ fontWeight: 700 }}>
                            {name}
                          </Box>{' '}
                          — {desc}
                        </Typography>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Section>

            <Divider sx={{ mb: 6 }} />

            {/* ===== ARCHITECTURE ===== */}
            <Section id="architecture">
              <SectionTitle icon={<DeploymentUnitOutlined />}>Architecture</SectionTitle>
              <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.8 }}>
                The diagram below shows how the components interact at a high level:
              </Typography>
              <CodeBlock
                language="text"
                code={`Your App
    │
    │  REST API calls (Bearer token)
    ▼
Interface API  ─────────────────────────────────►  ShortMesh Client
(shortmesh/Interface-API)                          (shortmesh/Client)
    │                                                      │
    │  OTP requests                                        │  Matrix protocol
    ▼                                                      ▼
Authy API                                         Synapse Homeserver
(shortmesh/Authy-API)                             + MAS (Auth Service)
                                                          │
                                            ┌─────────────┴──────────────┐
                                            │                            │
                                      WhatsApp Bridge              Signal Bridge
                                      (mautrix-whatsapp)          (mautrix-signal)
                                            │                            │
                                         WhatsApp                    Signal`}
              />
              <Alert severity="info" sx={{ mt: 2 }}>
                The Interface API communicates with the ShortMesh Client over a RabbitMQ message queue. The Client manages Matrix rooms and
                device sessions on your behalf.
              </Alert>
            </Section>

            <Divider sx={{ mb: 6 }} />

            {/* ===== SYNAPSE ===== */}
            <Section id="synapse">
              <SectionTitle icon={<DeploymentUnitOutlined />} chip="Step 1">
                Synapse Homeserver
              </SectionTitle>
              <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                <Chip
                  icon={<GithubOutlined />}
                  label="element-hq/synapse"
                  component="a"
                  href="https://github.com/element-hq/synapse"
                  target="_blank"
                  rel="noopener noreferrer"
                  clickable
                  size="small"
                />
                <Chip
                  icon={<GithubOutlined />}
                  label="Synapse Docs"
                  component="a"
                  href="https://element-hq.github.io/synapse/latest/"
                  target="_blank"
                  rel="noopener noreferrer"
                  clickable
                  size="small"
                  variant="outlined"
                />
              </Box>
              <Typography variant="body1" sx={{ mb: 1, lineHeight: 1.8 }}>
                <strong>What:</strong> Synapse is the Matrix homeserver — the backbone of ShortMesh's messaging infrastructure.
              </Typography>
              <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.8 }}>
                <strong>Why:</strong> Every message, bridge room, and user session runs through Synapse. It must be running and reachable
                before any other ShortMesh component can work.
              </Typography>

              <SubSection title="Install Synapse">
                <CodeBlock
                  language="bash"
                  code={`# Debian/Ubuntu
sudo apt-get install -y lsb-release wget apt-transport-https
sudo wget -O /usr/share/keyrings/matrix-org-archive-keyring.gpg \\
  https://packages.matrix.org/debian/matrix-org-archive-keyring.gpg
echo "deb [signed-by=/usr/share/keyrings/matrix-org-archive-keyring.gpg] \\
  https://packages.matrix.org/debian/ $(lsb_release -cs) main" | \\
  sudo tee /etc/apt/sources.list.d/matrix-org.list
sudo apt-get update
sudo apt-get install -y matrix-synapse-py3`}
                />
              </SubSection>

              <SubSection title="Generate Configuration">
                <CodeBlock
                  language="bash"
                  code={`sudo python -m synapse.app.homeserver \\
  --server-name matrix.example.com \\
  --config-path /etc/matrix-synapse/homeserver.yaml \\
  --generate-config \\
  --report-stats=no`}
                />
              </SubSection>

              <Alert severity="info" sx={{ mb: 2 }}>
                Put Synapse behind a reverse proxy (Nginx / Caddy) with TLS, and serve a <code>.well-known/matrix/client</code> file so
                clients can discover your homeserver and MAS issuer. See the{' '}
                <Box
                  component="a"
                  href="https://element-hq.github.io/synapse/latest/reverse_proxy.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ color: 'primary.main' }}
                >
                  Synapse reverse proxy docs
                </Box>{' '}
                for configuration details.
              </Alert>
            </Section>

            <Divider sx={{ mb: 6 }} />

            {/* ===== MAS ===== */}
            <Section id="mas">
              <SectionTitle icon={<SafetyOutlined />} chip="Step 2">
                MAS — Matrix Authentication Service
              </SectionTitle>
              <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                <Chip
                  icon={<GithubOutlined />}
                  label="element-hq/matrix-authentication-service"
                  component="a"
                  href="https://github.com/element-hq/matrix-authentication-service"
                  target="_blank"
                  rel="noopener noreferrer"
                  clickable
                  size="small"
                />
              </Box>
              <Typography variant="body1" sx={{ mb: 1, lineHeight: 1.8 }}>
                <strong>What:</strong> MAS is the OAuth2/OIDC authentication layer that sits alongside Synapse.
              </Typography>
              <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.8 }}>
                <strong>Why:</strong> Synapse delegates all user authentication to MAS. The ShortMesh Client uses OAuth2 client credentials
                (issued by MAS) to log in as a Matrix user and manage bridge sessions on your behalf.
              </Typography>
              <Alert severity="info" sx={{ mb: 2 }}>
                Reference setup guide:{' '}
                <Box
                  component="a"
                  href="https://willlewis.co.uk/blog/posts/stronger-matrix-auth-mas-synapse-docker-compose/"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ color: 'primary.main' }}
                >
                  Stronger Matrix Auth with MAS + Synapse
                </Box>
              </Alert>

              <SubSection title="MAS Configuration">
                <Alert severity="info" sx={{ mb: 2 }}>
                  For a full configuration reference, see the{' '}
                  <Box
                    component="a"
                    href="https://element-hq.github.io/matrix-authentication-service/reference/configuration.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ color: 'primary.main' }}
                  >
                    MAS configuration docs
                  </Box>
                  . Key fields to set: <code>http.public_base</code>, <code>matrix.homeserver</code>, <code>matrix.secret</code>, and the{' '}
                  <code>account</code> block.
                </Alert>
              </SubSection>

              <SubSection title="Retrieve MAS Client Credentials">
                <Typography variant="body2" sx={{ mb: 1 }}>
                  After MAS is running, register a client to get the <code>mas_client_id</code> and <code>mas_client_secret</code> needed by
                  the ShortMesh Client:
                </Typography>
                <CodeBlock
                  language="bash"
                  code={`# Register an OAuth2 client in MAS
curl -X POST https://auth.example.com/oauth2/registration \\
  -H "Content-Type: application/json" \\
  -d '{
    "client_name": "ShortMesh Client",
    "redirect_uris": [],
    "grant_types": ["client_credentials"],
    "token_endpoint_auth_method": "client_secret_basic"
  }'
# Save the returned client_id and client_secret`}
                />
              </SubSection>
            </Section>

            <Divider sx={{ mb: 6 }} />

            {/* ===== CLIENT ===== */}
            <Section id="client">
              <SectionTitle icon={<DeploymentUnitOutlined />} chip="Step 3">
                ShortMesh Client
              </SectionTitle>
              <Typography variant="body1" sx={{ mb: 1, lineHeight: 1.8 }}>
                <strong>What:</strong> A headless Go service that connects to your Synapse homeserver and manages Matrix bridge rooms.
              </Typography>
              <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.8 }}>
                <strong>Why:</strong> It acts as the message router — receiving instructions from the Interface API via RabbitMQ and
                translating them into Matrix events that reach WhatsApp, Signal, and other bridged platforms.
              </Typography>
              <Box
                component="a"
                href="https://github.com/shortmesh/Client"
                target="_blank"
                rel="noopener noreferrer"
                sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, color: 'primary.main', mb: 2, textDecoration: 'none' }}
              >
                <GithubOutlined /> github.com/shortmesh/Client
              </Box>

              <SubSection title="Clone & Install">
                <CodeBlock
                  language="bash"
                  code={`git clone https://github.com/shortmesh/Client.git
cd Client
go mod tidy`}
                />
              </SubSection>

              <SubSection title="Configure conf.yaml">
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Copy the example config and fill in your values:
                </Typography>
                <CodeBlock language="bash" code={`cp conf.yaml.example conf.yaml`} />
                <CodeBlock
                  language="yaml"
                  code={`api_version: 1

# Your Synapse homeserver address
homeserver: "https://matrix.example.com"
homeserver_domain: "matrix.example.com"

# MAS OAuth2 credentials (obtained in Step 2)
mas_client_id: "your-mas-client-id"
mas_client_secret: "your-mas-client-secret"

api_authentication_info: "ShortMesh API Authentication v1"

# High-entropy hex-encoded 64-character key (for SQLCipher)
db_key: "your-64-char-hex-key"

server:
  host: "0.0.0.0"
  port: 8080

rabbitmq:
  username: "guest"
  password: "guest"
  port: 5672
  host: "0.0.0.0"
  is_tls: false
  tls:
    crt: ""
    key: ""

bridges:
  - name: wa
    botname: "@whatsappbot:matrix.example.com"
    username_template: "whatsapp_{{.}}"
    display_username_template: "{{.}} (WA)"
    cmd:
      login: "login qr"
      list-logins: "* \`%s\` (+%s) - \`CONNECTED\`"
      # ... (see conf.yaml.example for full bridge config)

  # Uncomment to enable Signal bridge:
  # - signal:
  #     botname: "@signalbot:matrix.example.com"
  #     ...`}
                />
              </SubSection>

              <SubSection title="Generate db_key">
                <CodeBlock
                  language="bash"
                  code={`# Generate a secure 64-character hex key
openssl rand -hex 32`}
                />
              </SubSection>

              <SubSection title="Bridge Setup Note">
                <Alert severity="warning" sx={{ mb: 2 }}>
                  For end-to-end encryption to work correctly, enable self-signing in your bridge config:
                </Alert>
                <CodeBlock
                  language="yaml"
                  code={`# In your bridge config file (e.g. whatsapp-registration.yaml)
encryption:
  self_sign: true`}
                />
              </SubSection>

              <SubSection title="Generate Swagger Docs & Run">
                <CodeBlock
                  language="bash"
                  code={`# Generate API docs
swag init

# Start the client
go run .

# API docs available at:
# http://localhost:8080/docs/index.html`}
                />
              </SubSection>

              <SubSection title="RabbitMQ Message Queue">
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Incoming messages are routed to the queue with the following bindings:
                </Typography>
                <CodeBlock
                  language="text"
                  code={`Exchange:    bridges.topic
Binding key: bridges.topic.add_new_device
Queue name:  <userId>`}
                />
              </SubSection>

              <SubSection title="Systemd Service (Production)">
                <CodeBlock
                  language="bash"
                  code={`# Build the binary
go build -o matrix-client .

# Copy the systemd service file
sudo cp matrix-client.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now matrix-client`}
                />
              </SubSection>
            </Section>

            <Divider sx={{ mb: 6 }} />

            {/* ===== INTERFACE API ===== */}
            <Section id="interface-api">
              <SectionTitle icon={<ApiOutlined />} chip="Step 4">
                Interface API
              </SectionTitle>
              <Typography variant="body1" sx={{ mb: 1, lineHeight: 1.8 }}>
                <strong>What:</strong> The primary REST API your applications call to manage tokens, link messaging devices via QR code, and
                send messages.
              </Typography>
              <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.8 }}>
                <strong>Why:</strong> This is the main entry point for your code into the ShortMesh stack. It abstracts all Matrix protocol
                complexity and communicates with the ShortMesh Client via RabbitMQ.
              </Typography>
              <Box
                component="a"
                href="https://github.com/shortmesh/Interface-API"
                target="_blank"
                rel="noopener noreferrer"
                sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, color: 'primary.main', mb: 2, textDecoration: 'none' }}
              >
                <GithubOutlined /> github.com/shortmesh/Interface-API
              </Box>

              <SubSection title="Quick Start">
                <CodeBlock
                  language="bash"
                  code={`git clone https://github.com/shortmesh/Interface-API.git
cd Interface-API
make setup        # Copies example.env → .env and auto-generates crypto keys
make migrate-up   # Run database migrations
make run          # Start the API server (http://localhost:8080)`}
                />
              </SubSection>

              <SubSection title="Key Environment Variables">
                <Typography variant="body2" sx={{ mb: 1 }}>
                  After <code>make setup</code>, review and update <code>.env</code>. Key variables:
                </Typography>
                <CodeBlock
                  language="env"
                  code={`APP_MODE=development        # 'production' enforces HTTPS
HOST=127.0.0.1
PORT=8080

# Auto-generated by 'make setup' — do NOT change after initial setup
HASH_KEY=                   # openssl rand -base64 32
DB_ENCRYPTION_KEY=          # openssl rand -hex 32
CLIENT_ID=                  # openssl rand -hex 16
CLIENT_SECRET=              # openssl rand -hex 32

# MAS (from Step 2)
MAS_URL=https://auth.example.com
MAS_ADMIN_URL=http://localhost:8081
ADMIN_CLIENT_ID=your-admin-client-id
ADMIN_CLIENT_SECRET=your-admin-client-secret

# ShortMesh Client URL (from Step 3)
MATRIX_CLIENT_URL=http://localhost:8080

# RabbitMQ — must match the Client's config
RABBITMQ_URL=amqp://guest:guest@localhost:5672/`}
                />
              </SubSection>

              <SubSection title="Makefile Commands">
                <CodeBlock
                  language="bash"
                  code={`make setup           # Setup .env with auto-generated keys
make run             # Start API server
make worker          # Start message worker (separate process)
make build           # Build binaries
make test            # Run tests
make docs            # Regenerate Swagger docs

# Database migrations
make migrate-up      # Run pending migrations
make migrate-down    # Rollback last migration
make migrate-status  # Show migration status`}
                />
              </SubSection>

              <SubSection title="Swagger API Docs">
                <CodeBlock
                  language="bash"
                  code={`# Generate and serve Swagger UI
make docs
# Then open: http://localhost:8080/docs/index.html`}
                />
              </SubSection>
            </Section>

            <Divider sx={{ mb: 6 }} />

            {/* ===== AUTHY API ===== */}
            <Section id="authy-api">
              <SectionTitle icon={<KeyOutlined />} chip="Step 5">
                Authy API
              </SectionTitle>
              <Typography variant="body1" sx={{ mb: 1, lineHeight: 1.8 }}>
                <strong>What:</strong> A standalone OTP microservice for generating, delivering, and verifying one-time passwords.
              </Typography>
              <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.8 }}>
                <strong>Why:</strong> Instead of SMS or email, Authy delivers OTPs through linked messaging platforms (e.g., WhatsApp) via
                the Interface API — giving you a phone-based 2FA flow with no carrier dependency.
              </Typography>
              <Box
                component="a"
                href="https://github.com/shortmesh/Authy-API"
                target="_blank"
                rel="noopener noreferrer"
                sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, color: 'primary.main', mb: 2, textDecoration: 'none' }}
              >
                <GithubOutlined /> github.com/shortmesh/Authy-API
              </Box>

              <SubSection title="Quick Start">
                <CodeBlock
                  language="bash"
                  code={`git clone https://github.com/shortmesh/Authy-API.git
cd Authy-API
make setup        # Auto-generates .env with crypto keys
make migrate-up   # Run database migrations
make run          # Start the OTP server (http://localhost:8080)`}
                />
              </SubSection>

              <SubSection title="Key Environment Variables">
                <CodeBlock
                  language="env"
                  code={`APP_MODE=development        # 'production' enforces HTTPS
HOST=127.0.0.1
PORT=8080

# Auto-generated by 'make setup' — do NOT change after initial setup
HASH_KEY=                   # openssl rand -base64 32
DB_ENCRYPTION_KEY=          # openssl rand -hex 32

# Interface API connection (REQUIRED — from Step 4)
INTERFACE_API_URL=http://localhost:8080
INTERFACE_API_TOKEN=mt_xxxxx  # A Matrix token from the Interface API`}
                />
              </SubSection>

              <Alert severity="info" sx={{ mb: 2 }}>
                The <code>INTERFACE_API_TOKEN</code> is a Matrix token (<code>mt_xxxxx</code>) obtained from the Interface API. Create one
                with <code>use_host: true</code> to share the admin device, or <code>use_host: false</code> to provision a dedicated Authy
                device.
              </Alert>

              <SubSection title="Makefile Commands">
                <CodeBlock
                  language="bash"
                  code={`make setup           # Setup .env with auto-generated keys
make run             # Start OTP server
make build           # Build binary
make test            # Run tests
make docs            # Regenerate Swagger docs

# Database migrations
make migrate-up      # Run pending migrations
make migrate-down    # Rollback last migration
make migrate-status  # Show migration status`}
                />
              </SubSection>
            </Section>

            <Divider sx={{ mb: 6 }} />

            {/* ===== API USAGE ===== */}
            <Section id="api-usage">
              <SectionTitle icon={<ThunderboltOutlined />}>API Usage</SectionTitle>

              {/* Interface API Usage */}
              <SubSection title="Interface API">
                <Typography variant="body2" sx={{ mb: 2 }}>
                  Base URL: <code>http://localhost:8080</code> &nbsp;·&nbsp; Auth: Basic Auth (<code>CLIENT_ID:CLIENT_SECRET</code>) or
                  Bearer token
                </Typography>

                <Tabs value={apiTab} onChange={(_, v) => setApiTab(v)} sx={{ mb: 2 }} variant="scrollable" scrollButtons="auto">
                  <Tab label="Create Token" />
                  <Tab label="Add Device" />
                  <Tab label="List Devices" />
                  <Tab label="Send Message" />
                  <Tab label="Delete Device" />
                </Tabs>

                {apiTab === 0 && (
                  <>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      The first token created is automatically an admin and establishes the host Matrix identity.
                    </Typography>
                    <CodeBlock
                      language="bash"
                      code={`# Create admin / first token (use_host: false — new Matrix user)
curl -X POST http://localhost:8080/api/v1/tokens \\
  -u "$CLIENT_ID:$CLIENT_SECRET" \\
  -H "Content-Type: application/json" \\
  -d '{"use_host": false}'

# Response:
# {
#   "message": "Matrix token created successfully",
#   "token": "mt_abc123..."
# }

# Create a token that shares the admin's devices (use_host: true)
curl -X POST http://localhost:8080/api/v1/tokens \\
  -u "$CLIENT_ID:$CLIENT_SECRET" \\
  -H "Content-Type: application/json" \\
  -d '{"use_host": true}'

# Create a token with an expiry date
curl -X POST http://localhost:8080/api/v1/tokens \\
  -u "$CLIENT_ID:$CLIENT_SECRET" \\
  -H "Content-Type: application/json" \\
  -d '{"use_host": false, "expires_at": "2026-12-31T23:59:59Z"}'`}
                    />
                  </>
                )}

                {apiTab === 1 && (
                  <>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      Request device addition — returns a WebSocket URL to receive the QR code.
                    </Typography>
                    <CodeBlock
                      language="bash"
                      code={`TOKEN="mt_abc123..."

# Step 1: Initiate device add
curl -X POST http://localhost:8080/api/v1/devices \\
  -H "Authorization: Bearer $TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{"platform": "wa"}'

# Response:
# {
#   "message": "Scan the QR code to link your device",
#   "qr_code_url": "ws://localhost:8080/api/v1/devices/qr-code?token=mt_abc123..."
# }

# Step 2: Connect to WebSocket to receive the QR code
websocat "ws://localhost:8080/api/v1/devices/qr-code?token=$TOKEN"
# Scan the printed QR code in your WhatsApp (or Signal) app`}
                    />
                  </>
                )}

                {apiTab === 2 && (
                  <CodeBlock
                    language="bash"
                    code={`TOKEN="mt_abc123..."

curl -X GET http://localhost:8080/api/v1/devices \\
  -H "Authorization: Bearer $TOKEN"

# Response:
# [
#   {
#     "platform": "wa",
#     "device_id": "237123456789"
#   }
# ]`}
                  />
                )}

                {apiTab === 3 && (
                  <CodeBlock
                    language="bash"
                    code={`TOKEN="mt_abc123..."

curl -X POST http://localhost:8080/api/v1/devices/237123456789/message \\
  -H "Authorization: Bearer $TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "contact": "1234567890",
    "platform": "wa",
    "text": "Hello from ShortMesh!"
  }'`}
                  />
                )}

                {apiTab === 4 && (
                  <CodeBlock
                    language="bash"
                    code={`TOKEN="mt_abc123..."

curl -X DELETE http://localhost:8080/api/v1/devices \\
  -H "Authorization: Bearer $TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "device_id": "237123456789",
    "platform": "wa"
  }'`}
                  />
                )}
              </SubSection>

              {/* Authy API Usage */}
              <SubSection title="Authy API">
                <Typography variant="body2" sx={{ mb: 2 }}>
                  Base URL: <code>http://localhost:8080</code> &nbsp;·&nbsp; No auth header required for OTP endpoints (token is configured
                  server-side via <code>INTERFACE_API_TOKEN</code>)
                </Typography>

                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                  1. List Available Platforms
                </Typography>
                <CodeBlock
                  language="bash"
                  code={`curl -X GET http://localhost:8080/api/v1/platforms

# Response:
# [
#   {
#     "platform": "wa",
#     "device_id": "+237123456789"
#   }
# ]`}
                />

                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, mt: 2 }}>
                  2. Generate & Send OTP
                </Typography>
                <CodeBlock
                  language="bash"
                  code={`curl -X POST http://localhost:8080/api/v1/otp/generate \\
  -H "Content-Type: application/json" \\
  -d '{
    "phone_number": "+237123456780",
    "platform": "wa",
    "device_id": "+237123456789"
  }'

# Response:
# {
#   "message": "OTP sent successfully",
#   "expires_at": "2026-03-17T11:35:00Z"
# }`}
                />

                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, mt: 2 }}>
                  3. Verify OTP
                </Typography>
                <CodeBlock
                  language="bash"
                  code={`curl -X POST http://localhost:8080/api/v1/otp/verify \\
  -H "Content-Type: application/json" \\
  -d '{
    "phone_number": "+237123456780",
    "platform": "wa",
    "device_id": "+237123456789",
    "code": "123456"
  }'

# Response:
# {
#   "message": "OTP verified successfully"
# }`}
                />

                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, mt: 2 }}>
                  Error Responses
                </Typography>
                <CodeBlock
                  language="json"
                  code={`// 400 — Bad Request
{ "error": "Missing required field: phone_number" }

// 401 — Invalid/Expired OTP
{ "error": "Invalid or expired OTP" }

// 429 — Too Many Requests
{ "error": "Too many attempts, please request a new code" }`}
                />
              </SubSection>
            </Section>

            <Divider sx={{ mb: 6 }} />

            {/* ===== PRODUCTION NOTES ===== */}
            <Section id="production">
              <SectionTitle icon={<SafetyOutlined />}>Production Notes</SectionTitle>

              <SubSection title="Enable Database Encryption (SQLCipher)">
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Both Interface API and Authy API support AES-256 database encryption via SQLCipher:
                </Typography>
                <CodeBlock
                  language="env"
                  code={`# In .env for Interface API or Authy API:
DISABLE_DB_ENCRYPTION=false
DB_ENCRYPTION_KEY=   # openssl rand -hex 32

# Build / run commands automatically use SQLCipher when this is set`}
                />
                <Alert severity="warning" sx={{ mt: 1 }}>
                  Do <strong>not</strong> change <code>DB_ENCRYPTION_KEY</code> after initial setup — this will make existing data
                  unreadable.
                </Alert>
              </SubSection>

              <SubSection title="HTTPS / TLS">
                <CodeBlock
                  language="env"
                  code={`# Direct TLS termination
APP_MODE=production
TLS_CERT_FILE=/etc/letsencrypt/live/api.example.com/fullchain.pem
TLS_KEY_FILE=/etc/letsencrypt/live/api.example.com/privkey.pem

# OR: Behind a reverse proxy (Nginx / Caddy handles TLS)
APP_MODE=production
ALLOW_INSECURE_SERVER=true    # Allow HTTP from proxy → API
ALLOW_INSECURE_EXTERNAL=true  # Allow HTTP for internal services`}
                />
              </SubSection>

              <SubSection title="Disable Auto-Migrations">
                <CodeBlock
                  language="env"
                  code={`# .env — always set to false in production
AUTO_MIGRATE=false

# Run migrations explicitly before deploying
make migrate-up`}
                />
              </SubSection>

              <SubSection title="Generating Secure Keys">
                <CodeBlock
                  language="bash"
                  code={`# HASH_KEY — 32-byte base64
openssl rand -base64 32

# DB_ENCRYPTION_KEY — 32-byte hex (64 chars)
openssl rand -hex 32

# CLIENT_ID — 16-byte hex
openssl rand -hex 16

# CLIENT_SECRET — 32-byte hex
openssl rand -hex 32

# db_key (Client conf.yaml) — 64-char hex
openssl rand -hex 32`}
                />
              </SubSection>

              <SubSection title="Startup Order">
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Start services in this order to avoid dependency failures:
                </Typography>
                <List dense>
                  {[
                    'PostgreSQL / SQLite (database)',
                    'RabbitMQ',
                    'Synapse homeserver',
                    'MAS (Matrix Authentication Service)',
                    'Matrix bridges (mautrix-whatsapp, etc.)',
                    'ShortMesh Client',
                    'Interface API + worker',
                    'Authy API'
                  ].map((item, i) => (
                    <ListItem key={item} sx={{ py: 0.25, px: 0 }}>
                      <ListItemText
                        primary={
                          <Typography variant="body2">
                            <Box component="span" sx={{ fontWeight: 700, mr: 1, color: 'primary.main' }}>
                              {i + 1}.
                            </Box>
                            {item}
                          </Typography>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </SubSection>
            </Section>
          </Grid>
        </Grid>
      </Box>

      {/* Footer */}
      <Box component="footer" sx={{ py: 4, px: 2, textAlign: 'center' }}>
        <Divider sx={{ mb: 3 }} />
        <Typography variant="body2" color="text.secondary">
          &copy; {new Date().getFullYear()} Afkanerd. All rights reserved. &nbsp;·&nbsp;{' '}
          <Box component="a" href="mailto:developers@smswithoutborders.com" sx={{ color: 'primary.main', textDecoration: 'none' }}>
            developers@smswithoutborders.com
          </Box>
        </Typography>
      </Box>
    </Box>
  );
}
