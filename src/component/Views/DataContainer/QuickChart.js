import React, { useRef } from 'react';

import styles from './QuickChart.module.css';

import { useSelector, useDispatch } from 'react-redux';
import { initialize, updateData } from '../../redux/myDataSlice';

import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import bellCurve from 'highcharts/modules/histogram-bellcurve'; //module
bellCurve(Highcharts); //init module

const QuickChart = () => {
  const selectedData = useSelector((state) => state.mydata.selectedData);
  const dispatch = useDispatch();
  const options = {
    chart: {
      height: 300,
      zoomType: 'xy',
      labels: {
        enabled: false,
      },
    },
    boost: {
      useGPUTranslations: true,
    },
    title: { text: null },
    xAxis: [
      {
        title: { text: null },
        alignTicks: false,
      },
      {
        title: { text: null },
        alignTicks: false,
        opposite: true,
      },
    ],

    yAxis: [
      {
        title: { text: null },
      },
      {
        title: { text: null },
        opposite: true,
      },
    ],
    plotOptions: {
      histogram: {
        accessibility: {
          point: {
            valueDescriptionFormat:
              '{index}. {point.x:.3f} to {point.x2:.3f}, {point.y}.',
          },
        },
      },
    },

    series: selectedData,
  };
  const chartComponentRef = useRef < HighchartsReact.RefObject > null;
  return (
    <div id="quickChart" className={styles.QuickChart}>
      <div className={styles.ChartBox}>
        <HighchartsReact
          highcharts={Highcharts}
          options={options}
          // ref={chartComponentRef}
          // {...props}
        />
      </div>
    </div>
  );
};

export default QuickChart;
