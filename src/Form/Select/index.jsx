import PropTypes from 'prop-types';
import WindowedSelect, { createFilter } from 'react-windowed-select';
import memoize from 'memoize-one';

import styles from './styles';

Select.propTypes = {
  name: PropTypes.string,
  value: PropTypes.any,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.any.isRequired,
    })
  ).isRequired,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func,
  multi: PropTypes.bool,
  disabled: PropTypes.bool,
  clearable: PropTypes.bool,
  searchable: PropTypes.bool,
  placeholder: PropTypes.string,
  getOptionValue: PropTypes.func,
};

Select.defaultProps = {
  multi: false,
  disabled: false,
  searchable: true,
  getOptionValue: (option) => option.value,
  // clearable: multi ? true : false,
  // placeholder: !disabled ? 'Select...' : '',
};

const getCompleteState = memoize(({ value, options, multi }) =>
  multi
    ? options.filter((option) => value.includes(option.value))
    : options.find((option) => option.value === value) || null
);

const getMinifiedState = ({ newValue, multi }) => {
  switch (multi) {
    case true:
      return newValue ? newValue.map(({ value }) => value) : [];
    case false:
      return newValue ? newValue.value : null;
    default:
      throw new Error('multi is not defined');
  }
};

function Select(props) {
  const {
    name,
    value,
    options,
    onChange,
    onBlur,
    multi,
    disabled,
    clearable,
    searchable,
    placeholder,
    getOptionValue,
  } = props;

  const handleChange = (newValue) => {
    const nextState = getMinifiedState({ newValue, multi });

    onChange(nextState);
  };

  return (
    <WindowedSelect
      name={name}
      value={getCompleteState({ value, options, multi })}
      onChange={handleChange}
      onBlur={onBlur}
      options={options}
      isMulti={multi}
      isDisabled={disabled}
      isClearable={clearable}
      isSearchable={searchable}
      placeholder={disabled ? '' : placeholder}
      getOptionValue={getOptionValue}
      filterOption={createFilter({ ignoreAccents: false })}
      styles={styles}
    />
  );
}

export default Select;
