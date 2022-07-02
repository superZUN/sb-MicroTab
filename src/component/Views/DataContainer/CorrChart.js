import React, { useRef } from 'react';

import { useSelector, useDispatch } from 'react-redux';
import styles from './QuickChart.module.css';

import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const CorrChart = () => {
  const selectedDataCorr = useSelector(
    (state) => state.mydata.selectedDataCorr
  );
  return (
    <div id="CorrChart" className={styles.CorrChart}>
      {selectedDataCorr.map((item) => (
        <div>
          {item[0]} x {item[1]} : {item[2]}
        </div>
      ))}
    </div>
  );
};

export default CorrChart;
