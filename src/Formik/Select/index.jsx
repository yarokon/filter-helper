import { useField } from 'formik';

import ControledSelect from '../../Form/Select';

function Select({ name, ...rest }) {
  const [field, , helpers] = useField({ name });

  return (
    <label>
      <span>{name}</span>
      <ControledSelect
        name={name}
        value={field.value}
        onChange={helpers.setValue}
        onBlur={() => helpers.setTouched(true)}
        {...rest}
      />
    </label>
  );
}

export default Select;
