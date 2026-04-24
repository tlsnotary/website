import React from 'react';
import Link from '@docusaurus/Link';
import Content from '@theme-original/BlogSidebar/Content';
import type ContentType from '@theme/BlogSidebar/Content';
import type {WrapperProps} from '@docusaurus/types';

type Props = WrapperProps<typeof ContentType>;

export default function ContentWrapper(props: Props): JSX.Element {
  return (
    <>
      <Content {...props} />
      <Link to="/blog/archive" style={{display: 'inline-block', marginTop: '1.2rem', fontWeight: 600}}>
        More →
      </Link>
    </>
  );
}
