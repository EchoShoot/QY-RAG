import { PageHeader } from '@/components/page-header';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Segmented, SegmentedValue } from '@/components/ui/segmented';
import {
  QueryStringMap,
  useNavigatePage,
} from '@/hooks/logic-hooks/navigate-hooks';
import { Routes } from '@/routes';
import { EllipsisVertical, Save } from 'lucide-react';
import { useMemo } from 'react';
import { Outlet, useLocation } from 'react-router';

export default function ChunkPage() {
  const { navigateToDataset, navigateToDatasetList, getQueryString, navigateToChunk } =
    useNavigatePage();
  const location = useLocation();

  const options = useMemo(() => {
    return [
      {
        label: 'Parsed results',
        value: Routes.ParsedResult,
      },
      {
        label: 'Chunk result',
        value: Routes.ChunkResult,
      },
      {
        label: 'Result view',
        value: Routes.ResultView,
      },
    ];
  }, []);

  const path = useMemo(() => {
    return location.pathname.split('/').slice(0, 3).join('/');
  }, [location.pathname]);

  return (
    <section className="size-full flex flex-col bg-app-page">
      <PageHeader>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink onClick={() => navigateToDatasetList({})}>
                数据集
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink
                onClick={navigateToDataset(
                  getQueryString(QueryStringMap.KnowledgeId) as string,
                )}
              >
                文件
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>解析结果</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div>
          <Segmented
            options={options}
            value={path}
            onChange={navigateToChunk as (val: SegmentedValue) => void}
          ></Segmented>
        </div>
        <div className="flex items-center gap-2">
          <Button variant={'ghost'} size={'icon'}>
            <EllipsisVertical />
          </Button>
          <Button size={'sm'}>
            <Save />
            Save
          </Button>
        </div>
      </PageHeader>
      <div className="flex-1 min-h-0 mx-3 mb-3 bg-bg-base rounded-3xl overflow-hidden">
        <Outlet />
      </div>
    </section>
  );
}
