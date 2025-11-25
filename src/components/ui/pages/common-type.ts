import { SyntheticEvent } from 'react';

export type PageUIProps = {
  errorText: string | undefined;
  email: string;
  setEmail: (value: string) => void;
  handleSubmit: (e: SyntheticEvent) => void;
};
