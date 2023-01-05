import { Field, FieldProps } from 'formik';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import { ColProps } from 'react-bootstrap';

import RequiredStar from './RequiredStar';

type Props = JSX.IntrinsicElements['input'] &
  ColProps & {
    name: string;
    label?: string;
    required?: boolean;
  };

const TextInput: React.FC<Props> = ({
  name,
  label,
  required,
  xs,
  sm,
  md,
  lg,
  xl,
  xxl,
  type,
  autoComplete,
  placeholder,
  ...props
}) => {
  return (
    <Col xs={xs} sm={sm} md={md} lg={lg} xl={xl} xxl={xxl}>
      <Field name={name} {...props}>
        {({ field, meta }: FieldProps) => (
          <Form.Group>
            {label && (
              <Form.Label>
                {label}
                {required ? <RequiredStar /> : null}
              </Form.Label>
            )}
            <Form.Control
              type={type}
              {...field}
              isInvalid={meta.touched && !!meta.error}
              autoComplete={autoComplete}
              placeholder={placeholder}
            />
            <Form.Text className="text-danger">{meta.touched && meta.error}</Form.Text>
          </Form.Group>
        )}
      </Field>
    </Col>
  );
};

export default TextInput;
