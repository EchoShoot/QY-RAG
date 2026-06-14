import ApiContent from '@/components/api-service/chat-overview-modal/api-content';
import { UserSettingBreadcrumb } from '../components/user-setting-breadcrumb';

const ApiPage = () => {
  return (
    <>
      <UserSettingBreadcrumb label="API" />
      <ApiContent idKey="dialogId"></ApiContent>
    </>
  );
};

export default ApiPage;
