import {useEffect} from 'react';
import {useHistory} from '@docusaurus/router';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Layout from '@theme/Layout';

export default function Home() {
  const history = useHistory();
  const overviewUrl = useBaseUrl('/reference/overview');

  useEffect(() => {
    history.replace(overviewUrl);
  }, [history, overviewUrl]);

  return <Layout title="Cotomy Reference" />;
}
