# Wallet Card (UI-027)

Displays wallet connection state and details.

## States

### Disconnected
- Wallet icon + "No wallet connected" message
- "Connect Wallet" CTA button

### Connected
- Gradient blue card
- Network name + icon
- Connected badge
- USDC balance
- Shortened address (tooltip on hover)
- Copy address button
- Explorer link button
- Disconnect button
- "Connected via {provider}" label

## Props

| Prop | Type |
|------|------|
| provider | `string` |
| address | `string` |
| network | `string` |
| isConnected | `boolean` |
| balance | `string` |
| onConnect | `() => void` |
| onDisconnect | `() => void` |
| onCopy | `() => void` |
| onExplorer | `() => void` |

## Implementation

`src/components/ui/wallet/wallet-card.tsx`
