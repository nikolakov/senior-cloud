import { useState, useRef } from 'react';
import { Field, FieldProps } from 'formik';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import { ColProps } from 'react-bootstrap';

import RequiredStar from '../RequiredStar';

import classes from './styles.module.css';

type Props = JSX.IntrinsicElements['input'] &
  ColProps & {
    name: string;
    label: string;
    required?: boolean;
  };

const PasswordInput: React.FC<Props> = ({
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
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const fieldRef = useRef<HTMLInputElement>(null);

  return (
    <Col xs={xs} sm={sm} md={md} lg={lg} xl={xl} xxl={xxl}>
      <Field name={name} {...props}>
        {({ field, meta }: FieldProps) => (
          <Form.Group className="mb-3">
            <Form.Label>
              {label}
              {required ? <RequiredStar /> : null}
            </Form.Label>
            <div style={{ position: 'relative' }}>
              <Form.Control
                type={showPassword ? 'text' : 'password'}
                {...field}
                isInvalid={meta.touched && !!meta.error}
                ref={fieldRef}
              />
              <button
                className={classes.EyeIconContainer}
                type="button"
                onClick={() => {
                  setShowPassword(prevState => !prevState);
                  setTimeout(() => {
                    if (fieldRef.current) {
                      const end = fieldRef.current.value.length;
                      fieldRef.current.setSelectionRange(end, end);
                      fieldRef.current.focus();
                    }
                  }, 0);
                }}
                style={{
                  right: meta.touched && meta.error ? '2rem' : '0.5rem',
                }}
              >
                {showPassword ? (
                  <i className="bi bi-eye-slash-fill" />
                ) : (
                  <i className="bi bi-eye" />
                )}
              </button>
            </div>
            <Form.Text className="text-danger">{meta.touched && meta.error}</Form.Text>
          </Form.Group>
        )}
      </Field>
    </Col>
  );
};

export default PasswordInput;
