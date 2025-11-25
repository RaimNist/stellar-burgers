import { useState, ChangeEvent } from 'react';

export const useForm = <T extends Record<string, string>>(initialValues: T) => {
  const [values, setValues] = useState<T>(initialValues);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const setValue = <K extends keyof T>(name: K, value: T[K]) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const reset = (nextValues: T = initialValues) => {
    setValues(nextValues);
  };

  return { values, handleChange, setValue, reset } as const;
};
