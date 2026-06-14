import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { useNavigatePage } from '@/hooks/logic-hooks/navigate-hooks';
import Spotlight from '@/components/spotlight';
import { Outlet } from 'react-router';
import { SideBar } from './sidebar';
import { useFetchMemoryBaseConfiguration } from './hooks/use-memory-setting';

export default function MemoryWrapper() {
  const { data } = useFetchMemoryBaseConfiguration();
  const { navigateToMemoryList } = useNavigatePage();

  return (
    <section className="flex h-full flex-col w-full pt-3">
      <div className="px-5 pb-2">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <span
                className="cursor-pointer text-sm text-muted-foreground hover:text-foreground"
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
      </div>
      <div className="flex flex-1 min-h-0">
        <SideBar></SideBar>
        <div className="relative flex-1 overflow-auto border-[0.5px] border-border-button p-5 rounded-md mr-5 mb-5">
          <Spotlight />
          <Outlet />
        </div>
      </div>
    </section>
  );
}
