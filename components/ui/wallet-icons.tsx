export function TrustWalletIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="10" fill="#0500FF" />
      <path d="M20 4L4 12v12c0 9.9 6.4 19.1 16 22 9.6-2.9 16-12.1 16-22V12L20 4z" fill="white" opacity="0.95" />
    </svg>
  );
}

export function WalletConnectIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="10" fill="#3396FF" />
      <path d="M14.4 16.1c2.9-2.9 7.6-2.9 10.5 0l.4.4c.1.1.1.3 0 .4l-1.4 1.4c-.1.1-.3.1-.4 0l-.5-.5c-2-2-5.3-2-7.3 0l-.5.5c-.1.1-.3.1-.4 0l-1.4-1.4c-.1-.1-.1-.3 0-.4l1-.9zm13 2.5l1.2 1.2c.1.1.1.3 0 .4l-5.4 5.4c-.1.1-.3.1-.4 0l-3.8-3.8c0-.1-.1-.1-.2 0l-3.8 3.8c-.1.1-.3.1-.4 0l-5.4-5.4c-.1-.1-.1-.3 0-.4l1.2-1.2c.1-.1.3-.1.4 0l3.8 3.8c0 .1.1.1.2 0l3.8-3.8c.1-.1.3-.1.4 0l3.8 3.8c0 .1.1.1.2 0l3.8-3.8c.1-.1.3-.1.4 0z" fill="white" />
    </svg>
  );
}
