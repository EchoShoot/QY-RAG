import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { PageHeader } from '@/components/page-header';
import { useNavigatePage } from '@/hooks/logic-hooks/navigate-hooks';
import Spotlight from '@/components/spotlight';
import { Outlet } from 'react-router';
import { SideBar } from './sidebar';
import { useFetchMemoryBaseConfiguration } from './hooks/use-memory-setting';

export default function MemoryWrapper() {
  const { data } = useFetchMemoryBaseConfiguration();
  const { navigateToMemoryList } = useNavigatePage();

  return (
    <section className="flex h-full flex-col w-full bg-app-page">
      <PageHeader>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <span
                className="cursor-pointer text-sm text-text-secondary hover:text-text-primary"
                onClick={() => navigateToMemoryList({})}
              >
                记忆
              </span>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{data.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </PageHeader>
      <div className="flex flex-1 min-h-0 gap-3 px-3 pb-3">
        <SideBar></SideBar>
        <div className="relative flex-1 overflow-auto bg-bg-base rounded-3xl p-5">
          <Spotlight />
          <Outlet />
        </div>
      </div>
    </section>
  );
}
