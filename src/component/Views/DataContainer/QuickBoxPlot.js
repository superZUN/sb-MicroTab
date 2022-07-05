import React, { useRef } from 'react';

import styles from './Chart.module.css';

import { useSelector, useDispatch } from 'react-redux';
import { initialize, updateData } from '../../redux/myDataSlice';

import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import HighchartsMore from 'highcharts/highcharts-more';

HighchartsMore(Highcharts);

const QuickBoxPlot = () => {
  const selectedData = useSelector((state) => state.mydata.selectedData);
  const selectedHeaders = useSelector((state) => state.mydata.selectedHeaders);

  const dispatch = useDispatch();
  const options = {
    chart: {
      type: 'boxplot',
      height: '300px',
    },

    title: {
      text: null,
    },

    legend: {
      enabled: false,
    },

    xAxis: {
      categories: selectedHeaders,
      title: {
        text: null,
      },
    },

    yAxis: {
      title: {
        text: null,
      },
      // plotLines: [
      //   {
      //     value: 932,
      //     color: 'red',
      //     width: 1,
      //     label: {
      //       text: 'Theoretical mean: 932',
      //       align: 'center',
      //       style: {
      //         color: 'gray',
      //       },
      //     },
      //   },
      // ],
    },

    series: [
      {
        name: 'Observations',
        data: [
          [760, 801, 848, 895, 965],
          [733, 853, 939, 980, 1080],
          [714, 762, 817, 870, 918],
          [724, 802, 806, 871, 950],
          [834, 836, 864, 882, 910],
        ],
        tooltip: {
          headerFormat: '<em>Experiment No {point.key}</em><br/>',
        },
      },
      {
        name: 'Outliers',
        color: Highcharts.getOptions().colors[0],
        type: 'scatter',
        data: [
          // x, y positions where 0 is the first category
          [0, 644],
          [4, 718],
          [4, 951],
          [4, 969],
        ],
        marker: {
          fillColor: 'white',
          lineWidth: 1,
          lineColor: Highcharts.getOptions().colors[0],
        },
        tooltip: {
          pointFormat: 'Observation: {point.y}',
        },
      },
    ],
  };
  const chartComponentRef = useRef < HighchartsReact.RefObject > null;
  return (
    <div className={styles.ChartBox}>
      <HighchartsReact
        highcharts={Highcharts}
        options={options}
        // ref={chartComponentRef}
        // {...props}
      />
    </div>
  );
};

export default QuickBoxPlot;
