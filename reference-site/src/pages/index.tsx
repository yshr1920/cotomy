import {useEffect} from 'react';
import {useHistory} from '@docusaurus/router';
import Layout from '@theme/Layout';

export default function Home() {
  const history = useHistory();

  useEffect(() => {
    history.replace('/reference/overview');
  }, [history]);

  return <Layout title="Cotomy Reference" />;
}
