import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { useNavigate } from 'react-router';
import { useSelectBreadcrumbItems } from './use-navigate-to-folder';

export function FileBreadcrumb() {
  const breadcrumbItems = useSelectBreadcrumbItems();
  const navigate = useNavigate();
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbItems.map((x, idx) => (
          <div key={x.path} className="flex items-center gap-2">
            {idx !== 0 && <BreadcrumbSeparator />}
            <BreadcrumbItem
              key={x.path}
              onClick={() => navigate(x.path)}
              className="cursor-pointer"
            >
              {idx === breadcrumbItems.length - 1 ? (
                <BreadcrumbPage>{x.title}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink>{x.title}</BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </div>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
