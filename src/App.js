import { useMemo } from 'react';
import { Formik, Form } from 'formik';

import FilterHelper from './Formik/FilterHelper';
import Select from './Formik/Select';
import list1 from './data/a';
import list2 from './data/b';
import list3 from './data/c';
import list4 from './data/d';
import './styles.css';

function App() {
  const getOption = ({ id }) => {
    return {
      label: String(id),
      value: id,
    };
  };

  const config = useMemo(
    () => [
      {
        name: 'A',
        list: list1,
        getOption,
        multi: false,
      },
      {
        name: 'B',
        list: list2,
        getOption,
        filterBy: 'aId',
      },
      {
        name: 'C',
        list: list3,
        getOption,
        filterBy: 'bId',
      },
      {
        name: 'D',
        list: list4,
        getOption,
        filterBy: 'cId',
      },
    ],
    []
  );

  return (
    <div className="App">
      <Formik
        initialValues={{
          A: null,
          B: [],
          C: [],
          D: [],
        }}
      >
        <Form>
          <FilterHelper config={config}>
            {propsList =>
              propsList.map(props => (
                <div key={props.name} className="row">
                  <Select multi clearable searchable={false} {...props} />
                </div>
              ))
            }
          </FilterHelper>
        </Form>
      </Formik>
    </div>
  );
}

export default App;
