import { Header } from '@/layouts/components/header';
import { SideBar } from '@/pages/user-setting/sidebar';

const Home = () => {
  return (
    <div className="size-full flex flex-col items-center justify-center gap-12">
      <Header className="px-5 py-4 max-w-5xl w-full" />
      <SideBar />
    </div>
  );
};

export default Home;
