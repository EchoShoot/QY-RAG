import ApiContent from '@/components/api-service/chat-overview-modal/api-content';
import { UserSettingBreadcrumb, UserSettingPageWrapper } from '../components/user-setting-breadcrumb';

const ApiPage = () => {
  return (
    <UserSettingPageWrapper>
      <UserSettingBreadcrumb label="API" />
      <div className="flex-1 min-h-0 mx-3 mb-3 overflow-auto">
        <ApiContent idKey="dialogId"></ApiContent>
      </div>
    </UserSettingPageWrapper>
  );
};

export default ApiPage;
