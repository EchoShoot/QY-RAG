import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { PageHeader } from '@/components/page-header';
import { useNavigate } from 'react-router';

export function UserSettingBreadcrumb({ label }: { label: string }) {
  const navigate = useNavigate();
  return (
    <PageHeader>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <span
              className="cursor-pointer text-sm text-muted-foreground hover:text-foreground"
              onClick={() => navigate('/')}
            >
              设置
            </span>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{label}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </PageHeader>
  );
}
