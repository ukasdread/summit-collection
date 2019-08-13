import React from 'react';
import 'minireset.css/minireset.min.css';
import './index.less';
import CopyRight from '@components/CopyRight/';

function Repairing(props) {
  return (
    <div className="repairing-container">
      <div className="bg-img-container"></div>
      <h1 className="page-title">页面正在进行升级维护:)</h1>
      <p className="tips">请等会儿再来瞅瞅吧</p>
      <CopyRight style={{color: '#fff'}}></CopyRight>
    </div>
  );
}

export default Repairing;