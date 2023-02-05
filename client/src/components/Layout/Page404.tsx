import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Page404: React.FC = () => {
  const { t } = useTranslation('public');

  return (
    <>
      <h1>{t('errorPages.404')}</h1>
      <h3>
        <Link to="/">{t('errorPages.toHomepageLinkText')}</Link>
      </h3>
    </>
  );
};

export default Page404;
