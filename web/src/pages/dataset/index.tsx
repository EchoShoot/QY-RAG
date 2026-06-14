import { useFetchKnowledgeBaseConfiguration } from '@/hooks/use-knowledge-request';
import { KnowledgeBaseProvider } from '@/pages/dataset/contexts/knowledge-base-context';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { useNavigatePage } from '@/hooks/logic-hooks/navigate-hooks';
import { Outlet } from 'react-router';
import { SideBar } from './sidebar';

export default function DatasetWrapper() {
  const { data, loading } = useFetchKnowledgeBaseConfiguration();
  const { navigateToDatasetList } = useNavigatePage();

  return (
    <KnowledgeBaseProvider knowledgeBase={data} loading={loading}>
      <article className="pt-3 size-full grid grid-cols-[auto_1fr] grid-rows-[auto_1fr]">
        <div className="col-span-2 px-5 pb-2">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <span
                  className="cursor-pointer text-sm text-muted-foreground hover:text-foreground"
                  onClick={() => navigateToDatasetList({})}
                >
                  数据集
                </span>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{data.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <SideBar dataset={data} />
        <Outlet />
      </article>
    </KnowledgeBaseProvider>
  );
}
