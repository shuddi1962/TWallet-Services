# Admin Reports

## Report Catalog

| Report | Description | Filters | Export |
|--------|-------------|---------|--------|
| User Growth | New users over time | Date range, country, wallet type | CSV, Excel |
| Order Summary | Orders by status, date, type | Date range, status, card type | CSV, Excel, PDF |
| Payment Summary | Payments by status, token, network | Date range, status, token, network | CSV, Excel |
| Wallet Statistics | Wallet connections by type, network | Date range, wallet type | CSV |
| Support Statistics | Tickets by category, status, agent | Date range, category, status | CSV, Excel |
| Activity Logs | All analytics events | Date range, event name, user ID | CSV |
| Revenue Report | Revenue by token, network, time | Date range, token, network | CSV, Excel, PDF |
| Customer List | All users with activity summary | Filters, search | CSV |

## Report Implementation

### Report Generator Pattern

```typescript
// src/lib/reports/generate-report.ts
export interface ReportConfig {
  name: string;
  sql: string;
  params: Record<string, unknown>;
  format: 'csv' | 'xlsx' | 'pdf';
}

export async function generateReport(config: ReportConfig): Promise<Buffer> {
  const { db } = await getServiceRoleClient();
  const rows = await db.unsafe(config.sql, config.params);

  switch (config.format) {
    case 'csv':
      return generateCsv(rows);
    case 'xlsx':
      return generateXlsx(rows);
    case 'pdf':
      return generatePdf(rows, config.name);
  }
}
```

### Admin Report Page

```typescript
// src/app/admin/reports/page.tsx
export default async function AdminReportsPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Reports</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ReportCard
          title="User Growth"
          description="New user registrations over time"
          icon={<Users />}
          href="/admin/reports/user-growth"
          formats={['csv', 'xlsx']}
        />
        <ReportCard
          title="Order Summary"
          description="Orders by status and date"
          icon={<ShoppingCart />}
          href="/admin/reports/orders"
          formats={['csv', 'xlsx', 'pdf']}
        />
        {/* ... */}
      </div>
    </div>
  );
}
```

### Scheduled Report Delivery

```sql
-- pg_cron schedule for daily report generation
SELECT cron.schedule(
  'daily-payment-reconciliation',
  '0 6 * * *',
  $$
  SELECT generate_and_email_report(
    'payment_reconciliation',
    (SELECT ... FROM ...),
    'finance@twallet.app'
  );
  $$
);
```
