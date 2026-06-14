import { useFetchKnowledgeBaseConfiguration } from '@/hooks/use-knowledge-request';
import { KnowledgeBaseProvider } from '@/pages/dataset/contexts/knowledge-base-context';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { PageHeader } from '@/components/page-header';
import { useNavigatePage } from '@/hooks/logic-hooks/navigate-hooks';
import { Outlet } from 'react-router';
import { SideBar } from './sidebar';

export default function DatasetWrapper() {
  const { data, loading } = useFetchKnowledgeBaseConfiguration();
  const { navigateToDatasetList } = useNavigatePage();

  return (
    <KnowledgeBaseProvider knowledgeBase={data} loading={loading}>
      <article className="size-full flex flex-col bg-app-page">
        <PageHeader>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <span
                  className="cursor-pointer text-sm text-text-secondary hover:text-text-primary"
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
        </PageHeader>
        <div className="flex flex-1 min-h-0 gap-3 px-3 pb-3">
          <SideBar dataset={data} />
          <div className="flex-1 min-w-0 bg-bg-base rounded-3xl overflow-hidden">
            <Outlet />
          </div>
        </div>
      </article>
    </KnowledgeBaseProvider>
  );
}
