import { Modal } from '@/components/ui/modal/modal';
import DOMPurify from 'dompurify';
import { isEmpty } from 'lodash';
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

export const useWarnEmptyModel = (
  showEmptyModelWarn: boolean,
  embdId?: string,
  llmId?: string,
  loading?: boolean,
) => {
  const { t } = useTranslation();
  const warnedRef = useRef(false);

  useEffect(() => {
    if (
      showEmptyModelWarn &&
      !warnedRef.current &&
      !loading &&
      (isEmpty(embdId) || isEmpty(llmId)) &&
      typeof embdId === 'string' &&
      typeof llmId === 'string'
    ) {
      warnedRef.current = true;
      Modal.warning({
        title: t('common.warn'),
        content: (
          <div
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(t('setting.modelProvidersWarn')),
            }}
          ></div>
        ),
        closable: true,
        showCancel: false,
      });
    }
  }, [showEmptyModelWarn, embdId, llmId, loading, t]);
};
