import SignalCellularNullSharp from '@mui/icons-material/SignalCellularNullSharp';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import * as statFuncs from './statFunctions';
import * as myFuncs from './myDataSliceFunction';

export const mydataState = () => {
  myData: [];
  selectedData: [];
  selectedDataIsAvailable: false;
  selectedDataCorr: [];
  selectedDataCorrIsAvailable: false;
};

const genInitData = (r, c) => {
  let arr = [];
  for (let i = 0; i < r; i++) {
    let row = [];
    for (let j = 0; j < c; j++) {
      j % 2 == 0
        ? row.push(Math.random() * (i + 1) * Math.cos(i + 1))
        : row.push(Math.random() * (i + 1) * Math.sin(i + 1));
      // row.push(null);
    }
    arr.push(row);
  }
  // console.log(arr);
  return arr;
};

const initialState = {
  myData: genInitData(10, 26),
  selectedData: [],
  selectedDataCorr: [],
  selectedDataIsAvailable: false,
};

export const mydataSlice = createSlice({
  name: 'myData',
  initialState,
  reducers: {
    initialize: (state) => {
      // console.log('hi');
      state.myData = [
        [1, 0, 0],
        [2, 0, 0],
        [3, 0, 0],
      ];
    },
    updateData: (state, action) => {
      // console.log('updateData', action);
      const newData = [...state.myData];

      action.payload.forEach(([row, column, oldValue, newValue]) => {
        let rows = newData.length;
        let cols = newData[0].length;
        // console.log('row:', row, rows);
        // console.log('col:', column, cols);
        if (row >= rows) {
          newData.push([]);
        }
        if (column >= cols) {
          for (let i = 0; i < newData.length; i++) newData[i].push(null);
        }
        newData[row][column] = newValue * 1;
        // console.log(newData);
      });

      state.myData = newData;
    },
    updateSelection: (state, action) => {
      let c1, c2, r1, r2;

      const data = [...state.myData];
      // console.log(data);
      let selection = [];
      state.selectedData = [];

      //data 유무 확인 (all null 이면?)
      let dataFlag = false;

      //C1,C2,R1,R2 정의
      [c1, c2, r1, r2] = myFuncs.defineRC(action.payload);

      //data 유효성 검사 :데이터가 하나라도 있으면 flag=true
      for (let c = c1; c <= c2; c++) {
        for (let r = r1; r <= r2; r++) {
          data[r][c] != null ? (dataFlag = true) : null;
        }
      }

      //check data is available?
      if (dataFlag) {
        for (let c = c1; c <= c2; c++) {
          let tmpRow = [];
          for (let r = r1; r <= r2; r++) {
            data[r][c] != null ? tmpRow.push(data[r][c]) : tmpRow.push();
          }
          selection.push(tmpRow);
        }
      } else {
        selection.push([0]);
      }

      //공통 State update
      for (let i = 0; i <= c2 - c1; i++) {
        let plotData = { type: 'histogram', data: selection[i] };
        let plotHistogram = {
          name: 'Data' + i,
          type: 'histogram',
          xAxis: 1,
          yAxis: 1,
          baseSeries: 'pData' + i,

          zIndex: -1,
        };
        let plotScatter = {
          name: 'Data' + i,
          type: 'scatter',
          data: selection[i],
          id: 'pData' + i,
          marker: {
            radius: 1.5,
          },
        };
        // state.selectedData.push(plotData);
        state.selectedData.push(plotHistogram);
        state.selectedData.push(plotScatter);
      }

      //2*5 이상일 때 상관계수 분석
      if (selection.length >= 2 && selection[0].length >= 5) {
        let corrResult = [];
        for (let i = 0; i < selection.length - 1; i++) {
          for (let j = i + 1; j < selection.length; j++) {
            corrResult.push([
              i + 1,
              j + 1,
              statFuncs.getCorrelation(selection[i], selection[j]),
              // ttest(selection[i], selection[j], { mu: 0 }).pValue(),
            ]);
          }
        }
        state.selectedDataCorr = corrResult;
      } else {
        state.selectedDataCorr = null;
      }
    },
  },
});

// Action creators are generated for each case reducer function
export const { initialize, updateData, updateSelection } = mydataSlice.actions;

export default mydataSlice.reducer;
