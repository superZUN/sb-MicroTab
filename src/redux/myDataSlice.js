import { createSlice } from '@reduxjs/toolkit';

import calculateCorrelation from 'calculate-correlation';

export const mydataState = () => {
  myData: [];
  selectedData: [];
};

const genInitData = (r, c) => {
  let arr = [];
  for (let i = 0; i < r; i++) {
    let row = [];
    for (let j = 0; j < c; j++) {
      j % 2 == 0
        ? row.push(Math.random() * Math.random() * (i + 1) * Math.sin(i))
        : row.push(Math.random() * (i + 1) * Math.cos(i));
      // row.push(0);
    }
    arr.push(row);
  }
  // console.log(arr);
  return arr;
};

const initialState = {
  myData: genInitData(20, 26),
  selectedData: [],
};

const mydataSlice = createSlice({
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
      //afterSelection(row, column, row2, column2, preventScrolling, selectionLayerLevel)

      let c1, c2, r1, r2;
      const data = [...state.myData];
      // console.log(data);
      let selection = [];
      state.selectedData = [];

      if (action.payload.r1 == -1) {
        //컬럼 선택 시
        // console.log('column selected');
        c1 =
          action.payload.c1 < action.payload.c2
            ? action.payload.c1
            : action.payload.c2;
        c2 =
          action.payload.c1 < action.payload.c2
            ? action.payload.c2
            : action.payload.c1;
        r1 = 0;
        r2 = action.payload.r2;
      } else {
        //영역 선택 시
        c1 =
          action.payload.c1 < action.payload.c2
            ? action.payload.c1
            : action.payload.c2;
        c2 =
          action.payload.c1 < action.payload.c2
            ? action.payload.c2
            : action.payload.c1;
        r1 =
          action.payload.r1 < action.payload.r2
            ? action.payload.r1
            : action.payload.r2;
        r2 =
          action.payload.r1 < action.payload.r2
            ? action.payload.r2
            : action.payload.r1;
      }

      for (let c = c1; c <= c2; c++) {
        let tmpRow = [];
        for (let r = r1; r <= r2; r++) {
          tmpRow.push(data[r][c]);
        }
        selection.push(tmpRow);
      }

      //공통 State update
      for (let i = 0; i <= c2 - c1; i++) {
        let plotData = { type: 'histogram', data: selection[i] };
        let plotHistogram = {
          type: 'histogram',
          xAxis: 1,
          yAxis: 1,
          baseSeries: 'pData' + i,

          zIndex: -1,
        };
        let plotScatter = {
          name: 'Data',
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

        //2*5 이상일 때 상관계수 분석
        if (selection.length >= 2 && selection[0].length >= 5) {
          // console.log('correlation');
          console.log(calculateCorrelation(selection[0], selection[1]));
        }
      }
    },
  },
});

// Action creators are generated for each case reducer function
export const { initialize, updateData, updateSelection } = mydataSlice.actions;

export default mydataSlice.reducer;
