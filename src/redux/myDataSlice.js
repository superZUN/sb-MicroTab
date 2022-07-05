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
  colHeaders: [];
  selectedHeaders: [];
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
  myData: genInitData(50, 26),
  selectedData: [],
  selectedDataCorr: [],
  selectedDataIsAvailable: false,
  colHeaders: [
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z',
    'AA',
  ],
  selectedHeaders: [],
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
      let c1, c2, r1, r2, p, l;

      const data = [...state.myData];
      // console.log(data);
      let selection = [];

      //data 유무 확인 (all null 이면?)
      let dataFlag = false;

      //C1,C2,R1,R2 정의
      [c1, c2, r1, r2] = myFuncs.defineRC(action.payload);

      //multi selection일 때 selection추가 일 경우 selectedData  초기화 하지 않음.
      l = action.payload.l;

      //layerLevel에 따라 데이터 비우거나 추가하기
      l == 0
        ? (state.selectedData = [])
        : (state.selectedData = [...state.selectedData]);

      //colHeader 가져오기
      l == 0
        ? (state.selectedHeaders = [])
        : (state.selectedHeaders = [...state.selectedHeaders]);
      for (let i = c1; i <= c2; i++) {
        // console.log(i);
        state.selectedHeaders.push(state.colHeaders[i]);
      }
      // console.log('selectedHeader:', state.selectedHeaders);

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
        ``;
      }

      //plot 그리기 용
      //공통 State update
      for (let i = 0; i <= c2 - c1; i++) {
        let plotData = { type: 'histogram', data: selection[i] };
        let plotHistogram = {
          name: 'Data' + (i + l),
          type: 'histogram',
          xAxis: 1,
          yAxis: 1,
          baseSeries: 'pData' + (i + l),

          zIndex: -1,
        };
        let plotScatter = {
          name: 'Data' + (i + l),
          type: 'scatter',
          data: selection[i],
          id: 'pData' + (i + l),
          marker: {
            radius: 1.5,
          },
        };
        // state.selectedData.push(plotData);
        state.selectedData.push(plotHistogram);
        state.selectedData.push(plotScatter);
      }
      // console.log(state.selectedData.length);
      // console.log('selectedData:', state.selectedData);

      //2*5 이상일 때 상관계수 분석
      if (
        state.selectedData.length >= 4 &&
        state.selectedData[1].data.length >= 5
      ) {
        let corrResult = [];
        for (let i = 0; i < state.selectedData.length / 2 - 1; i++) {
          for (let j = i + 1; j < state.selectedData.length / 2; j++) {
            // console.log('d1:', state.selectedData[(i + 1) * 2 - 1].data);
            // console.log('d2:', state.selectedData[j * 2 - 1].data);

            corrResult.push([
              state.selectedHeaders[i],
              state.selectedHeaders[j],
              statFuncs.getCorrelation(
                state.selectedData[(i + 1) * 2 - 1].data,
                state.selectedData[(j + 1) * 2 - 1].data
              ),
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
