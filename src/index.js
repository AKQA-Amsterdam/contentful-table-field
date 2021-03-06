import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import {
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  TextInput,
  Button
} from '@contentful/forma-36-react-components';
import { init } from 'contentful-ui-extensions-sdk';
import '@contentful/forma-36-react-components/dist/styles.css';
import './index.css';

const App = ({ sdk }) => {
  const columns = sdk.parameters.instance.headers.split(',').map(v => v.trim());
  const firstCellOfLastRow = useRef();

  const getNewRow = () => columns.map(() => '');

  const getRowsFromExistingObject = obj => {
    return obj.map(row => Object.keys(row).map(key => row[key]));
  };

  const getInitialRows = () => {
    const data = sdk.field.getValue();
    return data ? getRowsFromExistingObject(data) : [getNewRow()];
  };

  const [rows, setRows] = useState(getInitialRows());

  useEffect(() => {
    sdk.window.startAutoResizer();

    const onExternalChange = value => {
      if (value) {
        const rowData = getRowsFromExistingObject(value);
        setRows(rowData);
      }
    };

    const detachExternalChangeHandler = sdk.field.onValueChanged(onExternalChange);

    return () => {
      if (detachExternalChangeHandler) {
        detachExternalChangeHandler();
      }
    };
  }, [sdk]);

  const updateCell = async (row, column, value) => {
    const rowData = rows.slice(0);
    rowData[row][column] = value;
    setRows(rowData);
    const formattedData = buildTableDataArray();
    await sdk.field.setValue(formattedData);
  };

  const buildTableDataArray = () => {
    const out = rows.reduce((acc, curr) => {
      acc.push(
        curr.reduce((a, c, i) => {
          return { ...a, [columns[i]]: c };
        }, {})
      );
      return acc;
    }, []);
    return out;
  };

  const addRow = () => {
    const rowData = rows.slice(0);
    rowData.push(getNewRow());
    setRows(rowData);
    // In timeout to allow for new row to render before setting focus
    setTimeout(() => {
      firstCellOfLastRow.current.focus();
    }, 0);
  };

  const checkIfLastCell = (e, row, col) => {
    if (e.keyCode === 9 && row === rows.length - 1 && col === columns.length - 1) {
      e.preventDefault();
      addRow();
    }
  };

  return (
    <div>
      <Table>
        <TableHead>
          <TableRow>
            {columns.map(h => (
              <TableCell key={h}>{h}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((r, rIdx) => (
            <TableRow key={`row-${rIdx}`}>
              {r.map((cell, cIdx) => (
                <TableCell key={`cell-${rIdx}-${cIdx}`}>
                  <TextInput
                    type="text"
                    value={cell}
                    width="full"
                    onChange={e => updateCell(rIdx, cIdx, e.target.value)}
                    onKeyDown={e => checkIfLastCell(e, rIdx, cIdx)}
                    inputRef={rIdx === rows.length - 1 && cIdx === 0 && firstCellOfLastRow}
                  />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="table-field-actions ">
        <Button className="new-row-cta" buttonType="muted" size="small" onClick={addRow}>
          Add new row
        </Button>
      </div>
    </div>
  );
};

App.propTypes = {
  sdk: PropTypes.object.isRequired
};

init(sdk => {
  ReactDOM.render(<App sdk={sdk} />, document.getElementById('root'));
});
