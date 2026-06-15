import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useTestRetrieval } from '@/hooks/use-knowledge-request';
import { t } from 'i18next';
import { useState } from 'react';
import TestingForm from './testing-form';
import { TestingResult } from './testing-result';

export default function RetrievalTesting() {
  const { loading, setValues, refetch, data, handleFilterSubmit, filterValue } =
    useTestRetrieval();

  const [count] = useState(1); // TODO: Different layouts are needed; if they are no longer required, consider deleting them.

  return (
    <div className="flex size-full min-h-0 flex-col p-5">
      <Card className="flex min-h-0 flex-1 flex-col bg-transparent shadow-none">
        <CardHeader className="p-5">
          <header>
            <CardTitle as="h1">
              {t('knowledgeDetails.retrievalTesting')}
            </CardTitle>

            <CardDescription>
              {t('knowledgeDetails.testingDescription')}
            </CardDescription>
          </header>
        </CardHeader>

        {count === 1 ? (
          <CardContent className="grid min-h-0 flex-1 grid-cols-1 grid-rows-[minmax(0,1fr)_minmax(0,1fr)] gap-3 overflow-hidden p-0 xl:grid-cols-2 xl:grid-rows-1">
            <article className="flex min-h-0 min-w-0 flex-col overflow-hidden rounded-3xl bg-surface-raised">
              <header className="shrink-0 px-5 py-3">
                <h2 className="font-semibold text-base leading-8">
                  {t('knowledgeDetails.testSetting')}
                </h2>
              </header>

              <div className="min-h-0 flex-1">
                <TestingForm
                  loading={loading}
                  setValues={setValues}
                  refetch={refetch}
                />
              </div>
            </article>

            <div className="flex min-h-0 min-w-0 flex-col overflow-hidden rounded-3xl bg-surface-raised">
              <TestingResult
                data={data}
                loading={loading}
                filterValue={filterValue}
                handleFilterSubmit={handleFilterSubmit}
              />
            </div>
          </CardContent>
        ) : (
          <CardContent className="p-0 flex gap-2">
            <div className="flex-1">
              <TestingForm
                loading={loading}
                setValues={setValues}
                refetch={refetch}
              ></TestingForm>
              <TestingResult
                data={data}
                loading={loading}
                filterValue={filterValue}
                handleFilterSubmit={handleFilterSubmit}
              ></TestingResult>
            </div>
            <div className="flex-1">
              <TestingForm
                loading={loading}
                setValues={setValues}
                refetch={refetch}
              ></TestingForm>
              <TestingResult
                data={data}
                loading={loading}
                filterValue={filterValue}
                handleFilterSubmit={handleFilterSubmit}
              ></TestingResult>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
