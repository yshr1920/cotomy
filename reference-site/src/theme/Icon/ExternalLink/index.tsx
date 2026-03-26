import React, {type ReactNode} from 'react';
import {translate} from '@docusaurus/Translate';
import type {Props} from '@theme/Icon/ExternalLink';

import styles from './styles.module.css';

export default function IconExternalLink({
  width = 17,
  height = 17,
}: Props): ReactNode {
  const widthValue = typeof width === 'number' ? `${width}px` : width;
  const heightValue = typeof height === 'number' ? `${height}px` : height;

  return (
    <span
      aria-label={translate({
        id: 'theme.IconExternalLink.ariaLabel',
        message: '(opens in new tab)',
        description: 'The ARIA label for the external link icon',
      })}
      className={`${styles.iconExternalLink} material-icons-outlined`}
      style={{fontSize: widthValue, width: widthValue, height: heightValue}}
    >
      open_in_new
    </span>
  );
}
