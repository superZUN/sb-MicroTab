import * as React from 'react';
import styles from './DataContainer.module.css';
import QuickChart from './DataContainer/QuickChart';

import 'handsontable/dist/handsontable.full.css';

import { HotTable } from '@handsontable/react';
import Handsontable from 'handsontable';

import { useSelector, useDispatch } from 'react-redux';
import { decrement, increment } from '../../redux/counterSlice';
import {
  initialize,
  updateData,
  updateSelection,
} from '../../redux/myDataSlice';

// import { useSelector } from 'react-redux';

// register Handsontable's modules
// registerAllModules();

const DataContainer = () => {
  const count = useSelector((RootState) => state.counter.value);
  const mydata = useSelector(( RootState) => state.mydata.myData);
  const dispatch = useDispatch();

  const onBeforeHotChange = (changes) => {
    dispatch(updateData(changes));

    return false;
  };

  const onAfterSelection = (r1,c1, r2,c2)=> {
    dispatch(updateSelection({r1:r1,c1:c1,r2:r2,c2:c2}));
	},
  return (
    <div id="hot-app">
      <QuickChart />
      <div styleName={styles.hotTable}>
        <HotTable
          data={mydata}
          width= '100%'
          height='50vh'
          colHeaders={true}
          rowHeaders={true}
          beforeChange={onBeforeHotChange}
          afterSelection={onAfterSelection}
          rowHeights={23}
          colWidths={100}
          selectionMode="range" // 'single', 'range' or 'multiple',
          licenseKey="non-commercial-and-evaluation"
        />
        
      </div>
    </div>
  );
};

export default DataContainer;
