# Navigation Components

> **Sidebar, Breadcrumb, Pagination**

## Sidebar

```ts
interface SidebarProps {
  items: NavItem[];
  collapsed: boolean;
  onToggle: () => void;
  role?: AdminRole;
}
```

## Breadcrumb

```ts
interface BreadcrumbProps {
  items: { label: string; href?: string }[];
}
```

## Pagination

```ts
interface PaginationProps {
  page: number;
  pageSize: number;
  totalCount: number;
  onPageChange: (page: number) => void;
}
```
