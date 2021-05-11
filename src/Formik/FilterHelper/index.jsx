import { useMemo, useEffect, memo } from 'react';
import PropTypes from 'prop-types';
import { useFormikContext } from 'formik';
import _ from 'lodash';

FilterHelper.propTypes = {
  config: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      list: PropTypes.array.isRequired,
      getOption: PropTypes.func.isRequired,
      filterBy: PropTypes.string,
    }).isRequired
  ).isRequired,
  children: PropTypes.func.isRequired,
};

function FilterHelper({ config: configList, children }) {
  const { values: formikValues, setFieldValue } = useFormikContext();

  const valuesList = useMemo(
    () => configList.map(({ name }) => _.get(formikValues, name)),
    [configList, formikValues]
  );

  const { names, optionsList, props } = useMemo(
    () => ({
      names: configList.map(({ name }) => name),
      optionsList: configList.map(({ list, filterBy, getOption }) =>
        list.map(entity => ({
          parentValue: entity[filterBy],
          ...getOption(entity),
        }))
      ),
      props: configList.map(entity =>
        _.omit(entity, ['name', 'list', 'getOption', 'filterBy'])
      ),
    }),
    [configList]
  );

  const getFilteredOptions = () =>
    optionsList.reduce((acc, options, depth) => {
      if (depth === 0) {
        return [options];
      } else {
        const parentValue = valuesList[depth - 1];
        const isMulti = Array.isArray(parentValue);
        const parentOptions = acc[depth - 1];
        const allPossibleParentValues = parentOptions.map(({ value }) => value);

        const newOptions = options.filter(option => {
          if (isMulti) {
            if (parentValue.length) {
              return parentValue.includes(option.parentValue);
            } else {
              return allPossibleParentValues.includes(option.parentValue);
            }
          } else {
            if (parentValue !== null) {
              return parentValue === option.parentValue;
            } else {
              return allPossibleParentValues.includes(option.parentValue);
            }
          }
        });

        return [...acc, newOptions];
      }
    }, []);

  const filteredOptionsList = useMemo(getFilteredOptions, [
    optionsList,
    valuesList,
  ]);

  useEffect(() => {
    valuesList.forEach((values, depth) => {
      const isMulti = Array.isArray(values);
      const allowedValues = filteredOptionsList[depth].map(
        ({ value }) => value
      );

      if (isMulti) {
        const newValues = allowedValues.filter(value => values.includes(value));

        if (values.length !== newValues.length) {
          setFieldValue(configList[depth].name, newValues);
        }
      } else {
        const newValue = allowedValues.includes(values) ? values : null;

        if (values !== newValue) {
          setFieldValue(configList[depth].name, newValue);
        }
      }
    });
  }, [valuesList, configList, filteredOptionsList, setFieldValue]);

  const propsList = useMemo(
    () =>
      _.zipWith(names, filteredOptionsList, props, (name, options, props) => ({
        name,
        options,
        ...props,
      })),
    [names, filteredOptionsList, props]
  );

  return children(propsList);
}

export default memo(
  FilterHelper,
  (prevProps, nextProps) => prevProps.config === nextProps.config
);
